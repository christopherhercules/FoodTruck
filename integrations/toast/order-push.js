/**
 * Toast POS Integration — Order Push
 *
 * Pushes a new order from our DynamoDB into Toast POS so kitchen
 * staff see it on their Toast KDS (Kitchen Display System).
 *
 * Called automatically when an order is placed, or manually:
 *   node order-push.js --orderId ORD-1234567890
 *
 * Toast Order structure requires:
 *   - entityType: "Order"
 *   - checks[]: at least one check with selections[]
 *   - Each selection maps to a Toast menu item GUID
 */

const { TOAST_BASE_URL, TOAST_RESTAURANT_GUID, APPSYNC_URL, API_KEY } = require('./config');
const { getHeaders } = require('./auth');

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

async function getOrder(orderId) {
  const data = await gql(`
    query {
      listOrders(filter: { orderId: { eq: "${orderId}" } }) {
        items {
          id orderId customerName customerPhone orderType
          tableNumber items totalPrice specialInstructions
          status source timestamp
        }
      }
    }
  `);
  return data.listOrders.items?.[0] || null;
}

async function getMenuItemGuids(itemIds) {
  // Fetch Toast GUIDs we stored during menu sync
  // itemId format: "XX-TOAST-XXXXXXXX" — extract the Toast GUID portion
  const guidMap = {};
  for (const itemId of itemIds) {
    const parts = itemId.split('-TOAST-');
    if (parts[1]) {
      // We stored abbreviated GUIDs — in production you'd store full GUIDs
      // For now return the abbreviated form; replace with full GUID lookup
      guidMap[itemId] = parts[1];
    }
  }
  return guidMap;
}

async function updateOrderToastId(id, toastOrderGuid) {
  // Store Toast order GUID in specialInstructions for now
  // Ideally add a toastOrderGuid field to the DynamoDB schema
  await gql(`
    mutation UpdateOrder($input: UpdateOrderInput!) {
      updateOrder(input: $input) { id }
    }
  `, { input: { id, specialInstructions: `TOAST:${toastOrderGuid}` } });
}

// ── MAP OUR ORDER → TOAST FORMAT ───────────────────────────────────────────

/**
 * Toast Order payload structure:
 * {
 *   entityType: "Order",
 *   externalId: "our-order-id",
 *   source: "ONLINE",
 *   checks: [{
 *     entityType: "Check",
 *     selections: [{
 *       entityType: "MenuItemSelection",
 *       item: { entityType: "MenuItem", multiLocationId: "guid" },
 *       quantity: 1,
 *       modifiers: []
 *     }]
 *   }],
 *   table: { entityType: "Table", externalId: "table-id" }  // dine-in only
 * }
 */
function buildToastOrder(order) {
  let cartItems = [];
  try {
    cartItems = JSON.parse(order.items || '[]');
  } catch (e) {
    throw new Error(`Could not parse order items: ${e.message}`);
  }

  const selections = cartItems.map(item => {
    // Extract Toast GUID from our itemId (format: XX-TOAST-XXXXXXXX)
    const toastGuidPart = item.itemId?.split('-TOAST-')[1];

    const selection = {
      entityType: "MenuItemSelection",
      item: {
        entityType:        "MenuItem",
        multiLocationId:   toastGuidPart || item.itemId  // fallback to our id
      },
      quantity: 1,
      modifiers: []
    };

    // Map customization to Toast modifier if present
    if (item.customization) {
      selection.modifiers.push({
        entityType: "MenuItemSelectionModifier",
        modifier:   { entityType: "MenuItemModifier", name: item.customization }
      });
    }

    return selection;
  });

  const toastOrder = {
    entityType:  "Order",
    externalId:  order.orderId,
    source:      "ONLINE",
    checks: [{
      entityType:  "Check",
      displayNumber: order.orderId,
      selections
    }]
  };

  // Add table for dine-in orders
  if (order.orderType === 'Dine-In' && order.tableNumber) {
    toastOrder.table = {
      entityType: "Table",
      externalId: String(order.tableNumber)
    };
  }

  // Add special instructions as a note
  if (order.specialInstructions) {
    toastOrder.checks[0].appliedServiceCharges = [];
    toastOrder.checks[0].customerNote = order.specialInstructions;
  }

  return toastOrder;
}

// ── PUSH TO TOAST ──────────────────────────────────────────────────────────
async function pushOrderToToast(order) {
  const headers    = await getHeaders(TOAST_RESTAURANT_GUID);
  const toastOrder = buildToastOrder(order);

  console.log(`📤 Pushing order ${order.orderId} to Toast...`);

  const res = await fetch(`${TOAST_BASE_URL}/orders/v2/orders`, {
    method:  "POST",
    headers,
    body:    JSON.stringify(toastOrder)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Toast order push failed (${res.status}): ${err}`);
  }

  const result = await res.json();
  const toastOrderGuid = result.guid;

  console.log(`✅ Order pushed to Toast. Toast GUID: ${toastOrderGuid}`);

  // Store Toast GUID back in our system
  await updateOrderToastId(order.id, toastOrderGuid);

  return toastOrderGuid;
}

// ── MAIN (CLI usage) ───────────────────────────────────────────────────────
async function main() {
  const orderIdArg = process.argv.includes('--orderId')
    ? process.argv[process.argv.indexOf('--orderId') + 1]
    : null;

  if (!orderIdArg) {
    console.error('Usage: node order-push.js --orderId ORD-1234567890');
    process.exit(1);
  }

  const order = await getOrder(orderIdArg);
  if (!order) {
    console.error(`Order not found: ${orderIdArg}`);
    process.exit(1);
  }

  await pushOrderToToast(order);
}

// Run if called directly
if (require.main === module) {
  main().catch(err => {
    console.error("Fatal:", err.message);
    process.exit(1);
  });
}

module.exports = { pushOrderToToast };
