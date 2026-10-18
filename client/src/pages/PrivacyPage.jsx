import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import SEO from '../components/SEO';
import LandingNavbar from '../components/Landing/LandingNavbar';
import Footer from '../components/Landing/Footer';

const SECTIONS = [
    { id: 'intro',      label: '1. Introduction' },
    { id: 'collect',    label: '2. Information We Collect' },
    { id: 'use',        label: '3. How We Use Information' },
    { id: 'storage',    label: '4. Data Storage & Security' },
    { id: 'sharing',    label: '5. Sharing of Information' },
    { id: 'cookies',    label: '6. Cookies & Tracking' },
    { id: 'retention',  label: '7. Data Retention' },
    { id: 'children',   label: "8. Children's Privacy" },
    { id: 'rights',     label: '9. Your Rights' },
    { id: 'thirdparty', label: '10. Third-Party Services' },
    { id: 'changes',    label: '11. Changes to Policy' },
    { id: 'contact',    label: '12. Contact' },
];

const Sec = ({ id, n, title, children }) => (
    <section id={id} className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
            <span className="inline-flex w-9 h-9 rounded-xl bg-blue-50 items-center justify-center text-sm font-black text-blue-600 shrink-0">{n}</span>
            {title}
        </h2>
        <div className="pl-12 space-y-4 text-gray-600 leading-relaxed text-[15px]">{children}</div>
    </section>
);

const PrivacyPage = () => (
    <div className="bg-white min-h-screen">
        <SEO title="Privacy Policy — Inkless" description="Inkless Privacy Policy — Learn how we collect, use, and protect your personal information." />
        <LandingNavbar />
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <Shield size={22} className="text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Last updated: June 26, 2026</p>
                    </div>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                    Your privacy matters to us. This policy explains what data we collect, how we use it, and how we keep it safe.
                </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-14 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Table of Contents</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                    {SECTIONS.map(s => (
                        <a key={s.id} href={`#${s.id}`} className="text-sm text-gray-600 hover:text-blue-600 font-medium py-0.5 transition-colors">{s.label}</a>
                    ))}
                </div>
            </motion.div>

            <div className="space-y-14">
                <Sec id="intro" n="1" title="Introduction">
                    <p>Inkless ("we", "us", "our") operates the Inkless digital classroom platform. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our Service.</p>
                    <p>By using Inkless, you consent to the data practices described in this policy. If you do not agree, please discontinue use of the Service.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="collect" n="2" title="Information We Collect">
                    <p><strong className="text-gray-800">Account Information:</strong> When you register, we collect your name, email address, password (stored as a secure hash — never in plain text), and your account role (Teacher, Student, or Admin).</p>
                    <p><strong className="text-gray-800">Profile & Usage Data:</strong> We collect information you provide when using the Service, including class names, assignment content, quiz questions, student submissions, grades, and comments.</p>
                    <p><strong className="text-gray-800">Payment Information (Teachers only):</strong> We collect billing-related data necessary to process your subscription. <strong>We never store your credit card number, CVV, or full card details on our servers.</strong> All payment processing is handled by Stripe and RevenueCat.</p>
                    <p><strong className="text-gray-800">Technical Data:</strong> We automatically collect basic usage data such as your IP address, browser type, device information, and pages visited to improve Service performance and security.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="use" n="3" title="How We Use Information">
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc list-inside space-y-1.5">
                        <li>Provide, operate, and maintain the Inkless Service</li>
                        <li>Authenticate your identity and manage your account</li>
                        <li>Process teacher subscription payments and manage billing</li>
                        <li>Send important notifications about your account, classes, and assignments</li>
                        <li>Generate analytics reports for teachers (e.g., student performance, CLO reports)</li>
                        <li>Improve Service features, fix bugs, and prevent fraud</li>
                        <li>Respond to support requests and customer inquiries</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                    <p>We do <strong>not</strong> use your data for targeted advertising or sell it to third-party marketers.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="storage" n="4" title="Data Storage & Security">
                    <p>Your data is stored in a MongoDB database secured with role-based access controls. All data transmission is encrypted using SSL/TLS. Authentication is handled via JSON Web Tokens (JWT) with appropriate expiration and refresh policies.</p>
                    <p>We implement industry-standard security measures including encryption at rest, secure key management, and regular security reviews. However, no system is completely immune to security risks, and we cannot guarantee absolute security.</p>
                    <p>If we become aware of a data breach affecting your information, we will notify you promptly in accordance with applicable law.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="sharing" n="5" title="Sharing of Information">
                    <p><strong>We do not sell, trade, or rent your personal data to third parties.</strong></p>
                    <p>We share your information only in the following limited circumstances:</p>
                    <ul className="list-disc list-inside space-y-1.5">
                        <li><strong>Stripe & RevenueCat:</strong> For processing teacher subscription payments only. They receive your billing email and subscription details but never your full card details from us.</li>
                        <li><strong>Legal compliance:</strong> If required by law, court order, or government authority, we may disclose your information.</li>
                        <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or asset sale, your data may be transferred. We will notify you before any such transfer.</li>
                    </ul>
                    <p>Within the platform, teachers can see their own students' submission data, and students can see their own grades — this is core to the product's function and is not considered external sharing.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="cookies" n="6" title="Cookies & Tracking">
                    <p>Inkless uses browser <strong>localStorage</strong> to store your authentication token (JWT) for session management. We use minimal cookies only as technically necessary for the Service to function.</p>
                    <p>We do <strong>not</strong> use tracking cookies for advertising purposes. We do not use third-party analytics platforms that track you across other websites.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="retention" n="7" title="Data Retention">
                    <p>We retain your account data for as long as your account is active. If you cancel your teacher subscription, your data remains accessible for <strong>90 days</strong>, during which you may export your content. After 90 days, inactive account data may be permanently deleted.</p>
                    <p>Student data within a class is managed by the teacher of that class. When a teacher deletes a class, the associated student submissions are also deleted.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="children" n="8" title="Children's Privacy">
                    <p>Inkless is not directed to children under the age of 13 without appropriate consent. If you are an educational institution using Inkless with students under 13, you are responsible for:</p>
                    <ul className="list-disc list-inside space-y-1.5">
                        <li>Obtaining verifiable parental or guardian consent before creating student accounts</li>
                        <li>Complying with the Children's Online Privacy Protection Act (COPPA) and any other applicable children's privacy laws</li>
                        <li>Ensuring that student data is used only for educational purposes</li>
                    </ul>
                    <p>If we learn that we have collected personal information from a child under 13 without parental consent, we will promptly delete that information.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="rights" n="9" title="Your Rights">
                    <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                    <div className="space-y-3">
                        {[
                            { right: 'Access', desc: 'Request a copy of the personal data we hold about you.' },
                            { right: 'Correction', desc: 'Request correction of inaccurate or incomplete data.' },
                            { right: 'Deletion', desc: 'Request deletion of your account and associated data.' },
                            { right: 'Export', desc: 'Request an export of your data in a portable format.' },
                            { right: 'Objection', desc: 'Object to specific processing of your data in certain circumstances.' },
                        ].map(({ right, desc }) => (
                            <div key={right} className="flex items-start gap-3">
                                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0 mt-0.5">{right}</span>
                                <p className="text-sm text-gray-600">{desc}</p>
                            </div>
                        ))}
                    </div>
                    <p>To exercise any of these rights, contact us at <a href="mailto:privacy@inkless.app" className="text-blue-600 font-semibold hover:underline">privacy@inkless.app</a>. We will respond within 30 days.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="thirdparty" n="10" title="Third-Party Services">
                    <p>Inkless integrates with the following third-party services, each with their own privacy policies:</p>
                    <div className="space-y-3">
                        {[
                            { name: 'Stripe', role: 'Payment processing', url: 'https://stripe.com/privacy' },
                            { name: 'RevenueCat', role: 'Subscription management', url: 'https://www.revenuecat.com/privacy' },
                        ].map(({ name, role, url }) => (
                            <div key={name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{name} <span className="font-normal text-gray-500">— {role}</span></p>
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">{url}</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="changes" n="11" title="Changes to This Policy">
                    <p>We may update this Privacy Policy from time to time. When we make significant changes, we will notify you via email or prominent notice within the Service at least 14 days before changes take effect.</p>
                    <p>We encourage you to review this policy periodically. The "Last updated" date at the top of this page indicates when it was last revised.</p>
                </Sec>
                <hr className="border-gray-100" />

                <Sec id="contact" n="12" title="Contact">
                    <p>For privacy-related questions, data requests, or concerns:</p>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-1">
                        <p className="font-semibold text-gray-900">Inkless Privacy Team</p>
                        <p className="text-sm">Email: <a href="mailto:privacy@inkless.app" className="text-blue-600 font-semibold hover:underline">privacy@inkless.app</a></p>
                        <p className="text-sm">General support: <a href="mailto:support@inkless.app" className="text-blue-600 font-semibold hover:underline">support@inkless.app</a></p>
                        <p className="text-sm">Website: <Link to="/" className="text-blue-600 font-semibold hover:underline">inkless.app</Link></p>
                    </div>
                </Sec>
            </div>
        </div>
        <Footer />
    </div>
);

export default PrivacyPage;
