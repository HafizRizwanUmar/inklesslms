import API_BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Filter, MoreVertical, BookOpen, PenTool, Code, User, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
    const [tasks, setTasks] = useState([]); // Combined Assignments & Labs
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, assignment, lab
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const hdrs = { headers: { 'x-auth-token': token } };

                const resClasses = await axios.get(`${API_BASE_URL}/api/classes`, hdrs);
                const classes = resClasses.data;

                let allItems = [];

                await Promise.all(classes.map(async (cls) => {
                    const [resAss, resLab] = await Promise.all([
                        axios.get(`${API_BASE_URL}/api/assignments/class/${cls._id}`, hdrs),
                        axios.get(`${API_BASE_URL}/api/lab-tasks/class/${cls._id}`, hdrs)
                    ]);

                    const assigns = resAss.data.map(a => ({ ...a, type: 'Assignment', classTitle: cls.title }));
                    const labs = resLab.data.map(l => ({ ...l, type: 'Lab', classTitle: cls.title }));
                    allItems = [...allItems, ...assigns, ...labs];
                }));

                allItems.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
                setTasks(allItems);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const now = new Date();
    const filteredTasks = tasks.filter(t => {
        if (filter === 'all') return true;
        return t.type.toLowerCase() === filter.toLowerCase();
    });

    const upcoming = filteredTasks.filter(t => new Date(t.deadline) > now);
    const past = filteredTasks.filter(t => new Date(t.deadline) <= now);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <SEO title="Calendar" description="Track your academic schedule, assignment deadlines, and upcoming quizzes in one unified view." />
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight">Academic Calendar</h1>
                    <p className="text-muted-foreground mt-1 font-medium">Keep track of your deadlines and course activities.</p>
                </div>
                <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border border-border">
                    {['all', 'assignment', 'lab'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* UPCOMING TIMELINE */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-xl flex items-center gap-2">
                            <Clock className="text-primary" size={24} /> 
                            <span>Upcoming Deadlines</span>
                        </h2>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                            {upcoming.length} Tasks
                        </span>
                    </div>

                    {upcoming.length === 0 ? (
                        <div className="p-16 border border-dashed border-border rounded-[32px] text-center bg-surface/50">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="font-bold text-2xl text-black mb-2">All Caught Up!</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">You have no upcoming deadlines. Enjoy your free time!</p>
                        </div>
                    ) : (
                        <div className="relative space-y-4">
                            {upcoming.map((task, idx) => {
                                const daysLeft = Math.ceil((new Date(task.deadline) - now) / (1000 * 60 * 60 * 24));
                                return (
                                    <motion.div
                                        key={task._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group bg-surface p-6 rounded-2xl border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer relative overflow-hidden"
                                        onClick={() => navigate(task.type === 'Lab' ? `/lab-task-details/${task._id}` : `/assignment-details/${task._id}`)}
                                    >
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                                        
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${task.type === 'Lab' ? 'bg-black text-white border-black' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                                        {task.type}
                                                    </span>
                                                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                                        <BookOpen size={12} /> {task.classTitle}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-xl text-black group-hover:text-primary transition-colors">{task.title}</h3>
                                                
                                                <div className="flex items-center gap-4 mt-4 text-sm font-medium text-muted-foreground">
                                                    <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2 py-1 rounded-md">
                                                        <AlertCircle size={14} />
                                                        <span>Due {new Date(task.deadline).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <PenTool size={14} />
                                                        <span>{task.totalMarks || task.marks} Marks</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col items-end shrink-0">
                                                <div className={`text-3xl font-black ${daysLeft <= 2 ? 'text-red-500' : 'text-black'}`}>
                                                    {daysLeft}
                                                </div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Days Left</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* PAST / COMPLETED */}
                <div className="lg:col-span-4 space-y-6">
                    <h2 className="font-bold text-xl flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="text-muted-foreground" size={24} /> 
                        <span>Completed / Past</span>
                    </h2>

                    <div className="space-y-4">
                        {past.length === 0 ? (
                            <div className="p-8 border border-dashed border-border rounded-2xl text-center bg-muted/10">
                                <p className="text-muted-foreground text-sm font-medium">No past history found.</p>
                            </div>
                        ) : (
                            past.slice(0, 8).map(task => (
                                <div key={task._id} className="bg-muted/5 p-4 rounded-xl border border-border group hover:bg-white transition-colors">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-muted-foreground line-through text-sm">{task.title}</h4>
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase">{task.type}</span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                                        <BookOpen size={10} /> {task.classTitle}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
