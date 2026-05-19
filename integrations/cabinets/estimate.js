/**
 * Shawn Cabinets — Estimate Request Handler
 *
 * POST /cabinets/estimate
 *
 * Fires an email to Shawn when a new cabinet estimate is submitted.
 */

const express  = require('express');
const router   = express.Router();
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');

const NOTIFY_FROM = process.env.CABINETS_EMAIL_FROM || 'noreply@aiagentassistance.com';
const NOTIFY_TO   = process.env.CABINETS_EMAIL_TO   || 'christopherhercules@outlook.com';
const DASH_URL    = 'https://cabinets.myserviceflows.com/dashboard.html';

const ses = new SESv2Client({ region: process.env.AWS_DEFAULT_REGION || 'us-east-1' });

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

router.post('/cabinets/estimate', express.json(), async (req, res) => {
  const { name, phone, email, address, projectType, style, finish, budget, rooms, notes } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ error: 'Missing required fields: name, phone' });
  }

  const emailSubject = `New cabinet estimate: ${name} — ${address ? address.split(',')[0] : 'address unknown'}`;

  const emailText = [
    'New estimate request from Shawn Cabinets website.',
    '',
    'CONTACT',
    `  Name:  ${name}`,
    `  Phone: ${phone}`,
    `  Email: ${email || 'not provided'}`,
    '',
    'PROJECT',
    `  Address: ${address || 'not provided'}`,
    `  Type:    ${projectType || 'not provided'}`,
    `  Style:   ${style  || 'not provided'}`,
    `  Finish:  ${finish || 'not provided'}`,
    `  Budget:  ${budget || 'not provided'}`,
    notes ? `  Notes:   ${notes}` : '',
    '',
    `Open dashboard: ${DASH_URL}`,
  ].filter(s => s !== undefined).join('\n');

  const roomsHtml = (() => {
    try {
      const parsed = JSON.parse(rooms || '[]');
      if (!parsed.length) return '';
      return `
        <tr><td colspan="2" style="background:#f5f0e8;padding:8px 12px;font-weight:600;">Rooms</td></tr>
        ${parsed.map(r => `<tr><td style="padding:6px 12px;color:#666;">${r.room}</td><td style="padding:6px 12px;">${r.linearFt ? r.linearFt + ' LF' : ''}${r.notes ? (r.linearFt ? ' · ' : '') + r.notes : ''}</td></tr>`).join('')}`;
    } catch { return ''; }
  })();

  const emailHtml = `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#222;">
  <h2 style="color:#c4a35a;margin-bottom:4px;">New Cabinet Estimate Request</h2>
  <p style="color:#666;margin-top:0;font-size:13px;">Shawn Cabinets — submitted via website</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr><td colspan="2" style="background:#f5f0e8;padding:8px 12px;font-weight:600;border-radius:4px 4px 0 0;">Contact</td></tr>
    <tr><td style="padding:8px 12px;width:80px;color:#666;">Name</td><td style="padding:8px 12px;font-weight:500;">${name}</td></tr>
    <tr style="background:#fafaf8;"><td style="padding:8px 12px;color:#666;">Phone</td><td style="padding:8px 12px;font-weight:500;">${phone}</td></tr>
    <tr><td style="padding:8px 12px;color:#666;">Email</td><td style="padding:8px 12px;">${email || '—'}</td></tr>
    <tr><td colspan="2" style="background:#f5f0e8;padding:8px 12px;font-weight:600;">Project</td></tr>
    <tr style="background:#fafaf8;"><td style="padding:8px 12px;color:#666;">Address</td><td style="padding:8px 12px;">${address || '—'}</td></tr>
    <tr><td style="padding:8px 12px;color:#666;">Type</td><td style="padding:8px 12px;font-weight:500;">${projectType || '—'}</td></tr>
    <tr style="background:#fafaf8;"><td style="padding:8px 12px;color:#666;">Style</td><td style="padding:8px 12px;">${style || '—'}</td></tr>
    <tr><td style="padding:8px 12px;color:#666;">Finish</td><td style="padding:8px 12px;">${finish || '—'}</td></tr>
    <tr style="background:#fafaf8;"><td style="padding:8px 12px;color:#666;">Budget</td><td style="padding:8px 12px;">${budget || '—'}</td></tr>
    ${notes ? `<tr><td style="padding:8px 12px;color:#666;">Notes</td><td style="padding:8px 12px;">${notes}</td></tr>` : ''}
    ${roomsHtml}
  </table>
  <a href="${DASH_URL}" style="display:inline-block;background:#c4a35a;color:#000;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">Open Dashboard</a>
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
    console.log(`[cabinets/estimate] Email sent to ${NOTIFY_TO} — from ${name} (${phone})`);
  } catch (err) {
    console.error('[cabinets/estimate] SES error:', err.message);
  }

  return res.json({ ok: true });
});

module.exports = router;
