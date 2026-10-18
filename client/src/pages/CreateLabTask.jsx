import API_BASE_URL from '../config';
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Plus, Trash2, Upload, Code2, ChevronDown, Terminal } from 'lucide-react';

const LANGUAGES = [
    { id: 'python',     label: 'Python',     monacoLang: 'python',     ext: '.py'  },
    { id: 'javascript', label: 'JavaScript',  monacoLang: 'javascript', ext: '.js'  },
    { id: 'typescript', label: 'TypeScript',  monacoLang: 'typescript', ext: '.ts'  },
    { id: 'cpp',        label: 'C++',         monacoLang: 'cpp',        ext: '.cpp' },
    { id: 'c',          label: 'C',           monacoLang: 'c',          ext: '.c'   },
    { id: 'java',       label: 'Java',        monacoLang: 'java',       ext: '.java'},
    { id: 'csharp',     label: 'C#',          monacoLang: 'csharp',     ext: '.cs'  },
    { id: 'go',         label: 'Go',          monacoLang: 'go',         ext: '.go'  },
    { id: 'rust',       label: 'Rust',        monacoLang: 'rust',       ext: '.rs'  },
    { id: 'sql',        label: 'SQL',         monacoLang: 'sql',        ext: '.sql' },
];

const STARTER_TEMPLATES = {
    python:     '# Write your solution below\n\ndef solution():\n    pass\n\nif __name__ == "__main__":\n    solution()\n',
    javascript: '// Write your solution below\n\nfunction solution() {\n    \n}\n\nconsole.log(solution());\n',
    typescript: '// Write your solution below\n\nfunction solution(): void {\n    \n}\n\nsolution();\n',
    cpp:        '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    \n    return 0;\n}\n',
    c:          '#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    \n    return 0;\n}\n',
    java:       'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n',
    csharp:     'using System;\n\nclass Solution {\n    static void Main(string[] args) {\n        // Write your solution here\n    }\n}\n',
    go:         'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your solution here\n    fmt.Println("Hello")\n}\n',
    rust:       'fn main() {\n    // Write your solution here\n    println!("Hello, world!");\n}\n',
    sql:        '-- Write your SQL query below\nSELECT * FROM table_name\nWHERE condition\nORDER BY column;\n',
};

// VS Code-like Monaco Editor Panel
const CodeEditorPanel = ({ value, onChange, language, onLanguageChange }) => {
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const currentLang = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

    const handleLangSelect = (lang) => {
        onLanguageChange(lang.id);
        // Only auto-fill if the current code is blank or matches a template
        const isBlank = !value || value.trim() === '';
        const isTemplate = Object.values(STARTER_TEMPLATES).some(t => t.trim() === (value || '').trim());
        if (isBlank || isTemplate) {
            onChange(STARTER_TEMPLATES[lang.id] || '');
        }
        setLangDropdownOpen(false);
    };

    return (
        <div className="vscode-panel" style={{
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid #3c3c3c',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            background: '#1e1e1e',
        }}>
            {/* VS Code Title Bar */}
            <div style={{
                background: '#323233',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 12px',
                height: '36px',
                borderBottom: '1px solid #252526',
                userSelect: 'none',
            }}>
                {/* Window dots */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                </div>

                {/* Centered file tab */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#1e1e1e',
                    padding: '4px 14px',
                    borderRadius: '4px 4px 0 0',
                    border: '1px solid #3c3c3c',
                    borderBottom: 'none',
                    marginBottom: '-1px',
                    position: 'relative',
                    top: '1px',
                }}>
                    <Code2 size={13} color="#569cd6" />
                    <span style={{ color: '#cccccc', fontSize: '12px', fontFamily: 'Consolas, monospace' }}>
                        starter_code{currentLang.ext}
                    </span>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e5c07b', marginLeft: 4 }} title="Unsaved changes" />
                </div>

                {/* Language selector */}
                <div style={{ position: 'relative' }}>
                    <button
                        type="button"
                        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            background: '#0e639c', border: 'none', borderRadius: '4px',
                            color: '#fff', fontSize: '11px', fontWeight: 600,
                            padding: '3px 10px', cursor: 'pointer',
                            fontFamily: 'Consolas, monospace',
                        }}
                    >
                        {currentLang.label}
                        <ChevronDown size={11} />
                    </button>
                    {langDropdownOpen && (
                        <div style={{
                            position: 'absolute', right: 0, top: '110%',
                            background: '#252526', border: '1px solid #454545',
                            borderRadius: '6px', zIndex: 100, minWidth: '140px',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                            overflow: 'hidden',
                        }}>
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.id}
                                    type="button"
                                    onClick={() => handleLangSelect(lang)}
                                    style={{
                                        display: 'flex', alignItems: 'center', width: '100%',
                                        padding: '7px 14px', border: 'none', background: 'transparent',
                                        color: lang.id === language ? '#569cd6' : '#cccccc',
                                        fontSize: '12px', fontFamily: 'Consolas, monospace',
                                        cursor: 'pointer', textAlign: 'left',
                                        fontWeight: lang.id === language ? 700 : 400,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#094771'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {lang.id === language && <span style={{ marginRight: 6, color: '#27c93f' }}>✓</span>}
                                    {lang.label}
                                    <span style={{ marginLeft: 'auto', color: '#555', fontSize: '10px' }}>{lang.ext}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Line numbers sidebar + Editor */}
            <div style={{ display: 'flex' }}>
                {/* Activity bar */}
                <div style={{ width: '3px', background: '#0e639c', flexShrink: 0 }} />
                {/* Monaco Editor */}
                <div style={{ flex: 1 }}>
                    <Editor
                        height="280px"
                        language={currentLang.monacoLang}
                        value={value || STARTER_TEMPLATES[language] || ''}
                        onChange={val => onChange(val || '')}
                        theme="vs-dark"
                        options={{
                            fontSize: 13,
                            fontFamily: "'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace",
                            fontLigatures: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            lineNumbers: 'on',
                            renderLineHighlight: 'line',
                            cursorBlinking: 'smooth',
                            cursorSmoothCaretAnimation: 'on',
                            tabSize: 4,
                            wordWrap: 'on',
                            automaticLayout: true,
                            padding: { top: 12 },
                            smoothScrolling: true,
                            contextmenu: false,
                            folding: true,
                            bracketPairColorization: { enabled: true },
                            guides: { bracketPairs: true },
                        }}
                    />
                </div>
            </div>

            {/* VS Code Bottom Status Bar */}
            <div style={{
                background: '#007acc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 12px',
                height: '22px',
            }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Terminal size={11} color="#ffffffcc" />
                    <span style={{ color: '#ffffffcc', fontSize: '11px', fontFamily: 'Consolas, monospace' }}>
                        Starter Code Template
                    </span>
                </div>
                <span style={{ color: '#ffffffcc', fontSize: '11px', fontFamily: 'Consolas, monospace' }}>
                    {currentLang.label} · UTF-8 · LF
                </span>
            </div>
        </div>
    );
};

const CreateLabTask = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { classId } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        totalMarks: 100,
        deadline: ''
    });

    const [taskDocument, setTaskDocument] = useState(null);
    const [uploadMode, setUploadMode] = useState('manual'); // 'manual' | 'file'
    const [questions, setQuestions] = useState([{
        questionText: '',
        subMarks: 10,
        submissionTypes: ['code'],
        starterCode: STARTER_TEMPLATES['python'],
        language: 'python',
    }]);
    const [loading, setLoading] = useState(false);

    const addQuestion = () => {
        setQuestions([...questions, {
            questionText: '',
            subMarks: 10,
            submissionTypes: ['code'],
            starterCode: STARTER_TEMPLATES['python'],
            language: 'python',
        }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const toggleSubmissionType = (index, type) => {
        const newQuestions = [...questions];
        let types = newQuestions[index].submissionTypes || [];
        if (types.includes(type)) {
            types = types.filter(t => t !== type);
        } else {
            types.push(type);
        }
        newQuestions[index].submissionTypes = types;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('totalMarks', formData.totalMarks);
            submitData.append('deadline', formData.deadline);
            submitData.append('classId', classId);

            if (uploadMode === 'manual') {
                submitData.append('questions', JSON.stringify(questions));
            } else if (taskDocument) {
                submitData.append('taskDocument', taskDocument);
            }

            await axios.post(`${API_BASE_URL}/api/lab-tasks`, submitData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate(`/class-details/${classId}`);
        } catch (err) {
            console.error(err);
            alert('Error creating lab task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-secondary-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-black text-foreground tracking-tight">Create Lab Task</h1>
                <p className="text-secondary-foreground mt-1 text-sm">Define questions, add starter code, and configure submission types.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Details */}
                <div className="bg-surface p-6 rounded-2xl border border-border space-y-4">
                    <h2 className="font-bold text-lg border-b border-border pb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-black">1</span>
                        Task Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold mb-1.5 text-secondary-foreground">Title</label>
                            <input
                                type="text" required
                                className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Lab 01: Conditionals & Loops"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold mb-1.5 text-secondary-foreground">Description</label>
                            <textarea
                                required rows="3"
                                className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the lab task objectives..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-secondary-foreground">Total Marks</label>
                            <input
                                type="number" required
                                className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                value={formData.totalMarks}
                                onChange={e => setFormData({ ...formData, totalMarks: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-secondary-foreground">Deadline</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                value={formData.deadline}
                                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Task Content Toggle */}
                <div className="bg-surface p-6 rounded-2xl border border-border space-y-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-black">2</span>
                            Task Content
                        </h2>
                        <div className="flex bg-muted/30 p-1 rounded-xl border border-border">
                            <button
                                type="button"
                                onClick={() => setUploadMode('manual')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${uploadMode === 'manual' ? 'bg-background shadow-sm text-foreground' : 'text-secondary-foreground hover:text-foreground'}`}
                            >
                                Manual Questions
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadMode('file')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${uploadMode === 'file' ? 'bg-background shadow-sm text-foreground' : 'text-secondary-foreground hover:text-foreground'}`}
                            >
                                Upload PDF
                            </button>
                        </div>
                    </div>

                    {uploadMode === 'manual' ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-secondary-foreground font-medium">
                                    Add questions with optional starter code templates for students.
                                </p>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm"
                                >
                                    <Plus size={16} /> Add Question
                                </button>
                            </div>

                            {questions.map((q, index) => (
                                <div key={index} className="rounded-2xl border border-border overflow-hidden shadow-sm">
                                    {/* Question Header */}
                                    <div className="flex items-center justify-between px-5 py-3 bg-muted/20 border-b border-border">
                                        <div className="flex items-center gap-3">
                                            <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-black flex items-center justify-center">
                                                {index + 1}
                                            </span>
                                            <span className="font-bold text-sm text-foreground">Question {index + 1}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(index)}
                                            className="flex items-center gap-1.5 text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-semibold"
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>

                                    <div className="p-5 space-y-5 bg-surface">
                                        {/* Question text */}
                                        <div>
                                            <label className="block text-xs font-bold text-secondary-foreground uppercase tracking-wide mb-1.5">Question Text</label>
                                            <textarea
                                                required rows="2"
                                                className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none text-sm"
                                                value={q.questionText}
                                                onChange={e => updateQuestion(index, 'questionText', e.target.value)}
                                                placeholder="e.g. Write a function to check if a number is prime..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-secondary-foreground uppercase tracking-wide mb-1.5">Marks</label>
                                                <input
                                                    type="number" required
                                                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm"
                                                    value={q.subMarks}
                                                    onChange={e => updateQuestion(index, 'subMarks', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-secondary-foreground uppercase tracking-wide mb-1.5">Submission Types</label>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {['code', 'output', 'image', 'text'].map(type => (
                                                        <label key={type} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${q.submissionTypes.includes(type) ? 'bg-primary/10 border-primary/40 text-primary' : 'border-border text-secondary-foreground hover:border-primary/30'}`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={q.submissionTypes.includes(type)}
                                                                onChange={() => toggleSubmissionType(index, type)}
                                                                className="sr-only"
                                                            />
                                                            {type === 'code' && <Code2 size={11} />}
                                                            <span className="capitalize">{type}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* VS Code Editor — only shown when 'code' is selected */}
                                        {q.submissionTypes.includes('code') && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Code2 size={14} className="text-primary" />
                                                    <label className="text-xs font-bold text-primary uppercase tracking-wide">
                                                        Starter Code Template
                                                    </label>
                                                    <span className="text-xs text-secondary-foreground font-medium">
                                                        — students will see this as a starting point
                                                    </span>
                                                </div>
                                                <CodeEditorPanel
                                                    value={q.starterCode}
                                                    onChange={(val) => updateQuestion(index, 'starterCode', val)}
                                                    language={q.language || 'python'}
                                                    onLanguageChange={(lang) => updateQuestion(index, 'language', lang)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-border p-10 rounded-2xl hover:bg-muted/20 transition-colors relative cursor-pointer group flex flex-col items-center justify-center text-center">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={(e) => setTaskDocument(e.target.files[0])}
                                    required={uploadMode === 'file'}
                                />
                                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload size={26} />
                                </div>
                                <p className="text-base font-bold text-foreground mb-1">
                                    {taskDocument ? taskDocument.name : 'Upload Question PDF'}
                                </p>
                                <p className="text-sm text-secondary-foreground">
                                    {taskDocument ? (taskDocument.size / 1024 / 1024).toFixed(2) + ' MB' : 'Click or drag to upload PDF file'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white px-10 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg disabled:opacity-60"
                    >
                        {loading ? (
                            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing...</>
                        ) : 'Publish Lab Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateLabTask;
