/**
 * Toast POS Integration — Status Sync
 *
 * Polls Toast for order status updates and syncs them back to our DynamoDB.
 * Bridges the gap between Toast KDS and our customer-facing tracker.
 *
 * Toast order states → our status mapping:
 *   OPEN       → Pending
 *   NEEDS_APPROVAL → Pending
 *   BEING_PROCESSED → Preparing
 *   CLOSED     → Completed
 *   VOIDED     → Cancelled
 *
 * Usage:
 *   node status-sync.js            ← poll once
 *   node status-sync.js --watch    ← poll every 30 seconds
 */

const { TOAST_BASE_URL, TOAST_RESTAURANT_GUID, APPSYNC_URL, API_KEY } = require('./config');
const { getHeaders } = require('./auth');

const POLL_INTERVAL_MS = 30000; // 30 seconds

// ── TOAST STATUS → OUR STATUS MAP ─────────────────────────────────────────
const STATUS_MAP = {
  "OPEN":              "Pending",
  "NEEDS_APPROVAL":    "Pending",
  "BEING_PROCESSED":   "Preparing",
  "FULFILLED":         "Ready",
  "CLOSED":            "Completed",
  "VOIDED":            "Cancelled"
};

// ── APPSYNC HELPERS ────────────────────────────────────────────────────────
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

// Get all active (non-completed) orders that have a Toast GUID
async function getActiveOrdersWithToastId() {
  const data = await gql(`
    query {
      listOrders(limit: 100, filter: {
        and: [
          { status: { ne: "Completed" } },
          { status: { ne: "Cancelled" } },
          { specialInstructions: { beginsWith: "TOAST:" } }
        ]
      }) {
        items { id orderId status specialInstructions customerPhone source }
      }
    }
  `);
  return data.listOrders.items || [];
}

async function updateOrderStatus(id, status) {
  await gql(`
    mutation UpdateOrder($input: UpdateOrderInput!) {
      updateOrder(input: $input) { id status }
    }
  `, { input: { id, status } });
}

// ── FETCH ORDER STATUS FROM TOAST ──────────────────────────────────────────
async function getToastOrderStatus(toastOrderGuid) {
  const headers = await getHeaders(TOAST_RESTAURANT_GUID);

  const res = await fetch(
    `${TOAST_BASE_URL}/orders/v2/orders/${toastOrderGuid}`,
    { headers }
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Toast order fetch failed (${res.status})`);

  const order = await res.json();
  return order.displayState || order.voided ? "VOIDED" : order.displayState;
}

// ── MAIN SYNC LOOP ─────────────────────────────────────────────────────────
async function syncStatuses() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] Checking Toast order statuses...`);

  const orders = await getActiveOrdersWithToastId();

  if (!orders.length) {
    console.log("  No active orders with Toast IDs.");
    return;
  }

  let synced = 0;

  for (const order of orders) {
    // Extract Toast GUID from specialInstructions ("TOAST:xxxxxxxx-xxxx-...")
    const toastGuid = order.specialInstructions?.replace('TOAST:', '');
    if (!toastGuid) continue;

    try {
      const toastState   = await getToastOrderStatus(toastGuid);
      const mappedStatus = STATUS_MAP[toastState];

      if (!mappedStatus) {
        console.log(`  ⚠️  ${order.orderId}: unknown Toast state "${toastState}"`);
        continue;
      }

      if (mappedStatus !== order.status) {
        await updateOrderStatus(order.id, mappedStatus);
        console.log(`  🔄 ${order.orderId}: ${order.status} → ${mappedStatus}`);
        synced++;

        // Fire SMS notifications on status change
        if (order.customerPhone) {
          const sms = require('../twilio/sms');
          if (mappedStatus === 'Preparing') {
            await sms.sendOrderPreparing(order).catch(e => console.error('SMS error:', e.message));
          }
          if (mappedStatus === 'Ready') {
            await sms.sendOrderReady(order).catch(e => console.error('SMS error:', e.message));
          }
          if (mappedStatus === 'Cancelled') {
            await sms.sendOrderCancelled(order).catch(e => console.error('SMS error:', e.message));
          }
        }
      } else {
        console.log(`  ✓  ${order.orderId}: still ${order.status}`);
      }
    } catch (err) {
      console.error(`  ❌ ${order.orderId}: ${err.message}`);
    }
  }

  console.log(`  Synced ${synced} status change(s).`);
}

// ── ENTRY POINT ────────────────────────────────────────────────────────────
async function main() {
  const watch = process.argv.includes('--watch');

  await syncStatuses();

  if (watch) {
    console.log(`\n👀 Watching for status changes every ${POLL_INTERVAL_MS / 1000}s... (Ctrl+C to stop)\n`);
    setInterval(syncStatuses, POLL_INTERVAL_MS);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error("Fatal:", err.message);
    process.exit(1);
  });
}

module.exports = { syncStatuses };
