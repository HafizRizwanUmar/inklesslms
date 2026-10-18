import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, CheckSquare, Clock, GraduationCap, TrendingUp, Search, Plus, Filter, MessageSquare, AlertCircle, ChevronRight, LayoutDashboard, User, FolderOpen } from 'lucide-react';
import SEO from '../components/SEO';
import API_BASE_URL from '../config';
import { motion } from 'framer-motion';

const StudentClassCard = ({ title, section, teacher, theme, classId, nextAssignment }) => (
    <motion.div
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        className="group relative flex flex-col bg-white border border-border rounded-3xl overflow-hidden transition-all duration-300 w-full shadow-sm hover:shadow-2xl hover:shadow-primary/10"
    >
        {/* Banner Section */}
        <div className="h-32 relative flex flex-col justify-end p-5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-primary/80 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
            
            <div className="relative z-10">
                <Link to={`/class-details/${classId}`} className="block group/link">
                    <h2 className="text-xl font-bold text-white leading-tight mb-0.5 group-hover/link:text-primary transition-colors truncate">
                        {title}
                    </h2>
                    <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest">{section}</p>
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-tight mt-2 flex items-center gap-1">
                        <User size={10} /> {teacher}
                    </p>
                </Link>
            </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col gap-4 bg-white">
            <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Next Up</p>
                {nextAssignment ? (
                    <Link to={nextAssignment.type === 'Lab' ? `/lab-task-details/${nextAssignment._id}` : `/assignment-details/${nextAssignment._id}`} className="block group/task">
                        <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10 group-hover/task:border-primary/40 transition-colors">
                            <div className="text-sm font-bold text-black truncate mb-1">
                                {nextAssignment.title}
                            </div>
                             <div className="text-[10px] font-black text-black/70 flex items-center gap-1">
                                <Clock size={12} /> Due {new Date(nextAssignment.deadline).toLocaleDateString()}
                             </div>
                        </div>
                    </Link>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium py-2 bg-gray-50/50 rounded-2xl px-3 border border-dashed border-gray-100">
                        <CheckSquare className="w-4 h-4 text-green-500" /> All caught up!
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-2 pt-2">
                <Link 
                    to={`/class-details/${classId}`}
                    className="flex-1 py-3 bg-black text-white text-[12px] font-bold rounded-2xl text-center hover:bg-primary hover:text-black transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    Go to Class
                    <ChevronRight size={14} />
                </Link>
                <div className="flex gap-1">
                    <button className="p-3 bg-gray-50 text-gray-400 hover:text-black hover:bg-primary rounded-2xl transition-all" title="Your Performance">
                        <TrendingUp className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
);

const StudentDashboard = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem('token');
                const hdrs = { headers: { 'x-auth-token': token } };
                const res = await fetch(`${API_BASE_URL}/api/classes`, { headers: { 'x-auth-token': token } });
                const classData = await res.json();

                // Fetch next assignment for each class
                // In production, this should be done on backend for performance.
                // For now, we will fetch assignments for each class separately.
                const enrichedClasses = await Promise.all(classData.map(async (cls) => {
                    try {
                        // Fetch both Assignments and Labs
                        const resAss = await fetch(`${API_BASE_URL}/api/assignments/class/${cls._id}`, hdrs);
                        const assignments = await resAss.json();

                        const resLab = await fetch(`${API_BASE_URL}/api/lab-tasks/class/${cls._id}`, hdrs);
                        const labs = await resLab.json();

                        // Combine and sort by deadline > now
                        const now = new Date();
                        const allTasks = [...assignments, ...labs]
                            .filter(t => new Date(t.deadline) > now)
                            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

                        return { ...cls, nextAssignment: allTasks[0] || null };
                    } catch (e) { console.error(e); return cls; }
                }));

                setClasses(enrichedClasses);
            } catch (err) {
                console.error("Error fetching classes:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    if (loading) return <div className="p-6 text-center text-secondary-foreground py-20">Loading your profile...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <SEO title="Student Dashboard" description="Access your enrolled classes, upcoming assignments, and track your academic performance." />
            {/* Top Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">My Classes</h1>
                    <p className="text-sm text-secondary-foreground">Access your enrolled courses and upcoming deadlines.</p>
                </div>
            </div>

            {/* Grid of Class Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {classes.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-surface/50 border border-dashed border-border rounded-3xl">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-black mb-6"
                        >
                            <FolderOpen size={40} />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-black mb-2 tracking-tight">No Active Classes</h3>
                        <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                            It looks like you haven't joined any classes yet. Connect with your instructors to get your class code.
                        </p>
                        <Link 
                            to="/join-class" 
                            className="bg-primary text-black px-8 py-3 rounded-full font-bold hover:bg-black hover:text-white transition-all shadow-[0_10px_20px_rgba(214,255,63,0.3)] flex items-center gap-2"
                        >
                            <Plus size={20} /> Join Your First Class
                        </Link>
                    </div>
                ) : (
                    classes.map((cls) => (
                        <StudentClassCard
                            key={cls._id}
                            title={cls.title}
                            section={cls.section}
                            teacher={cls.owner?.name || 'Instructor'} // Ideally we populate this on backend, using placeholder for now if missing
                            theme={cls.theme}
                            classId={cls._id}
                            nextAssignment={cls.nextAssignment}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
