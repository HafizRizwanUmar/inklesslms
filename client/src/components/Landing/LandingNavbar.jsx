import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import InklessLogo from '../InklessLogo';

// Pages accessible from public navbar
const NAV_LINKS = [
    { name: 'Home',     to: '/',          type: 'route' },
    { name: 'Features', to: '/features',  type: 'route' },
    { name: 'Pricing',  to: '/pricing',   type: 'route' },
    { name: 'Contact',  to: '/contact',   type: 'route' },
];

const LandingNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAnchor = (e, to) => {
        if (to.startsWith('#')) {
            e.preventDefault();
            // If we're not on the home page, navigate there first
            if (location.pathname !== '/') {
                window.location.href = '/' + to;
                return;
            }
            const el = document.querySelector(to);
            if (el) {
                window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' });
            }
            setMobileMenuOpen(false);
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-100 ${scrolled ? 'shadow-sm' : ''}`}
        >
            <div className="max-w-[1440px] mx-auto flex items-stretch h-16 md:h-20">
                {/* Logo */}
                <div className="flex items-center px-6 md:px-8 border-r border-gray-100">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="group-hover:scale-105 transition-transform">
                            <InklessLogo className="h-10 w-auto" />
                        </div>
                        <span className="font-sans text-lg font-bold tracking-tight text-black">INKLESS</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex flex-1 items-center px-8 space-x-8">
                    {NAV_LINKS.map((link) => (
                        link.type === 'route' ? (
                            <Link
                                key={link.name}
                                to={link.to}
                                className={`text-[15px] font-medium transition-colors ${
                                    location.pathname === link.to
                                        ? 'text-black font-semibold'
                                        : 'text-gray-500 hover:text-black'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ) : (
                            <a
                                key={link.name}
                                href={link.to}
                                onClick={(e) => handleAnchor(e, link.to)}
                                className="text-[15px] font-medium text-gray-500 hover:text-black transition-colors"
                            >
                                {link.name}
                            </a>
                        )
                    ))}
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-3 px-6 md:px-8 border-l border-gray-100">
                    <Link
                        to="/login"
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                    >
                        Sign in
                    </Link>
                    <Link
                        to="/signup"
                        className="px-5 py-2.5 bg-black text-white font-semibold text-sm hover:bg-primary hover:text-black transition-all rounded-lg"
                    >
                        Get started free
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center px-6 ml-auto">
                    <button
                        className="p-2 text-gray-900"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 shadow-xl overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-1">
                            {NAV_LINKS.map((link) => (
                                link.type === 'route' ? (
                                    <Link
                                        key={link.name}
                                        to={link.to}
                                        className="py-3 text-gray-700 font-medium hover:text-black border-b border-gray-50 last:border-0"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ) : (
                                    <a
                                        key={link.name}
                                        href={link.to}
                                        className="py-3 text-gray-700 font-medium hover:text-black border-b border-gray-50"
                                        onClick={(e) => { handleAnchor(e, link.to); setMobileMenuOpen(false); }}
                                    >
                                        {link.name}
                                    </a>
                                )
                            ))}
                            <div className="pt-4 flex flex-col gap-3">
                                <Link
                                    to="/login"
                                    className="w-full block text-center border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="w-full block text-center bg-black text-white py-3 rounded-lg font-bold hover:bg-primary hover:text-black transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Get started free
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default LandingNavbar;
