import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Type, Highlighter, Eraser, Download, Save, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Setup pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PDFViewerEditor = ({ fileUrl, onSave, readOnly = false }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.2);
    const [tool, setTool] = useState('none'); // 'text', 'highlight'
    const [annotations, setAnnotations] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleCanvasClick = (e) => {
        if (readOnly || tool === 'none') return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        if (tool === 'text') {
            const text = prompt("Enter text to add:");
            if (text) {
                setAnnotations([...annotations, { type: 'text', x, y, text, page: pageNumber }]);
            }
        } else if (tool === 'highlight') {
            setAnnotations([...annotations, { type: 'highlight', x, y, page: pageNumber }]);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const pages = pdfDoc.getPages();

            annotations.forEach(ann => {
                const page = pages[ann.page - 1];
                const { height } = page.getSize();
                
                if (ann.type === 'text') {
                    page.drawText(ann.text, {
                        x: ann.x,
                        y: height - ann.y - 12, // Standard offset
                        size: 14,
                        font,
                        color: rgb(0.988, 0.416, 0.051), // Brand Orange #fc6a0d
                    });
                } else if (ann.type === 'highlight') {
                    page.drawRectangle({
                        x: ann.x - 5,
                        y: height - ann.y - 5,
                        width: 50,
                        height: 15,
                        color: rgb(1, 0.8, 0),
                        opacity: 0.4
                    });
                }
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            onSave(blob);
        } catch (err) {
            console.error("Error saving PDF:", err);
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-inner min-h-[600px]">
            {/* Toolbar */}
            <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setTool('text')}
                        className={`p-2 rounded-xl transition-all ${tool === 'text' ? 'bg-primary text-black shadow-lg shadow-primary/30' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                        title="Add Text"
                    >
                        <Type size={18} />
                    </button>
                    <button 
                        onClick={() => setTool('highlight')}
                        className={`p-2 rounded-xl transition-all ${tool === 'highlight' ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-400/30' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                        title="Highlight"
                    >
                        <Highlighter size={18} />
                    </button>
                    <div className="w-px h-6 bg-gray-200 mx-2" />
                    <button 
                        onClick={() => setAnnotations([])}
                        className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        title="Clear All"
                    >
                        <Eraser size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-gray-50 rounded-xl px-3 py-1">
                        <button onClick={() => setPageNumber(Math.max(1, pageNumber - 1))} className="p-1 hover:text-primary transition-colors disabled:opacity-30" disabled={pageNumber <= 1}>
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-xs font-black min-w-[60px] text-center">
                            {pageNumber} / {numPages || '--'}
                        </span>
                        <button onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))} className="p-1 hover:text-primary transition-colors disabled:opacity-30" disabled={pageNumber >= numPages}>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1">
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><ZoomOut size={16} /></button>
                        <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><ZoomIn size={16} /></button>
                    </div>
                </div>

                {!readOnly && (
                    <button 
                        onClick={handleSave}
                        disabled={isSaving || annotations.length === 0}
                        className="bg-black text-white px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </button>
                )}
            </div>

            {/* Viewer Area */}
            <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-50/50 relative" ref={containerRef}>
                <div className="relative shadow-2xl" onClick={handleCanvasClick}>
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div className="p-20 text-center font-bold text-gray-400">Loading PDF Engine...</div>}
                    >
                        <Page 
                            pageNumber={pageNumber} 
                            scale={scale} 
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </Document>

                    {/* Annotation Layer (UI Only) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {annotations.filter(ann => ann.page === pageNumber).map((ann, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{ 
                                    left: ann.x * scale, 
                                    top: ann.y * scale,
                                    position: 'absolute'
                                }}
                                className={`flex items-center gap-2 ${ann.type === 'highlight' ? 'bg-yellow-400/40 w-[50px] h-[15px]' : 'text-primary font-black text-sm whitespace-nowrap'}`}
                            >
                                {ann.type === 'text' && ann.text}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Status */}
            <div className="bg-white p-3 border-t border-gray-100 flex justify-center items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${tool === 'none' ? 'bg-gray-300' : 'bg-primary animate-pulse'}`} />
                    Tool: {tool === 'none' ? 'Selection' : tool}
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <div>{annotations.length} Edits Pending</div>
            </div>
        </div>
    );
};

export default PDFViewerEditor;
