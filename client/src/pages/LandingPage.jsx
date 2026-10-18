import React from 'react';
import LandingNavbar from '../components/Landing/LandingNavbar';
import HeroSection from '../components/Landing/HeroSection';
import AboutSection from '../components/Landing/AboutSection';
import PersonalizedLearningSection from '../components/Landing/PersonalizedLearningSection';
import ComparisonSection from '../components/Landing/ComparisonSection';
import GlobalImpactSection from '../components/Landing/GlobalImpactSection';
import Footer from '../components/Landing/Footer';
import SEO from '../components/SEO';

const LandingPage = () => {
    return (
        <div className="bg-white min-h-screen">
            <SEO 
                title="Home"
                description="Inkless — Asia's Top 20 Student-Led Startup. The modern digital classroom for teachers and students. Manage classes, assignments, lab tasks, quizzes, and analytics in one paperless platform."
            />
            <LandingNavbar />
            <main>
                <HeroSection />
                {/* Recognition Strip */}
                <div className="bg-black py-3 overflow-hidden">
                    <div className="flex items-center justify-center gap-8 flex-wrap px-6">
                        <div className="flex items-center gap-2 text-white">
                            <span className="text-lg">🏆</span>
                            <span className="text-sm font-bold tracking-wide">Asia&apos;s Top 20 Student-Led Startup</span>
                        </div>
                        <div className="w-1 h-1 bg-white/30 rounded-full hidden sm:block" />
                        <span className="text-white/60 text-sm font-medium hidden sm:block">Teachers $4.99/month · Students Always Free</span>
                    </div>
                </div>
                <AboutSection />
                <PersonalizedLearningSection />
                <ComparisonSection />
                <GlobalImpactSection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
