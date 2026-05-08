/**
 * Twilio SMS Integration — Configuration
 *
 * Fill in credentials once your toll-free number is verified.
 *
 * Where to get these:
 *   console.twilio.com → Account → API keys & tokens
 *   ACCOUNT_SID  → starts with "AC..."
 *   AUTH_TOKEN   → shown on dashboard home
 *   FROM_NUMBER  → (844) 321-4664 once verified
 */

// ── TWILIO CREDENTIALS ─────────────────────────────────────────────────────
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "REPLACE_WITH_ACCOUNT_SID";
const TWILIO_AUTH_TOKEN  = process.env.TWILIO_AUTH_TOKEN  || "REPLACE_WITH_AUTH_TOKEN";
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || "+18443214664";

// ── MESSAGE TEMPLATES ──────────────────────────────────────────────────────
// {name}        → customer first name
// {orderId}     → order number e.g. ORD-1234567890
// {restaurant}  → business name
// {address}     → pickup address
// {eta}         → estimated ready time e.g. "5:30 PM"

const MESSAGES = {

  // Sent immediately when customer opts in (checks the consent box)
  OPT_IN_CONFIRMATION: (restaurant) =>
    `You're signed up for order updates from ${restaurant}! We'll text you when your order is ready. Reply STOP to unsubscribe, HELP for help.`,

  // Sent when staff hits "Start Preparing"
  ORDER_PREPARING: (name, orderId, restaurant) =>
    `👨‍🍳 Hey ${name}! Your order at ${restaurant} is being prepared. We'll text you the moment it's ready! Order #${orderId}`,

  // Sent when staff hits "Mark Ready"
  ORDER_READY: (name, orderId, restaurant, address) =>
    `🔔 ${name}, your order is READY for pickup at ${restaurant}! Order #${orderId}. 📍 ${address} Reply STOP to opt out.`,

  // Sent when order is marked Ready with an ETA
  ORDER_READY_ETA: (name, orderId, restaurant, address, eta) =>
    `🔔 ${name}, your order is READY at ${restaurant}! Order #${orderId} — pick up by ${eta}. 📍 ${address} Reply STOP to opt out.`,

  // Sent if order is cancelled
  ORDER_CANCELLED: (name, orderId, restaurant) =>
    `We're sorry ${name}, your order #${orderId} at ${restaurant} was cancelled. Please contact us if you have questions.`,

  // Reply to HELP keyword
  HELP_REPLY: (restaurant, phone) =>
    `${restaurant} Order Alerts: Text STOP to unsubscribe. For support call ${phone}. Msg & data rates may apply.`,
};

// ── RESTAURANT PROFILES ────────────────────────────────────────────────────
// Maps our DynamoDB source names to display info for SMS messages
const RESTAURANT_PROFILES = {
  "Restaurant": {
    name:    "Más Chingón Mexican Grill",
    address: "1105 W Village Rd, Salado TX",
    phone:   "(254) 248-0209"
  },
  "FoodTruck": {
    name:    "Más Chingón Food Truck",
    address: "Check our website for today's location",
    phone:   "(254) 248-0209"
  },
  "Bar1859": {
    name:    "Bar 1859",
    address: "21 N. Main St., Salado TX",
    phone:   "(254) 721-5510"
  },
  // Add the 12 Salado trucks here as they onboard:
  // "SylviasTacos": { name: "Sylvia's Tacos", address: "...", phone: "..." },
};

// ── OUR APPSYNC BACKEND ────────────────────────────────────────────────────
const APPSYNC_URL = "https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY     = "da2-6l2dtmahczbbnlp3m2vmgihqby";

module.exports = {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER,
  MESSAGES,
  RESTAURANT_PROFILES,
  APPSYNC_URL,
  API_KEY,
};
