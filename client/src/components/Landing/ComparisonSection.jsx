import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ComparisonSection = () => {
    const plans = [
        { name: 'Inkless Free', cta: 'Get started', price: 'Free' },
        { name: 'Inkless Pro', cta: 'Upgrade Now', price: 'Paid' },
        { name: 'Inkless Team', cta: 'Contact Sales', price: 'Paid' },
        { name: 'Inkless Enterprise', cta: 'Get a Quote', price: 'Paid' }
    ];

    const features = [
        { 
            title: 'AI-Powered Grading & Feedback', 
            availability: [false, true, true, true] 
        },
        { 
            title: 'Custom Branding & Domain', 
            comingSoon: true, 
            availability: [false, false, true, true] 
        },
        { 
            title: 'Advanced Student Analytics Dashboard', 
            availability: [false, true, true, true] 
        },
        { 
            title: 'Centralized Assignment Management', 
            availability: [true, true, true, true] 
        }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Time-saving features</h2>
            </div>

            <div className="container mx-auto px-6 overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="w-1/3 py-8 text-left"></th>
                            {plans.map((plan, i) => (
                                <th key={i} className="py-8 px-6 text-center border-l border-gray-100">
                                    <div className="flex flex-col items-center gap-4">
                                        <span className="text-gray-900 font-bold max-w-[120px] leading-tight">{plan.name}</span>
                                        <button className="px-4 py-2 border border-gray-200 rounded-full text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
                                            {plan.cta}
                                        </button>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {features.map((feature, i) => (
                            <tr key={i} className="border-b border-gray-100 group hover:bg-gray-50 transition-colors">
                                <td className="py-8 pr-6">
                                    <div className="flex items-center gap-3">
                                        {feature.comingSoon && (
                                            <span className="shrink-0 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">Coming Soon</span>
                                        )}
                                        <span className="text-gray-700 font-medium">{feature.title}</span>
                                    </div>
                                </td>
                                {feature.availability.map((available, j) => (
                                    <td key={j} className="py-8 px-6 text-center border-l border-gray-100">
                                        {available ? (
                                            <div className="flex justify-center">
                                                <Check className="text-primary" size={20} strokeWidth={3} />
                                            </div>
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ComparisonSection;
