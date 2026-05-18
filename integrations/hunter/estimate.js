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
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = require('../twilio/config');

const JASON_PHONE = process.env.HUNTER_NOTIFY_PHONE || '+18308327065';
const NOTIFY_FROM = process.env.HUNTER_EMAIL_FROM   || 'christopherhercules@outlook.com';
const NOTIFY_TO   = process.env.HUNTER_EMAIL_TO     || 'christopherhercules@outlook.com';
const DASH_URL    = 'https://hunter.aiagentassistance.com/dashboard.html';

const ses = new SESv2Client({ region: process.env.AWS_DEFAULT_REGION || 'us-east-1' });

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

  // ── EMAIL via SES (primary — always attempt) ──────────────────────────────
  const acresStr   = acres && parseFloat(acres) > 0 ? `${parseFloat(acres).toFixed(2)} acres` : 'unknown';
  const emailSubject = `New estimate: ${name} — ${address ? address.split(',')[0] : 'address unknown'}`;
  const emailText  = [
    'New estimate request from Hunter Land Clearing website.',
    '',
    'CONTACT',
    `  Name:  ${name}`,
    `  Phone: ${phone}`,
    `  Email: ${email || 'not provided'}`,
    '',
    'PROPERTY',
    `  Address: ${address || 'not provided'}`,
    `  Acres:   ${acresStr}`,
    `  Service: ${service}`,
    source ? `  Source:  ${source}` : '',
    notes  ? `  Notes:   ${notes}`  : '',
    '',
    `Open dashboard: ${DASH_URL}`,
  ].filter(s => s !== undefined).join('\n');

  const emailHtml = `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#222;">
  <h2 style="color:#b45309;margin-bottom:4px;">New Estimate Request</h2>
  <p style="color:#666;margin-top:0;font-size:13px;">Hunter Land Clearing — submitted via website</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr><td colspan="2" style="background:#f5f0e8;padding:8px 12px;font-weight:600;border-radius:4px 4px 0 0;">Contact</td></tr>
    <tr><td style="padding:8px 12px;width:80px;color:#666;">Name</td><td style="padding:8px 12px;font-weight:500;">${name}</td></tr>
    <tr style="background:#fafaf8;"><td style="padding:8px 12px;color:#666;">Phone</td><td style="padding:8px 12px;font-weight:500;">${phone}</td></tr>
    <tr><td style="padding:8px 12px;color:#666;">Email</td><td style="padding:8px 12px;">${email || '—'}</td></tr>
    <tr><td colspan="2" style="background:#f5f0e8;padding:8px 12px;font-weight:600;">Property</td></tr>
    <tr style="background:#fafaf8;"><td style="padding:8px 12px;color:#666;">Address</td><td style="padding:8px 12px;">${address || '—'}</td></tr>
    <tr><td style="padding:8px 12px;color:#666;">Acres</td><td style="padding:8px 12px;font-weight:500;">${acresStr}</td></tr>
    <tr style="background:#fafaf8;"><td style="padding:8px 12px;color:#666;">Service</td><td style="padding:8px 12px;">${service}</td></tr>
    ${notes ? `<tr><td style="padding:8px 12px;color:#666;">Notes</td><td style="padding:8px 12px;">${notes}</td></tr>` : ''}
  </table>
  <a href="${DASH_URL}" style="display:inline-block;background:#b45309;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">Open Dashboard</a>
</div>`;

  try {
    await ses.send(new SendEmailCommand({
      FromEmailAddress: NOTIFY_FROM,
      Destination: { ToAddresses: [NOTIFY_TO] },
      Content: {
        Simple: {
          Subject: { Data: emailSubject },
          Body: { Text: { Data: emailText }, Html: { Data: emailHtml } },
        },
      },
    }));
    console.log(`[hunter/estimate] Email sent to ${NOTIFY_TO} — from ${name} (${phone})`);
  } catch (emailErr) {
    console.error('[hunter/estimate] SES error:', emailErr.message);
  }

  // ── SMS via Twilio (secondary — best-effort, blocked until toll-free approved) ──
  try {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    const message = await client.messages.create({
      body: smsBody,
      from: TWILIO_FROM_NUMBER,
      to:   JASON_PHONE,
    });
    console.log(`[hunter/estimate] SMS sent to Jason — SID ${message.sid}`);
  } catch (smsErr) {
    console.warn('[hunter/estimate] SMS skipped (Twilio not yet approved):', smsErr.message);
  }

  return res.json({ ok: true });
});

module.exports = router;
