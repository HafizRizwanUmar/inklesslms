import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen, ClipboardList, FlaskConical, Brain, BarChart3,
    Users, Bell, Calendar, FileDown, Code2, PenLine, Shield,
    Check, ArrowRight, Zap, Star
} from 'lucide-react';
import SEO from '../components/SEO';
import LandingNavbar from '../components/Landing/LandingNavbar';
import Footer from '../components/Landing/Footer';

const FEATURE_CATEGORIES = [
    {
        category: 'Class Management',
        color: 'bg-violet-50 border-violet-100',
        iconColor: 'text-violet-600',
        iconBg: 'bg-violet-100',
        features: [
            {
                icon: BookOpen,
                title: 'Class Creation & Enrollment',
                desc: 'Create classes in seconds and invite students using a unique class code. Manage multiple classes from one dashboard.',
            },
            {
                icon: Users,
                title: 'Student Management',
                desc: 'View student profiles, track attendance, monitor individual progress, and manage your roster with ease.',
            },
            {
                icon: Shield,
                title: 'Archived Classes',
                desc: 'Archive completed classes to keep your workspace clean while preserving all historical data and submissions.',
            },
        ],
    },
    {
        category: 'Assignments & Grading',
        color: 'bg-blue-50 border-blue-100',
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
        features: [
            {
                icon: ClipboardList,
                title: 'Assignment Builder',
                desc: 'Create rich assignments with deadlines, file upload support, and detailed instructions. Students submit directly from their dashboard.',
            },
            {
                icon: PenLine,
                title: 'Manual Grading & Annotations',
                desc: 'Grade submissions with inline comments, scores, and feedback. Provide detailed, personalized feedback to every student.',
            },
            {
                icon: FileDown,
                title: 'Download Reports',
                desc: 'Export grade reports as CSV or PDF for your records, institutional requirements, or parent communication.',
            },
        ],
    },
    {
        category: 'Lab Tasks & Code Testing',
        color: 'bg-emerald-50 border-emerald-100',
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-100',
        features: [
            {
                icon: FlaskConical,
                title: 'Lab Task Management',
                desc: 'Create structured lab tasks with multi-file submissions. Ideal for practical programming and engineering assignments.',
            },
            {
                icon: Code2,
                title: 'Code Testing Environment',
                desc: 'Students run and test their code in-browser. Teachers view test results alongside submitted code for accurate evaluation.',
            },
            {
                icon: ClipboardList,
                title: 'Lab Grading & Feedback',
                desc: 'Grade lab submissions with a dedicated interface. View code, outputs, and provide structured feedback per lab task.',
            },
        ],
    },
    {
        category: 'Quizzes & Assessments',
        color: 'bg-amber-50 border-amber-100',
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-100',
        features: [
            {
                icon: Brain,
                title: 'Quiz Builder',
                desc: 'Build quizzes with multiple question types: MCQs, short answers, true/false, and coding challenges — all from one editor.',
            },
            {
                icon: Code2,
                title: 'Coding Quiz Tests',
                desc: 'Set timed coding challenges where students write and execute code inside the quiz. Auto-evaluate outputs against test cases.',
            },
            {
                icon: BarChart3,
                title: 'Quiz Analytics',
                desc: 'Get detailed submission analytics per quiz — question-level difficulty, average scores, and student performance breakdown.',
            },
        ],
    },
    {
        category: 'Analytics & Reports',
        color: 'bg-rose-50 border-rose-100',
        iconColor: 'text-rose-600',
        iconBg: 'bg-rose-100',
        features: [
            {
                icon: BarChart3,
                title: 'Student Performance Reports',
                desc: 'Comprehensive per-student reports covering grades across assignments, labs, and quizzes throughout the semester.',
            },
            {
                icon: Brain,
                title: 'CLO Tracking Reports',
                desc: 'Map your assessments to Course Learning Outcomes (CLOs) and generate compliance reports for accreditation.',
            },
            {
                icon: BarChart3,
                title: 'Weekly Summaries',
                desc: 'Auto-generated weekly summaries of class activity — submissions received, graded, pending, and student engagement.',
            },
        ],
    },
    {
        category: 'Productivity Tools',
        color: 'bg-gray-50 border-gray-100',
        iconColor: 'text-gray-700',
        iconBg: 'bg-gray-200',
        features: [
            {
                icon: Bell,
                title: 'Notification Center',
                desc: 'Real-time notifications for assignment submissions, quiz completions, grading updates, and important class events.',
            },
            {
                icon: Calendar,
                title: 'Calendar & Scheduling',
                desc: 'Visualize all deadlines, class events, and quiz dates in one calendar view. Never miss an important date.',
            },
            {
                icon: Zap,
                title: 'Role-Based Access',
                desc: 'Three user roles — Teacher, Student, and Admin — each with tailored dashboards and appropriate access controls.',
            },
        ],
    },
];

const HIGHLIGHTS = [
    { number: '100%', label: 'Paperless workflow' },
    { number: '30s', label: 'Class setup time' },
    { number: '∞', label: 'Students per class' },
    { number: '24/7', label: 'Access anywhere' },
];

const FeaturesPage = () => (
    <div className="bg-white min-h-screen">
        <SEO
            title="Features — Inkless"
            description="Explore all Inkless features: class management, assignments, lab tasks, quizzes, code testing, analytics, and more — built for modern teachers and students."
        />
        <LandingNavbar />

        {/* Hero */}
        <section className="pt-32 pb-16 px-6 text-center bg-white">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-bold shadow-md">
                        🏆 Asia&apos;s Top 20 Student-Led Startup
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-sm font-semibold text-black border border-primary/30">
                        Everything you need to teach digitally
                    </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                    Built for real classrooms.<br />
                    <span className="text-primary">Not just demos.</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
                    Inkless covers every part of the teaching workflow — from creating a class to grading the final quiz — in one clean, paperless platform.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        to="/signup"
                        className="px-8 py-3.5 bg-black text-white font-bold rounded-xl hover:bg-primary hover:text-black transition-all flex items-center gap-2"
                    >
                        Start free trial <ArrowRight size={16} />
                    </Link>
                    <Link
                        to="/pricing"
                        className="px-8 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-black hover:text-black transition-all"
                    >
                        View pricing
                    </Link>
                </div>
            </motion.div>
        </section>

        {/* Highlights bar */}
        <section className="py-10 px-6 border-y border-gray-100 bg-gray-50">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                {HIGHLIGHTS.map(({ number, label }) => (
                    <div key={label} className="text-center">
                        <p className="text-3xl font-black text-gray-900 mb-1">{number}</p>
                        <p className="text-sm text-gray-500 font-medium">{label}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Feature Categories */}
        <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto space-y-20">
                {FEATURE_CATEGORIES.map(({ category, color, iconColor, iconBg, features }, ci) => (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * ci }}
                    >
                        {/* Category label */}
                        <div className="flex items-center gap-3 mb-8">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${color} ${iconColor}`}>
                                {category}
                            </span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        {/* Feature cards */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {features.map(({ icon: Icon, title, desc }, fi) => (
                                <motion.div
                                    key={title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.07 * fi }}
                                    className={`rounded-2xl border p-6 ${color} hover:shadow-md transition-shadow`}
                                >
                                    <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
                                        <Icon size={20} className={iconColor} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* Student side features */}
        <section className="py-16 px-6 bg-gray-50 border-y border-gray-100">
            <div className="max-w-4xl mx-auto text-center mb-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-sm font-semibold text-blue-600 border border-blue-100 mb-4">
                    For Students — Always Free
                </span>
                <h2 className="text-3xl font-bold text-gray-900">Students get everything too</h2>
            </div>
            <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
                {[
                    'Join unlimited classes with a code',
                    'Submit assignments & lab work',
                    'Take quizzes and coding tests',
                    'View real-time grades and feedback',
                    'Track personal performance over time',
                    'Access notifications and calendar',
                ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-5 py-3.5">
                        <Check size={16} className="text-blue-500 shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{f}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
                <Star size={32} className="text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to go paperless?</h2>
                <p className="text-gray-500 mb-8">Start your 30-day free trial. No credit card required for teachers.</p>
                <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-10 py-4 bg-black text-white font-bold rounded-xl hover:bg-primary hover:text-black transition-all text-base"
                >
                    Get started free <ArrowRight size={18} />
                </Link>
            </motion.div>
        </section>

        <Footer />
    </div>
);

export default FeaturesPage;
