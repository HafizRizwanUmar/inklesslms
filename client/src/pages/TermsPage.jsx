import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import SEO from '../components/SEO';
import LandingNavbar from '../components/Landing/LandingNavbar';
import Footer from '../components/Landing/Footer';

const SECTIONS = [
    { id: 'acceptance',  label: '1. Acceptance of Terms' },
    { id: 'service',     label: '2. Description of Service' },
    { id: 'accounts',    label: '3. User Accounts & Eligibility' },
    { id: 'billing',     label: '4. Subscription & Billing' },
    { id: 'students',    label: '5. Student Accounts' },
    { id: 'aup',         label: '6. Acceptable Use' },
    { id: 'ip',          label: '7. Intellectual Property' },
    { id: 'privacy',     label: '8. Privacy' },
    { id: 'disclaimer',  label: '9. Disclaimers' },
    { id: 'termination', label: '10. Termination' },
    { id: 'governing',   label: '11. Governing Law' },
    { id: 'changes',     label: '12. Changes to Terms' },
    { id: 'contact',     label: '13. Contact' },
];

const Sec = ({ id, n, title, children }) => (
    <section id={id} className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
            <span className="inline-flex w-9 h-9 rounded-xl bg-primary/10 items-center justify-center text-sm font-black text-primary shrink-0">{n}</span>
            {title}
        </h2>
        <div className="pl-12 space-y-4 text-gray-600 leading-relaxed text-[15px]">{children}</div>
    </section>
);

const TermsPage = () => (
    <div className="bg-white min-h-screen">
        <SEO title="Terms of Service — Inkless" description="Read the Terms of Service for Inkless, the digital classroom platform for teachers and students." />
        <LandingNavbar />
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <FileText size={22} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Last updated: June 26, 2026</p>
                    </div>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                    These Terms of Service govern your use of Inkless. By accessing or using our service, you agree to be bound by these terms.
                </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-14 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Table of Contents</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                    {SECTIONS.map(s => (
                        <a key={s.id} href={`#${s.id}`} className="text-sm text-gray-600 hover:text-primary font-medium py-0.5 transition-colors">{s.label}</a>
                    ))}
                </div>
            </motion.div>

            <div className="space-y-14">
                <Sec id="acceptance" n="1" title="Acceptance of Terms">
                    <p>By accessing or using Inkless ("Service", "Platform", "we", "us", "our"), you agree to be bound by these Terms of Service and our <Link to="/privacy" className="text-primary font-semibold hover:underline">Privacy Policy</Link>. If you do not agree, you may not use the Service.</p>
                    <p>If you are using the Service on behalf of a school or organization, you represent that you have authority to bind that entity to these terms.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="service" n="2" title="Description of Service">
                    <p>Inkless is a digital classroom management platform enabling teachers and students to interact in a paperless environment. The Service includes:</p>
                    <ul className="list-disc list-inside space-y-1.5">
                        <li>Class creation, management, and student enrollment</li>
                        <li>Assignment and lab task creation, submission, and grading</li>
                        <li>Quiz and assessment building and delivery</li>
                        <li>Student performance analytics and reporting</li>
                        <li>Notifications and scheduling features</li>
                    </ul>
                    <p>We reserve the right to modify or discontinue features with reasonable notice.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="accounts" n="3" title="User Accounts & Eligibility">
                    <p>You must register with accurate information and maintain the confidentiality of your account credentials. Notify us immediately at <a href="mailto:support@inkless.app" className="text-primary font-semibold hover:underline">support@inkless.app</a> of any unauthorized account access.</p>
                    <p>You must be at least 13 years old to use Inkless. Users under 18 require parental consent. Educational institutions using Inkless with students under 13 are responsible for compliance with applicable laws (including COPPA).</p>
                    <p>Inkless offers three roles: <strong>Teacher</strong>, <strong>Student</strong>, and <strong>Admin</strong>. Features depend on your assigned role.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="billing" n="4" title="Teacher Subscription & Billing">
                    <p>Teacher accounts require a paid subscription after the free trial. Key billing details:</p>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3">
                        {[
                            ['Plan price',         '$4.99 USD per month'],
                            ['Free trial',         '30 days from account creation — no credit card required'],
                            ['Billing cycle',      'Monthly, on the subscription anniversary date'],
                            ['Payment processor',  'RevenueCat and Stripe (PCI-DSS Level 1 compliant)'],
                            ['Cancellation',       'Cancel anytime; access continues until end of billing period'],
                            ['Refunds',            'Subject to our Refund Policy at inkless.app/refund'],
                        ].map(([label, value]) => (
                            <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1">
                                <span className="text-sm font-semibold text-gray-700 sm:w-44 shrink-0">{label}</span>
                                <span className="text-sm text-gray-500">{value}</span>
                            </div>
                        ))}
                    </div>
                    <p>We will provide at least 30 days' notice before any price change. Continued use after notice constitutes acceptance of new pricing.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="students" n="5" title="Student Accounts">
                    <p>Student accounts are <strong>always free</strong>. Students are never charged for using Inkless. Students join classes using a code provided by their teacher, and may submit assignments, take quizzes, view grades, and track academic progress.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="aup" n="6" title="Acceptable Use Policy">
                    <p>You agree not to use the Service to:</p>
                    <ul className="list-disc list-inside space-y-1.5">
                        <li>Upload content that is unlawful, harmful, abusive, harassing, or defamatory</li>
                        <li>Impersonate any person or falsely misrepresent your affiliation</li>
                        <li>Attempt to gain unauthorized access to the Service or related systems</li>
                        <li>Use automated bots, scrapers, or crawlers without written permission</li>
                        <li>Violate any applicable local, national, or international law</li>
                        <li>Engage in academic dishonesty, including submitting work that is not your own</li>
                    </ul>
                    <p>We may suspend or terminate accounts violating this policy without prior notice.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="ip" n="7" title="Intellectual Property">
                    <p>The Inkless platform, design, code, trademarks, and related intellectual property are owned by Inkless and protected by applicable laws. You may not copy, modify, sell, or sublicense any part of the platform without written permission.</p>
                    <p><strong>Your Content:</strong> You retain ownership of content you upload. By uploading, you grant Inkless a limited, non-exclusive license to store and process that content solely to provide the Service.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="privacy" n="8" title="Privacy">
                    <p>Our <Link to="/privacy" className="text-primary font-semibold hover:underline">Privacy Policy</Link> describes how we collect, use, and protect your personal information. By using the Service, you agree to our Privacy Policy. We never sell your data to third parties. Payment information is handled exclusively by Stripe and RevenueCat — we never store credit card details on our servers.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="disclaimer" n="9" title="Disclaimers & Limitation of Liability">
                    <p>The Service is provided "as is" without warranties of any kind. We do not warrant that the Service will be uninterrupted, error-free, or completely secure.</p>
                    <p>To the fullest extent permitted by law, Inkless shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability to you shall not exceed the amount you paid to Inkless in the twelve (12) months prior to any claim.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="termination" n="10" title="Termination">
                    <p>You may terminate your account anytime via account settings or by contacting <a href="mailto:support@inkless.app" className="text-primary font-semibold hover:underline">support@inkless.app</a>. We may suspend or terminate access if we believe you have violated these Terms.</p>
                    <p>Your data is retained for 90 days after termination, after which it may be permanently deleted.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="governing" n="11" title="Governing Law">
                    <p>These Terms are governed by the laws of the jurisdiction where Inkless is operated. Any disputes shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="changes" n="12" title="Changes to Terms">
                    <p>We may update these Terms at any time. We will notify users of significant changes via email or prominent in-app notice at least 14 days before changes take effect. Continued use after the effective date constitutes acceptance.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="contact" n="13" title="Contact">
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-1">
                        <p className="font-semibold text-gray-900">Inkless Support Team</p>
                        <p className="text-sm">Email: <a href="mailto:support@inkless.app" className="text-primary font-semibold hover:underline">support@inkless.app</a></p>
                        <p className="text-sm">Website: <Link to="/" className="text-primary font-semibold hover:underline">inkless.app</Link></p>
                    </div>
                </Sec>
            </div>
        </div>
        <Footer />
    </div>
);

export default TermsPage;
