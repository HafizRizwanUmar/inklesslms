import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Sparkles, ChevronRight } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

/**
 * TrialBanner
 * Shows a countdown banner for teachers during their free trial.
 * Hidden for students, admins, and after trial expires (paywall shows instead).
 */
const TrialBanner = () => {
    const { isTeacher, trialActive, trialDaysLeft, openPaywall, loading } = useSubscription();
    const [dismissed, setDismissed] = useState(false);

    // Only show for teachers during active trial
    if (loading || !isTeacher || !trialActive || dismissed) return null;

    // Determine urgency color
    const isUrgent = trialDaysLeft <= 5;
    const isWarning = trialDaysLeft <= 14 && trialDaysLeft > 5;

    const bannerStyle = isUrgent
        ? { background: 'linear-gradient(90deg, #7f1d1d, #991b1b, #7f1d1d)', borderColor: 'rgba(239,68,68,0.4)' }
        : isWarning
        ? { background: 'linear-gradient(90deg, #451a03, #78350f, #451a03)', borderColor: 'rgba(245,158,11,0.4)' }
        : { background: 'linear-gradient(90deg, #1e1b4b, #312e81, #1e1b4b)', borderColor: 'rgba(124,58,237,0.4)' };

    const textColor = isUrgent ? 'text-red-200' : isWarning ? 'text-amber-200' : 'text-violet-200';
    const accentColor = isUrgent ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-violet-400';
    const badgeBg = isUrgent ? 'bg-red-500/20 border-red-500/40 text-red-300' : isWarning ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-violet-500/20 border-violet-500/40 text-violet-300';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
            >
                <div
                    className="flex items-center justify-between px-4 md:px-8 py-2.5 border-b text-sm"
                    style={bannerStyle}
                >
                    {/* Left: info */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0">
                            <Clock className={`w-4 h-4 ${accentColor}`} />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-semibold ${textColor}`}>
                                {trialDaysLeft === 0
                                    ? 'Your free trial has ended.'
                                    : trialDaysLeft === 1
                                    ? 'Last day of your free trial!'
                                    : `${trialDaysLeft} days left in your free trial.`}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${badgeBg}`}>
                                Teacher Plan · $1/mo after trial
                            </span>
                        </div>
                    </div>

                    {/* Right: CTA + dismiss */}
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={openPaywall}
                            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${badgeBg}`}
                        >
                            <Sparkles className="w-3 h-3" />
                            Subscribe
                            <ChevronRight className="w-3 h-3" />
                        </motion.button>
                        <button
                            onClick={() => setDismissed(true)}
                            className={`p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity ${textColor}`}
                            aria-label="Dismiss banner"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TrialBanner;
