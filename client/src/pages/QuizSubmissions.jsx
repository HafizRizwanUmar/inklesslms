import API_BASE_URL from '../config';
import { AI_ENABLED } from '../config/features';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, CheckCircle, Share2, Sparkles, AlertTriangle, ShieldCheck, ShieldOff, Eye, FileSpreadsheet, Trophy, TrendingUp, TrendingDown, Package, Loader2, PenLine, Save, ChevronDown, ChevronUp } from 'lucide-react';
import SEO from '../components/SEO';

const StrikeBadge = ({ count }) => {
    if (count === 0) return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
            0
        </span>
    );
    const color = count >= 3 ? 'red' : 'orange';
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full
            ${color === 'red' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                'bg-orange-500/15 text-orange-400 border border-orange-500/30'}`}>
            {count}
        </span>
    );
};

// ─── Manual Grading Panel ─────────────────────────────────────────────────────
const ManualGradePanel = ({ att, quiz, onSaved }) => {
    const [grades, setGrades] = useState(() =>
        att.answers.map(ans => ({
            questionIndex: ans.questionIndex,
            score: ans.manualScore !== undefined ? ans.manualScore : '',
            feedback: ans.aiFeedback || ''
        }))
    );
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                `${API_BASE_URL}/api/quizzes/attempt/${att._id}/manual-grade`,
                { grades: grades.map(g => ({ ...g, score: g.score === '' ? undefined : Number(g.score) })) },
                { headers: { 'x-auth-token': token } }
            );
            alert(`Saved! New total score: ${res.data.score}`);
            onSaved(att._id, res.data.score, grades);
        } catch (err) {
            console.error(err);
            alert('Failed to save grades.');
        } finally {
            setSaving(false);
        }
    };

    const updateGrade = (qIdx, field, value) => {
        setGrades(prev => prev.map(g => g.questionIndex === qIdx ? { ...g, [field]: value } : g));
    };

    const textQuestions = quiz?.questions?.filter(q => q.type === 'SHORT' || q.type === 'LONG') || [];

    return (
        <div className="mt-4 border-t border-border/50 pt-4 space-y-4">
            <div className="flex items-center gap-2 mb-3">
                <PenLine className="w-4 h-4 text-primary" />
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Manual Marking</p>
            </div>

            {att.answers.map((ans, i) => {
                const question = quiz?.questions?.[ans.questionIndex];
                if (!question) return null;
                const isMCQ = !question.type || question.type === 'MCQ';
                const grade = grades.find(g => g.questionIndex === ans.questionIndex);
                const maxPts = question.points || 1;

                return (
                    <div key={i} className="bg-background border border-border rounded-xl p-4 space-y-3">
                        {/* Question header */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded mr-2 ${isMCQ ? 'bg-blue-500/10 text-blue-400' : question.type === 'SHORT' ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                    Q{ans.questionIndex + 1} · {question.type || 'MCQ'}
                                </span>
                                <span className="text-[10px] text-secondary-foreground font-medium">{maxPts} pts max</span>
                            </div>
                        </div>

                        <p className="text-sm font-semibold text-foreground leading-relaxed">{question.questionText}</p>

                        {/* Student answer */}
                        {isMCQ ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-secondary-foreground">Selected:</span>
                                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
                                    {ans.selectedOptionIndex !== undefined ? String.fromCharCode(65 + ans.selectedOptionIndex) : '—'}
                                </span>
                                <span className="text-xs text-secondary-foreground">{question.options?.[ans.selectedOptionIndex]?.text || ''}</span>
                            </div>
                        ) : (
                            <div className="bg-surface border border-border/50 rounded-lg p-3 text-sm text-foreground italic leading-relaxed">
                                {ans.textAnswer || <span className="text-secondary-foreground not-italic">No answer provided</span>}
                            </div>
                        )}

                        {/* Score input + feedback */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-1">
                                <label className="text-[9px] font-black text-secondary-foreground uppercase tracking-widest block mb-1">
                                    Score <span className="text-primary">/ {maxPts}</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max={maxPts}
                                    value={grade?.score ?? ''}
                                    onChange={e => updateGrade(ans.questionIndex, 'score', e.target.value)}
                                    placeholder={isMCQ ? 'Auto' : '0'}
                                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm font-bold text-foreground focus:border-primary outline-none"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-[9px] font-black text-secondary-foreground uppercase tracking-widest block mb-1">Feedback / Comment</label>
                                <textarea
                                    rows="2"
                                    value={grade?.feedback ?? ''}
                                    onChange={e => updateGrade(ans.questionIndex, 'feedback', e.target.value)}
                                    placeholder="Write feedback for student..."
                                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>
                );
            })}

            <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-black rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm shadow-primary/20"
            >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Marks'}
            </button>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const QuizSubmissions = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { quizId } = useParams();

    const [attempts, setAttempts] = useState([]);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiStatus, setAiStatus] = useState({ available: false, msg: 'Checking...' });
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [selected, setSelected] = useState(null);
    const [showManual, setShowManual] = useState({}); // attemptId -> bool
    const [downloading, setDownloading] = useState('');
    const [zipDropdownOpen, setZipDropdownOpen] = useState(false);
    const zipDropdownRef = useRef(null);

    useEffect(() => {
        if (!quizId) return navigate(-1);
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const [submissionsRes, aiStatusRes, quizRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/quizzes/submissions/${quizId}`, { headers: { 'x-auth-token': token } }),
                    axios.get(`${API_BASE_URL}/api/quizzes/ai-status`, { headers: { 'x-auth-token': token } }),
                    axios.get(`${API_BASE_URL}/api/quizzes/${quizId}`, { headers: { 'x-auth-token': token } })
                ]);
                setAttempts(submissionsRes.data.attempts || []);
                setAiStatus(aiStatusRes.data);
                setQuiz(quizRes.data);
            } catch (err) {
                console.error('Failed to fetch submissions:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [quizId, navigate]);

    // Close ZIP dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (zipDropdownRef.current && !zipDropdownRef.current.contains(e.target)) setZipDropdownOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleBatchMarking = async () => {
        if (!window.confirm('This will use AI to mark all text questions for all students. Continue?')) return;
        setIsProcessingAI(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/quizzes/grade-all/${quizId}`, {}, { headers: { 'x-auth-token': token } });
            alert(res.data.msg);
            const submissionsRes = await axios.get(`${API_BASE_URL}/api/quizzes/submissions/${quizId}`, { headers: { 'x-auth-token': token } });
            setAttempts(submissionsRes.data.attempts || []);
        } catch (err) {
            console.error(err);
            alert('Failed to process AI marking.');
        } finally {
            setIsProcessingAI(false);
        }
    };

    const handleShareResults = async () => {
        if (!window.confirm('Share results with all students? They will see their full scores.')) return;
        setIsSharing(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/quizzes/share-results/${quizId}`, {}, { headers: { 'x-auth-token': token } });
            setQuiz({ ...quiz, resultsShared: true });
            alert('Results shared successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to share results.');
        } finally {
            setIsSharing(false);
        }
    };

    const handleDownload = async (type) => {
        try {
            setDownloading(type);
            const token = localStorage.getItem('token');
            const endpoint = type === 'excel'
                ? `${API_BASE_URL}/api/quizzes/export/excel/${quizId}`
                : `${API_BASE_URL}/api/quizzes/export/pdf-zip/${quizId}`;
            const ext = type === 'excel' ? 'xlsx' : 'zip';
            const mimeType = type === 'excel'
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                : 'application/zip';
            const res = await fetch(endpoint, { headers: { 'x-auth-token': token } });
            if (!res.ok) { alert('Export failed. No submissions yet?'); return; }
            const blob = await res.blob();
            const url = URL.createObjectURL(new Blob([blob], { type: mimeType }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `${quiz?.title || 'quiz'}_${type === 'excel' ? 'submissions' : 'reports'}.${ext}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert('Download failed.');
        } finally {
            setDownloading('');
        }
    };

    const handleManualSaved = (attemptId, newScore, newGrades) => {
        setAttempts(prev => prev.map(att => {
            if (att._id !== attemptId) return att;
            const updatedAnswers = att.answers.map(ans => {
                const g = newGrades.find(gr => gr.questionIndex === ans.questionIndex);
                return g ? { ...ans, aiFeedback: g.feedback, manualScore: g.score !== '' ? Number(g.score) : ans.manualScore } : ans;
            });
            return { ...att, score: newScore, answers: updatedAnswers };
        }));
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-secondary-foreground">Loading submissions...</div>;
    if (!quiz || !attempts) return <div className="min-h-screen flex items-center justify-center text-red-400">Failed to load submissions.</div>;

    const suspiciousCount = attempts.filter(a => a.strikes > 0).length;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <SEO title="Quiz Submissions" description="Review student quiz attempts, AI-powered grading insights, and share results." />

            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary-foreground hover:text-primary mb-6 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to Quizzes
            </button>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">{quiz.title}</h1>
                    <p className="text-secondary-foreground text-sm mt-1 font-medium">
                        {attempts.length} submission{attempts.length !== 1 ? 's' : ''} recorded
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                    {/* AI_FEATURE_HIDDEN: AI Status Badge + Mark All with AI — set AI_ENABLED=true in config/features.js to restore */}
                    {AI_ENABLED && (
                    <>
                    {/* AI Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${aiStatus.available ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${aiStatus.available ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`} />
                        <span>GPT-4o Mini: {aiStatus.available ? 'Ready' : 'Unavailable'}</span>
                    </div>

                    {/* AI Mark All */}
                    <button
                        onClick={handleBatchMarking}
                        disabled={isProcessingAI || !aiStatus.available || attempts.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 shadow-sm"
                    >
                        {isProcessingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {isProcessingAI ? 'Grading...' : 'Mark All with AI'}
                    </button>
                    </>
                    )}

                    {/* Share Results */}
                    <button
                        onClick={handleShareResults}
                        disabled={isSharing || attempts.length === 0 || quiz?.resultsShared}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${quiz?.resultsShared ? 'bg-green-600/20 text-green-400 cursor-default' : 'bg-green-600 text-white hover:bg-green-700'}`}
                    >
                        {quiz?.resultsShared ? <><CheckCircle className="w-4 h-4" /> Results Shared</> : <><Share2 className="w-4 h-4" /> Share Results</>}
                    </button>

                    {/* Excel Export */}
                    <button
                        onClick={() => handleDownload('excel')}
                        disabled={downloading === 'excel'}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm"
                        title="Download Excel Spreadsheet"
                    >
                        {downloading === 'excel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                        Excel
                    </button>

                    {/* ZIP Reports Dropdown */}
                    <div className="relative" ref={zipDropdownRef}>
                        <button
                            onClick={() => setZipDropdownOpen(!zipDropdownOpen)}
                            disabled={downloading === 'zip' || attempts.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                        >
                            {downloading === 'zip' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                            {downloading === 'zip' ? 'Generating...' : 'Export Reports'}
                        </button>
                        {zipDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-surface border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
                                <div className="px-4 py-3 bg-indigo-600/10 border-b border-border">
                                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">PDF Reports ZIP</p>
                                    <p className="text-xs text-secondary-foreground mt-0.5">3 styled PDF reports will be generated</p>
                                </div>
                                <div className="p-3 space-y-2">
                                    {[
                                        { icon: Trophy, label: 'Best Performer', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                                        { icon: TrendingUp, label: 'Class Average', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                                        { icon: TrendingDown, label: 'Needs Attention', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
                                    ].map(({ icon: Icon, label, color, bg, border }) => (
                                        <div key={label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${bg} border ${border}`}>
                                            <div className={`w-8 h-8 rounded-lg ${bg} border ${border} flex items-center justify-center`}>
                                                <Icon className={`w-4 h-4 ${color}`} />
                                            </div>
                                            <p className={`text-xs font-bold ${color}`}>{label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-3 pb-3">
                                    <button
                                        onClick={() => { setZipDropdownOpen(false); handleDownload('zip'); }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
                                    >
                                        <Package className="w-4 h-4" /> Download ZIP (3 PDFs)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><User className="w-6 h-6" /></div>
                    <div>
                        <p className="text-xs text-secondary-foreground font-bold uppercase">Total Submissions</p>
                        <p className="text-2xl font-black text-foreground">{attempts.length}</p>
                    </div>
                </div>
                <div className={`border rounded-2xl p-4 flex items-center gap-4 ${suspiciousCount > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${suspiciousCount > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className={`text-xs font-bold uppercase ${suspiciousCount > 0 ? 'text-red-500' : 'text-green-500'}`}>Suspicious Activity</p>
                        <p className={`text-2xl font-black ${suspiciousCount > 0 ? 'text-red-500' : 'text-green-500'}`}>{suspiciousCount} Students</p>
                    </div>
                </div>
                <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent"><ShieldCheck className="w-6 h-6" /></div>
                    <div>
                        <p className="text-xs text-secondary-foreground font-bold uppercase">Integrity System</p>
                        <p className="text-sm font-bold text-foreground">Active &amp; Monitoring</p>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs font-medium text-secondary-foreground px-2 mb-4">
                <div className="flex items-center gap-2"><ShieldOff className="w-4 h-4 text-orange-400" /><span>Tab Switches</span></div>
                <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" /><span>Copy Attempts</span></div>
                <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-brand-accent" /><span>Total Strikes</span></div>
            </div>

            {/* Table */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-background border-b border-border text-[10px] uppercase text-secondary-foreground font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4 text-center">Score</th>
                                <th className="px-6 py-4 text-center">Indicators</th>
                                <th className="px-6 py-4 text-center">Submitted At</th>
                                <th className="px-6 py-4 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {attempts.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-secondary-foreground font-medium italic">No submissions yet for this quiz.</td></tr>
                            ) : (
                                attempts.map(att => {
                                    const pct = att.totalPoints > 0 ? Math.round((att.score / att.totalPoints) * 100) : 0;
                                    const isSuspicious = att.strikes > 0;
                                    const isOpen = selected === att._id;
                                    const isManualOpen = showManual[att._id];
                                    return (
                                        <React.Fragment key={att._id}>
                                            <tr className={`transition-all duration-200 ${isSuspicious ? 'bg-red-500/[0.02] hover:bg-red-500/5' : 'hover:bg-muted/10'}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${isSuspicious ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                                            {att.student?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-foreground text-sm">{att.student?.name || 'Unknown'}</p>
                                                            <p className="text-[10px] text-secondary-foreground uppercase font-bold tracking-tight">{att.student?.email}</p>
                                                        </div>
                                                        {isSuspicious && <AlertTriangle className="w-4 h-4 text-red-500 ml-1" />}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="inline-flex flex-col items-center">
                                                        <span className={`text-base font-black leading-none ${pct >= 70 ? 'text-green-500' : pct >= 40 ? 'text-orange-500' : 'text-red-500'}`}>
                                                            {att.score}/{att.totalPoints}
                                                        </span>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <div className="w-12 h-1 bg-border rounded-full overflow-hidden">
                                                                <div className={`h-full ${pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <span className="text-[10px] font-black">{pct}%</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <StrikeBadge count={att.tabSwitchCount || 0} />
                                                        <StrikeBadge count={att.copyAttemptCount || 0} />
                                                        <div className="w-px h-4 bg-border/50 mx-1" />
                                                        <StrikeBadge count={att.strikes || 0} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center text-[11px] font-bold text-secondary-foreground">
                                                    {new Date(att.attemptedAt).toLocaleDateString()}
                                                    <br />
                                                    <span className="opacity-50 font-medium">{new Date(att.attemptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setSelected(isOpen ? null : att._id)}
                                                        className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${isOpen ? 'bg-primary text-white' : 'text-primary hover:bg-primary/10'}`}
                                                    >
                                                        {isOpen ? 'HIDE' : 'VIEW'}
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Expanded Detail Row */}
                                            {isOpen && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-6 bg-muted/20 border-b border-border/50">
                                                        {/* Answers Review */}
                                                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                                            <p className="font-black text-[10px] uppercase tracking-widest text-primary mb-2">Student Submission Details</p>
                                                            {att.answers.map((ans, idx) => (
                                                                <div key={idx} className="bg-surface border border-border rounded-xl p-5 shadow-sm">
                                                                    <div className="flex items-start justify-between mb-3">
                                                                        <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded-md">QUESTION {ans.questionIndex + 1}</span>
                                                                    </div>
                                                                    {ans.selectedOptionIndex !== undefined && (
                                                                        <div className="flex items-center gap-3 mb-2">
                                                                            <p className="text-sm font-medium text-secondary-foreground">Selected Option:</p>
                                                                            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black">{String.fromCharCode(65 + ans.selectedOptionIndex)}</span>
                                                                        </div>
                                                                    )}
                                                                    {ans.textAnswer && (
                                                                        <div className="mt-2">
                                                                            <p className="text-[10px] font-black text-secondary-foreground uppercase mb-1">Student Answer:</p>
                                                                            <p className="text-sm text-foreground bg-background/50 p-3 rounded-lg border border-border/50 italic leading-relaxed">"{ans.textAnswer}"</p>
                                                                        </div>
                                                                    )}
                                                                    {ans.aiFeedback && (
                                                                        <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl relative overflow-hidden">
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <div className="p-1 rounded-md bg-purple-500/10"><Sparkles className="w-3 h-3 text-purple-500" /></div>
                                                                                <p className="text-[10px] font-black text-purple-600 uppercase tracking-tight">AI / Teacher Feedback</p>
                                                                            </div>
                                                                            <p className="text-xs text-purple-700 font-medium leading-relaxed">{ans.aiFeedback}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Manual Marking Toggle */}
                                                        <div className="mt-4">
                                                            <button
                                                                onClick={() => setShowManual(prev => ({ ...prev, [att._id]: !prev[att._id] }))}
                                                                className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-xs font-black text-secondary-foreground hover:border-primary hover:text-primary transition-all"
                                                            >
                                                                <PenLine className="w-3.5 h-3.5" />
                                                                {isManualOpen ? 'Hide Manual Marking' : 'Manual Marking'}
                                                                {isManualOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                            </button>

                                                            {isManualOpen && (
                                                                <ManualGradePanel
                                                                    att={att}
                                                                    quiz={quiz}
                                                                    onSaved={handleManualSaved}
                                                                />
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QuizSubmissions;
