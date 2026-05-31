/**
 * Food ordering — Stripe Checkout
 *
 * POST /food/checkout
 *
 * Body (JSON):
 *   restaurantId       string   e.g. "maschingonrestaurant"
 *   restaurantName     string   e.g. "Mas Chingon Mexican Grill"
 *   orderType          string   "Dine-In" | "Pickup" | "Delivery"
 *   tableNumber        string?
 *   customerName       string
 *   customerPhone      string?
 *   specialInstructions string?
 *   smsConsent         boolean?
 *   items              Array<{ itemId, name, price, quantity, customizations? }>
 *
 * Response: { url, sessionId, orderId }
 *   Caller should redirect window.location.href = url
 */

const express             = require('express');
const Stripe              = require('stripe');
const router              = express.Router();
const { createOrder }     = require('./appsync');

const BASE_DOMAIN = process.env.FOOD_BASE_DOMAIN || 'aiagentassistance.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

router.options('/food/checkout', (req, res) => res.set(CORS_HEADERS).sendStatus(204));

router.post('/food/checkout', express.json(), async (req, res) => {
  res.set(CORS_HEADERS);
  const {
    restaurantId        = 'maschingonrestaurant',
    restaurantName      = 'Mas Chingon Mexican Grill',
    orderType,
    tableNumber,
    customerName,
    customerPhone,
    specialInstructions,
    smsConsent          = false,
    items               = [],
  } = req.body || {};

  if (!customerName || !orderType) {
    return res.status(400).json({ error: 'Missing required fields: customerName, orderType' });
  }
  if (!items.length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const stripe     = Stripe(process.env.STRIPE_SECRET_KEY);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const orderId    = `ORD-${Date.now()}`;

  // ── Step 1: Create AppSync Order (status: PendingPayment) ─────────────────
  let appsyncOrder;
  try {
    appsyncOrder = await createOrder({
      orderId,
      customerName,
      customerPhone:       customerPhone  || null,
      orderType,
      tableNumber:         tableNumber    || null,
      items:               JSON.stringify(items),
      totalPrice,
      specialInstructions: specialInstructions || null,
      status:              'PendingPayment',
      source:              restaurantId,
      smsConsent,
      timestamp:           new Date().toISOString(),
    });
    console.log(`[food/checkout] AppSync order created: ${appsyncOrder.id} (${orderId})`);
  } catch (err) {
    console.error('[food/checkout] AppSync createOrder failed:', err.message);
    return res.status(500).json({ error: 'Failed to create order record' });
  }

  // ── Step 2: Create Stripe Checkout Session ────────────────────────────────
  const successUrl = `https://${restaurantId}.${BASE_DOMAIN}/order.html?success=true&orderId=${orderId}`;
  const cancelUrl  = `https://${restaurantId}.${BASE_DOMAIN}/order.html?cancelled=true`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode:                 'payment',
      client_reference_id:  appsyncOrder.id,   // AppSync DynamoDB ID — used by webhook
      line_items: items.map(item => ({
        price_data: {
          currency:     'usd',
          unit_amount:  Math.round(item.price * 100),  // cents
          product_data: {
            name:        item.name,
            description: item.customizations || undefined,
          },
        },
        quantity: item.quantity,
      })),
      metadata: {
        restaurant_id:   restaurantId,
        restaurant_name: restaurantName,
        order_type:      orderType,
        table_number:    tableNumber    || '',
        customer_phone:  customerPhone  || '',
        order_id:        orderId,
      },
      success_url: successUrl,
      cancel_url:  cancelUrl,
    });

    console.log(`[food/checkout] Stripe session ${session.id} → order ${orderId}`);
    return res.json({ url: session.url, sessionId: session.id, orderId });

  } catch (err) {
    console.error('[food/checkout] Stripe session creation failed:', err.message);
    return res.status(500).json({ error: 'Failed to create payment session' });
  }
});

module.exports = router;
