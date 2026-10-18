import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, MapPin, Clock, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import LandingNavbar from '../components/Landing/LandingNavbar';
import Footer from '../components/Landing/Footer';

const CONTACT_OPTIONS = [
    {
        icon: Mail,
        title: 'General Support',
        desc: 'Questions about using Inkless or your account.',
        contact: 'support@inkless.app',
        href: 'mailto:support@inkless.app',
    },
    {
        icon: MessageSquare,
        title: 'Billing & Refunds',
        desc: 'Subscription issues, payment questions, refund requests.',
        contact: 'billing@inkless.app',
        href: 'mailto:billing@inkless.app',
    },
    {
        icon: MapPin,
        title: 'Privacy Requests',
        desc: 'Data access, deletion, or GDPR/COPPA requests.',
        contact: 'privacy@inkless.app',
        href: 'mailto:privacy@inkless.app',
    },
];

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate form send (replace with real API / EmailJS / Formspree later)
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="bg-white min-h-screen">
            <SEO
                title="Contact — Inkless"
                description="Get in touch with the Inkless team. We're here to help with support, billing, privacy, and general inquiries."
            />
            <LandingNavbar />

            {/* Hero */}
            <section className="pt-32 pb-14 px-6 text-center">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-sm font-semibold text-black mb-5 border border-primary/20">
                        We reply within 24 hours
                    </span>
                    <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-4">Get in touch</h1>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        Have a question, a bug to report, or just want to say hello? We'd love to hear from you.
                    </p>
                </motion.div>
            </section>

            {/* Contact Cards */}
            <section className="pb-16 px-6">
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5">
                    {CONTACT_OPTIONS.map(({ icon: Icon, title, desc, contact, href }) => (
                        <motion.a
                            key={title}
                            href={href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -3 }}
                            className="block p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center mb-4 shadow-sm group-hover:bg-primary group-hover:border-primary transition-all">
                                <Icon size={18} className="text-gray-600 group-hover:text-black transition-colors" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                            <p className="text-sm text-gray-500 mb-3 leading-relaxed">{desc}</p>
                            <span className="text-sm font-semibold text-primary">{contact}</span>
                        </motion.a>
                    ))}
                </div>
            </section>

            {/* Contact Form */}
            <section className="pb-24 px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h2>
                        <p className="text-gray-500 text-sm mb-8">Fill in the form below and we'll get back to you within one business day.</p>

                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center py-12"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-5">
                                    <CheckCircle size={32} className="text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
                                <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                                    Thanks for reaching out. We'll reply to <strong>{form.email}</strong> within 24 hours.
                                </p>
                                <button
                                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                    className="mt-6 text-sm text-primary font-semibold hover:underline"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your full name"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="you@email.com"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                                    <select
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors bg-white"
                                    >
                                        <option value="">Select a subject...</option>
                                        <option value="general">General Question</option>
                                        <option value="billing">Billing / Subscription</option>
                                        <option value="bug">Bug Report</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="privacy">Privacy / Data Request</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder="Tell us how we can help..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-colors resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white font-bold rounded-xl hover:bg-primary hover:text-black transition-all disabled:opacity-60"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} /> Send message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Response time note */}
                    <div className="flex items-center gap-3 mt-5 px-2">
                        <Clock size={15} className="text-gray-400 shrink-0" />
                        <p className="text-sm text-gray-500">
                            Typical response time: <strong className="text-gray-700">under 24 hours</strong> on business days (Mon–Fri).
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ContactPage;
