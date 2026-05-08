/**
 * Twilio SMS Integration — Inbound Webhook
 *
 * Handles messages customers send TO (844) 321-4664.
 * Twilio forwards every inbound text to this endpoint.
 *
 * Set in Twilio Console:
 *   Phone Numbers → (844) 321-4664 → Messaging Configuration
 *   "A message comes in" → Webhook → https://YOUR_DOMAIN/twilio/sms
 *
 * Handles:
 *   STOP / STOPALL / UNSUBSCRIBE / CANCEL / END / QUIT
 *     → Twilio handles automatically, but we log it
 *   HELP / INFO
 *     → Send help message
 *   START / YES / SUBSCRIBE
 *     → Re-subscribe confirmation
 *   Anything else
 *     → Friendly "this is SMS-only" reply
 *
 * Run:
 *   node webhook.js
 */

const express  = require('express');
const crypto   = require('crypto');
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER,
  MESSAGES,
  RESTAURANT_PROFILES,
  APPSYNC_URL,
  API_KEY,
} = require('./config');

const app  = express();
const PORT = process.env.PORT || 3002;

app.set('trust proxy', 1); // Trust Render/proxy SSL termination
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ── TWILIO REQUEST VALIDATION ──────────────────────────────────────────────
/**
 * Validates that the incoming request is genuinely from Twilio.
 * https://www.twilio.com/docs/usage/webhooks/webhooks-security
 */
function validateTwilioRequest(req) {
  if (TWILIO_AUTH_TOKEN === "REPLACE_WITH_AUTH_TOKEN") {
    console.warn("⚠️  Skipping Twilio validation (not yet configured)");
    return true;
  }

  const twilioSignature = req.headers['x-twilio-signature'];
  if (!twilioSignature) return false;

  const host   = req.headers['x-forwarded-host'] || req.get('host');
  const proto  = req.headers['x-forwarded-proto'] || req.protocol;
  const url    = `${proto}://${host}${req.originalUrl}`;
  const params = req.body;

  // Sort params and build validation string
  const sortedKeys = Object.keys(params).sort();
  let validationStr = url;
  sortedKeys.forEach(key => { validationStr += key + params[key]; });

  const hmac      = crypto.createHmac('sha1', TWILIO_AUTH_TOKEN);
  const signature = hmac.update(validationStr).digest('base64');

  return signature === twilioSignature;
}

// ── TWIML RESPONSE BUILDER ─────────────────────────────────────────────────
function twimlReply(message) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${message}</Message>
</Response>`;
}

function twimlEmpty() {
  return `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
}

// ── APPSYNC LOG HELPER ─────────────────────────────────────────────────────
async function logOptOut(phone) {
  // Optional: record opt-outs in DynamoDB for your records
  // For now just console log — implement full storage as needed
  console.log(`📵 Opt-out recorded for ${phone}`);
}

// ── KEYWORD HANDLERS ───────────────────────────────────────────────────────
const STOP_KEYWORDS      = ['STOP','STOPALL','UNSUBSCRIBE','CANCEL','END','QUIT'];
const START_KEYWORDS     = ['START','YES','SUBSCRIBE','UNSTOP'];
const HELP_KEYWORDS      = ['HELP','INFO','?'];

function getDefaultProfile() {
  return RESTAURANT_PROFILES['Restaurant'] || {
    name:  "Más Chingón",
    phone: "(254) 248-0209"
  };
}

// ── INBOUND SMS ROUTE ──────────────────────────────────────────────────────
app.post('/twilio/sms', async (req, res) => {
  res.setHeader('Content-Type', 'text/xml');

  if (!validateTwilioRequest(req)) {
    console.error("❌ Invalid Twilio signature");
    return res.status(403).send(twimlEmpty());
  }

  const from    = req.body.From || '';
  const body    = (req.body.Body || '').trim().toUpperCase();
  const profile = getDefaultProfile();

  console.log(`\n📩 Inbound SMS from ${from}: "${req.body.Body}"`);

  // STOP — Twilio handles auto opt-out, we just log
  if (STOP_KEYWORDS.includes(body)) {
    await logOptOut(from);
    // Twilio sends its own STOP confirmation — return empty response
    return res.send(twimlEmpty());
  }

  // START / re-subscribe
  if (START_KEYWORDS.includes(body)) {
    console.log(`✅ Re-subscribe from ${from}`);
    return res.send(twimlReply(
      `Welcome back! You're signed up for order updates from ${profile.name}. Reply STOP anytime to unsubscribe.`
    ));
  }

  // HELP
  if (HELP_KEYWORDS.includes(body)) {
    const helpMsg = MESSAGES.HELP_REPLY(profile.name, profile.phone);
    return res.send(twimlReply(helpMsg));
  }

  // Anything else — friendly redirect
  return res.send(twimlReply(
    `Hi! This number sends order updates only — we can't receive messages here. ` +
    `To reach ${profile.name} call ${profile.phone}. Reply STOP to unsubscribe.`
  ));
});

// ── STATUS CALLBACK ROUTE ──────────────────────────────────────────────────
// Set in Twilio Console: Status Callback URL → https://YOUR_DOMAIN/twilio/status
app.post('/twilio/status', (req, res) => {
  const { MessageSid, MessageStatus, To, ErrorCode } = req.body;
  console.log(`📊 SMS Status: ${MessageSid} → ${MessageStatus} (to: ${To})`);
  if (ErrorCode) console.error(`   Error ${ErrorCode}`);
  res.sendStatus(200);
});

// ── HEALTH CHECK ───────────────────────────────────────────────────────────
app.get('/twilio/health', (req, res) => {
  res.json({
    status:      "ok",
    number:      TWILIO_FROM_NUMBER,
    configured:  TWILIO_ACCOUNT_SID !== "REPLACE_WITH_ACCOUNT_SID",
    timestamp:   new Date().toISOString()
  });
});

// ── START (only when run directly, not when required by server.js) ─────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n📱 Twilio webhook server running on port ${PORT}`);
    console.log(`   POST https://YOUR_DOMAIN/twilio/sms     ← inbound messages`);
    console.log(`   POST https://YOUR_DOMAIN/twilio/status  ← delivery receipts`);
    console.log(`   GET  https://YOUR_DOMAIN/twilio/health  ← health check\n`);
  });
}

module.exports = app;
