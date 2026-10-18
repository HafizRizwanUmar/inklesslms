import API_BASE_URL from '../config';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, Save, FileText, Upload, CheckCircle, Code, Image as ImageIcon, Terminal, AlertCircle, Pen, Maximize2, Minimize2 } from 'lucide-react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';

// Language detection from file extension
const getLang = (fileName) => {
    const ext = (fileName || '').split('.').pop().toLowerCase();
    const map = { js: 'javascript', ts: 'typescript', py: 'python', cpp: 'cpp', c: 'c', java: 'java', cs: 'csharp', go: 'go', rs: 'rust', sql: 'sql', html: 'html', css: 'css', json: 'json', txt: 'plaintext' };
    return map[ext] || 'plaintext';
};

// Read-only annotation display for students
const ReadOnlyAnnotations = ({ annotations, width, height }) => {
    const canvasRef = useRef(null);
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        (annotations || []).forEach(ann => {
            ctx.save();
            if (ann.type === 'path') {
                ctx.strokeStyle = ann.color; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                ctx.beginPath();
                (ann.points || []).forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
                ctx.stroke();
            } else if (ann.type === 'tick') {
                ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 3; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(ann.x - 12, ann.y); ctx.lineTo(ann.x - 4, ann.y + 10); ctx.lineTo(ann.x + 14, ann.y - 12); ctx.stroke();
            } else if (ann.type === 'cross') {
                ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(ann.x - 10, ann.y - 10); ctx.lineTo(ann.x + 10, ann.y + 10);
                ctx.moveTo(ann.x + 10, ann.y - 10); ctx.lineTo(ann.x - 10, ann.y + 10); ctx.stroke();
            } else if (ann.type === 'mark') {
                ctx.fillStyle = ann.color || '#f59e0b'; ctx.font = `bold 18px Arial`; ctx.fillText(ann.text, ann.x, ann.y);
            } else if (ann.type === 'circle') {
                ctx.strokeStyle = ann.color; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ann.x, ann.y, 18, 0, Math.PI * 2); ctx.stroke();
            }
            ctx.restore();
        });
    }, [annotations]);
    useEffect(() => { draw(); }, [draw]);
    return <canvas ref={canvasRef} width={width} height={height}
        className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }} />;
};

const LabTaskDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { labId } = useParams();
    const [lab, setLab] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [answers, setAnswers] = useState({}); // { questionId: { codeFiles, activeFileIndex, output, text, images } }
    const [submittedDocument, setSubmittedDocument] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [fullscreenQId, setFullscreenQId] = useState(null); // qId of the fullscreen editor

    useEffect(() => {
        if (!labId) return navigate(-1);
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const user = JSON.parse(decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))).user;
                setCurrentUser(user);

                const resLab = await axios.get(`${API_BASE_URL}/api/lab-tasks/${labId}`, { headers: { 'x-auth-token': token } });
                setLab(resLab.data);

                const resSub = await axios.get(`${API_BASE_URL}/api/lab-submissions/my/${labId}`, { headers: { 'x-auth-token': token } });
                if (resSub.data) {
                    setSubmission(resSub.data);
                    const ansMap = {};
                    resSub.data.answers.forEach(a => {
                        ansMap[a.questionId] = {
                            codeFiles: a.codeFiles?.length ? a.codeFiles : (a.code ? [{ fileName: 'main.cpp', content: a.code }] : [{ fileName: 'main.cpp', content: '' }]),
                            activeFileIndex: 0,
                            output: a.output || '',
                            text: a.text || '',
                            images: a.images || (a.image ? [a.image] : [])
                        };
                    });
                    setAnswers(ansMap);
                }
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [labId, navigate]);

    // Timer Logic
    useEffect(() => {
        if (!lab?.deadline) return;
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(lab.deadline).getTime() - now;
            if (distance < 0) {
                setTimeLeft('EXPIRED');
                clearInterval(interval);
            } else {
                const d = Math.floor(distance / (1000 * 60 * 60 * 24));
                const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lab]);

    const handleAnswerChange = (qId, field, value) => {
        setAnswers(prev => ({
            ...prev,
            [qId]: { ...prev[qId], [field]: value }
        }));
    };

    // Code File Handlers
    const handleAddFile = (qId) => {
        setAnswers(prev => {
            const currentFiles = prev[qId]?.codeFiles || [{ fileName: 'main.cpp', content: '' }];
            return {
                ...prev,
                [qId]: {
                    ...prev[qId],
                    codeFiles: [...currentFiles, { fileName: `file${currentFiles.length + 1}.cpp`, content: '' }],
                    activeFileIndex: currentFiles.length
                }
            };
        });
    };

    const handleRemoveFile = (qId, index) => {
        setAnswers(prev => {
            const currentFiles = prev[qId]?.codeFiles || [];
            if (currentFiles.length <= 1) return prev; // Don't delete last file
            const newFiles = currentFiles.filter((_, i) => i !== index);
            return {
                ...prev,
                [qId]: {
                    ...prev[qId],
                    codeFiles: newFiles,
                    activeFileIndex: 0
                }
            };
        });
    };

    const handleUpdateFileName = (qId, index, newName) => {
        setAnswers(prev => {
            const currentFiles = [...(prev[qId]?.codeFiles || [])];
            if (currentFiles[index]) currentFiles[index].fileName = newName;
            return {
                ...prev,
                [qId]: { ...prev[qId], codeFiles: currentFiles }
            };
        });
    };

    const handleUpdateFileContent = (qId, index, newContent) => {
        setAnswers(prev => {
            const currentFiles = [...(prev[qId]?.codeFiles || [])];
            if (currentFiles[index]) currentFiles[index].content = newContent;
            return {
                ...prev,
                [qId]: { ...prev[qId], codeFiles: currentFiles }
            };
        });
    };

    // Image Handlers
    const handleImageUpload = (qId, files) => {
        if (!files || files.length === 0) return;
        setAnswers(prev => {
            const currentImages = prev[qId]?.images || [];
            const newImages = Array.from(files);
            return {
                ...prev,
                [qId]: {
                    ...prev[qId],
                    images: [...currentImages, ...newImages]
                }
            };
        });
    };

    const handleRemoveImage = (qId, index) => {
        setAnswers(prev => {
            const currentImages = prev[qId]?.images || [];
            const newImages = currentImages.filter((_, i) => i !== index);
            return {
                ...prev,
                [qId]: { ...prev[qId], images: newImages }
            };
        });
    };

    const handleCodeImport = (e, qId) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setAnswers(prev => {
                const currentFiles = prev[qId]?.codeFiles || [];
                return {
                    ...prev,
                    [qId]: {
                        ...prev[qId],
                        codeFiles: [...currentFiles, { fileName: file.name, content: event.target.result }],
                        activeFileIndex: currentFiles.length
                    }
                };
            });
        };
        reader.readAsText(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('labTaskId', labId);

            const answersPayload = lab.questions.map(q => ({
                questionId: q._id,
                codeFiles: answers[q._id]?.codeFiles || [],
                output: answers[q._id]?.output || '',
                text: answers[q._id]?.text || ''
            }));
            formData.append('answers', JSON.stringify(answersPayload));

            if (submittedDocument) {
                formData.append('submittedDocument', submittedDocument);
            }

            lab.questions.forEach(q => {
                const subType = q.submissionTypes;
                if (subType.includes('image') || subType.includes('output')) {
                    const images = answers[q._id]?.images || [];
                    images.forEach((img) => {
                        if (img instanceof File) {
                            formData.append(`image_${q._id}`, img);
                        }
                    });
                }
            });

            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/lab-submissions`, formData, {
                headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
            });
            setSubmission(res.data);
            alert('Lab Submitted Successfully!');
        } catch (err) {
            console.error(err);
            alert('Error submitting lab');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !lab) return <div className="p-8 text-center">Loading...</div>;
    const isTeacher = lab.createdBy === currentUser?.id;

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-12">
            <SEO title={lab?.title || 'Lab Task'} description={`Work on hands-on coding challenges and submit your lab project for ${lab?.title || 'this task'}.`} />
            {/* Professional Header */}
            <div className="bg-surface border-b border-border shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full transition-colors order-first">
                            <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold truncate max-w-[200px] md:max-w-md">{lab.title}</h1>
                            <div className="flex items-center gap-4 text-xs md:text-sm text-secondary-foreground mt-1">
                                <span className={`flex items-center gap-1 font-mono font-bold ${timeLeft === 'EXPIRED' ? 'text-red-500' : 'text-primary'}`}>
                                    <Clock size={14} /> {timeLeft || 'Loading...'}
                                </span>
                                <span className="hidden md:flex items-center gap-1"><FileText size={14} /> {lab.totalMarks} Marks</span>
                            </div>
                        </div>
                    </div>
                    {isTeacher && (
                        <button onClick={() => navigate(`/lab-submissions/${labId}`)} className="text-primary font-bold text-sm hover:underline">
                            View Subs
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Description Card */}
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Instructions</h3>
                    <p className="text-secondary-foreground leading-relaxed whitespace-pre-wrap">{lab.description}</p>
                </div>

                {lab.taskDocument && (
                    <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg mb-1">Task Document</h3>
                            <p className="text-secondary-foreground text-sm">Download the PDF to view the task questions.</p>
                        </div>
                        <a href={`${API_BASE_URL}${lab.taskDocument}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold hover:bg-primary/20 transition-colors">
                            <FileText size={18} /> View PDF
                        </a>
                    </div>
                )}

                {!isTeacher && (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Status Banners */}
                        {submission && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-500/10 text-green-700 p-4 rounded-xl border border-green-500/20 flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 shrink-0" />
                                <div>
                                    <p className="font-bold">Submission Received</p>
                                    <p className="text-sm opacity-90">{submission.status === 'graded' ? `Graded: ${submission.obtainedMarks} / ${lab.totalMarks}` : 'Pending Grading'}</p>
                                </div>
                            </motion.div>
                        )}

                        {submission?.teacherFeedback && (
                            <div className="bg-amber-500/10 text-amber-800 p-4 rounded-xl border border-amber-500/20">
                                <h4 className="font-bold mb-1 flex items-center gap-2"><AlertCircle size={16} /> Feedback</h4>
                                <p className="text-sm whitespace-pre-wrap">{submission.teacherFeedback}</p>
                            </div>
                        )}

                        {/* Questions or Document Upload */}
                        {lab.taskDocument ? (
                            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm p-8 text-center">
                                <h3 className="font-bold text-lg mb-4">Upload Submission</h3>
                                <p className="text-secondary-foreground mb-6">Since this lab uses a document for questions, please upload your answers as a PDF or ZIP file.</p>

                                {submission?.submittedDocument && !submittedDocument ? (
                                    <div className="flex flex-col items-center gap-4 w-full">
                                        {submission.status === 'graded' && submission.annotations ? (
                                            // Show PDF with teacher annotations overlaid
                                            <div className="w-full">
                                                <div className="flex items-center gap-2 mb-3 text-sm font-bold text-primary">
                                                    <Pen className="w-4 h-4" /> Teacher has annotated your submission
                                                </div>
                                                <div className="relative rounded-xl overflow-hidden border border-border w-full" style={{ minHeight: 600 }}>
                                                    <iframe
                                                        src={`${API_BASE_URL}${submission.submittedDocument}#toolbar=0`}
                                                        className="w-full border-0"
                                                        style={{ height: 600, position: 'relative', zIndex: 1 }}
                                                        title="Your Submission"
                                                    />
                                                    <ReadOnlyAnnotations
                                                        annotations={JSON.parse(submission.annotations)}
                                                        width={800} height={600}
                                                    />
                                                </div>
                                                <a href={`${API_BASE_URL}${submission.submittedDocument}`} target="_blank" rel="noreferrer" className="text-primary text-xs hover:underline font-bold mt-2 inline-block">Download your submission</a>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                                                    <CheckCircle size={32} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-bold text-foreground">File Submitted</p>
                                                    <a href={`${API_BASE_URL}${submission.submittedDocument}`} target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline font-medium">View current submission</a>
                                                </div>
                                            </div>
                                        )}
                                        {submission?.status !== 'graded' && (
                                            <button type="button" onClick={() => setSubmittedDocument(null)} className="text-sm font-bold text-secondary-foreground hover:text-foreground underline mt-2">
                                                Replace File
                                            </button>
                                        )}
                                    </div>

                                ) : (
                                    <div className="border-2 border-dashed border-border p-10 rounded-xl hover:bg-muted/30 transition-colors relative cursor-pointer group flex flex-col items-center mx-auto max-w-md">
                                        <input
                                            type="file"
                                            accept=".pdf,.zip"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={(e) => setSubmittedDocument(e.target.files[0])}
                                            disabled={submission?.status === 'graded'}
                                            required={!submission?.submittedDocument}
                                        />
                                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Upload size={32} />
                                        </div>
                                        <p className="text-lg font-bold text-foreground mb-2">
                                            {submittedDocument ? submittedDocument.name : 'Select PDF or ZIP File'}
                                        </p>
                                        <p className="text-sm text-secondary-foreground">
                                            {submittedDocument ? (submittedDocument.size / 1024 / 1024).toFixed(2) + ' MB' : 'Maximum file size 50MB'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {lab.questions.map((q, index) => (
                                    <div key={q._id} className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
                                        <div className="bg-muted/30 px-6 py-4 border-b border-border flex justify-between items-center">
                                            <h3 className="font-bold">Question {index + 1}</h3>
                                            <span className="text-xs bg-background px-2 py-1 rounded-md border border-border font-mono">{q.subMarks} pts</span>
                                        </div>

                                        <div className="p-6 space-y-6">
                                            <p className="text-foreground whitespace-pre-wrap font-medium">{q.questionText}</p>

                                            {/* Input Sections Based on Type */}
                                            <div className="space-y-6">
                                                {/* CODE INPUT */}
                                                {q.submissionTypes.includes('code') && (() => {
                                                    const activeIdx = answers[q._id]?.activeFileIndex || 0;
                                                    const files = answers[q._id]?.codeFiles || [{ fileName: 'main.cpp', content: q.starterCode || '' }];
                                                    const activeFile = files[activeIdx] || files[0];
                                                    const isFullscreen = fullscreenQId === q._id;
                                                    const editorContent = (
                                                        <div
                                                            className={isFullscreen
                                                                ? 'fixed inset-0 z-[9999] flex flex-col'
                                                                : 'border border-[#3c3c3c] rounded-xl overflow-hidden shadow-lg'
                                                            }
                                                            style={{ background: '#1e1e1e' }}
                                                        >
                                                            {/* VS Code Title Bar */}
                                                            <div style={{ background: '#323233', display: 'flex', alignItems: 'center', height: 36, padding: '0 10px', borderBottom: '1px solid #252526', flexShrink: 0, userSelect: 'none', gap: 8 }}>
                                                                {/* Traffic lights */}
                                                                <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginRight: 6 }}>
                                                                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56' }} />
                                                                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
                                                                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c93f' }} />
                                                                </div>

                                                                {/* Tabs */}
                                                                <div style={{ display: 'flex', flex: 1, overflowX: 'auto', gap: 1 }}>
                                                                    {files.map((file, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            style={{
                                                                                display: 'flex', alignItems: 'center', gap: 6,
                                                                                padding: '0 12px', height: 36, cursor: 'pointer',
                                                                                background: activeIdx === idx ? '#1e1e1e' : 'transparent',
                                                                                borderBottom: activeIdx === idx ? '2px solid #f97316' : '2px solid transparent',
                                                                                color: activeIdx === idx ? '#fff' : '#888',
                                                                                fontSize: 12, fontFamily: 'Consolas, monospace',
                                                                                flexShrink: 0,
                                                                            }}
                                                                            onClick={() => handleAnswerChange(q._id, 'activeFileIndex', idx)}
                                                                        >
                                                                            {submission?.status !== 'graded' ? (
                                                                                <input
                                                                                    style={{ background: 'transparent', outline: 'none', color: 'inherit', fontFamily: 'Consolas, monospace', fontSize: 12, width: Math.max(60, file.fileName.length * 8) }}
                                                                                    value={file.fileName}
                                                                                    onChange={e => handleUpdateFileName(q._id, idx, e.target.value)}
                                                                                    onClick={e => e.stopPropagation()}
                                                                                />
                                                                            ) : <span>{file.fileName}</span>}
                                                                            {submission?.status !== 'graded' && files.length > 1 && (
                                                                                <span
                                                                                    style={{ color: '#666', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}
                                                                                    onClick={e => { e.stopPropagation(); handleRemoveFile(q._id, idx); }}
                                                                                    onMouseEnter={e => e.currentTarget.style.color = '#ff5f56'}
                                                                                    onMouseLeave={e => e.currentTarget.style.color = '#666'}
                                                                                >×</span>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                {/* Actions */}
                                                                {submission?.status !== 'graded' && (
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                                                        <button type="button" title="New File"
                                                                            onClick={() => handleAddFile(q._id)}
                                                                            style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px' }}
                                                                            onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                                                                            onMouseLeave={e => e.currentTarget.style.color = '#888'}
                                                                        >+</button>
                                                                        <label
                                                                            htmlFor={`code-upload-${q._id}`}
                                                                            style={{ color: '#888', cursor: 'pointer', fontSize: 11, fontFamily: 'Consolas, monospace', display: 'flex', alignItems: 'center', gap: 3 }}
                                                                            onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                                                                            onMouseLeave={e => e.currentTarget.style.color = '#888'}
                                                                        >
                                                                            <Upload size={11} /> Import
                                                                        </label>
                                                                        <input type="file" id={`code-upload-${q._id}`} className="hidden"
                                                                            onChange={e => handleCodeImport(e, q._id)} accept=".c,.cpp,.java,.js,.py,.ts,.go,.rs,.sql,.txt" />
                                                                    </div>
                                                                )}

                                                                {/* Fullscreen toggle */}
                                                                <button
                                                                    type="button"
                                                                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                                                    onClick={() => setFullscreenQId(isFullscreen ? null : q._id)}
                                                                    style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                                                                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                                                    onMouseLeave={e => e.currentTarget.style.color = '#888'}
                                                                >
                                                                    {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                                                </button>
                                                            </div>

                                                            {/* Monaco Editor */}
                                                            <div style={{ flex: 1, minHeight: isFullscreen ? 0 : 320 }}>
                                                                <Editor
                                                                    height={isFullscreen ? '100%' : '320px'}
                                                                    language={getLang(activeFile?.fileName)}
                                                                    value={activeFile?.content || ''}
                                                                    onChange={val => handleUpdateFileContent(q._id, activeIdx, val || '')}
                                                                    theme="vs-dark"
                                                                    options={{
                                                                        fontSize: 13,
                                                                        fontFamily: "'Cascadia Code', 'Fira Code', Consolas, monospace",
                                                                        fontLigatures: true,
                                                                        minimap: { enabled: isFullscreen },
                                                                        scrollBeyondLastLine: false,
                                                                        lineNumbers: 'on',
                                                                        renderLineHighlight: 'line',
                                                                        cursorBlinking: 'smooth',
                                                                        tabSize: 4,
                                                                        wordWrap: 'on',
                                                                        automaticLayout: true,
                                                                        padding: { top: 12 },
                                                                        readOnly: submission?.status === 'graded',
                                                                        smoothScrolling: true,
                                                                        bracketPairColorization: { enabled: true },
                                                                        folding: true,
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* VS Code status bar */}
                                                            <div style={{ background: '#007acc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', height: 22, flexShrink: 0 }}>
                                                                <span style={{ color: '#ffffffcc', fontSize: 11, fontFamily: 'Consolas, monospace' }}>
                                                                    {getLang(activeFile?.fileName).toUpperCase()}
                                                                </span>
                                                                <span style={{ color: '#ffffffcc', fontSize: 11, fontFamily: 'Consolas, monospace' }}>
                                                                    {activeFile?.fileName} · UTF-8
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                    return editorContent;
                                                })()}

                                                {/* OUTPUT INPUT */}
                                                {q.submissionTypes.includes('output') && (
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-secondary-foreground flex items-center gap-1"><Terminal size={14} /> Console Output</label>
                                                        <textarea
                                                            rows="4"
                                                            className="w-full p-4 rounded-xl border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary bg-muted/30 font-mono text-sm outline-none transition-all"
                                                            placeholder="Paste output here..."
                                                            value={answers[q._id]?.output || ''}
                                                            onChange={e => handleAnswerChange(q._id, 'output', e.target.value)}
                                                            readOnly={submission?.status === 'graded'}
                                                        />
                                                    </div>
                                                )}

                                                {/* TEXT INPUT */}
                                                {q.submissionTypes.includes('text') && (
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-secondary-foreground">Answer</label>
                                                        <textarea
                                                            rows="3"
                                                            className="w-full p-4 rounded-xl border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background outline-none transition-all"
                                                            placeholder="Type your answer..."
                                                            value={answers[q._id]?.text || ''}
                                                            onChange={e => handleAnswerChange(q._id, 'text', e.target.value)}
                                                            readOnly={submission?.status === 'graded'}
                                                        />
                                                    </div>
                                                )}

                                                {/* IMAGE/SCREENSHOT INPUT */}
                                                {(q.submissionTypes.includes('image') || q.submissionTypes.includes('output')) && (
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <label className="text-xs font-bold uppercase text-secondary-foreground flex items-center gap-1"><ImageIcon size={14} /> {q.submissionTypes.includes('output') ? 'Output Screenshots' : 'Images'}</label>

                                                            {submission?.status !== 'graded' && (
                                                                <div className="relative">
                                                                    <input type="file" id={`img-upload-${q._id}`} className="hidden" multiple accept="image/*"
                                                                        onChange={e => handleImageUpload(q._id, e.target.files)}
                                                                    />
                                                                    <label htmlFor={`img-upload-${q._id}`} className="text-xs text-primary cursor-pointer hover:underline flex items-center gap-1">
                                                                        <Upload size={12} /> Add Images
                                                                    </label>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            {(answers[q._id]?.images || []).map((img, idx) => (
                                                                <div key={idx} className="relative group rounded-xl overflow-hidden border border-border aspect-video bg-black/5">
                                                                    <img
                                                                        src={img instanceof File ? URL.createObjectURL(img) : `${API_BASE_URL}${img}`}
                                                                        alt={`Upload ${idx}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    {submission?.status !== 'graded' && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveImage(q._id, idx)}
                                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                                                                        >
                                                                            &times;
                                                                        </button>
                                                                    )}
                                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                                        <span className="text-white text-xs font-medium px-2 py-1 bg-black/50 rounded-full">
                                                                            {img instanceof File ? 'Pending' : 'Uploaded'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {submission?.status !== 'graded' && (answers[q._id]?.images || []).length === 0 && (
                                                                <div className="col-span-2 border-2 border-dashed border-border p-6 rounded-xl hover:bg-muted/30 transition-colors relative cursor-pointer group flex flex-col items-center justify-center text-center">
                                                                    <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                                        onChange={e => handleImageUpload(q._id, e.target.files)}
                                                                    />
                                                                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                                        <Upload size={20} />
                                                                    </div>
                                                                    <p className="text-sm font-medium text-foreground">Upload Images</p>
                                                                    <p className="text-xs text-secondary-foreground">PNG, JPG</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Submit Action */}
                        {submission?.status !== 'graded' && (
                            <div>
                                <div className="max-w-4xl mx-auto">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        <Save size={20} />
                                        {submitting ? 'Submitting...' : (submission ? 'Update Submission' : 'Submit Lab Task')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                )}

                {isTeacher && (
                    <div className="bg-brand-accent/10 border border-brand-accent/20 p-6 rounded-2xl text-brand-muted text-center">
                        <h3 className="font-bold mb-2">Teacher Preview Mode</h3>
                        <p>This is what students see. Head to "View Subs" to grade.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LabTaskDetails;
