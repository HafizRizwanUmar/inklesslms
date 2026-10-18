/**
 * ─────────────────────────────────────────────────────────────────
 * REVENUECAT CONFIGURATION
 * ─────────────────────────────────────────────────────────────────
 *
 * SDK Version: @revenuecat/purchases-js v1.46.0
 *
 * Setup checklist (RevenueCat Dashboard → app.revenuecat.com):
 * 1. Project → Apps → Add App → Web (Stripe or Paddle)
 * 2. Products → Add product: "monthly" ($1/month, 30-day trial)
 * 3. Entitlements → Create → ID: "inkless Pro" → attach "monthly"
 * 4. Offerings → Default offering → attach "monthly" package
 * 5. API Keys → Copy "Web Billing" public key → paste below (VITE_REVENUECAT_API_KEY)
 * 6. Paywalls → Create paywall → attach to default offering
 *    (The SDK's presentPaywall() renders this remotely-configured paywall)
 * 7. Customer Center → Configure → copy the portal URL
 * ─────────────────────────────────────────────────────────────────
 */

// ── API Key ─────────────────────────────────────────────────────
// Set in .env file as: VITE_REVENUECAT_API_KEY=test_PbNqiaqJqKnVxuFbVijcmyqqzxP
// The key below is the test key provided — move to .env for production
export const RC_API_KEY =
  import.meta.env.VITE_REVENUECAT_API_KEY || 'test_PbNqiaqJqKnVxuFbVijcmyqqzxP';

// ── Entitlement identifier ───────────────────────────────────────
// Must match exactly: Dashboard → Entitlements → Identifier
export const RC_ENTITLEMENT_ID = 'inkless Pro';

// ── Offering identifier ──────────────────────────────────────────
// 'default' uses your Default Offering in RC Dashboard
export const RC_OFFERING_ID = 'default';

// ── Product identifiers ──────────────────────────────────────────
// Must match the product identifier you created in RC Dashboard
export const RC_PRODUCT_ID = 'monthly';

// ── Trial configuration ──────────────────────────────────────────
// Local 30-day trial window (server-enforced via createdAt)
// This should match the trial period on your RC product
export const TRIAL_DAYS = 30;

// ── Pricing display ─────────────────────────────────────────────
export const MONTHLY_PRICE_USD = 4.99;

// ── Customer Center URL ──────────────────────────────────────────
// Get from RC Dashboard → Customer Center → Portal URL
// This is the hosted self-serve portal for subscribers to manage their subscriptions
export const RC_CUSTOMER_CENTER_URL =
  import.meta.env.VITE_REVENUECAT_CUSTOMER_CENTER_URL || '';

// ── Helper ───────────────────────────────────────────────────────
export const isRCConfigured = () => Boolean(RC_API_KEY);
