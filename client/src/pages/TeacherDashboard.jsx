import API_BASE_URL from '../config';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, User, Calendar, FileText, CheckCircle, Clock, AlertCircle, ChevronRight, Search, LayoutDashboard, MoreVertical, Star, MoreHorizontal, ArrowUpRight, Trash2, Edit2, X, Loader } from 'lucide-react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';

const ClassCard = ({ classData, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef(null);

    const copyToClipboard = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(classData.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <motion.div
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative flex flex-col bg-white border border-border rounded-3xl overflow-hidden transition-all duration-300 w-full shadow-sm hover:shadow-2xl hover:shadow-primary/10"
        >
            {/* Header / Banner */}
            <div className="h-32 relative flex flex-col justify-end p-5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-primary/80 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                
                <div className="relative z-10">
                    <Link to={`/class-details/${classData._id}`} className="block group/link">
                        <h2 className="text-xl font-bold text-white leading-tight mb-0.5 group-hover/link:text-primary transition-colors truncate">
                            {classData.title}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">{classData.section}</span>
                        </div>
                    </Link>
                </div>

                {/* Floating Students Badge */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 text-white z-20">
                    <User size={12} className="text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{classData.students?.length || 0}</span>
                </div>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col gap-5 bg-white">
                <div className="flex items-center justify-between">
                    <div 
                        onClick={copyToClipboard}
                        className="group/code cursor-pointer relative"
                    >
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Class Code</div>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl group-hover/code:border-primary transition-colors">
                            <span className="text-sm font-black text-black tracking-widest uppercase">{classData.code}</span>
                            <div className={`p-1 rounded-md transition-colors ${copied ? 'bg-green-500 text-white' : 'text-gray-400 group-hover/code:text-primary'}`}>
                                {copied ? <CheckCircle size={14} /> : <ArrowUpRight size={14} />}
                            </div>
                        </div>
                    </div>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => { e.preventDefault(); setShowMenu(!showMenu); }}
                            className={`p-2 rounded-xl transition-all ${showMenu ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100'}`}
                        >
                            <MoreHorizontal size={20} />
                        </button>

                        <AnimatePresence>
                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 bottom-12 w-36 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-30 overflow-hidden"
                                >
                                    <button
                                        onClick={() => { setShowMenu(false); onEdit(classData); }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-primary/5 hover:text-primary flex items-center gap-2 transition-colors"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <div className="h-px bg-gray-50 mx-2 my-1" />
                                    <button
                                        onClick={() => { setShowMenu(false); onDelete(classData._id); }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <Link 
                    to={`/class-details/${classData._id}`}
                    className="w-full py-3 bg-black text-white text-[13px] font-bold rounded-2xl text-center hover:bg-primary transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    Manage Class
                    <ChevronRight size={16} />
                </Link>
            </div>
        </motion.div>
    );
};

const EditClassModal = ({ isOpen, onClose, classData, onSave }) => {
    const [formData, setFormData] = useState({ title: '', section: '', subject: '', room: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (classData) {
            setFormData({
                title: classData.title || '',
                section: classData.section || '',
                subject: classData.subject || '',
                room: classData.room || ''
            });
        }
    }, [classData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave(classData._id, formData);
        setLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border"
            >
                <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">Edit Class</h3>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Class Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Section</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                            value={formData.section}
                            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Room</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                                value={formData.room}
                                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            {loading && <Loader size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const TeacherDashboard = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/classes`, {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            setClasses(data);
        } catch (err) {
            console.error("Error fetching classes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleDeleteClass = async (classId) => {
        if (!window.confirm("Are you sure you want to delete this class? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/classes/${classId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                setClasses(classes.filter(c => c._id !== classId));
            } else {
                alert("Failed to delete class");
            }
        } catch (err) {
            console.error("Error deleting class:", err);
        }
    };

    const handleEditClass = (classData) => {
        setSelectedClass(classData);
        setIsEditModalOpen(true);
    };

    const handleSaveClass = async (classId, updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/classes/${classId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(updatedData)
            });

            if (res.ok) {
                const updatedClass = await res.json();
                setClasses(classes.map(c => c._id === classId ? updatedClass : c));
            } else {
                alert("Failed to update class");
            }
        } catch (err) {
            console.error("Error updating class:", err);
        }
    };

    if (loading) return <div className="p-6 text-center text-secondary-foreground">Loading classes...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <SEO title="Teacher Dashboard" description="Manage your classes, track student progress, and grade assignments with AI-powered tools." />
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Teaching</h1>
                    <p className="text-sm text-secondary-foreground">Manage your active courses.</p>
                </div>
            </div>

            {/* Grid of Class Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {classes.length === 0 ? (
                    <div className="col-span-full py-16 bg-surface rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4 text-primary">
                            <Plus size={32} />
                        </div>
                        <h3 className="text-lg font-bold mb-1">No Classes Created</h3>
                        <p className="text-secondary-foreground max-w-sm mb-6">You haven't created any classes yet. Click the + button in the top bar to get started.</p>
                        <Link to="/create-class" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-transform active:scale-95 flex items-center gap-2">
                            Create a Class
                        </Link>
                    </div>
                ) : (
                    classes.map((cls) => (
                        <ClassCard
                            key={cls._id}
                            classData={cls}
                            onEdit={handleEditClass}
                            onDelete={handleDeleteClass}
                        />
                    ))
                )}
            </div>

            <EditClassModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                classData={selectedClass}
                onSave={handleSaveClass}
            />
        </div>
    );
};

export default TeacherDashboard;
