import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Mail, ArrowUpRight } from 'lucide-react';
import InklessLogo from '../InklessLogo';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const PRODUCT_LINKS = [
        { label: 'Home',     to: '/'         },
        { label: 'Features', to: '/features' },
        { label: 'Pricing',  to: '/pricing'  },
        { label: 'Contact',  to: '/contact'  },
    ];

    const LEGAL_LINKS = [
        { label: 'Terms of Service', to: '/terms'   },
        { label: 'Privacy Policy',   to: '/privacy' },
        { label: 'Refund Policy',    to: '/refund'  },
    ];

    const SUPPORT_LINKS = [
        { label: 'Sign In',      to: '/login'        },
        { label: 'Get Started',  to: '/signup'       },
        { label: 'Contact Us', href: 'mailto:support@inkless.app' },
    ];

    return (
        <footer className="relative w-full bg-white overflow-hidden">
            {/* CTA Section */}
            <div className="mx-6 mb-20 rounded-[32px] overflow-hidden bg-primary relative min-h-[280px] flex items-center">
                <div className="absolute left-0 top-0 h-full w-1/3 opacity-20 pointer-events-none">
                    <div className="absolute top-1/2 left-[-10%] -translate-y-1/2 w-64 h-64 border-[32px] border-white rounded-full opacity-30" />
                    <div className="absolute top-1/2 left-[5%] -translate-y-1/2 w-48 h-48 border-[24px] border-white rounded-full opacity-50" />
                </div>
                <div className="container mx-auto px-12 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="max-w-xl text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-serif font-medium text-black leading-tight">
                            Ready To Join <br />
                            The Future Of Learning?
                        </h2>
                    </div>
                    <div className="max-w-xs text-center md:text-left">
                        <p className="text-black/70 text-base mb-6 leading-snug font-medium">
                            Start your 30-day free trial today. No credit card required.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <Link
                                to="/signup"
                                className="px-7 py-3 bg-black text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all shadow-lg"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                to="/pricing"
                                className="px-7 py-3 bg-transparent text-black font-semibold rounded-lg border border-black/20 hover:bg-black/5 transition-all flex items-center gap-2"
                            >
                                View Pricing
                                <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container mx-auto px-6 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-100">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <InklessLogo className="h-8 w-auto" />
                            <span className="font-bold text-black text-base tracking-tight">INKLESS</span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed mb-5">
                            The modern digital classroom for teachers and students. Paperless, smart, and built for real learning.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { icon: <Twitter size={16} />, label: 'Twitter', href: '#' },
                                { icon: <Github size={16} />, label: 'GitHub', href: '#' },
                                { icon: <Mail size={16} />, label: 'Email', href: 'mailto:support@inkless.app' },
                            ].map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-primary hover:border-primary hover:text-black transition-all"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Product</p>
                        <ul className="space-y-3">
                            {PRODUCT_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.to} className="text-sm text-gray-600 hover:text-black font-medium transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support / Account */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Account</p>
                        <ul className="space-y-3">
                            {SUPPORT_LINKS.map((link) => (
                                <li key={link.label}>
                                    {link.href ? (
                                        <a href={link.href} className="text-sm text-gray-600 hover:text-black font-medium transition-colors">
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link to={link.to} className="text-sm text-gray-600 hover:text-black font-medium transition-colors">
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Legal</p>
                        <ul className="space-y-3">
                            {LEGAL_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.to} className="text-sm text-gray-600 hover:text-black font-medium transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">
                        © {currentYear} Inkless. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                        {LEGAL_LINKS.map((link) => (
                            <Link key={link.label} to={link.to} className="hover:text-black transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
