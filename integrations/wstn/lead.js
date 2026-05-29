/**
 * WSTN Apartment Locating — Lead Notification Handler
 *
 * POST /wstn/lead
 *
 * Fires an email + SMS to Westin when a new lead is submitted
 * from livewstn.myserviceflows.com (form or AI chat).
 */

const express  = require('express');
const router   = express.Router();
const twilio   = require('twilio');
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = require('../twilio/config');
const { resolveNotification } = require('../notify-mode');

const WESTIN_PHONE = process.env.WSTN_NOTIFY_PHONE || '+12103940238';
const NOTIFY_FROM  = process.env.WSTN_EMAIL_FROM   || 'WSTN Apartment Locating <notifications@myserviceflows.com>';
const NOTIFY_TO    = process.env.WSTN_NOTIFY_EMAIL || 'admin@aiagentassistance.com';
const DASH_URL     = 'https://livewstn.myserviceflows.com/dashboard.html';

const ses = new SESv2Client({ region: process.env.AWS_DEFAULT_REGION || 'us-east-1' });

router.use('/wstn', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

router.post('/wstn/lead', express.json(), async (req, res) => {
  const {
    name, phone, email, type,
    budget, beds, movedate, timeline, preapproved,
    area, notes, source,
    address, askingprice, condition,
  } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ error: 'Missing required fields: name, phone' });
  }

  const isSell    = type === 'sell';
  const isRent    = !isSell && type !== 'buy';
  const typeLabel = isSell ? 'Home Seller' : isRent ? 'Apartment Seeker' : 'Home Buyer';
  const emoji     = isSell ? '🏠' : isRent ? '🏢' : '🏡';
  const firstName = name.split(' ')[0];

  // ── SMS to Westin ──────────────────────────────────────────────────────────
  const smsBody = isSell
    ? `${emoji} NEW SELLER LEAD — WSTN\n\n` +
      `👤 ${name}\n` +
      `📞 ${phone}\n` +
      (email ? `📧 ${email}\n` : '') +
      `\n🏠 Address: ${address || 'not specified'}\n` +
      `💰 Est. Value: ${askingprice || 'not specified'}\n` +
      (timeline  ? `⏱  Timeline: ${timeline}\n`  : '') +
      (condition ? `🔧 Condition: ${condition}\n` : '') +
      (notes ? `\n💬 Notes: ${notes}\n` : '') +
      (source === 'chat' ? `\n📱 Via AI chat widget\n` : '') +
      `\nDashboard: ${DASH_URL}`
    : `${emoji} NEW LEAD — WSTN Apartment Locating\n\n` +
      `👤 ${name} (${typeLabel})\n` +
      `📞 ${phone}\n` +
      (email ? `📧 ${email}\n` : '') +
      `\n📍 Area: ${area || 'not specified'}\n` +
      `💰 Budget: ${budget || 'not specified'}\n` +
      (isRent && beds     ? `🛏  Beds: ${beds}\n`        : '') +
      (isRent && movedate ? `📅 Move: ${movedate}\n`     : '') +
      (!isRent && timeline    ? `⏱  Timeline: ${timeline}\n`        : '') +
      (!isRent && preapproved ? `🏦 Pre-approved: ${preapproved}\n` : '') +
      (notes ? `\n💬 Notes: ${notes}\n` : '') +
      (source === 'chat' ? `\n📱 Via AI chat widget\n` : '') +
      `\nDashboard: ${DASH_URL}`;

  // ── Email to Westin via SES ────────────────────────────────────────────────
  const rawSubject = isSell
    ? `${emoji} New Home Seller: ${name} — ${address || 'Texas'}`
    : `${emoji} New ${typeLabel}: ${name} — ${area || 'Texas'}`;

  const textBody = isSell ? [
    `New seller lead from WSTN website.`,
    `Source: ${source === 'chat' ? 'AI Chat Widget' : 'Contact Form'}`,
    '',
    'CONTACT',
    `  Name:  ${name}`,
    `  Phone: ${phone}`,
    `  Email: ${email || 'not provided'}`,
    '',
    'PROPERTY',
    `  Address:   ${address || 'not specified'}`,
    `  Est. Value: ${askingprice || 'not specified'}`,
    timeline  ? `  Timeline:  ${timeline}`  : '',
    condition ? `  Condition: ${condition}` : '',
    notes ? `\nNOTES\n  ${notes}` : '',
    '',
    `Open dashboard: ${DASH_URL}`,
  ].filter(l => l !== '').join('\n') : [
    `New lead from WSTN Apartment Locating website.`,
    `Source: ${source === 'chat' ? 'AI Chat Widget' : 'Contact Form'}`,
    '',
    'CONTACT',
    `  Name:  ${name}`,
    `  Phone: ${phone}`,
    `  Email: ${email || 'not provided'}`,
    '',
    'SEARCH',
    `  Type:   ${typeLabel}`,
    `  Area:   ${area || 'not specified'}`,
    `  Budget: ${budget || 'not specified'}`,
    isRent && beds     ? `  Beds:   ${beds}`        : '',
    isRent && movedate ? `  Move:   ${movedate}`    : '',
    !isRent && timeline    ? `  Timeline:    ${timeline}`    : '',
    !isRent && preapproved ? `  Pre-approved: ${preapproved}` : '',
    notes ? `\nNOTES\n  ${notes}` : '',
    '',
    `Open dashboard: ${DASH_URL}`,
  ].filter(l => l !== '').join('\n');

  const detailRows = isSell ? [
    ['Type',      typeLabel],
    ['Address',   address    || '—'],
    ['Est. Value', askingprice || '—'],
    ['Timeline',  timeline   || '—'],
    ['Condition', condition  || '—'],
  ] : [
    ['Type',   typeLabel],
    ['Area',   area   || '—'],
    ['Budget', budget || '—'],
    isRent ? ['Bedrooms', beds     || '—'] : null,
    isRent ? ['Move Date', movedate || '—'] : null,
    !isRent ? ['Timeline',    timeline    || '—'] : null,
    !isRent ? ['Pre-approved', preapproved || '—'] : null,
  ].filter(Boolean);

  const htmlBody = `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#222;">
  <div style="background:#0D1B2A;padding:20px 24px;border-radius:8px 8px 0 0;">
    <div style="margin-bottom:14px;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;color:#C8913A;letter-spacing:0.08em;line-height:1;">WSTN</div>
      <div style="font-size:9px;font-weight:500;color:rgba(255,255,255,0.45);letter-spacing:0.18em;text-transform:uppercase;margin-top:3px;">Apartment Locating</div>
    </div>
    <h2 style="color:#fff;margin:0;font-size:18px;font-weight:600;">${emoji} New ${typeLabel}</h2>
    <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:12px;">
      ${source === 'chat' ? 'via AI Chat' : 'via Contact Form'}
    </p>
  </div>
  <div style="background:#FDF8F3;padding:20px 24px;">
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      <tr><td colspan="2" style="background:#e8e2d8;padding:8px 12px;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">Contact</td></tr>
      <tr><td style="padding:8px 12px;width:100px;color:#666;">Name</td><td style="padding:8px 12px;font-weight:600;">${name}</td></tr>
      <tr style="background:#fff;"><td style="padding:8px 12px;color:#666;">Phone</td><td style="padding:8px 12px;"><a href="tel:${phone.replace(/\D/g,'')}" style="color:#C8913A;font-weight:700;">${phone}</a></td></tr>
      <tr><td style="padding:8px 12px;color:#666;">Email</td><td style="padding:8px 12px;">${email || '—'}</td></tr>
      <tr><td colspan="2" style="background:#e8e2d8;padding:8px 12px;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">Search Details</td></tr>
      ${detailRows.map(([k,v], i) =>
        `<tr${i % 2 === 0 ? ' style="background:#fff;"' : ''}><td style="padding:8px 12px;color:#666;">${k}</td><td style="padding:8px 12px;font-weight:500;">${v}</td></tr>`
      ).join('')}
      ${notes ? `<tr><td colspan="2" style="background:#e8e2d8;padding:8px 12px;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">Notes</td></tr><tr><td colspan="2" style="padding:10px 12px;font-style:italic;color:#555;">${notes}</td></tr>` : ''}
    </table>
    <a href="${DASH_URL}" style="display:inline-block;background:#C8913A;color:#000;padding:11px 24px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">
      Open Dashboard →
    </a>
    <p style="margin-top:16px;font-size:12px;color:#999;">
      Reply to ${firstName} directly: <a href="tel:${phone.replace(/\D/g,'')}" style="color:#C8913A;">${phone}</a>
    </p>
  </div>
</div>`;

  const { to: resolvedTo, subject, smsBody: resolvedSms, suppressSms } = resolveNotification({
    to:      NOTIFY_TO,
    subject: rawSubject,
    smsBody,
    siteEnv: process.env.WSTN_APP_ENV,
  });

  if (!suppressSms) {
    try {
      const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: resolvedSms,
        from: TWILIO_FROM_NUMBER,
        to:   WESTIN_PHONE,
      });
      console.log(`[wstn/lead] SMS sent to ${WESTIN_PHONE} — ${name}`);
    } catch (err) {
      console.warn('[wstn/lead] SMS failed:', err.message);
    }
  }

  try {
    await ses.send(new SendEmailCommand({
      FromEmailAddress: NOTIFY_FROM,
      Destination: { ToAddresses: [resolvedTo] },
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: { Text: { Data: textBody }, Html: { Data: htmlBody } },
        },
      },
    }));
    console.log(`[wstn/lead] Email sent to ${resolvedTo} — ${name} (${phone})`);
  } catch (err) {
    console.error('[wstn/lead] SES error:', err.message);
  }

  return res.json({ ok: true });
});

module.exports = router;
