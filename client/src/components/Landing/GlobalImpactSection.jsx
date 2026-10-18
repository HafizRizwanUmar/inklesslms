import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const GlobalImpactSection = () => {
    const stories = [
        {
            title: "Empowering educators and students",
            image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600"
        },
        {
            title: "Preparing students for the future",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600"
        },
        {
            title: "Helping students reach their potential",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600"
        },
        {
            title: "Growing teacher impact and student engagement",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600"
        }
    ];

    return (
        <section className="py-24 bg-[#fcfdfe] overflow-hidden">
            <div className="container mx-auto px-6 text-center mb-16">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                >
                    Explore the global impact of Inkless
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 text-lg max-w-4xl mx-auto"
                >
                    Discover how institutions of all different sizes, demographics, and needs are transforming education with Inkless. Watch inspiring stories from leaders and educators around the world.
                </motion.p>
            </div>

            <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stories.map((story, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group cursor-pointer"
                    >
                        {/* Video Thumbnail */}
                        <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 shadow-lg group-hover:shadow-2xl transition-all">
                            <img 
                                src={story.image} 
                                alt={story.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-black shadow-xl group-hover:scale-110 transition-transform">
                                    <Play fill="currentColor" size={24} className="ml-1" />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors">
                            {story.title}
                        </h3>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default GlobalImpactSection;
