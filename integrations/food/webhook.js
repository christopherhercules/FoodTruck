/**
 * Food ordering — Stripe Webhook
 *
 * POST /food/webhook
 *
 * Handles Stripe events for the food ordering flow.
 *
 * Events handled:
 *   checkout.session.completed  → updates AppSync Order status: PendingPayment → Pending
 *
 * IMPORTANT: Stripe requires the raw (unparsed) request body for signature
 * verification. This route uses express.raw() — do NOT apply express.json() globally
 * before mounting this router.
 */

const express              = require('express');
const Stripe               = require('stripe');
const router               = express.Router();
const { updateOrderById }  = require('./appsync');

router.post(
  '/food/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const stripe  = Stripe(process.env.STRIPE_SECRET_KEY);
    const sig     = req.headers['stripe-signature'];
    const secret  = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
      console.error('[food/webhook] STRIPE_WEBHOOK_SECRET not set');
      return res.status(500).send('Webhook secret not configured');
    }

    // ── Verify Stripe signature ─────────────────────────────────────────────
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, secret);
    } catch (err) {
      console.error('[food/webhook] Signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`[food/webhook] ${event.type} — id: ${event.id}`);

    // ── Handle events ───────────────────────────────────────────────────────
    if (event.type === 'checkout.session.completed') {
      const session        = event.data.object;
      const appsyncOrderId = session.client_reference_id;
      const orderId        = session.metadata?.order_id;

      if (!appsyncOrderId) {
        console.warn('[food/webhook] No client_reference_id — cannot update AppSync order');
        return res.json({ received: true });
      }

      try {
        await updateOrderById(appsyncOrderId, { status: 'Pending' });
        console.log(`[food/webhook] Order ${orderId} (${appsyncOrderId}) confirmed — status → Pending`);
      } catch (err) {
        // Log but return 200 — Stripe retries on non-2xx and we don't want duplicates
        console.error(`[food/webhook] AppSync update failed for ${appsyncOrderId}:`, err.message);
      }
    }

    return res.json({ received: true });
  }
);

module.exports = router;
