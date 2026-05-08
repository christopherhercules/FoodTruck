/**
 * Toast POS Integration — Webhook Handler
 *
 * Receives real-time events from Toast via HTTP POST.
 * Much faster than polling — Toast pushes updates instantly.
 *
 * Setup in Toast Web:
 *   Integrations → Webhooks → Add Endpoint
 *   URL: https://YOUR_DOMAIN/toast/webhook
 *   Events: ORDER_STATUS_CHANGED, MENU_PUBLISHED
 *
 * Run this server:
 *   node webhook.js
 *   (or deploy to AWS Lambda / EC2 / any Node host)
 *
 * Requires:
 *   npm install express
 */

const express    = require('express');
const crypto     = require('crypto');
const { APPSYNC_URL, API_KEY, TOAST_RESTAURANT_GUID } = require('./config');
const { syncStatuses } = require('./status-sync');

const app  = express();
const PORT = process.env.PORT || 3001;

// Toast webhook signing secret — set in Toast Web when you create the webhook
// Store this in an environment variable, never hardcode
const WEBHOOK_SECRET = process.env.TOAST_WEBHOOK_SECRET || "REPLACE_WITH_WEBHOOK_SECRET";

// ── MIDDLEWARE ─────────────────────────────────────────────────────────────
app.use(express.json());

// ── SIGNATURE VERIFICATION ─────────────────────────────────────────────────
/**
 * Toast signs webhook payloads with HMAC-SHA256.
 * Verify to ensure requests are actually from Toast.
 */
function verifyToastSignature(req) {
  const signature = req.headers['toast-signature'];
  if (!signature || WEBHOOK_SECRET === "REPLACE_WITH_WEBHOOK_SECRET") {
    // Skip verification in dev if secret not yet configured
    console.warn("⚠️  Skipping signature verification (secret not configured)");
    return true;
  }

  const hmac     = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest   = hmac.update(JSON.stringify(req.body)).digest('hex');
  const expected = `sha256=${digest}`;

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// ── APPSYNC HELPER ─────────────────────────────────────────────────────────
async function gql(query, variables = {}) {
  const res = await fetch(APPSYNC_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body:    JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

// ── STATUS MAP ─────────────────────────────────────────────────────────────
const STATUS_MAP = {
  "OPEN":            "Pending",
  "BEING_PROCESSED": "Preparing",
  "FULFILLED":       "Ready",
  "CLOSED":          "Completed",
  "VOIDED":          "Cancelled"
};

// ── EVENT HANDLERS ─────────────────────────────────────────────────────────

async function handleOrderStatusChanged(event) {
  const toastGuid   = event.order?.guid;
  const toastState  = event.order?.displayState;
  const externalId  = event.order?.externalId; // This is our orderId

  if (!externalId && !toastGuid) {
    console.log("  No externalId or guid in event, skipping");
    return;
  }

  const ourStatus = STATUS_MAP[toastState];
  if (!ourStatus) {
    console.log(`  Unknown Toast state: ${toastState}`);
    return;
  }

  // Find our order by orderId (externalId) or by stored Toast GUID
  const filter = externalId
    ? `{ orderId: { eq: "${externalId}" } }`
    : `{ specialInstructions: { beginsWith: "TOAST:${toastGuid}" } }`;

  const data = await gql(`
    query { listOrders(filter: ${filter}) { items { id orderId status customerPhone } } }
  `);

  const order = data.listOrders.items?.[0];
  if (!order) {
    console.log(`  Order not found for externalId: ${externalId}`);
    return;
  }

  if (order.status === ourStatus) {
    console.log(`  No change: ${order.orderId} already ${ourStatus}`);
    return;
  }

  await gql(`
    mutation UpdateOrder($input: UpdateOrderInput!) {
      updateOrder(input: $input) { id status }
    }
  `, { input: { id: order.id, status: ourStatus } });

  console.log(`  ✅ ${order.orderId}: ${order.status} → ${ourStatus}`);

  // Fire SMS on status change
  if (order.customerPhone) {
    const sms = require('../twilio/sms');
    if (ourStatus === 'Preparing') {
      await sms.sendOrderPreparing(order).catch(e => console.error('SMS error:', e.message));
    }
    if (ourStatus === 'Ready') {
      await sms.sendOrderReady(order).catch(e => console.error('SMS error:', e.message));
    }
    if (ourStatus === 'Cancelled') {
      await sms.sendOrderCancelled(order).catch(e => console.error('SMS error:', e.message));
    }
  }
}

async function handleMenuPublished(event) {
  // Toast published a menu update — re-sync our menu
  console.log("  Menu published in Toast — triggering menu sync...");
  const { execSync } = require('child_process');
  execSync('node menu-sync.js', { stdio: 'inherit', cwd: __dirname });
}

// ── WEBHOOK ROUTE ──────────────────────────────────────────────────────────
app.post('/toast/webhook', async (req, res) => {
  // Always respond 200 quickly — Toast will retry if we don't
  res.status(200).json({ received: true });

  if (!verifyToastSignature(req)) {
    console.error("❌ Invalid Toast webhook signature");
    return;
  }

  const { eventType, ...event } = req.body;
  console.log(`\n📨 Toast webhook: ${eventType}`);

  try {
    switch (eventType) {
      case 'ORDER_STATUS_CHANGED':
        await handleOrderStatusChanged(event);
        break;
      case 'MENU_PUBLISHED':
        await handleMenuPublished(event);
        break;
      default:
        console.log(`  Unhandled event type: ${eventType}`);
    }
  } catch (err) {
    console.error(`  Error handling ${eventType}:`, err.message);
  }
});

// ── HEALTH CHECK ───────────────────────────────────────────────────────────
app.get('/toast/health', (req, res) => {
  res.json({
    status:    "ok",
    timestamp: new Date().toISOString(),
    env:       process.env.NODE_ENV || 'development'
  });
});

// ── START (only when run directly, not when required by server.js) ─────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🔗 Toast webhook server running on port ${PORT}`);
    console.log(`   POST https://YOUR_DOMAIN/toast/webhook`);
    console.log(`   GET  https://YOUR_DOMAIN/toast/health\n`);
  });
}

module.exports = app;
