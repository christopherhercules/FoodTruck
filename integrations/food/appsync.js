/**
 * Food vertical — AppSync helper
 *
 * Wraps createOrder / updateOrder mutations against the food backend.
 * URL is not a secret — just a regional endpoint.
 * API key comes from process.env.APPSYNC_API_KEY (loaded from SSM by secrets.js).
 */

const APPSYNC_URL = process.env.FOOD_APPSYNC_URL ||
  'https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql';

async function foodGql(query, variables = {}) {
  const apiKey = process.env.APPSYNC_API_KEY;
  if (!apiKey) throw new Error('APPSYNC_API_KEY not set');

  const res = await fetch(APPSYNC_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body:    JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map(e => e.message).join(', '));
  return json.data;
}

// ── MUTATIONS ────────────────────────────────────────────────────────────────

const CREATE_ORDER = `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id orderId status customerName customerPhone orderType tableNumber totalPrice timestamp
    }
  }
`;

const UPDATE_ORDER = `
  mutation UpdateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      id orderId status
    }
  }
`;

async function createOrder(data) {
  const result = await foodGql(CREATE_ORDER, { input: data });
  return result.createOrder;
}

async function updateOrderById(id, fields) {
  const result = await foodGql(UPDATE_ORDER, { input: { id, ...fields } });
  return result.updateOrder;
}

module.exports = { createOrder, updateOrderById };
