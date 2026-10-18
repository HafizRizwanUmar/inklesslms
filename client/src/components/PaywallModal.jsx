/**
 * PaywallModal — Inkless Subscription Paywall
 *
 * Primary: uses RevenueCat SDK's presentPaywall() which renders the
 *          paywall you designed in the RC Dashboard Paywall Editor.
 *
 * Fallback: when RC isn't configured or SDK paywall fails, shows our
 *           custom-built premium paywall UI with package info from RC offerings.
 *
 * This component only shows the custom fallback modal.
 * The RC native paywall is presented as a full-screen overlay directly
 * by the SDK (rendered into a div with id="rcb-ui-pw-root").
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, CreditCard, RotateCcw, Shield, Zap, BookOpen,
  Star, Check, X, Loader2, ExternalLink,
} from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { MONTHLY_PRICE_USD, RC_CUSTOMER_CENTER_URL } from '../config/revenuecat';

const FEATURES = [
  { icon: BookOpen, text: 'Unlimited classes & assignments' },
  { icon: Zap,      text: 'Lab tasks, quizzes & grading tools' },
  { icon: Shield,   text: 'Analytics & performance reports' },
  { icon: Star,     text: 'Priority support & new features first' },
];

const PaywallModal = () => {
  const {
    showPaywallModal,
    setShowPaywallModal,
    trialDaysLeft,
    purchaseMonthly,
    restorePurchases,
    getOfferings,
    presentRCPaywall,
  } = useSubscription();

  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [offering, setOffering] = useState(null);
  const [loadingOffering, setLoadingOffering] = useState(false);

  // Fetch current offering to display price from RC
  useEffect(() => {
    if (!showPaywallModal) return;
    let cancelled = false;

    const load = async () => {
      setLoadingOffering(true);
      const offerings = await getOfferings();
      if (!cancelled && offerings?.current) {
        setOffering(offerings.current);
      }
      setLoadingOffering(false);
    };
    load();
    return () => { cancelled = true; };
  }, [showPaywallModal, getOfferings]);

  // Get price from RC offering, fallback to our constant
  const price = offering?.monthly?.product?.price
    ? `${offering.monthly.product.currencyCode} ${offering.monthly.product.price}`
    : `$${MONTHLY_PRICE_USD}.00/month`;

  const onPurchase = useCallback(async () => {
    setPurchasing(true);
    const success = await purchaseMonthly();
    setPurchasing(false);
    if (success) setShowPaywallModal(false);
  }, [purchaseMonthly, setShowPaywallModal]);

  const onRestore = useCallback(async () => {
    setRestoring(true);
    await restorePurchases();
    setRestoring(false);
  }, [restorePurchases]);

  const onOpenRCPaywall = useCallback(async () => {
    // Close this modal first, then open RC's native paywall
    setShowPaywallModal(false);
    await presentRCPaywall();
  }, [presentRCPaywall, setShowPaywallModal]);

  return (
    <AnimatePresence>
      {showPaywallModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0,0,0,0.88)' }}
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl"
              style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 32 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="relative w-full max-w-md"
          >
            <div
              className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              style={{ background: 'linear-gradient(145deg, #0f0f1a 0%, #1a1030 50%, #0f1a2a 100%)' }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowPaywallModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all z-10"
                aria-label="Close paywall"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="relative pt-10 pb-5 px-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 shadow-lg shadow-violet-500/30"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                >
                  <Lock className="w-9 h-9 text-white" />
                </motion.div>

                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                  {trialDaysLeft === 0
                    ? 'Your Free Trial Has Ended'
                    : 'Upgrade to Inkless Pro'}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {trialDaysLeft === 0
                    ? "Subscribe to keep teaching with all your tools."
                    : "Unlock the full power of Inkless for teachers."}
                </p>
              </div>

              {/* Price card */}
              <div className="mx-8 mb-5">
                <div
                  className="rounded-2xl p-4 flex items-center justify-between border border-violet-500/25"
                  style={{ background: 'rgba(124,58,237,0.08)' }}
                >
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
                      Inkless Pro
                    </p>
                    <div className="flex items-baseline gap-1">
                      {loadingOffering ? (
                        <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                      ) : (
                        <>
                          <span className="text-3xl font-black text-white">
                            ${MONTHLY_PRICE_USD}
                          </span>
                          <span className="text-slate-400 font-medium">/month</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] bg-violet-500/15 text-violet-300 px-2.5 py-1 rounded-full font-black border border-violet-500/25">
                      Teachers Only
                    </span>
                    <span className="text-[10px] text-slate-500">Students always free</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mx-8 mb-6 space-y-2.5">
                {FEATURES.map(({ icon: Icon, text }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(124,58,237,0.18)' }}
                    >
                      <Icon className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <span className="text-sm text-slate-300 font-medium">{text}</span>
                    <Check className="w-3.5 h-3.5 text-violet-400 ml-auto shrink-0" />
                  </motion.div>
                ))}
              </div>

              {/* Primary CTA — RC native paywall */}
              <div className="px-8 pb-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenRCPaywall}
                  disabled={purchasing}
                  className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 transition-all"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                >
                  <CreditCard className="w-5 h-5" />
                  Subscribe — ${MONTHLY_PRICE_USD}/month
                </motion.button>
              </div>

              {/* Secondary CTA — direct package purchase */}
              <div className="px-8 pb-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onPurchase}
                  disabled={purchasing || restoring}
                  className="w-full py-3 rounded-2xl font-bold text-slate-300 text-sm flex items-center justify-center gap-2 border border-white/10 hover:border-violet-500/40 hover:text-white transition-all disabled:opacity-50"
                >
                  {purchasing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard className="w-4 h-4" /> Quick Checkout</>
                  )}
                </motion.button>
              </div>

              {/* Restore + Customer Center + Disclaimer */}
              <div className="px-8 pb-7 flex flex-col items-center gap-2.5">
                <div className="flex items-center gap-4">
                  <button
                    onClick={onRestore}
                    disabled={restoring || purchasing}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 disabled:opacity-40"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {restoring ? 'Restoring...' : 'Restore Purchase'}
                  </button>

                  {RC_CUSTOMER_CENTER_URL && (
                    <>
                      <span className="text-slate-700 text-xs">·</span>
                      <a
                        href={RC_CUSTOMER_CENTER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                      >
                        Manage Subscription
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-slate-600 text-center leading-relaxed max-w-[280px]">
                  Subscriptions renew monthly. Cancel anytime from the Customer Center.
                  Powered by RevenueCat secure billing.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaywallModal;
