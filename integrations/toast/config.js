/**
 * Toast POS Integration — Configuration
 *
 * Fill in the values below once you have Toast API credentials.
 * Everything else in the integration reads from this file.
 *
 * Where to get these:
 *   1. Log into Toast Web → Integrations → API Access
 *   2. Create a new API client (or use existing)
 *   3. Copy Client ID, Client Secret, and Restaurant GUID
 */

// ── TOAST API CREDENTIALS ──────────────────────────────────────────────────
const TOAST_CLIENT_ID     = process.env.TOAST_CLIENT_ID;
const TOAST_CLIENT_SECRET = process.env.TOAST_CLIENT_SECRET;

// Restaurant GUID — found in Toast Web → Restaurants → select restaurant → URL bar
// Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
const TOAST_RESTAURANT_GUID = process.env.TOAST_RESTAURANT_GUID;

// ── ENVIRONMENT ────────────────────────────────────────────────────────────
// "sandbox" for testing, "production" for live
const TOAST_ENV = "sandbox";

const TOAST_BASE_URL = TOAST_ENV === "production"
  ? "https://ws-api.toasttab.com"
  : "https://ws-sandbox.toasttab.com";

// ── OUR APPSYNC BACKEND ────────────────────────────────────────────────────
const APPSYNC_URL = "https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY     = process.env.APPSYNC_API_KEY;

// ── SOURCE MAPPING ─────────────────────────────────────────────────────────
// Maps our DynamoDB source names to Toast restaurant GUIDs
// Add more restaurants here as they onboard Toast
const SOURCE_MAP = {
  "Restaurant":  TOAST_RESTAURANT_GUID,
  "FoodTruck":   TOAST_RESTAURANT_GUID, // same Toast account, different menu
  // "Bar1859":  "REPLACE_WITH_BAR_GUID",
};

module.exports = {
  TOAST_CLIENT_ID,
  TOAST_CLIENT_SECRET,
  TOAST_RESTAURANT_GUID,
  TOAST_ENV,
  TOAST_BASE_URL,
  APPSYNC_URL,
  API_KEY,
  SOURCE_MAP,
};
