import API_BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { FileText, Users, BarChart2, Settings, PenTool, Plus, PlayCircle, Code, ChevronRight, Clock, Archive, HelpCircle, CheckCircle2, MoreVertical, Copy, ShieldCheck, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ClassDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { classId } = useParams();

    useEffect(() => {
        if (!classId) {
            navigate('/');
        }
    }, [classId, navigate]);

    const [activeTab, setActiveTab] = useState('Overview');
    const [classData, setClassData] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [labTasks, setLabTasks] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [copied, setCopied] = useState(false);

    const tabs = [
        { id: 'Overview', icon: FileText },
        { id: 'Assignments', icon: FileText },
        { id: 'Lab Tasks', icon: Code },
        { id: 'Quizzes', icon: PenTool },
        { id: 'Students', icon: Users },
        { id: 'Analytics', icon: BarChart2 },
    ];

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await axios.get(`${API_BASE_URL}/api/classes/${classId}`, {
                    headers: { 'x-auth-token': token }
                });

                setClassData(res.data);

                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                    const decoded = JSON.parse(jsonPayload);
                    setCurrentUser(decoded.user);
                } catch (decodeErr) {
                    console.error("Error decoding token:", decodeErr);
                }
            } catch (err) {
                console.error("Error fetching class data:", err);
            }
        };
        if (classId) fetchClassData();
    }, [classId, navigate]);

    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!classId || !token) return;
        const hdrs = { headers: { 'x-auth-token': token } };

        if (activeTab === 'Quizzes') axios.get(`${API_BASE_URL}/api/quizzes/class/${classId}`, hdrs).then(res => setQuizzes(res.data)).catch(console.error);
        if (activeTab === 'Assignments') axios.get(`${API_BASE_URL}/api/assignments/class/${classId}`, hdrs).then(res => setAssignments(res.data)).catch(console.error);
        if (activeTab === 'Lab Tasks') axios.get(`${API_BASE_URL}/api/lab-tasks/class/${classId}`, hdrs).then(res => setLabTasks(res.data)).catch(console.error);
        if (activeTab === 'Analytics') axios.get(`${API_BASE_URL}/api/classes/${classId}/analytics`, hdrs).then(res => setAnalyticsData(res.data)).catch(console.error);
    }, [activeTab, classId]);

    if (!classData || !currentUser) return <div className="flex h-screen items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

    const isTeacher = classData && currentUser && (
        (typeof classData.owner === 'object' ? classData.owner._id === currentUser.id : classData.owner === currentUser.id) ||
        (classData.teachers && classData.teachers.some(t => typeof t === 'object' ? t._id === currentUser.id : t === currentUser.id))
    );

    const handleArchive = async () => {
        const confirm = window.confirm("Are you sure you want to archive this class?");
        if (!confirm) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/classes/${classId}/archive`, {}, {
                headers: { 'x-auth-token': token }
            });
            navigate('/teacher/dashboard');
        } catch (err) {
            console.error("Failed to archive", err);
            alert("Failed to archive class.");
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(classData.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] pb-12">
            <SEO
                title={classData?.title || 'Class Details'}
                description={`Class details, assignments, quizzes, and analytics for ${classData?.title || 'your classroom'}.`}
            />

            {/* Premium Cinematic Banner */}
            <div className="relative h-80 bg-black overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-primary/40 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                
                <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="space-y-3 flex-1">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2"
                            >
                                <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-black">
                                    {classData.section}
                                </span>
                                <span className="text-white/60 text-sm font-bold tracking-tight uppercase">{classData.subject}</span>
                            </motion.div>
                            
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]"
                            >
                                {classData.title}
                            </motion.h1>

                            <div className="flex flex-wrap items-center gap-6 pt-2">
                                <div className="flex items-center gap-2 text-white/70">
                                    <MapPin size={16} className="text-primary" />
                                    <span className="text-sm font-bold uppercase tracking-wider">Room {classData.room}</span>
                                </div>
                                <div 
                                    onClick={copyCode}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl cursor-pointer border border-white/10 transition-all active:scale-95"
                                >
                                    <ShieldCheck size={16} className={copied ? 'text-green-400' : 'text-primary'} />
                                    <span className="text-sm font-black tracking-widest text-white uppercase">{classData.code}</span>
                                    {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} className="text-white/40" />}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {isTeacher && (
                                <button 
                                    onClick={handleArchive}
                                    className="p-4 bg-white/10 hover:bg-red-500/80 rounded-2xl backdrop-blur-md transition-all text-white border border-white/10"
                                    title="Archive Class"
                                >
                                    <Archive size={24} />
                                </button>
                            )}
                            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md transition-all text-white border border-white/10">
                                <Settings size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Modern Tab Navigation */}
            <div className="sticky top-0 z-[40] bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
                    <div className="flex space-x-10 min-w-max">
                        {tabs.filter(tab => isTeacher || tab.id !== 'Students').map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-6 px-1 flex items-center space-x-2 font-bold text-sm transition-all relative ${activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                            >
                                <tab.icon size={18} className={activeTab === tab.id ? 'text-primary' : ''} />
                                <span className="uppercase tracking-widest text-[11px]">{tab.id}</span>
                                {activeTab === tab.id && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full shadow-[0_-4px_10px_rgba(214,255,63,0.3)]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="min-h-[500px]"
                    >
                        {activeTab === 'Overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className="lg:col-span-8 space-y-8">
                                    <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                                        <h3 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                                            <Info size={24} className="text-primary" />
                                            About this Class
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed text-lg font-medium">
                                            {classData.description || "Welcome to the class! Use this platform to stay updated with your course materials, assignments, and quizzes."}
                                        </p>
                                    </div>
                                </div>
                                
                                {isTeacher && (
                                    <div className="lg:col-span-4 space-y-6">
                                        <div className="bg-black p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                                            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                                                <BarChart2 size={20} className="text-primary" />
                                                Class Statistics
                                            </h3>
                                            
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/20 text-primary rounded-xl"><Users size={20} /></div>
                                                        <span className="text-white/80 font-bold text-sm uppercase tracking-wider">Students</span>
                                                    </div>
                                                    <span className="text-2xl font-black text-white">{classData.students?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Assignments / Labs / Quizzes Sections */}
                        {(activeTab === 'Assignments' || activeTab === 'Lab Tasks' || activeTab === 'Quizzes') && (
                            <div className="space-y-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h2 className="text-4xl font-black text-black tracking-tight">{activeTab}</h2>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Manage your course {activeTab.toLowerCase()}</p>
                                    </div>
                                    {isTeacher && (
                                        <button 
                                            onClick={() => navigate(activeTab === 'Quizzes' ? '/quiz-builder' : activeTab === 'Assignments' ? `/create-assignment/${classId}` : `/create-lab-task/${classId}`, { state: { classId } })}
                                            className="w-full md:w-auto bg-primary text-black px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/30 hover:bg-black hover:text-white hover:shadow-black/10 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                        >
                                            <Plus size={18} /> New {activeTab.replace(' Tasks', '').replace('s', '')}
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {activeTab === 'Assignments' && (
                                        assignments.length === 0 ? (
                                            <div className="col-span-full"><EmptyState icon={FileText} text="No assignments posted yet." /></div>
                                        ) : (
                                            assignments.map(item => <TaskCard key={item._id} item={item} type="Assignment" onClick={() => navigate(`/assignment-details/${item._id}`)} />)
                                        )
                                    )}
                                    {activeTab === 'Lab Tasks' && (
                                        labTasks.length === 0 ? (
                                            <div className="col-span-full"><EmptyState icon={Code} text="No lab tasks available." /></div>
                                        ) : (
                                            labTasks.map(item => <TaskCard key={item._id} item={item} type="Lab" onClick={() => navigate(`/lab-task-details/${item._id}`)} />)
                                        )
                                    )}
                                    {activeTab === 'Quizzes' && (
                                        quizzes.length === 0 ? (
                                            <div className="col-span-full"><EmptyState icon={PenTool} text="No quizzes created yet." /></div>
                                        ) : (
                                            quizzes.map(quiz => <QuizCard key={quiz._id} quiz={quiz} isTeacher={isTeacher} navigate={navigate} />)
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Students Tab */}
                        {activeTab === 'Students' && (
                            <div className="space-y-8">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-4xl font-black text-black tracking-tight">Class Roster</h2>
                                    <span className="bg-black text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{classData.students?.length || 0} Members</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {!classData.students || classData.students.length === 0 ? (
                                        <div className="col-span-full"><EmptyState icon={Users} text="Class is currently empty." /></div>
                                    ) : (
                                        classData.students.map(student => (
                                            <div key={student._id || student} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:border-primary transition-all">
                                                <div className="w-20 h-20 rounded-full bg-gray-50 border-4 border-white shadow-inner overflow-hidden flex items-center justify-center font-black text-2xl text-black mb-4 group-hover:border-primary transition-all">
                                                    <img 
                                                        src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(student.email || student._id || 'anon')}&backgroundColor=f1f5f9`} 
                                                        alt={`${student.name || 'Student'} avatar`} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <h4 className="font-bold text-black text-lg mb-1 truncate w-full px-2">{student.name || 'Anonymous'}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{student.email || 'No Email'}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Analytics Tab */}
                        {activeTab === 'Analytics' && (
                            <div className="space-y-8">
                                <h2 className="text-4xl font-black text-black tracking-tight">Analytics</h2>
                                {!analyticsData ? (
                                    <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
                                ) : (
                                    <AnalyticsView data={analyticsData} isTeacher={isTeacher} currentUser={currentUser} />
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// Sub-components for cleaner code
const TaskCard = ({ item, type, onClick }) => (
    <div 
        onClick={onClick}
        className="group bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="text-primary" />
        </div>
        <div className="flex flex-col h-full">
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 inline-block w-fit ${type === 'Lab' ? 'bg-black text-white' : 'bg-primary/10 text-primary'}`}>
                {type}
            </span>
            <h4 className="text-xl font-bold text-black mb-4 line-clamp-2">{item.title}</h4>
            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                    <Clock size={14} /> {new Date(item.deadline).toLocaleDateString()}
                </div>
                <span className="text-xs font-black text-black">{item.marks || item.totalMarks} PTS</span>
            </div>
        </div>
    </div>
);

const QuizCard = ({ quiz, isTeacher, navigate }) => {
    const now = new Date();
    const isExpired = quiz.endTime && new Date(quiz.endTime) < now;
    const isNotStarted = quiz.startTime && new Date(quiz.startTime) > now;
    const isActive = !isExpired && !isNotStarted;

    return (
        <div className="group bg-white rounded-[28px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden flex flex-col">
            <div className={`h-1.5 w-full ${isExpired ? 'bg-red-500' : isNotStarted ? 'bg-orange-500' : 'bg-primary'}`} />
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-black line-clamp-1 group-hover:text-primary transition-colors">{quiz.title}</h4>
                    <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${isExpired ? 'bg-red-50 text-red-500' : isNotStarted ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'}`}>
                        {isExpired ? 'Closed' : isNotStarted ? 'Upcoming' : 'Active'}
                    </span>
                </div>
                <div className="flex gap-2 mb-6">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold bg-gray-50 text-gray-500 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                        <HelpCircle size={12} /> {quiz.questions.length} Questions
                    </span>
                    {quiz.timeLimitMinutes && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold bg-primary/5 text-primary px-3 py-1.5 rounded-full uppercase tracking-tighter">
                            <Clock size={12} /> {quiz.timeLimitMinutes} Mins
                        </span>
                    )}
                </div>
                <button 
                    onClick={() => navigate(isTeacher ? `/quiz-analytics/${quiz._id}` : `/quiz-attempt/${quiz._id}`)}
                    className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isActive && !isTeacher ? 'bg-primary text-black shadow-lg shadow-primary/30' : 'bg-black text-white'}`}
                >
                    {isTeacher ? 'View Analytics' : isExpired ? 'View Results' : isNotStarted ? 'Locked' : 'Start Quiz'}
                </button>
            </div>
        </div>
    );
};

const AnalyticsView = ({ data, isTeacher, currentUser }) => {
    if (isTeacher) return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatBox label="Students" val={data.totalStudents} icon={Users} color="primary" />
            <StatBox label="Assignments" val={data.assignments} icon={FileText} color="black" />
            <StatBox label="Quizzes" val={data.quizzes} icon={PenTool} color="primary" />
            <StatBox label="Labs" val={data.labTasks} icon={Code} color="black" />
        </div>
    );

    const myStats = data.studentStats?.find(s => s.id === currentUser.id);
    if (!myStats) return <EmptyState icon={BarChart2} text="No performance data yet." />;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                <h4 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="text-primary" /> Completion Progress</h4>
                <div className="space-y-6">
                    <ProgressBar label="Assignments" current={myStats.completedAssignments} total={data.assignments} />
                    <ProgressBar label="Quizzes" current={myStats.completedQuizzes} total={data.quizzes} />
                    <ProgressBar label="Labs" current={myStats.completedLabs} total={data.labTasks} />
                </div>
            </div>
            <div className="lg:col-span-5 bg-black p-10 rounded-[32px] flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] rounded-full" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Total Earned</span>
                <h2 className="text-8xl font-black text-white tracking-tighter mb-4">
                    {myStats.earnedAssigMarks + myStats.earnedQuizMarks + myStats.earnedLabMarks}
                </h2>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Global Points</p>
            </div>
        </div>
    );
};

const StatBox = ({ label, val, icon: Icon, color }) => (
    <div className={`p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center text-center bg-white hover:shadow-xl transition-all`}>
        <div className={`w-14 h-14 ${color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-black text-white'} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
            <Icon size={28} />
        </div>
        <h4 className="text-4xl font-black text-black mb-1 tracking-tight">{val}</h4>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
);

const ProgressBar = ({ label, current, total }) => (
    <div>
        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-2">
            <span>{label}</span>
            <span>{current} / {total}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
            <div className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(214,255,63,0.25)]" style={{ width: `${total > 0 ? (current/total)*100 : 0}%` }} />
        </div>
    </div>
);

const EmptyState = ({ icon: Icon, text }) => (
    <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center w-full">
        <div className="p-5 bg-gray-50 rounded-full mb-6 text-gray-300"><Icon size={40} /></div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{text}</p>
    </div>
);

const Info = ({ size, className }) => <HelpCircle size={size} className={className} />;

export default ClassDetails;
