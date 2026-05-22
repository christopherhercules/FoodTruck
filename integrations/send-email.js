/**
 * Generic outbound email sender
 *
 * POST /send-email
 * Body: { to, subject, body, from? }
 *
 * Used by contractor dashboards (Hunter, Cabinets) to send customer
 * notifications automatically via SES without opening an email client.
 */

const express = require('express');
const router  = express.Router();
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');

const DEFAULT_FROM = process.env.NOTIFY_FROM || 'noreply@myserviceflows.com';
const ses = new SESv2Client({ region: process.env.AWS_DEFAULT_REGION || 'us-east-1' });

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

router.post('/send-email', express.json(), async (req, res) => {
  const { to, subject, body, html: htmlOverride, from } = req.body || {};

  if (!to || !subject || (!body && !htmlOverride)) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, body or html' });
  }

  const fromAddress = from || DEFAULT_FROM;
  const plainText   = body || '';

  // Use caller-provided HTML if given, otherwise convert plain text
  const html = htmlOverride || `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#222;line-height:1.6;">
    ${plainText.replace(/\n/g, '<br>').replace(/={5,}/g, '<hr style="border:1px solid #ddd;margin:12px 0;">')}
  </div>`;

  try {
    await ses.send(new SendEmailCommand({
      FromEmailAddress: fromAddress,
      Destination: { ToAddresses: [to] },
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: { Text: { Data: plainText }, Html: { Data: html } },
        },
      },
    }));
    console.log(`[send-email] Sent to ${to} — "${subject}"`);
    return res.json({ ok: true });
  } catch (err) {
    console.error('[send-email] SES error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
