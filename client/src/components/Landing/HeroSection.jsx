import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Play, MessageCircle, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    const containerRef = useRef(null);

    const floatingAnimation = {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <section id="hero" ref={containerRef} className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden bg-white pt-32 pb-20">
            {/* Background Grid & Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(214,255,63,0.12),white_60%)]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="container relative z-10 mx-auto px-6 flex flex-col items-center text-center">
                {/* Recognition Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-3 mb-12"
                >
                    {/* Asia Top 20 Badge */}
                    <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full shadow-lg">
                        <span className="text-base">🏆</span>
                        <span className="text-sm font-bold tracking-tight">Asia&apos;s Top 20 Student-Led Startup</span>
                    </div>
                </motion.div>

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="max-w-4xl mb-8"
                >
                    <h1 className="text-4xl md:text-6xl font-sans font-bold tracking-tight text-black leading-[0.95] mb-4">
                        The Digital Classroom
                    </h1>
                    <h1 className="text-4xl md:text-6xl font-serif italic text-black leading-[0.95]">
                        Built for Real Teachers.
                    </h1>
                </motion.div>

                {/* Subheadline */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-base md:text-lg text-gray-500 max-w-2xl mb-12 leading-relaxed"
                >
                    Inkless replaces paper, spreadsheets, and email chains with one clean platform — create classes, assign work, run quizzes, grade submissions, and track every student's progress.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-4 mb-24"
                >
                    <Link
                        to="/signup"
                        className="px-10 py-4 bg-primary text-black font-semibold rounded-full shadow-[0_10px_30px_rgba(214,255,63,0.35)] border border-primary hover:bg-black hover:text-white hover:border-black transition-all"
                    >
                        Book a Demo
                    </Link>
                    <Link
                        to="#demo"
                        className="px-10 py-4 bg-transparent text-black font-semibold rounded-full border border-black/10 hover:bg-black hover:text-white transition-all flex items-center gap-2"
                    >
                        Watch Video
                    </Link>
                </motion.div>

                {/* Dashboard Visual */}
                <motion.div 
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="relative w-full max-w-6xl mx-auto"
                >
                    {/* Mockup Container */}
                    <div className="bg-white rounded-[24px] md:rounded-[40px] border-[8px] md:border-[12px] border-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden">
                        <img src="/DASHBOARD.png" alt="Inkless Dashboard" className="w-full h-auto object-cover" />
                    </div>

                    {/* Floating Elements */}
                    <motion.div animate={floatingAnimation} className="absolute -top-12 left-10 bg-white px-6 py-3 rounded-full shadow-xl border border-gray-50 flex items-center gap-3 z-20">
                        <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-black"><MoreHorizontal size={14} /></div>
                        <span className="text-sm font-bold text-black">Teacher Dashboard</span>
                    </motion.div>

                    <motion.div animate={floatingAnimation} className="absolute top-10 -right-8 bg-white px-6 py-3 rounded-full shadow-xl border border-gray-50 flex items-center gap-3 z-20">
                        <span className="text-sm font-bold text-black flex items-center gap-2">
                            <span className="text-primary">✦</span> Smart AI Grading
                        </span>
                    </motion.div>

                    <motion.div animate={floatingAnimation} className="absolute bottom-40 -left-16 bg-white p-6 rounded-[32px] shadow-2xl border border-gray-50 text-left z-20 hidden md:block">
                        <div className="text-sm font-bold text-gray-800 mb-1">Latest Assignment</div>
                        <div className="text-xs text-gray-400 mb-4">21 new submissions</div>
                        <div className="w-12 h-1 bg-gray-100 rounded-full" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
