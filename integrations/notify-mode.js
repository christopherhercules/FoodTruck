/**
 * Per-site notification mode helper
 *
 * Each handler passes its site-specific env var (e.g. HUNTER_APP_ENV).
 * Falls back to global APP_ENV, then to 'dev' — never accidentally goes live.
 *
 * Modes: dev | demo | live
 */

const DEV_EMAIL = 'admin@aiagentassistance.com';

function resolveNotification({ to, subject, smsBody, siteEnv }) {
  const mode = siteEnv || process.env.APP_ENV || 'dev';

  switch (mode) {
    case 'live':
      return { to, subject, smsBody, suppressSms: false };

    case 'demo':
      return {
        to,
        subject: `[DEMO] ${subject}`,
        smsBody: smsBody ? `[DEMO] ${smsBody}` : null,
        suppressSms: false,
      };

    case 'dev':
    default:
      return {
        to: DEV_EMAIL,
        subject: `[DEV] ${subject}`,
        smsBody: null,
        suppressSms: true,
      };
  }
}

module.exports = { resolveNotification };
