/**
 * Toast POS Integration — Authentication
 *
 * Handles OAuth token fetch and automatic refresh.
 * Toast tokens expire every 60 minutes — this module
 * caches the token and refreshes before it expires.
 *
 * Usage:
 *   const { getToken } = require('./auth');
 *   const token = await getToken();
 *   // use token in Authorization header
 */

const { TOAST_BASE_URL, TOAST_CLIENT_ID, TOAST_CLIENT_SECRET } = require('./config');

// ── TOKEN CACHE ────────────────────────────────────────────────────────────
let cachedToken     = null;
let tokenExpiresAt  = null;

/**
 * Fetch a fresh OAuth token from Toast.
 * Toast uses a custom auth body (not standard OAuth form encoding).
 */
async function fetchNewToken() {
  const res = await fetch(`${TOAST_BASE_URL}/authentication/v1/authentication/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientId:       TOAST_CLIENT_ID,
      clientSecret:   TOAST_CLIENT_SECRET,
      userAccessType: "TOAST_MACHINE_CLIENT"
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Toast auth failed (${res.status}): ${err}`);
  }

  const data = await res.json();

  // Toast returns token nested under data.token
  const token      = data.token?.accessToken;
  const expiresIn  = data.token?.expiresIn || 3600; // seconds, default 1hr

  if (!token) throw new Error("Toast auth response missing accessToken");

  // Cache token, refresh 2 minutes before expiry
  cachedToken    = token;
  tokenExpiresAt = Date.now() + (expiresIn - 120) * 1000;

  console.log(`✅ Toast token obtained. Expires in ${expiresIn}s`);
  return token;
}

/**
 * Get a valid token — returns cached if still valid, fetches new if expired.
 */
async function getToken() {
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }
  return fetchNewToken();
}

/**
 * Build standard headers for all Toast API requests.
 */
async function getHeaders(restaurantGuid) {
  const token = await getToken();
  return {
    "Authorization":                 `Bearer ${token}`,
    "Toast-Restaurant-External-ID":  restaurantGuid,
    "Content-Type":                  "application/json"
  };
}

module.exports = { getToken, getHeaders };
