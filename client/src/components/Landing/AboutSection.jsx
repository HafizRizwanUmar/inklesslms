import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
                    <div className="max-w-2xl">
                        <span className="px-4 py-1.5 bg-gray-50 text-gray-600 text-sm font-semibold rounded-lg mb-6 inline-block">
                            About Us
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Elevate Learning with Inkless <br />
                            Digital Classroom Tools
                        </h2>
                    </div>
                    <div className="max-w-md">
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Inkless provides a comprehensive suite of digital tools designed to streamline teaching, engage students, and provide actionable insights for modern educators.
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Visual */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-[32px] overflow-hidden shadow-2xl h-[450px] bg-gray-100"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=1200" 
                            alt="Digital Classroom" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* List */}
                    <div className="space-y-8">
                        {[
                            { 
                                id: '01', 
                                title: 'Smart Assignment Management', 
                                desc: 'Create, distribute, and track assignments effortlessly with our centralized dashboard and automated workflows.' 
                            },
                            { 
                                id: '02', 
                                title: 'AI-Powered Grading Assistant', 
                                desc: 'Save hours every week with our advanced AI that helps grade objective tasks and provides feedback suggestions.' 
                            },
                            { 
                                id: '03', 
                                title: 'Collaborative Learning Hub', 
                                desc: 'Enable real-time interaction between students and teachers through integrated chat, comments, and shared workspaces.' 
                            }
                        ].map((item, index) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex items-start gap-6 group"
                            >
                                <div className="shrink-0 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-2xl font-bold text-black shadow-[0_8px_20px_rgba(214,255,63,0.3)] group-hover:scale-110 transition-transform">
                                    {item.id}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
