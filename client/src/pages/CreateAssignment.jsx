import API_BASE_URL from '../config';
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Upload, CheckSquare, FileText, Archive, PenTool, BarChart3, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const CreateAssignment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { classId } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        marks: 100,
        deadline: '',
        enableAI: false,
        submissionTypes: {
            code: false,
            output: false,
            image: false,
            pdf: false,
            zip: false
        }
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!classId) return <div className="p-8">Error: No Class ID</div>;

    const handleSubmissionTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            submissionTypes: {
                ...prev.submissionTypes,
                [type]: !prev.submissionTypes[type]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('marks', formData.marks);
            data.append('deadline', formData.deadline);
            data.append('enableAI', formData.enableAI);
            data.append('classId', classId);
            data.append('submissionTypes', JSON.stringify(formData.submissionTypes));

            if (file) {
                data.append('file', file);
            }

            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/assignments`, data, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate(`/class-details/${classId}`);
        } catch (err) {
            console.error(err);
            alert('Error creating assignment');
        } finally {
            setLoading(false);
        }
    };

    const requirements = [
        { id: 'pdf', label: 'PDF Document', icon: FileText, color: 'text-red-500' },
        { id: 'zip', label: 'ZIP Archive', icon: Archive, color: 'text-blue-500' },
        { id: 'code', label: 'Source Code', icon: PenTool, color: 'text-primary' },
        { id: 'output', label: 'Text Output', icon: BarChart3, color: 'text-green-500' },
        { id: 'image', label: 'Screenshot', icon: Sparkles, color: 'text-purple-500' },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 pb-20">
            <SEO title="Create Task" description="Publish a new assignment or lab task for your class." />
            
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-black font-bold uppercase tracking-widest text-[11px] mb-8 transition-colors"
            >
                <ArrowLeft size={16} /> Cancel & Exit
            </button>

            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-black tracking-tighter">Create Task</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Publish a new assignment or lab to your class</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Main Card */}
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-8 space-y-6">
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Task Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-lg"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Data Structures Lab 1"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Task Description / Instructions</label>
                                <textarea
                                    required
                                    rows="6"
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium leading-relaxed"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Outline the steps or paste the question here..."
                                />
                            </div>
                        </div>

                        <div className="md:col-span-4 space-y-6">
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Maximum Points</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className="w-full px-6 py-4 bg-black text-white rounded-2xl focus:ring-4 focus:ring-primary/20 transition-all outline-none font-black text-2xl"
                                        value={formData.marks}
                                        onChange={e => setFormData({ ...formData, marks: e.target.value })}
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-primary font-black text-xs uppercase tracking-widest">PTS</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Deadline</label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold"
                                        value={formData.deadline}
                                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submission Requirements Card */}
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-black mb-8 flex items-center gap-2">
                        <CheckSquare className="text-primary" />
                        Submission Requirements
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {requirements.map((req) => (
                            <div
                                key={req.id}
                                className={`p-6 border rounded-[28px] cursor-pointer flex flex-col gap-4 transition-all relative overflow-hidden group ${formData.submissionTypes[req.id] ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}
                                onClick={() => handleSubmissionTypeChange(req.id)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl ${formData.submissionTypes[req.id] ? 'bg-primary text-white' : 'bg-white text-gray-300'} transition-all`}>
                                        <req.icon size={20} />
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.submissionTypes[req.id] ? 'bg-black border-black text-white' : 'border-gray-200'}`}>
                                        {formData.submissionTypes[req.id] && <CheckCircle2 size={14} />}
                                    </div>
                                </div>
                                <div>
                                    <span className={`text-sm font-black uppercase tracking-tight ${formData.submissionTypes[req.id] ? 'text-black' : 'text-gray-400'}`}>{req.label}</span>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Allow {req.id.toUpperCase()} submissions</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reference Material */}
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
                    <h3 className="text-xl font-black text-black mb-8 flex items-center gap-2">
                        <Upload className="text-primary" />
                        Reference Material (Optional)
                    </h3>
                    <div className="relative group">
                        <input
                            type="file"
                            accept=".pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={e => setFile(e.target.files[0])}
                        />
                        <div className={`border-2 border-dashed rounded-[32px] p-10 text-center flex flex-col items-center transition-all ${file ? 'border-green-400 bg-green-50/30' : 'border-gray-100 group-hover:border-primary group-hover:bg-primary/5'}`}>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${file ? 'bg-green-100 text-green-500' : 'bg-gray-50 text-gray-300 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                {file ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                            </div>
                            <p className="font-black text-black text-sm uppercase tracking-widest mb-1">
                                {file ? file.name : "Attach a Question Paper or Notes"}
                            </p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
                                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Only PDF accepted"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto bg-black text-white px-16 py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:bg-primary hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <CheckCircle2 size={20} />
                                Publish Task
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAssignment;
