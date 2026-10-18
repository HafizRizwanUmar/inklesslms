/**
 * ─────────────────────────────────────────────────────────────────
 * INKLESS SUBSCRIPTION CONTEXT
 * RevenueCat Web SDK v1.46.0 — Full Integration
 * ─────────────────────────────────────────────────────────────────
 *
 * Provides subscription state app-wide via React context.
 *
 * Flow:
 *  1. User logs in → JWT contains createdAt
 *  2. Server endpoint /api/auth/subscription/status computes trial state
 *  3. RC SDK initialized with user's ID → entitlement checked via isEntitledTo()
 *  4. isPremium = trialActive OR rcEntitled
 *  5. Teachers with expired trial + no active subscription → PaywallModal opens
 *
 * Role behavior:
 *  - student: always isPremium=true, no paywall, no banner
 *  - admin:   always isPremium=true, no paywall, no banner
 *  - teacher: 30-day trial → RC subscription required
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  RC_API_KEY,
  RC_ENTITLEMENT_ID,
  TRIAL_DAYS,
} from '../config/revenuecat';
import API_BASE_URL from '../config';

// ── Context ────────────────────────────────────────────────────────────────
const SubscriptionContext = createContext(null);

// ── Helper: decode JWT without library ────────────────────────────────────
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(
      decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    );
  } catch {
    return null;
  }
};

// ── Provider ───────────────────────────────────────────────────────────────
export const SubscriptionProvider = ({ children }) => {
  const purchasesRef = useRef(null); // RevenueCat Purchases singleton

  const [state, setState] = useState({
    // Core identity
    role: null,
    userId: null,
    isTeacher: false,

    // Trial state (computed server-side from createdAt)
    trialActive: true,
    trialDaysLeft: TRIAL_DAYS,

    // RevenueCat entitlement state
    rcEntitled: false,
    customerInfo: null,

    // Combined: user may use premium features
    isPremium: true, // optimistic default — avoids flash

    // Loading state
    loading: true,
    error: null,
  });

  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [showRCPaywall, setShowRCPaywall] = useState(false);

  // ── Initialize RevenueCat SDK for a teacher ──────────────────────────────
  const initRC = useCallback(async (userId) => {
    if (!RC_API_KEY) {
      console.warn('[RC] No API key configured.');
      return { rcEntitled: false, customerInfo: null, purchases: null };
    }

    try {
      const { Purchases } = await import('@revenuecat/purchases-js');

      // If already configured for this user, reuse the instance
      if (Purchases.isConfigured()) {
        const existing = Purchases.getSharedInstance();
        if (existing.getAppUserId() === userId) {
          const { customerInfo } = await existing.getCustomerInfo();
          const rcEntitled = existing.isEntitledTo(RC_ENTITLEMENT_ID);
          purchasesRef.current = existing;
          return { rcEntitled, customerInfo, purchases: existing };
        }
      }

      // Configure SDK fresh
      const purchases = Purchases.configure(RC_API_KEY, userId);
      purchasesRef.current = purchases;

      // Fetch customer info & check entitlement
      const { customerInfo } = await purchases.getCustomerInfo();
      const rcEntitled = purchases.isEntitledTo(RC_ENTITLEMENT_ID);

      // Set customer attributes for analytics
      await purchases.setAttributes({
        $displayName: userId, // will be overridden with real name below
        inkless_role: 'teacher',
      });

      return { rcEntitled, customerInfo, purchases };
    } catch (err) {
      console.error('[RC] SDK init error:', err);
      return { rcEntitled: false, customerInfo: null, purchases: null };
    }
  }, []);

  // ── Main init: fetch trial status + init RC ──────────────────────────────
  const initSubscription = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    const decoded = decodeJWT(token);
    if (!decoded?.user) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    const { id: userId, role, name } = decoded.user;

    // Students and admins are always free
    if (role !== 'teacher') {
      setState({
        role,
        userId,
        isTeacher: false,
        trialActive: true,
        trialDaysLeft: TRIAL_DAYS,
        rcEntitled: false,
        customerInfo: null,
        isPremium: true,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      // 1. Server-side trial computation
      const res = await fetch(`${API_BASE_URL}/api/auth/subscription/status`, {
        headers: { 'x-auth-token': token },
      });
      if (!res.ok) throw new Error('Subscription status fetch failed');
      const { trialActive, trialDaysLeft } = await res.json();

      // 2. Initialize RC SDK
      const { rcEntitled, customerInfo } = await initRC(userId);

      // Update display name in RC
      if (purchasesRef.current && name) {
        await purchasesRef.current.setAttributes({ $displayName: name }).catch(() => {});
      }

      const isPremium = trialActive || rcEntitled;

      setState({
        role,
        userId,
        isTeacher: true,
        trialActive,
        trialDaysLeft,
        rcEntitled,
        customerInfo,
        isPremium,
        loading: false,
        error: null,
      });

      // Show paywall if neither trial nor subscription
      if (!isPremium) {
        setShowPaywallModal(true);
      }
    } catch (err) {
      console.error('[Subscription] Init error:', err);
      // Fail open: allow access on network error
      setState((s) => ({
        ...s,
        loading: false,
        error: err.message,
        isPremium: true,
      }));
    }
  }, [initRC]);

  useEffect(() => {
    initSubscription();
  }, [initSubscription]);

  // ── Present RevenueCat Paywall (SDK built-in UI) ─────────────────────────
  /**
   * Uses the RC SDK's presentPaywall() which renders the paywall you designed
   * in the RevenueCat Dashboard Paywall Editor (no-code, remote).
   * Falls back to our custom PaywallModal if RC SDK isn't configured.
   */
  const presentRCPaywall = useCallback(async () => {
    const purchases = purchasesRef.current;

    if (!purchases) {
      // RC not configured — show custom modal fallback
      setShowPaywallModal(true);
      return;
    }

    try {
      setShowRCPaywall(true);
      // presentPaywall renders the RC-designed paywall as a full-screen overlay
      // It returns once the user closes it (purchased or dismissed)
      await purchases.presentPaywall({
        // offering: undefined — uses default offering
        // htmlTarget: undefined — auto creates a fixed overlay
      });
      // After paywall closes, refresh subscription status
      await refreshAfterPurchase();
    } catch (err) {
      console.error('[RC] Paywall error:', err);
    } finally {
      setShowRCPaywall(false);
    }
  }, []);

  // ── Refresh after a successful purchase ──────────────────────────────────
  const refreshAfterPurchase = useCallback(async () => {
    const purchases = purchasesRef.current;
    if (!purchases) return;

    try {
      const { customerInfo } = await purchases.getCustomerInfo();
      const rcEntitled = purchases.isEntitledTo(RC_ENTITLEMENT_ID);

      setState((s) => ({
        ...s,
        rcEntitled,
        customerInfo,
        isPremium: s.trialActive || rcEntitled,
      }));

      if (rcEntitled) {
        setShowPaywallModal(false);
      }
    } catch (err) {
      console.error('[RC] Refresh error:', err);
    }
  }, []);

  // ── Manual package purchase (fallback when RC paywall UI isn't used) ──────
  const purchaseMonthly = useCallback(async () => {
    const purchases = purchasesRef.current;
    if (!purchases) {
      alert('Payment system not ready. Please refresh and try again.');
      return false;
    }

    try {
      const offerings = await purchases.getOfferings();
      const pkg = offerings?.current?.monthly ?? offerings?.current?.availablePackages?.[0];

      if (!pkg) {
        console.error('[RC] No monthly package found in current offering');
        alert('No subscription package available. Please contact support.');
        return false;
      }

      const { customerInfo } = await purchases.purchasePackage(pkg);
      const rcEntitled = purchases.isEntitledTo(RC_ENTITLEMENT_ID);

      if (rcEntitled) {
        setState((s) => ({
          ...s,
          rcEntitled: true,
          customerInfo,
          isPremium: true,
        }));
        setShowPaywallModal(false);
        return true;
      }
      return false;
    } catch (err) {
      // Don't alert on user cancellation
      if (!err?.errorCode?.includes('CANCELLED')) {
        console.error('[RC] Purchase error:', err);
        alert('Purchase failed. Please try again.');
      }
      return false;
    }
  }, []);

  // ── Restore purchases ─────────────────────────────────────────────────────
  const restorePurchases = useCallback(async () => {
    const purchases = purchasesRef.current;
    if (!purchases) return false;

    try {
      const { customerInfo } = await purchases.getCustomerInfo();
      const rcEntitled = purchases.isEntitledTo(RC_ENTITLEMENT_ID);

      setState((s) => ({
        ...s,
        rcEntitled,
        customerInfo,
        isPremium: s.trialActive || rcEntitled,
      }));

      if (rcEntitled) {
        setShowPaywallModal(false);
        return true;
      } else {
        alert('No active subscription found to restore.');
        return false;
      }
    } catch (err) {
      console.error('[RC] Restore error:', err);
      return false;
    }
  }, []);

  // ── Fetch offerings (for displaying package info) ─────────────────────────
  const getOfferings = useCallback(async () => {
    const purchases = purchasesRef.current;
    if (!purchases) return null;
    try {
      return await purchases.getOfferings();
    } catch (err) {
      console.error('[RC] getOfferings error:', err);
      return null;
    }
  }, []);

  // ── Context value ─────────────────────────────────────────────────────────
  const value = {
    ...state,

    // Paywall state
    showPaywallModal,
    setShowPaywallModal,
    showRCPaywall,

    // Actions
    openPaywall: presentRCPaywall,       // Opens RC's paywall (or fallback modal)
    openCustomModal: () => setShowPaywallModal(true), // Force-show custom modal
    presentRCPaywall,
    purchaseMonthly,
    restorePurchases,
    refreshAfterPurchase,
    getOfferings,
    refreshSubscription: initSubscription,

    // Raw SDK access (for advanced use)
    getPurchasesInstance: () => purchasesRef.current,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────────
export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within <SubscriptionProvider>');
  return ctx;
};

export default SubscriptionContext;
