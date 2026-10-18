/**
 * ─────────────────────────────────────────────────────────────────
 * INKLESS FEATURE FLAGS
 * ─────────────────────────────────────────────────────────────────
 * AI_ENABLED: Master switch for all AI-powered features.
 *
 * Set to `true` to re-enable all AI features across the app:
 *   - "Evaluate with AI" button on GradingPage
 *   - "Generate with AI" option in QuizBuilder
 *   - "Mark All with AI" in QuizSubmissions
 *   - AI routes: /ai-quiz-generator, /ai-confidence,
 *                /plagiarism-report, /similarity-comparison
 * ─────────────────────────────────────────────────────────────────
 */
export const AI_ENABLED = false;
