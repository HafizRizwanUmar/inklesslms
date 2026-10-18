import React from 'react';
import { motion } from 'framer-motion';

const PersonalizedLearningSection = () => {
    return (
        <section className="py-24 bg-[#fcfdfe] overflow-hidden">
            <div className="container mx-auto px-6 text-center mb-20">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
                >
                    Enrich and personalize learning
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 text-lg max-w-3xl mx-auto"
                >
                    Drive student agency with tools that meet students where they are – and build skills for their future.
                </motion.p>
            </div>

            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Side List */}
                <div className="space-y-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                        Premium features <span className="text-primary">that inspire new ways of teaching and learning</span>
                    </h3>

                    <div className="space-y-8">
                        {[
                            "Customized Learning Paths powered by AI",
                            "Interactive Lesson Builder with Multimedia Support",
                            "Instant Auto-Grading & Performance Insights"
                        ].map((text, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-6 pl-6 border-l-4 border-gray-100 hover:border-primary transition-colors py-2"
                            >
                                <p className="text-xl font-medium text-gray-700">{text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Side Mockup */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl p-4 overflow-hidden"
                >
                    {/* Mockup Header */}
                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 text-primary font-bold">✕</span>
                            <span className="font-bold text-gray-800 flex items-center gap-2">
                                <span className="bg-primary/10 p-1 rounded text-primary text-xs">📋</span> Assignment
                            </span>
                        </div>
                    </div>

                    {/* Mockup Body */}
                    <div className="bg-gray-50 rounded-2xl p-6 min-h-[300px]">
                        <div className="h-4 w-1/3 bg-gray-200 rounded mb-4" />
                        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-5/6 bg-gray-200 rounded mb-8" />
                        
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full" />
                                <div className="w-10 h-10 bg-red-100 rounded-full" />
                                <div className="w-10 h-10 bg-green-100 rounded-full" />
                                <div className="flex-1" />
                                <div className="w-32 h-8 bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PersonalizedLearningSection;
