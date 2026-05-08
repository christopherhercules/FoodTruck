/**
 * Twilio SMS Integration — Send Functions
 *
 * Core module for sending all outbound SMS messages.
 * Used by the staff dashboard status updates and Toast webhook.
 *
 * Usage:
 *   const sms = require('./sms');
 *   await sms.sendOrderReady(order);
 *   await sms.sendOptInConfirmation('+15125551234', 'Restaurant');
 *
 * Test from CLI:
 *   node sms.js --test +15125551234
 */

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER,
  MESSAGES,
  RESTAURANT_PROFILES,
} = require('./config');

// ── TWILIO CLIENT ──────────────────────────────────────────────────────────
// Using direct REST API (no SDK needed — keeps dependencies minimal)
const TWILIO_API = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

async function sendSMS(to, body) {
  if (TWILIO_ACCOUNT_SID === "REPLACE_WITH_ACCOUNT_SID") {
    console.log(`[SMS MOCK] To: ${to}`);
    console.log(`[SMS MOCK] Body: ${body}\n`);
    return { sid: "MOCK_SID", status: "mock" };
  }

  // Encode credentials for Basic Auth
  const credentials = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

  const params = new URLSearchParams({
    From: TWILIO_FROM_NUMBER,
    To:   to,
    Body: body,
  });

  const res = await fetch(TWILIO_API, {
    method:  "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type":  "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  const data = await res.json();

  if (!res.ok || data.status === 'failed') {
    throw new Error(`Twilio error ${data.code}: ${data.message}`);
  }

  console.log(`✅ SMS sent to ${to} [SID: ${data.sid}]`);
  return data;
}

// ── HELPERS ────────────────────────────────────────────────────────────────
function getProfile(source) {
  return RESTAURANT_PROFILES[source] || {
    name:    source,
    address: "See website for location",
    phone:   "N/A"
  };
}

function formatName(fullName) {
  return fullName?.split(' ')[0] || fullName || "there";
}

function formatPhone(phone) {
  if (!phone) return null;
  // Strip everything except digits
  const digits = phone.replace(/\D/g, '');
  // Add +1 if US number without country code
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

// ── SEND FUNCTIONS ─────────────────────────────────────────────────────────

/**
 * Sent when customer checks the SMS consent box and places order.
 */
async function sendOptInConfirmation(phoneRaw, source) {
  const phone   = formatPhone(phoneRaw);
  if (!phone) throw new Error("Invalid phone number");
  const profile = getProfile(source);
  const body    = MESSAGES.OPT_IN_CONFIRMATION(profile.name);
  return sendSMS(phone, body);
}

/**
 * Sent when staff clicks "Start Preparing".
 */
async function sendOrderPreparing(order) {
  if (!order.customerPhone || !order.smsConsent) return null;
  const phone   = formatPhone(order.customerPhone);
  if (!phone) return null;
  const profile = getProfile(order.source);
  const name    = formatName(order.customerName);
  const body    = MESSAGES.ORDER_PREPARING(name, order.orderId, profile.name);
  return sendSMS(phone, body);
}

/**
 * Sent when staff clicks "Mark Ready" — main notification customers wait for.
 */
async function sendOrderReady(order) {
  if (!order.customerPhone || !order.smsConsent) return null;
  const phone   = formatPhone(order.customerPhone);
  if (!phone) return null;
  const profile = getProfile(order.source);
  const name    = formatName(order.customerName);

  // Use ETA version if estimatedReadyTime was set
  let body;
  if (order.estimatedReadyTime) {
    const eta = new Date(order.estimatedReadyTime)
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    body = MESSAGES.ORDER_READY_ETA(name, order.orderId, profile.name, profile.address, eta);
  } else {
    body = MESSAGES.ORDER_READY(name, order.orderId, profile.name, profile.address);
  }

  return sendSMS(phone, body);
}

/**
 * Sent if an order is cancelled.
 */
async function sendOrderCancelled(order) {
  if (!order.customerPhone || !order.smsConsent) return null;
  const phone   = formatPhone(order.customerPhone);
  if (!phone) return null;
  const profile = getProfile(order.source);
  const name    = formatName(order.customerName);
  const body    = MESSAGES.ORDER_CANCELLED(name, order.orderId, profile.name);
  return sendSMS(phone, body);
}

// ── CLI TEST ───────────────────────────────────────────────────────────────
async function main() {
  const testPhone = process.argv.includes('--test')
    ? process.argv[process.argv.indexOf('--test') + 1]
    : null;

  if (!testPhone) {
    console.log("Usage: node sms.js --test +15125551234");
    process.exit(0);
  }

  console.log(`Sending test SMS to ${testPhone}...\n`);

  // Simulate a Ready notification
  await sendOrderReady({
    customerPhone:     testPhone,
    customerName:      "Test Customer",
    orderId:           "ORD-TEST123",
    source:            "Restaurant",
    smsConsent:        true,
    estimatedReadyTime: null
  });
}

if (require.main === module) {
  main().catch(err => {
    console.error("Error:", err.message);
    process.exit(1);
  });
}

module.exports = {
  sendSMS,
  sendOptInConfirmation,
  sendOrderPreparing,
  sendOrderReady,
  sendOrderCancelled,
};
