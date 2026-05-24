/**
 * Demo Request Handler
 *
 * POST /demo-request
 *
 * Receives a demo request from aiagentassistance.com homepage form
 * and fires an email via SES to the configured notification address.
 */

const express = require('express');
const router  = express.Router();
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');

const NOTIFY_FROM = process.env.DEMO_EMAIL_FROM || 'admin@aiagentassistance.com';
const NOTIFY_TO   = process.env.DEMO_EMAIL_TO   || 'chris@aiagentassistance.com';

const ses = new SESv2Client({ region: process.env.AWS_DEFAULT_REGION || 'us-east-1' });

router.use('/demo-request', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

router.post('/demo-request', express.json(), async (req, res) => {
  const { fname, lname, email, phone, btype, bname, msg } = req.body || {};

  if (!fname || !email || !bname) {
    return res.status(400).json({ error: 'Missing required fields: fname, email, bname' });
  }

  const name    = `${fname} ${lname || ''}`.trim();
  const subject = `Demo Request — ${bname} (${btype || 'Unknown'})`;

  const textBody = [
    'New demo request from aiagentassistance.com',
    '',
    `Name:          ${name}`,
    `Email:         ${email}`,
    `Phone:         ${phone || 'not provided'}`,
    `Business Type: ${btype || 'not specified'}`,
    `Business Name: ${bname}`,
    '',
    'Message:',
    msg || '(none)',
  ].join('\n');

  const htmlBody = `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b;">
  <h2 style="color:#1e40af;margin-bottom:4px;">New Demo Request</h2>
  <p style="color:#64748b;margin-top:0;font-size:13px;">Submitted via aiagentassistance.com</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
    <tr><td colspan="2" style="background:#eff6ff;padding:8px 12px;font-weight:700;color:#1e3a8a;border-radius:4px 4px 0 0;">Contact Info</td></tr>
    <tr><td style="padding:8px 12px;width:130px;color:#64748b;border-bottom:1px solid #f1f5f9;">Name</td><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #f1f5f9;">${name}</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:8px 12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;"><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td></tr>
    <tr><td style="padding:8px 12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Phone</td><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">${phone || '—'}</td></tr>
    <tr><td colspan="2" style="background:#eff6ff;padding:8px 12px;font-weight:700;color:#1e3a8a;">Business</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:8px 12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Type</td><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #f1f5f9;">${btype || '—'}</td></tr>
    <tr><td style="padding:8px 12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Name</td><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #f1f5f9;">${bname}</td></tr>
    ${msg ? `<tr style="background:#f8fafc;"><td style="padding:8px 12px;color:#64748b;vertical-align:top;">Message</td><td style="padding:8px 12px;">${msg.replace(/\n/g,'<br>')}</td></tr>` : ''}
  </table>
  <p style="font-size:12px;color:#94a3b8;margin-top:24px;">Reply directly to this email to respond to ${name}.</p>
</div>`;

  try {
    await ses.send(new SendEmailCommand({
      FromEmailAddress: NOTIFY_FROM,
      ReplyToAddresses: email ? [email] : undefined,
      Destination: { ToAddresses: [NOTIFY_TO] },
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: { Text: { Data: textBody }, Html: { Data: htmlBody } },
        },
      },
    }));
    console.log(`[demo/request] Email sent to ${NOTIFY_TO} — ${name} (${bname})`);
    return res.json({ ok: true });
  } catch (err) {
    console.error('[demo/request] SES error:', err.message);
    return res.status(500).json({ error: 'Failed to send notification email' });
  }
});

module.exports = router;
