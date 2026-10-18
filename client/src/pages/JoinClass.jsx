import API_BASE_URL from '../config';
import React, { useState } from 'react';
import { Search, Plus, BookOpen, User, Hash, ArrowRight, ShieldCheck, CheckCircle2, MoreVertical, X, Info } from 'lucide-react';
import SEO from '../components/SEO';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const JoinClass = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!code || loading) return;
        
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/classes/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ code: code.trim() })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || 'Invalid class code. Please check and try again.');
            }

            navigate('/student/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <SEO title="Join Class" description="Enroll in a new classroom using a unique class code provided by your teacher." />
            
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => navigate('/student/dashboard')}
                className="absolute inset-0 bg-black/60 backdrop-blur-[6px]" 
            />

            {/* Modal Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white/20"
            >
                {/* Header Decoration */}
                <div className="h-2 bg-primary w-full" />
                
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <ShieldCheck size={28} />
                        </div>
                        <button 
                            onClick={() => navigate('/student/dashboard')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <h2 className="text-3xl font-bold text-black tracking-tight mb-2">Join a Class</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-medium">
                        Enter the unique 6-digit code shared by your teacher to gain access to class materials and assignments.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2"
                            >
                                <Info size={14} />
                                {error}
                            </motion.div>
                        )}

                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <Hash size={20} />
                            </div>
                            <input
                                autoFocus
                                type="text"
                                name="code"
                                required
                                maxLength={10}
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="ENTER CLASS CODE"
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-black font-black tracking-[0.2em] placeholder:tracking-normal placeholder:font-bold placeholder:text-gray-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none uppercase"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate('/student/dashboard')}
                                className="flex-1 px-6 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!code || loading}
                                className="flex-[1.5] px-6 py-4 bg-primary text-black hover:text-white font-bold rounded-2xl shadow-[0_10px_25px_rgba(214,255,63,0.3)] hover:bg-black hover:shadow-black/10 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 group active:scale-95"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Join Class
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-wider justify-center">
                        <Info size={12} />
                        Can't find your code? Ask your instructor
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default JoinClass;
