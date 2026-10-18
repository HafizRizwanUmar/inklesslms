import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, XCircle, Clock, Mail, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import LandingNavbar from '../components/Landing/LandingNavbar';
import Footer from '../components/Landing/Footer';

const SECTIONS = [
    { id: 'overview', label: 'Overview' },
    { id: 'trial', label: 'Free Trial' },
    { id: 'eligible', label: 'Eligible Refunds' },
    { id: 'ineligible', label: 'Non-Refundable' },
    { id: 'process', label: 'Refund Process' },
    { id: 'cancellation', label: 'Cancellation' },
    { id: 'contact', label: 'Contact' },
];

const RefundPage = () => {
    return (
        <div className="bg-white min-h-screen">
            <SEO
                title="Refund Policy — Inkless"
                description="Inkless refund policy. Learn about our 30-day free trial, eligible refunds, and how to request a refund or cancel your subscription."
            />
            <LandingNavbar />

            <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <RefreshCw size={22} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Refund Policy</h1>
                            <p className="text-sm text-gray-400 mt-0.5">Last updated: June 26, 2026</p>
                        </div>
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                        We want you to love Inkless. If something isn't right, we're here to make it fair. This policy explains when and how refunds are issued.
                    </p>
                </motion.div>

                {/* Table of Contents */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12 p-6 rounded-2xl bg-gray-50 border border-gray-100"
                >
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contents</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SECTIONS.map((s) => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className="text-sm text-gray-600 hover:text-primary font-medium py-1 transition-colors"
                            >
                                {s.label}
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* Sections */}
                <div className="prose prose-gray max-w-none space-y-12">

                    {/* Overview */}
                    <section id="overview">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-black text-primary">1</span>
                            Overview
                        </h2>
                        <div className="pl-11 space-y-3 text-gray-600 leading-relaxed">
                            <p>
                                Inkless offers a <strong>$4.99/month subscription</strong> for teacher accounts. Student accounts are always free.
                                This Refund Policy applies only to paid teacher subscriptions processed through our payment provider (RevenueCat + Stripe).
                            </p>
                            <p>
                                We encourage all new users to take advantage of the <strong>30-day free trial</strong> before subscribing, so you can experience Inkless fully before any charge occurs.
                            </p>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Free Trial */}
                    <section id="trial">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-sm font-black text-green-600">2</span>
                            Free Trial Policy
                        </h2>
                        <div className="pl-11 space-y-4 text-gray-600 leading-relaxed">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                                <CheckCircle size={18} className="text-green-600 mt-0.5 shrink-0" />
                                <p className="text-sm text-green-800 font-medium">
                                    All teacher accounts receive a <strong>30-day free trial</strong> starting from registration. No credit card is required to begin the trial. You will only be charged after your trial ends and you choose to subscribe.
                                </p>
                            </div>
                            <p>
                                We strongly recommend using the full trial period to evaluate Inkless. If you choose not to subscribe after the trial, your account will be restricted — no data is deleted for 90 days, giving you time to export your work.
                            </p>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Eligible Refunds */}
                    <section id="eligible">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm font-black text-blue-600">3</span>
                            Eligible Refunds
                        </h2>
                        <div className="pl-11 space-y-4 text-gray-600 leading-relaxed">
                            <p>We will issue a full refund in the following situations:</p>
                            <div className="space-y-3">
                                {[
                                    { title: 'Accidental double charge', desc: 'You were charged more than once for the same billing period due to a technical error.' },
                                    { title: 'Charge after cancellation', desc: 'You were charged after successfully cancelling your subscription within the billing period.' },
                                    { title: 'Service unavailability', desc: 'Inkless experienced significant downtime (>24 hours) during a billing period due to our infrastructure failure.' },
                                    { title: 'Request within 48 hours', desc: 'You request a refund within 48 hours of your first paid charge (not trial) if you have not actively used the service during that period.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle size={16} className="text-blue-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Non-Refundable */}
                    <section id="ineligible">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-sm font-black text-red-500">4</span>
                            Non-Refundable Situations
                        </h2>
                        <div className="pl-11 space-y-4 text-gray-600 leading-relaxed">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                                <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                                <p className="text-sm text-red-800">
                                    The following are generally not eligible for refunds. We encourage you to use the free trial to avoid these situations.
                                </p>
                            </div>
                            <div className="space-y-3">
                                {[
                                    'Requests made more than 48 hours after the charge date',
                                    'Partial month refunds for mid-cycle cancellations',
                                    'Forgetting to cancel before the renewal date',
                                    'Dissatisfaction with features that were available during the free trial',
                                    'Account suspension due to violation of our Terms of Service',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <XCircle size={16} className="text-red-400 mt-1 shrink-0" />
                                        <p className="text-sm text-gray-600">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Process */}
                    <section id="process">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-black text-primary">5</span>
                            How to Request a Refund
                        </h2>
                        <div className="pl-11 space-y-4 text-gray-600 leading-relaxed">
                            <p>To request a refund, email us at <a href="mailto:support@inkless.app" className="text-primary font-semibold hover:underline">support@inkless.app</a> with the following:</p>
                            <div className="space-y-2">
                                {[
                                    'Your registered email address',
                                    'The date of the charge',
                                    'A brief reason for the refund request',
                                    'Any relevant screenshots (optional)',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">{i + 1}</div>
                                        <p className="text-sm text-gray-600">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 mt-4">
                                <Clock size={18} className="text-gray-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">Processing Time</p>
                                    <p className="text-sm text-gray-500">Approved refunds are processed within <strong>5–10 business days</strong> and returned to your original payment method.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Cancellation */}
                    <section id="cancellation">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-sm font-black text-orange-500">6</span>
                            Cancellation
                        </h2>
                        <div className="pl-11 space-y-3 text-gray-600 leading-relaxed">
                            <p>
                                You can cancel your Inkless subscription at any time through the <strong>Customer Center</strong> accessible from within the app (Settings → Manage Subscription).
                            </p>
                            <p>
                                When you cancel, your subscription remains active until the end of the current billing period. You will not be charged for the next cycle. <strong>No partial refunds</strong> are issued for the unused days of a billing period.
                            </p>
                            <p>
                                Your account data and class content are retained for 90 days after cancellation to allow you to re-subscribe or export your data.
                            </p>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Contact */}
                    <section id="contact">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-black text-gray-600">7</span>
                            Contact Us
                        </h2>
                        <div className="pl-11">
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-4">
                                <Mail size={22} className="text-primary mt-1 shrink-0" />
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">Billing & Refund Support</p>
                                    <p className="text-gray-600 text-sm mb-3">Our team typically responds within 24 hours on business days.</p>
                                    <a
                                        href="mailto:support@inkless.app"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-black hover:text-white transition-all"
                                    >
                                        <Mail size={14} />
                                        support@inkless.app
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default RefundPage;
