import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Star, ArrowRight, Users, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import SEO from '../components/SEO';
import LandingNavbar from '../components/Landing/LandingNavbar';
import Footer from '../components/Landing/Footer';

const PRICE = 4.99;

const TEACHER_FEATURES = [
    'Unlimited classes & students',
    'Assignment creation & submission',
    'Lab tasks & code testing',
    'Manual grading with annotations',
    'Quiz builder (multiple question types)',
    'PDF & ZIP file submissions',
    'Student performance analytics',
    'CLO reports & weekly summaries',
    'Download reports (CSV/PDF)',
    'Notification center',
    'Calendar & scheduling',
    'Priority email support',
];

const STUDENT_FEATURES = [
    'Join unlimited classes',
    'Submit assignments & lab work',
    'Take quizzes & coding tests',
    'View grades & feedback',
    'Track your performance',
    'Access class materials',
    'Notification center',
    'Always free — no credit card',
];

const FAQS = [
    {
        q: 'Is there a free trial for teachers?',
        a: 'Yes! Every teacher account gets a 30-day free trial with full access to all features. No credit card required to start.',
    },
    {
        q: 'Why is the teacher plan $4.99/month?',
        a: 'We keep pricing simple and affordable. $4.99/month gives you every feature Inkless offers with no hidden fees or per-student charges.',
    },
    {
        q: 'Are students always free?',
        a: 'Yes, always. Students never pay for Inkless. They join classes using a code from their teacher and get full access to submit work, take quizzes, and track their grades.',
    },
    {
        q: 'Can I cancel anytime?',
        a: 'Absolutely. Cancel your subscription anytime from your account settings. You keep access until the end of your billing period.',
    },
    {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure payment provider RevenueCat + Stripe.',
    },
    {
        q: 'Is my payment information secure?',
        a: 'Yes. We never store your card details. All payments are processed by Stripe, which is PCI-DSS Level 1 compliant — the highest level of payment security.',
    },
    {
        q: 'What happens when my trial ends?',
        a: 'When your 30-day trial ends, you\'ll see a subscription prompt inside the app. Your data is never deleted — subscribe to continue teaching.',
    },
    {
        q: 'Do you offer discounts for schools or institutions?',
        a: 'We\'re working on institutional plans. Reach out to us at support@inkless.app to discuss custom pricing for your school.',
    },
];

const FAQItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div
            className={`border border-gray-100 rounded-2xl overflow-hidden transition-all ${open ? 'bg-gray-50' : 'bg-white'}`}
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
                <span className="font-semibold text-gray-900 text-base pr-4">{q}</span>
                {open ? <ChevronUp size={20} className="text-primary shrink-0" /> : <ChevronDown size={20} className="text-gray-400 shrink-0" />}
            </button>
            {open && (
                <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm">{a}</div>
            )}
        </div>
    );
};

const PricingPage = () => {
    return (
        <div className="bg-white min-h-screen">
            <SEO
                title="Pricing — Inkless"
                description="Inkless is free for students forever. Teachers get a 30-day free trial, then $4.99/month for unlimited access to all features."
            />
            <LandingNavbar />

            {/* Hero */}
            <section className="pt-32 pb-16 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-sm font-semibold text-primary mb-6 border border-primary/20">
                        Simple, transparent pricing
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                        Free for students.<br />
                        <span className="text-primary">${PRICE}/month</span> for teachers.
                    </h1>
                    <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
                        No per-student fees. No hidden charges. One flat price gives you everything — 30 days free to start.
                    </p>
                </motion.div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-20 px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

                    {/* Student Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-3xl border border-gray-100 p-8 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                                <BookOpen size={22} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">For Students</p>
                                <h2 className="text-xl font-bold text-gray-900">Student Plan</h2>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-gray-900">$0</span>
                                <span className="text-gray-400 font-medium">/ forever</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">No credit card. No catch. Always free.</p>
                        </div>

                        <Link
                            to="/signup"
                            className="w-full block text-center py-3.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all mb-8"
                        >
                            Get started free
                        </Link>

                        <ul className="space-y-3">
                            {STUDENT_FEATURES.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                                    <Check size={16} className="text-blue-500 shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Teacher Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-3xl border-2 border-primary p-8 bg-white shadow-xl relative overflow-hidden"
                    >
                        {/* Popular badge */}
                        <div className="absolute top-6 right-6">
                            <span className="px-3 py-1 rounded-full bg-primary text-xs font-black text-black tracking-wider uppercase">
                                Most Popular
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Users size={22} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">For Teachers</p>
                                <h2 className="text-xl font-bold text-gray-900">Pro Plan</h2>
                            </div>
                        </div>

                        <div className="mb-2">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-gray-900">${PRICE}</span>
                                <span className="text-gray-400 font-medium">/ month</span>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 mb-8">
                            <Zap size={13} className="text-green-600" />
                            <span className="text-xs font-bold text-green-700">30-day free trial — no card needed</span>
                        </div>

                        <Link
                            to="/signup"
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-black text-white font-bold hover:bg-primary hover:text-black transition-all mb-8"
                        >
                            Start free trial
                            <ArrowRight size={16} />
                        </Link>

                        <ul className="space-y-3">
                            {TEACHER_FEATURES.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                                    <Check size={16} className="text-primary shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Trust badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-3xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    {[
                        { icon: <Shield size={18} className="text-green-600" />, text: 'SSL encrypted payments' },
                        { icon: <Star size={18} className="text-yellow-500" />, text: 'Cancel anytime, no fees' },
                        { icon: <Zap size={18} className="text-primary" />, text: 'Instant access after sign-up' },
                    ].map((b, i) => (
                        <div key={i} className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100">
                            {b.icon}
                            <span className="text-sm font-medium text-gray-700">{b.text}</span>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* FAQ */}
            <section className="pb-24 px-6">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Frequently asked questions</h2>
                    <p className="text-center text-gray-500 mb-10">Everything you need to know about Inkless pricing.</p>
                    <div className="space-y-3">
                        {FAQS.map((faq, i) => <FAQItem key={i} {...faq} />)}
                    </div>
                    <p className="text-center mt-10 text-gray-500 text-sm">
                        Still have questions?{' '}
                        <a href="mailto:support@inkless.app" className="text-primary font-semibold hover:underline">
                            Contact us
                        </a>
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PricingPage;
