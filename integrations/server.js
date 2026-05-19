/**
 * Combined Webhook Server
 *
 * Mounts both Twilio and Toast webhook handlers on a single Express instance.
 * One server, one port, one deployment.
 *
 * Routes:
 *   POST /twilio/sms       ← Twilio inbound messages
 *   POST /twilio/status    ← Twilio delivery receipts
 *   GET  /twilio/health
 *
 *   POST /toast/webhook    ← Toast order/menu events
 *   GET  /toast/health
 *
 *   GET  /health           ← top-level health check
 *   GET  /sites/health     ← ping all 15 food truck sites, return real HTTP status codes
 */

const express = require('express');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── TWILIO ROUTES ──────────────────────────────────────────────────────────
const twilioApp = require('./twilio/webhook');
app.use(twilioApp);

// ── TOAST ROUTES ───────────────────────────────────────────────────────────
const toastApp = require('./toast/webhook');
app.use(toastApp);

// ── HUNTER LAND CLEARING ROUTES ────────────────────────────────────────────
const hunterApp = require('./hunter/estimate');
app.use(hunterApp);

// ── SHAWN CABINETS ROUTES ──────────────────────────────────────────────────
const cabinetsApp = require('./cabinets/estimate');
app.use(cabinetsApp);

// ── SITE HEALTH CHECK ─────────────────────────────────────────────────────
const FOOD_TRUCK_SITES = [
  'maschingonrestaurant', 'maschingonfoodtruck', 'bar1859', 'sylviastacos',
  'donjuliostacos', 'hechoenqueso', 'happypizza', 'sacredsandwich',
  'thatgreentrailer', 'bigtonys', 'potatowagon', 'ribtips',
  'simplyporkfection', 'bobbyque', 'sodafusion'
];
const DOMAIN = 'aiagentassistance.com';
const SITE_TIMEOUT_MS = 8000;

app.get('/sites/health', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const checks = FOOD_TRUCK_SITES.map(async (site) => {
    const url = `https://${site}.${DOMAIN}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SITE_TIMEOUT_MS);
    const start = Date.now();
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
        status:  response.status,
        ok:      response.status >= 200 && response.status < 400,
        ms:      Date.now() - start
      };
    } catch (err) {
      clearTimeout(timer);
      return {
        site,
        url,
        status:  null,
        ok:      false,
        ms:      Date.now() - start,
        error:   err.name === 'AbortError' ? 'timeout' : err.message
      };
    }
  });

  const results = await Promise.all(checks);
  const upCount = results.filter(r => r.ok).length;

  res.json({
    checked_at: new Date().toISOString(),
    summary: { total: results.length, up: upCount, down: results.length - upCount },
    sites: results
  });
});

// ── TOP-LEVEL HEALTH ───────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status:    "ok",
    timestamp: new Date().toISOString(),
    routes: [
      "POST /twilio/sms",
      "POST /twilio/status",
      "POST /toast/webhook",
      "POST /hunter/estimate",
      "GET  /twilio/health",
      "GET  /toast/health"
    ]
  });
});

// ── START ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Webhook server running on port ${PORT}`);
  console.log(`   POST /twilio/sms    ← inbound SMS`);
  console.log(`   POST /toast/webhook ← Toast events`);
  console.log(`   GET  /health        ← server status`);
  console.log(`   GET  /sites/health  ← ping all 15 food truck sites\n`);
});

module.exports = app;
