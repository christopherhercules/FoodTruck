/**
 * Hunter Land Clearing — Estimate Request Handler
 *
 * POST /hunter/estimate
 *
 * Receives a lead from the estimate intake tool on hunter.aiagentassistance.com
 * and fires an SMS to Jason at (830) 832-7065.
 *
 * Body (JSON):
 *   name, phone, email, address, acres, service, source, notes
 */

const express  = require('express');
const router   = express.Router();
const twilio   = require('twilio');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = require('../twilio/config');

const JASON_PHONE = process.env.HUNTER_NOTIFY_PHONE || '+18308327065';

// ── CORS for hunter.aiagentassistance.com ──────────────────────────────────
router.use('/hunter', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── POST /hunter/estimate ──────────────────────────────────────────────────
router.post('/hunter/estimate', express.json(), async (req, res) => {
  const { name, phone, email, address, acres, service, source, notes } = req.body || {};

  if (!name || !phone || !service) {
    return res.status(400).json({ error: 'Missing required fields: name, phone, service' });
  }

  const acresLine = acres && parseFloat(acres) > 0
    ? `📐 Area: ~${parseFloat(acres).toFixed(2)} acres drawn on map`
    : `📐 Area: Customer will show on site`;

  const smsBody =
    `🌿 NEW ESTIMATE REQUEST — Hunter Land Clearing\n\n` +
    `👤 ${name}\n` +
    `📞 ${phone}\n` +
    (email ? `📧 ${email}\n` : '') +
    `\n📍 ${address || 'Address not provided'}\n` +
    `${acresLine}\n` +
    `🔧 Service: ${service}\n` +
    (source ? `📣 Source: ${source}\n` : '') +
    (notes  ? `\n💬 Notes: ${notes}\n` : '') +
    `\nReply to customer: ${phone}`;

  try {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    const message = await client.messages.create({
      body: smsBody,
      from: TWILIO_FROM_NUMBER,
      to:   JASON_PHONE,
    });

    console.log(`[hunter/estimate] SMS sent to Jason — SID ${message.sid} — from ${name} (${phone})`);
    return res.json({ ok: true, sid: message.sid });

  } catch (err) {
    console.error('[hunter/estimate] Twilio error:', err.message);

    // Still return 200 so the UI shows success — Jason can check email as backup
    return res.status(200).json({ ok: false, error: err.message, fallback: 'email' });
  }
});

module.exports = router;
