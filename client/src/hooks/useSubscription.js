/**
 * useSubscription — RevenueCat + Inkless Subscription Hook
 *
 * Usage:
 *   const sub = useSubscription();
 *
 * State:
 *   sub.isPremium         — true if trial active OR RC entitlement active
 *   sub.trialActive       — within 30-day trial window
 *   sub.trialDaysLeft     — days remaining (0 = expired)
 *   sub.rcEntitled        — RevenueCat 'inkless Pro' entitlement is active
 *   sub.customerInfo      — full RC CustomerInfo object (or null)
 *   sub.isTeacher         — true if role === 'teacher'
 *   sub.loading           — true while initializing
 *
 * Actions:
 *   sub.openPaywall()           — present RC SDK paywall (Dashboard-designed)
 *   sub.presentRCPaywall()      — same as openPaywall()
 *   sub.openCustomModal()       — show our custom fallback modal instead
 *   sub.purchaseMonthly()       — direct package purchase (no paywall UI)
 *   sub.restorePurchases()      — restore existing RC subscription
 *   sub.getOfferings()          — fetch RC Offerings (packages + metadata)
 *   sub.refreshSubscription()   — re-fetch trial status + RC entitlement
 *   sub.refreshAfterPurchase()  — lightweight re-check post-purchase
 *   sub.getPurchasesInstance()  — raw Purchases SDK instance (advanced)
 *
 * SDK Config:
 *   API Key:       test_PbNqiaqJqKnVxuFbVijcmyqqzxP (test_* prefix = sandbox)
 *   Entitlement:  "inkless Pro"
 *   Product:      "monthly" ($1/month)
 *
 * @module useSubscription
 */
export { useSubscription } from '../context/SubscriptionContext';
