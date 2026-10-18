import React, { useState, useEffect, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import Editor from '@monaco-editor/react';
import {
    ChevronRight, ChevronDown, FileCode, FileText, FileJson,
    Image, File, Archive, FolderOpen, Folder, Loader2,
    Download, RefreshCw, X, Maximize2, Minimize2
} from 'lucide-react';

// ─── Language detection by file extension ───────────────────────────────────
const getLanguage = (filename) => {
    if (!filename) return 'plaintext';
    const ext = filename.split('.').pop().toLowerCase();
    const map = {
        js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
        py: 'python', java: 'java', cpp: 'cpp', c: 'c', cs: 'csharp',
        html: 'html', css: 'css', scss: 'scss', json: 'json', xml: 'xml',
        md: 'markdown', sh: 'shell', bash: 'shell', yaml: 'yaml', yml: 'yaml',
        sql: 'sql', php: 'php', rb: 'ruby', go: 'go', rs: 'rust',
        swift: 'swift', kt: 'kotlin', r: 'r', m: 'objective-c',
        txt: 'plaintext', log: 'plaintext', env: 'plaintext',
        toml: 'ini', ini: 'ini', cfg: 'ini',
    };
    return map[ext] || 'plaintext';
};

// ─── File icon by extension ──────────────────────────────────────────────────
const FileIcon = ({ filename, className = 'w-4 h-4' }) => {
    if (!filename) return <File className={className} />;
    const ext = filename.split('.').pop().toLowerCase();
    const codeExts = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt'];
    const imgExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'];

    if (codeExts.includes(ext)) return <FileCode className={`${className} text-[#75beff]`} />;
    if (imgExts.includes(ext)) return <Image className={`${className} text-[#f9c74f]`} />;
    if (ext === 'json') return <FileJson className={`${className} text-[#f4a261]`} />;
    if (ext === 'md') return <FileText className={`${className} text-[#a8dadc]`} />;
    if (ext === 'html') return <FileCode className={`${className} text-[#e76f51]`} />;
    if (ext === 'css' || ext === 'scss') return <FileCode className={`${className} text-[#a8dadc]`} />;
    return <FileText className={`${className} text-[#aaa]`} />;
};

// ─── Build a folder tree from flat file list ─────────────────────────────────
const buildTree = (files) => {
    const root = {};
    files.forEach(({ path }) => {
        const parts = path.split('/').filter(Boolean);
        let node = root;
        parts.forEach((part, i) => {
            if (!node[part]) {
                node[part] = i === parts.length - 1 ? { __file: path } : {};
            }
            if (!node[part].__file) node = node[part];
        });
    });
    return root;
};

// ─── Recursive Tree Node ─────────────────────────────────────────────────────
const TreeNode = ({ name, node, depth = 0, selectedFile, onSelectFile }) => {
    const isFile = !!node.__file;
    const [open, setOpen] = useState(depth < 2);
    const indent = depth * 12;

    if (isFile) {
        const isSelected = selectedFile === node.__file;
        return (
            <button
                onClick={() => onSelectFile(node.__file)}
                className={`w-full text-left flex items-center gap-1.5 py-1 px-2 rounded text-xs transition-colors group ${isSelected
                    ? 'bg-[#094771] text-white'
                    : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                    }`}
                style={{ paddingLeft: `${indent + 8}px` }}
                title={name}
            >
                <FileIcon filename={name} className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate font-mono">{name}</span>
            </button>
        );
    }

    // Folder
    const children = Object.entries(node).filter(([k]) => k !== '__file');
    return (
        <div>
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full text-left flex items-center gap-1 py-1 px-2 rounded text-xs text-[#cccccc] hover:bg-[#2a2d2e] transition-colors"
                style={{ paddingLeft: `${indent + 4}px` }}
            >
                {open
                    ? <ChevronDown className="w-3 h-3 shrink-0 text-[#aaa]" />
                    : <ChevronRight className="w-3 h-3 shrink-0 text-[#aaa]" />
                }
                {open
                    ? <FolderOpen className="w-3.5 h-3.5 shrink-0 text-[#dcb67a]" />
                    : <Folder className="w-3.5 h-3.5 shrink-0 text-[#dcb67a]" />
                }
                <span className="truncate font-mono font-medium">{name}</span>
            </button>
            {open && (
                <div>
                    {children.map(([childName, childNode]) => (
                        <TreeNode
                            key={childName}
                            name={childName}
                            node={childNode}
                            depth={depth + 1}
                            selectedFile={selectedFile}
                            onSelectFile={onSelectFile}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Open Tabs Bar ───────────────────────────────────────────────────────────
const TabBar = ({ tabs, activeTab, onSelect, onClose }) => (
    <div className="flex overflow-x-auto bg-[#252526] border-b border-[#3e3e42] scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {tabs.map(tab => {
            const filename = tab.split('/').pop();
            const isActive = tab === activeTab;
            return (
                <div
                    key={tab}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-mono cursor-pointer shrink-0 border-r border-[#3e3e42] transition-colors group ${isActive
                        ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#fc6a0d]'
                        : 'bg-[#2d2d2d] text-[#999] hover:bg-[#2a2a2a]'
                        }`}
                    onClick={() => onSelect(tab)}
                >
                    <FileIcon filename={filename} className="w-3.5 h-3.5" />
                    <span className="max-w-[120px] truncate">{filename}</span>
                    <button
                        onClick={e => { e.stopPropagation(); onClose(tab); }}
                        className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity ml-1"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            );
        })}
    </div>
);

// ─── Status Bar (VS Code bottom bar) ────────────────────────────────────────
const StatusBar = ({ filename, language, fileCount }) => (
    <div className="flex items-center justify-between px-3 py-0.5 bg-[#007acc] text-white text-[10px] font-mono shrink-0">
        <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Archive className="w-3 h-3" /> ZIP Explorer</span>
            <span>{fileCount} files</span>
        </div>
        <div className="flex items-center gap-3">
            {filename && <span>{filename.split('/').pop()}</span>}
            {language && <span className="capitalize">{language}</span>}
        </div>
    </div>
);

// ─── Main ZipCodeViewer ──────────────────────────────────────────────────────
const ZipCodeViewer = ({ zipUrl, downloadUrl, studentName }) => {
    const [files, setFiles] = useState([]);
    const [tree, setTree] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContents, setFileContents] = useState({});
    const [openTabs, setOpenTabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBinary, setIsBinary] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const zipRef = useRef(null);

    // Escape key exits fullscreen
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setIsFullscreen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // ── Load zip on mount ───────────────────────────────────────────────────
    useEffect(() => {
        if (!zipUrl) return;
        loadZip();
    }, [zipUrl]);

    const loadZip = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(zipUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            const zip = new JSZip();
            const contents = await zip.loadAsync(blob);
            zipRef.current = contents;

            const filesList = [];
            contents.forEach((relativePath, file) => {
                if (!file.dir) filesList.push({ path: relativePath, file });
            });

            // Sort: folders first, then alphabetically
            filesList.sort((a, b) => {
                const aDepth = a.path.split('/').length;
                const bDepth = b.path.split('/').length;
                if (aDepth !== bDepth) return aDepth - bDepth;
                return a.path.localeCompare(b.path);
            });

            setFiles(filesList);
            setTree(buildTree(filesList));

            // Auto-open first meaningful file
            const firstCode = filesList.find(f => {
                const ext = f.path.split('.').pop().toLowerCase();
                return ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'html', 'css', 'json', 'md', 'txt', 'php', 'rb', 'go'].includes(ext);
            }) || filesList[0];

            if (firstCode) {
                await openFile(firstCode.path, firstCode.file);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openFile = async (path, fileObj) => {
        // If already cached
        if (fileContents[path] !== undefined) {
            setSelectedFile(path);
            setIsBinary(fileContents[path] === null);
            if (!openTabs.includes(path)) setOpenTabs(prev => [...prev, path]);
            return;
        }

        // Resolve fileObj from zipRef if not passed
        const resolvedFile = fileObj || (zipRef.current && zipRef.current.files[path]);
        if (!resolvedFile) return;

        try {
            const text = await resolvedFile.async('string');
            setFileContents(prev => ({ ...prev, [path]: text }));
            setIsBinary(false);
        } catch {
            setFileContents(prev => ({ ...prev, [path]: null }));
            setIsBinary(true);
        }
        setSelectedFile(path);
        if (!openTabs.includes(path)) setOpenTabs(prev => [...prev, path]);
    };

    const handleSelectFile = (path) => {
        const fileObj = files.find(f => f.path === path);
        openFile(path, fileObj?.file);
    };

    const closeTab = (path) => {
        const newTabs = openTabs.filter(t => t !== path);
        setOpenTabs(newTabs);
        if (selectedFile === path) {
            setSelectedFile(newTabs[newTabs.length - 1] || null);
        }
    };

    const currentContent = selectedFile ? (fileContents[selectedFile] ?? '') : '';
    const currentLanguage = selectedFile ? getLanguage(selectedFile) : 'plaintext';
    const currentFilename = selectedFile ? selectedFile.split('/').pop() : '';

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-[#1e1e1e] rounded-xl gap-3">
                <Loader2 className="w-8 h-8 text-[#fc6a0d] animate-spin" />
                <p className="text-[#aaa] text-sm font-mono">Extracting ZIP...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-[#1e1e1e] rounded-xl gap-3">
                <p className="text-red-400 text-sm font-mono">Error: {error}</p>
                <button onClick={loadZip} className="flex items-center gap-2 px-4 py-2 bg-[#fc6a0d] text-white rounded-lg text-sm font-bold hover:bg-[#e55a00] transition-colors">
                    <RefreshCw className="w-4 h-4" /> Retry
                </button>
            </div>
        );
    }

    return (
        <div
            className={`flex flex-col rounded-xl overflow-hidden border border-[#3e3e42] shadow-2xl bg-[#1e1e1e] transition-all ${
                isFullscreen
                    ? 'fixed inset-0 z-50 rounded-none border-0'
                    : ''
            }`}
            style={isFullscreen ? {} : { height: 600 }}
        >
            {/* VS Code-style title bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#323233] border-b border-[#3e3e42] shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="text-[#cccccc] text-xs font-mono ml-2">
                        {studentName ? `${studentName}'s Submission` : 'ZIP Code Viewer'} — {files.length} files
                    </span>
                </div>
                {/* right-side controls: fullscreen + download */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsFullscreen(f => !f)}
                        title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen'}
                        className="flex items-center gap-1.5 px-3 py-1 bg-[#3c3c3c] hover:bg-[#4a4a4a] text-[#cccccc] rounded text-xs font-mono transition-colors"
                    >
                        {isFullscreen
                            ? <Minimize2 className="w-3.5 h-3.5" />
                            : <Maximize2 className="w-3.5 h-3.5" />
                        }
                        {isFullscreen ? 'Exit' : 'Fullscreen'}
                    </button>
                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            download
                            className="flex items-center gap-1.5 px-3 py-1 bg-[#3c3c3c] hover:bg-[#4a4a4a] text-[#cccccc] rounded text-xs font-mono transition-colors"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Download ZIP
                        </a>
                    )}
                </div>
            </div>

            {/* Main layout: sidebar + editor */}
            <div className="flex flex-1 overflow-hidden">
                {/* ── Sidebar (Explorer) ── */}
                <div className="w-52 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
                    <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-[#bbb] font-bold border-b border-[#3e3e42] bg-[#252526]">
                        Explorer
                    </div>
                    <div className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#555 transparent' }}>
                        {Object.entries(tree).map(([name, node]) => (
                            <TreeNode
                                key={name}
                                name={name}
                                node={node}
                                depth={0}
                                selectedFile={selectedFile}
                                onSelectFile={handleSelectFile}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Editor Area ── */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Tab bar */}
                    {openTabs.length > 0 && (
                        <TabBar
                            tabs={openTabs}
                            activeTab={selectedFile}
                            onSelect={handleSelectFile}
                            onClose={closeTab}
                        />
                    )}

                    {/* Editor / content area */}
                    {selectedFile ? (
                        isBinary ? (
                            <div className="flex-1 flex items-center justify-center text-[#aaa] text-sm font-mono bg-[#1e1e1e]">
                                <div className="text-center space-y-2">
                                    <Image className="w-8 h-8 mx-auto text-[#555]" />
                                    <p>Binary file — cannot display as text</p>
                                    <p className="text-xs text-[#666]">{currentFilename}</p>
                                </div>
                            </div>
                        ) : (
                            <Editor
                                height="100%"
                                language={currentLanguage}
                                value={currentContent}
                                theme="vs-dark"
                                options={{
                                    readOnly: true,
                                    minimap: { enabled: true, scale: 0.7 },
                                    fontSize: 13,
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                    wordWrap: 'on',
                                    automaticLayout: true,
                                    renderLineHighlight: 'line',
                                    smoothScrolling: true,
                                    cursorBlinking: 'blink',
                                    folding: true,
                                    bracketPairColorization: { enabled: true },
                                    guides: { bracketPairs: true },
                                    padding: { top: 12 },
                                }}
                            />
                        )
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-[#555] font-mono text-sm bg-[#1e1e1e]">
                            Select a file from the explorer
                        </div>
                    )}
                </div>
            </div>

            {/* VS Code status bar */}
            <StatusBar filename={selectedFile} language={currentLanguage} fileCount={files.length} />
        </div>
    );
};

export default ZipCodeViewer;
