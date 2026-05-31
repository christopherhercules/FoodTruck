/**
 * Combined Webhook Server
 *
 * Routes:
 *   POST /twilio/sms            ← Twilio inbound messages
 *   POST /twilio/status         ← Twilio delivery receipts
 *   GET  /twilio/health
 *
 *   POST /toast/webhook         ← Toast order/menu events
 *   GET  /toast/health
 *
 *   POST /hunter/estimate       ← Hunter Land Clearing leads
 *   POST /hunter/social/caption ← Hunter social caption generation
 *   POST /hunter/social/post    ← Hunter social post to FB + IG
 *
 *   POST /cabinets/estimate     ← Shawn Cabinets leads
 *   POST /cabinets/analyze-plan ← Shawn Cabinets plan analyzer
 *
 *   POST /food/checkout         ← Stripe Checkout Session (food ordering)
 *   POST /food/webhook          ← Stripe webhook (payment confirmed → AppSync Order)
 *
 *   POST /demo-request          ← aiagentassistance.com demo form
 *   POST /aiagent/social/caption ← AI Agent social caption generation
 *   POST /aiagent/social/post    ← AI Agent social post to FB + IG
 *
 *   GET  /health                ← top-level health check
 *   GET  /sites/health          ← ping all 15 food truck sites
 */

const express         = require('express');
const { loadSecrets } = require('./secrets');

const PORT = process.env.PORT || 3000;

const FOOD_TRUCK_SITES = [
  'maschingonrestaurant', 'maschingonfoodtruck', 'bar1859', 'sylviastacos',
  'donjuliostacos', 'hechoenqueso', 'happypizza', 'sacredsandwich',
  'thatgreentrailer', 'bigtonys', 'potatowagon', 'ribtips',
  'simplyporkfection', 'bobbyque', 'sodafusion'
];
const DOMAIN          = 'aiagentassistance.com';
const SITE_TIMEOUT_MS = 8000;

async function start() {
  // Load all secrets from SSM into process.env before any route files are required.
  await loadSecrets();

  const app = express();

  // ── TWILIO ROUTES ────────────────────────────────────────────────────────
  const twilioApp = require('./twilio/webhook');
  app.use(twilioApp);

  // ── TOAST ROUTES ─────────────────────────────────────────────────────────
  const toastApp = require('./toast/webhook');
  app.use(toastApp);

  // ── HUNTER LAND CLEARING ROUTES ──────────────────────────────────────────
  const hunterApp       = require('./hunter/estimate');
  const hunterSocialApp = require('./hunter/social');
  app.use(hunterApp);
  app.use(hunterSocialApp);

  // ── SHAWN CABINETS ROUTES ─────────────────────────────────────────────────
  const cabinetsApp        = require('./cabinets/estimate');
  const cabinetsAnalyzeApp = require('./cabinets/analyze-plan');
  const cabinetsSocialApp  = require('./cabinets/social');
  app.use(cabinetsApp);
  app.use(cabinetsAnalyzeApp);
  app.use(cabinetsSocialApp);

  // ── WSTN APARTMENT LOCATING ROUTES ────────────────────────────────────────
  const wstnLeadApp    = require('./wstn/lead');
  const wstnSocialApp  = require('./wstn/social');
  app.use(wstnLeadApp);
  app.use(wstnSocialApp);

  // ── OUTBOUND EMAIL (contractor dashboards) ────────────────────────────────
  const sendEmailApp = require('./send-email');
  app.use(sendEmailApp);

  // ── FOOD ORDERING (Stripe) ───────────────────────────────────────────────
  const foodCheckoutApp = require('./food/checkout');
  const foodWebhookApp  = require('./food/webhook');
  app.use(foodWebhookApp);   // webhook FIRST — needs raw body before any json middleware
  app.use(foodCheckoutApp);

  // ── DEMO REQUEST ──────────────────────────────────────────────────────────
  const demoApp = require('./demo/request');
  app.use(demoApp);

  // ── AIAGENT SOCIAL POSTER ─────────────────────────────────────────────────
  const aiagentSocialApp = require('./aiagent/social');
  app.use(aiagentSocialApp);

  // ── SITE HEALTH CHECK ────────────────────────────────────────────────────
  app.get('/sites/health', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const checks = FOOD_TRUCK_SITES.map(async (site) => {
      const url        = `https://${site}.${DOMAIN}`;
      const controller = new AbortController();
      const timer      = setTimeout(() => controller.abort(), SITE_TIMEOUT_MS);
      const start      = Date.now();
      try {
        const response = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
          redirect: 'follow'
        });
        clearTimeout(timer);
        return {
          site,
          url,
          status: response.status,
          ok:     response.status >= 200 && response.status < 400,
          ms:     Date.now() - start
        };
      } catch (err) {
        clearTimeout(timer);
        return {
          site,
          url,
          status: null,
          ok:     false,
          ms:     Date.now() - start,
          error:  err.name === 'AbortError' ? 'timeout' : err.message
        };
      }
    });

    const results = await Promise.all(checks);
    const upCount = results.filter(r => r.ok).length;

    res.json({
      checked_at: new Date().toISOString(),
      summary:    { total: results.length, up: upCount, down: results.length - upCount },
      sites:      results
    });
  });

  // ── TOP-LEVEL HEALTH ──────────────────────────────────────────────────────
  app.get('/health', (req, res) => {
    res.json({
      status:    'ok',
      timestamp: new Date().toISOString(),
      routes: [
        'POST /twilio/sms',
        'POST /twilio/status',
        'POST /toast/webhook',
        'POST /hunter/estimate',
        'POST /hunter/social/caption',
        'POST /hunter/social/post',
        'POST /wstn/lead',
        'POST /wstn/social/caption',
        'POST /wstn/social/post',
        'POST /demo-request',
        'POST /aiagent/social/caption',
        'POST /aiagent/social/post',
        'GET  /twilio/health',
        'GET  /toast/health',
        'GET  /sites/health',
      ]
    });
  });

  // ── START ─────────────────────────────────────────────────────────────────
  app.listen(PORT, () => {
    console.log(`\n🚀 Webhook server running on port ${PORT}`);
    console.log(`   POST /twilio/sms             ← inbound SMS`);
    console.log(`   POST /toast/webhook          ← Toast events`);
    console.log(`   POST /hunter/estimate        ← Hunter leads`);
    console.log(`   POST /demo-request           ← aiagentassistance.com demo form`);
    console.log(`   POST /aiagent/social/caption ← AI Agent caption gen`);
    console.log(`   POST /aiagent/social/post    ← AI Agent social post`);
    console.log(`   GET  /health                 ← server status`);
    console.log(`   GET  /sites/health           ← ping all 15 food truck sites\n`);
  });

  return app;
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
