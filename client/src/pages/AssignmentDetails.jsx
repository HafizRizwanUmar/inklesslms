import API_BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, FileCode, ImageIcon, Archive, Eye, Trash2, CheckCircle2, ChevronRight, AlertCircle, Save, Download, CheckSquare, Maximize2, Minimize2 } from 'lucide-react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import PDFViewerEditor from '../components/PDFViewerEditor';
import Editor from '@monaco-editor/react';

// Language detection from file extension
const getLang = (fileName) => {
    const ext = (fileName || 'main.cpp').split('.').pop().toLowerCase();
    const map = { js: 'javascript', ts: 'typescript', py: 'python', cpp: 'cpp', c: 'c', java: 'java', cs: 'csharp', go: 'go', rs: 'rust', sql: 'sql', html: 'html', css: 'css', json: 'json', txt: 'plaintext' };
    return map[ext] || 'cpp';
};

const AssignmentDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [files, setFiles] = useState({ generic: null });
    const [textData, setTextData] = useState({ code: '', output: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [viewingFile, setViewingFile] = useState(null);
    const [editedBlob, setEditedBlob] = useState(null);
    const [codeFullscreen, setCodeFullscreen] = useState(false);
    const [codeFileName, setCodeFileName] = useState('main.cpp');
    const [pdfPanelOpen, setPdfPanelOpen] = useState(false);
    const [pdfPanelUrl, setPdfPanelUrl] = useState(null);

    useEffect(() => {
        if (!assignmentId) return navigate(-1);

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                const user = JSON.parse(jsonPayload).user;
                setCurrentUser(user);

                const resAssign = await axios.get(`${API_BASE_URL}/api/assignments/${assignmentId}`, {
                    headers: { 'x-auth-token': token }
                });
                setAssignment(resAssign.data);

                const resSub = await axios.get(`${API_BASE_URL}/api/submissions/my/${assignmentId}`, {
                    headers: { 'x-auth-token': token }
                });
                if (resSub.data) {
                    setSubmission(resSub.data);
                    setTextData({
                        code: resSub.data.codeContent || '',
                        output: resSub.data.outputContent || ''
                    });
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [assignmentId, navigate]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSubmitting(true);

        try {
            const types = assignment.submissionTypes || {};
            const hasFile = !!files.generic || !!editedBlob;
            const hasCode = !!textData.code && textData.code.trim().length > 0;
            const hasOutput = !!textData.output && textData.output.trim().length > 0;
            const hasExistingFile = !!submission?.filePath;
            const hasExistingCode = !!submission?.codeContent;
            const hasExistingOutput = !!submission?.outputContent;

            let isValid = false;
            if (types.code && (hasCode || hasExistingCode)) isValid = true;
            if (types.output && (hasOutput || hasExistingOutput)) isValid = true;
            if ((types.pdf || types.zip || types.image) && (hasFile || hasExistingFile)) isValid = true;

            if (!isValid) {
                alert('Please provide the required submission content.');
                setSubmitting(false);
                return;
            }

            const formData = new FormData();
            formData.append('assignmentId', assignmentId);
            if (assignment.submissionTypes?.code) formData.append('codeContent', textData.code);
            if (assignment.submissionTypes?.output) formData.append('outputContent', textData.output);
            
            // Handle Files
            if (editedBlob) {
                formData.append('file', editedBlob, 'edited_submission.pdf');
            } else if (files.generic) {
                formData.append('file', files.generic);
            }

            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/submissions`, formData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSubmission(res.data);
            setEditedBlob(null);
            alert('Assignment Submitted Successfully!');
        } catch (err) {
            console.error(err);
            alert('Error submitting assignment');
        } finally {
            setSubmitting(false);
        }
    };

    const [editingTypes, setEditingTypes] = useState(false);
    const [editTypes, setEditTypes] = useState(null);
    const [savingTypes, setSavingTypes] = useState(false);

    const handleSaveSubmissionTypes = async () => {
        setSavingTypes(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${API_BASE_URL}/api/assignments/${assignmentId}`, { submissionTypes: editTypes }, {
                headers: { 'x-auth-token': token }
            });
            setAssignment(res.data);
            setEditingTypes(false);
            alert('Submission types updated!');
        } catch (err) {
            console.error(err);
            alert('Failed to update submission types.');
        } finally {
            setSavingTypes(false);
        }
    };

    const handlePublishResults = async () => {
        try {
            const res = await axios.put(`${API_BASE_URL}/api/assignments/${assignmentId}/publish-results`, {}, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setAssignment(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to toggle result publication.');
        }
    };


    if (loading || !assignment) return <div className="flex h-screen items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

    const isTeacher = assignment.createdBy === currentUser?.id;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500 pb-20">
            <SEO title={assignment?.title || 'Assignment Details'} description={`View details and submit your work for ${assignment?.title || 'this assignment'}.`} />
            
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-black font-bold uppercase tracking-widest text-[11px] transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                {isTeacher && (
                    <button
                        onClick={() => navigate(`/submissions/${assignmentId}`)}
                        className="bg-black text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/10"
                    >
                        Review Submissions
                    </button>
                )}
            </div>

            {/* Cinematic Header Card */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Assignment</span>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"><Clock size={14} /> Due {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'TBA'}</span>
                        </div>
                        <h1 className="text-4xl font-black text-black tracking-tight leading-tight">{assignment.title}</h1>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium whitespace-pre-wrap max-w-2xl">{assignment.description}</p>
                    </div>

                    <div className="w-full md:w-auto flex flex-col gap-3">
                        <div className="bg-black p-6 rounded-3xl text-white min-w-[200px]">
                            <p className="text-[10px] font-black uppercase text-white/50 tracking-[0.2em] mb-1">Max Score</p>
                            <h2 className="text-4xl font-black">{assignment.marks} <span className="text-sm font-bold text-primary">PTS</span></h2>
                        </div>
                        {assignment.fileUrl && (
                            <button 
                                onClick={() => {
                                    const url = `${API_BASE_URL}${assignment.fileUrl}`;
                                    if (pdfPanelOpen && pdfPanelUrl === url) {
                                        setPdfPanelOpen(false);
                                    } else {
                                        setPdfPanelUrl(url);
                                        setPdfPanelOpen(true);
                                    }
                                }}
                                className={`w-full flex items-center justify-center gap-2 p-4 font-black text-xs uppercase tracking-widest rounded-2xl transition-all group ${
                                    pdfPanelOpen ? 'bg-primary text-white' : 'bg-gray-50 text-black hover:bg-primary hover:text-white'
                                }`}
                            >
                                <Eye size={16} className="group-hover:scale-110 transition-transform" />
                                {pdfPanelOpen ? 'Close PDF Panel' : 'View Attachment'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main layout: form + optional PDF side panel */}
            <div className={`flex gap-8 items-start`}>
                {/* Left: Submission / Teacher content */}
                <div className={`space-y-6 min-w-0 transition-all duration-300 ${pdfPanelOpen ? 'flex-[0_0_50%] max-w-[50%]' : 'flex-1'}`}>
                    {viewingFile ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-black">File Viewer</h3>
                                <button onClick={() => setViewingFile(null)} className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Close Viewer</button>
                            </div>
                            <PDFViewerEditor 
                                fileUrl={viewingFile} 
                                onSave={(blob) => {
                                    setEditedBlob(blob);
                                    setViewingFile(null);
                                    alert("Changes saved to your submission draft!");
                                }} 
                                readOnly={isTeacher || submission?.status === 'graded'}
                            />
                        </div>
                    ) : isTeacher ? (
                        <div className="space-y-6">
                            {/* Edit Submission Types */}
                            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-black text-black flex items-center gap-2">
                                        <CheckSquare className="text-primary" size={22} />
                                        Submission Requirements
                                    </h3>
                                    {!editingTypes ? (
                                        <button
                                            onClick={() => { setEditingTypes(true); setEditTypes({ ...assignment.submissionTypes }); }}
                                            className="text-xs font-black uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all"
                                        >
                                            Edit Types
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditingTypes(false)} className="text-xs font-black uppercase tracking-widest text-gray-400 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                                            <button onClick={handleSaveSubmissionTypes} disabled={savingTypes} className="text-xs font-black uppercase tracking-widest bg-black text-white px-4 py-2 rounded-xl hover:bg-primary transition-all disabled:opacity-50">
                                                {savingTypes ? 'Saving…' : 'Save'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {editingTypes && editTypes ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                        {[
                                            { id: 'pdf', label: 'PDF', icon: FileText, color: 'text-red-500' },
                                            { id: 'zip', label: 'ZIP Archive', icon: Archive, color: 'text-blue-500' },
                                            { id: 'code', label: 'Source Code', icon: FileCode, color: 'text-primary' },
                                            { id: 'output', label: 'Output', icon: FileText, color: 'text-green-500' },
                                            { id: 'image', label: 'Screenshot', icon: ImageIcon, color: 'text-purple-500' },
                                        ].map(req => (
                                            <div
                                                key={req.id}
                                                onClick={() => setEditTypes(prev => ({ ...prev, [req.id]: !prev[req.id] }))}
                                                className={`p-4 border rounded-[20px] cursor-pointer flex flex-col gap-3 transition-all ${editTypes[req.id] ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}
                                            >
                                                <div className={`p-2 rounded-xl w-fit ${editTypes[req.id] ? 'bg-primary text-white' : 'bg-white text-gray-300'} transition-all`}>
                                                    <req.icon size={18} />
                                                </div>
                                                <span className={`text-xs font-black uppercase tracking-tight ${editTypes[req.id] ? 'text-black' : 'text-gray-400'}`}>{req.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-3">
                                        {Object.entries(assignment.submissionTypes || {}).filter(([, v]) => v).length === 0 ? (
                                            <div className="w-full p-6 border-2 border-dashed border-red-100 rounded-2xl bg-red-50/30 text-center">
                                                <p className="text-red-500 font-bold text-xs uppercase tracking-widest">No submission types set — click "Edit Types" to add some</p>
                                            </div>
                                        ) : (
                                            Object.entries(assignment.submissionTypes || {}).filter(([, v]) => v).map(([key]) => (
                                                <span key={key} className="bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">{key}</span>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Publish Results */}
                            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm text-center">
                                <div className="flex justify-center mb-6">
                                    <div className="p-4 bg-primary/10 text-primary rounded-full">
                                        <AlertCircle size={32} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-black mb-4">Publish Results</h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm font-bold leading-relaxed">
                                    Once you have finished grading all submissions, publish the results so students can view their marks and feedback.
                                </p>
                                <button
                                    onClick={handlePublishResults}
                                    className={`px-12 py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all ${assignment.resultsPublished ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100' : 'bg-black text-white hover:bg-primary shadow-black/20 hover:shadow-primary/30'}`}
                                >
                                    {assignment.resultsPublished ? 'Unpublish Results' : 'Publish Results'}
                                </button>
                            </div>
                        </div>

                    ) : (
                        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-black text-black">Your Submission</h3>
                                {submission && (
                                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-widest ${submission.status === 'graded' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-primary/10 text-primary border-primary/10'}`}>
                                        <CheckCircle2 size={14} /> {submission.status}
                                    </div>
                                )}
                            </div>
                            
                            {!assignment.submissionTypes || (!assignment.submissionTypes.code && !assignment.submissionTypes.output && !assignment.submissionTypes.image && !assignment.submissionTypes.pdf && !assignment.submissionTypes.zip) ? (
                                <div className="p-10 border-2 border-dashed border-red-100 rounded-[40px] bg-red-50/30 text-center">
                                    <AlertCircle className="mx-auto text-red-400 mb-4" size={40} />
                                    <p className="text-red-500 font-bold uppercase tracking-widest text-xs">No Submission Requirements Set</p>
                                    <p className="text-gray-500 text-sm mt-2">The instructor hasn't specified any submission types for this assignment.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Code Submission */}
                                    {assignment.submissionTypes?.code && (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Source Code</label>
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded">Required</span>
                                            </div>

                                            {/* Monaco VS Code Editor */}
                                            <div
                                                className={codeFullscreen
                                                    ? 'fixed inset-0 z-[9999] flex flex-col'
                                                    : 'rounded-2xl overflow-hidden border border-[#3c3c3c] shadow-xl'
                                                }
                                                style={{ background: '#1e1e1e' }}
                                            >
                                                {/* VS Code Title Bar */}
                                                <div style={{ background: '#323233', display: 'flex', alignItems: 'center', height: 36, padding: '0 12px', borderBottom: '1px solid #252526', flexShrink: 0, userSelect: 'none', gap: 8 }}>
                                                    {/* Traffic lights */}
                                                    <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginRight: 8 }}>
                                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                                                    </div>

                                                    {/* File tab */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1e1e1e', padding: '4px 14px', borderRadius: '4px 4px 0 0', border: '1px solid #3c3c3c', borderBottom: 'none', marginBottom: -1, position: 'relative', top: 1 }}>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#569cd6" strokeWidth="2"/><polyline points="14 2 14 8 20 8" stroke="#569cd6" strokeWidth="2"/></svg>
                                                        <input
                                                            value={codeFileName}
                                                            onChange={e => setCodeFileName(e.target.value)}
                                                            style={{ background: 'transparent', outline: 'none', color: '#cccccc', fontFamily: 'Consolas, monospace', fontSize: 12, width: Math.max(80, codeFileName.length * 8) }}
                                                            readOnly={submission?.status === 'graded'}
                                                        />
                                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e5c07b' }} title="Unsaved changes" />
                                                    </div>

                                                    <div style={{ flex: 1 }} />

                                                    {/* Language badge */}
                                                    <span style={{ background: '#0e639c', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, fontFamily: 'Consolas, monospace' }}>
                                                        {getLang(codeFileName).toUpperCase()}
                                                    </span>

                                                    {/* Fullscreen toggle */}
                                                    <button
                                                        type="button"
                                                        title={codeFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                                        onClick={() => setCodeFullscreen(!codeFullscreen)}
                                                        style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                                                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                                        onMouseLeave={e => e.currentTarget.style.color = '#888'}
                                                    >
                                                        {codeFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                                    </button>
                                                </div>

                                                {/* Monaco Editor */}
                                                <div style={{ flex: 1 }}>
                                                    <Editor
                                                        height={codeFullscreen ? 'calc(100vh - 58px)' : '360px'}
                                                        language={getLang(codeFileName)}
                                                        value={textData.code}
                                                        onChange={val => setTextData({ ...textData, code: val || '' })}
                                                        theme="vs-dark"
                                                        options={{
                                                            fontSize: 13,
                                                            fontFamily: "'Cascadia Code', 'Fira Code', Consolas, monospace",
                                                            fontLigatures: true,
                                                            minimap: { enabled: codeFullscreen },
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
                                                <div style={{ background: '#007acc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', height: 22, flexShrink: 0 }}>
                                                    <span style={{ color: '#ffffffcc', fontSize: 11, fontFamily: 'Consolas, monospace' }}>Source Code Editor</span>
                                                    <span style={{ color: '#ffffffcc', fontSize: 11, fontFamily: 'Consolas, monospace' }}>{codeFileName} · UTF-8 · LF</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Output Area */}
                                    {assignment.submissionTypes?.output && (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Terminal Output</label>
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded">Required</span>
                                            </div>
                                            <textarea
                                                rows="6"
                                                className="w-full p-6 font-mono text-sm bg-gray-50 border border-gray-100 rounded-3xl focus:border-primary focus:bg-white transition-all outline-none"
                                                placeholder="Paste output here..."
                                                value={textData.output}
                                                onChange={e => setTextData({ ...textData, output: e.target.value })}
                                                readOnly={submission?.status === 'graded'}
                                            />
                                        </div>
                                    )}

                                    {/* Unified File Uploader */}
                                    {(assignment.submissionTypes?.image || assignment.submissionTypes?.pdf || assignment.submissionTypes?.zip) && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Attached Files</label>
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded">Required</span>
                                            </div>
                                        
                                        {/* Display Existing or Selected File */}
                                        {(submission?.filePath || files.generic || editedBlob) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                                                            {editedBlob ? <FileText size={20} /> : (submission?.fileType === 'zip' ? <Archive size={20} /> : <FileText size={20} />)}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-xs font-black text-black truncate uppercase tracking-tight">
                                                                {editedBlob ? 'Edited_Submission.pdf' : (files.generic?.name || (submission?.filePath ? 'Uploaded_File' : 'No File'))}
                                                            </p>
                                                            <p className="text-[10px] font-bold text-gray-400">{(submission?.fileType || 'draft').toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {(submission?.filePath || editedBlob) && (
                                                            <button 
                                                                type="button"
                                                                onClick={() => setViewingFile(editedBlob ? URL.createObjectURL(editedBlob) : `${API_BASE_URL}${submission.filePath}`)}
                                                                className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                        )}
                                                        {submission?.status !== 'graded' && (
                                                            <button 
                                                                type="button"
                                                                onClick={() => { setFiles({ generic: null }); setEditedBlob(null); }} 
                                                                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Upload Input */}
                                        {submission?.status !== 'graded' && !files.generic && !editedBlob && (
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept={[
                                                        assignment.submissionTypes?.pdf ? '.pdf' : '',
                                                        assignment.submissionTypes?.zip ? '.zip' : '',
                                                        assignment.submissionTypes?.image ? 'image/*' : ''
                                                    ].filter(Boolean).join(',') || '*/*'}
                                                    onChange={e => setFiles({ generic: e.target.files[0] })}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="border-2 border-dashed border-gray-200 group-hover:border-primary group-hover:bg-primary/5 transition-all rounded-[32px] p-10 text-center flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        <Upload size={32} />
                                                    </div>
                                                    <p className="font-black text-black text-sm uppercase tracking-widest mb-1">
                                                        Upload {
                                                            [
                                                                assignment.submissionTypes?.pdf ? 'PDF' : '',
                                                                assignment.submissionTypes?.zip ? 'ZIP' : '',
                                                                assignment.submissionTypes?.image ? 'Image' : ''
                                                            ].filter(Boolean).join(', ') || 'File'
                                                        }
                                                    </p>
                                                    <p className="text-xs text-gray-400 font-bold">Max file size: 20MB</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                    {/* Submit Button */}
                                    {submission?.status !== 'graded' && (
                                        <div className="pt-6 border-t border-gray-50">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full md:w-auto bg-black text-white px-12 py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:bg-primary hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                            >
                                                {submitting ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <Save size={20} />
                                                        {submission ? 'Update Submission' : 'Finalize & Submit'}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Stats / Feedback */}
                <div className="space-y-6">
                    {submission?.status === 'graded' && assignment.resultsPublished && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-600 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10"><CheckCircle2 size={120} /></div>
                            <p className="text-[10px] font-black uppercase text-white/60 tracking-[0.3em] mb-2">Obtained Marks</p>
                            <div className="text-7xl font-black mb-6">{submission.obtainedMarks} <span className="text-xl opacity-60">/ {assignment.marks}</span></div>
                            
                            {submission.teacherFeedback && (
                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                                    <p className="text-[10px] font-black uppercase text-white/60 tracking-widest mb-2 flex items-center gap-2">
                                        <FileText size={12} /> Instructor Feedback
                                    </p>
                                    <p className="text-sm font-bold leading-relaxed">{submission.teacherFeedback}</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {submission?.status === 'graded' && !assignment.resultsPublished && !isTeacher && (
                        <div className="bg-yellow-50 p-8 rounded-[40px] border border-yellow-100 shadow-sm text-center">
                            <h4 className="text-lg font-black text-yellow-600 mb-2">Graded</h4>
                            <p className="text-xs font-bold text-yellow-600/70">Marks will be visible once the instructor publishes the results.</p>
                        </div>
                    )}

                    {!pdfPanelOpen && (
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                            <h4 className="text-lg font-black text-black mb-6 flex items-center gap-2">
                                <AlertCircle size={20} className="text-primary" />
                                Submission Rules
                            </h4>
                            <ul className="space-y-4">
                                {[
                                    "PDFs can be edited directly inside Inkless.",
                                    "ZIP files are accepted for multi-file code projects.",
                                    "Late submissions may incur point deductions.",
                                    "Once graded, submissions cannot be updated."
                                ].map((rule, i) => (
                                    <li key={i} className="flex gap-3 text-xs font-bold text-gray-500 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right: PDF Side Panel */}
                {pdfPanelOpen && pdfPanelUrl && (
                    <div className="flex-[0_0_48%] max-w-[48%] min-w-0 sticky top-4 self-start">
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-lg overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <FileText size={16} className="text-primary" />
                                    <h3 className="font-black text-sm text-black uppercase tracking-widest">Assignment PDF</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={pdfPanelUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-1"
                                    >
                                        <Eye size={12} /> Open Full
                                    </a>
                                    <button
                                        onClick={() => setPdfPanelOpen(false)}
                                        className="text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                            <div className="h-[80vh] overflow-hidden">
                                <iframe
                                    src={`${pdfPanelUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                                    className="w-full h-full border-0"
                                    title="Assignment PDF"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const EmptyState = ({ icon: Icon, text }) => (
    <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center w-full">
        <div className="p-5 bg-gray-50 rounded-full mb-6 text-gray-300"><Icon size={40} /></div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{text}</p>
    </div>
);

export default AssignmentDetails;
