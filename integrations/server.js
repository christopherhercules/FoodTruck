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

// ── TOP-LEVEL HEALTH ───────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status:    "ok",
    timestamp: new Date().toISOString(),
    routes: [
      "POST /twilio/sms",
      "POST /twilio/status",
      "POST /toast/webhook",
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
  console.log(`   GET  /health        ← status check\n`);
});

module.exports = app;
