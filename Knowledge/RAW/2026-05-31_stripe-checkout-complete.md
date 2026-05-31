# Session Report — Stripe Checkout End-to-End Verified
**Date:** 2026-05-31

## What Was Accomplished

Full Stripe checkout flow verified and working end-to-end for Mas Chingon Restaurant.

### Bugs Found and Fixed

1. **Raw body ordering** (`integrations/server.js`)
   - `twilio/webhook.js` calls `app.use(express.json())` globally on its sub-app, which was parsing every request body before the Stripe webhook handler could read the raw bytes Stripe requires for signature verification.
   - Fix: moved `foodWebhookApp` mount to the very top of `server.js`, before Twilio and Toast routers.

2. **CORS missing on `/food/checkout`** (`integrations/food/checkout.js`)
   - Browser was blocking the cross-origin POST from `maschingonrestaurant.aiagentassistance.com` to `foodtruck-cymz.onrender.com` with "Failed to fetch".
   - Fix: added `Access-Control-Allow-Origin: *` headers + OPTIONS preflight handler.

3. **Wrong webhook signing secret in Render**
   - The `mas-chingon-food-webhook` created in the Stripe Workbench (live mode context) was never the one actually firing — Stripe was using `sophisticated-spark`, a test-mode webhook that was auto-created earlier.
   - Fix: retrieved the signing secret from `sophisticated-spark` and updated `STRIPE_WEBHOOK_SECRET` in Render env vars.

4. **`[object Object]` in meat options modal** (`Food/MasChingonRestaurant/website/order.html`)
   - The Toast seed script (`scripts/seed-menu-maschingon.js`) stores `customizationOptions` as grouped objects `[{ name, required, options: [...] }]`, but the older `populate-restaurant-menu.js` uses flat string arrays.
   - The modal renderer assumed flat strings only.
   - Fix: detect format and flatten grouped objects before rendering radio buttons.

### Stripe Configuration (Test Mode)

| Item | Value |
|---|---|
| Active webhook | `sophisticated-spark` (test mode) |
| Webhook URL | `https://foodtruck-cymz.onrender.com/food/webhook` |
| Event | `checkout.session.completed` |
| Secret env var | `STRIPE_WEBHOOK_SECRET` in Render (NOT SSM — Render env takes precedence) |
| SSM param | `/foodtruck/stripe/webhook_secret` (exists but overridden by Render env var) |
| Stripe secret key | `STRIPE_SECRET_KEY` in Render + SSM `/foodtruck/stripe/secret_key` |
| Test card | `4242 4242 4242 4242`, any future expiry, any CVC |

### Preview Gate

CloudFront Function intercepts all pages and serves a gate page.
- Access code: `demo2026`
- Sets cookie: `ft_demo=ok_ft_2026` (7-day expiry)
- Must be removed before going live with real customers.

### Order Flow (Confirmed Working)

1. Customer adds items to cart on `order.html`
2. Fills name + order type → clicks Proceed to Payment
3. `placeOrder()` POSTs to `https://foodtruck-cymz.onrender.com/food/checkout`
4. Server creates AppSync Order with status `PendingPayment`
5. Server creates Stripe Checkout Session → returns `{ url, sessionId, orderId }`
6. Browser redirects to `checkout.stripe.com`
7. Customer pays with card
8. Stripe fires `checkout.session.completed` to `/food/webhook`
9. Webhook verifies signature, updates AppSync Order status → `Pending`
10. Customer is redirected to `order.html?success=true&orderId=ORD-...` → "ORDER PLACED!" screen

### Architecture Notes

- **Merchant of record model**: Stripe payments go to AI Agent Assistance account. Restaurant gets paid via weekly/periodic payout minus platform fee. Standard model used by Uber Eats, Chownow, etc.
- **One Stripe account for all restaurants**: `restaurantId` in `session.metadata` routes events to the right restaurant inside the webhook handler. No separate accounts needed until Stripe Connect.
- **Menu source**: DynamoDB via AppSync — not Stripe, not static. Populated from Toast seed script. Can be synced from any POS with an API (Square, Clover, Toast) or managed directly.
- **Toast integration**: Blocked on credentials (`/foodtruck/toast/client_id`, `client_secret`, `restaurant_guid` not yet in SSM). Once restaurant authorizes API access, menu auto-syncs from Toast.

### Commits This Session

| Commit | Description |
|---|---|
| `91c96a4` | fix: mount food webhook before Twilio/Toast to preserve raw body |
| `6b34ac3` | fix: add CORS headers to /food/checkout |
| `fdff115` | fix: render meat options correctly for both flat and grouped formats |

### Pending / Next Steps

- [ ] Remove preview gate (`demo2026`) before going live
- [ ] Switch Stripe from test keys to live keys when ready for real payments
- [ ] Delete or rename `mas-chingon-food-webhook` (live mode Workbench) — it's not used
- [ ] Add payout summary tab to staff dashboard (builds restaurant trust)
- [ ] Toast API credentials from restaurant owner → enable menu auto-sync
- [ ] Stripe Connect (long term) — gives each restaurant their own transaction view
