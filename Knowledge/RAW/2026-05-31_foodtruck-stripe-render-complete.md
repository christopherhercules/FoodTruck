---
source: claude-code-session
captured: 2026-05-31
topic_hint: food-truck, stripe, render, gitlab, staff-dashboard, demo-prep
status: unprocessed
---

# Session Report — Food Truck Stripe Complete + Render Migration

**Date:** 2026-05-31

## What Was Accomplished

### 1. Mas Chingon Food Truck — Restaurant Parity

Full Stripe checkout flow built and verified end-to-end for the food truck.

**Menu seeded:**
- 23 items in AppSync using prefix `ITEM-FT-` (keeps food truck separate from restaurant `ITEM-` items)
- Script: `Food/platform-backend/scripts/seed-menu-foodtruck.js`
- Categories: Breakfast (5), Main (6), Antojitos (3), Specialty (5), Drinks (4)

**order.html updated:**
- Replaced direct AppSync mutation with Stripe checkout POST to `/food/checkout`
- `restaurantId: 'maschingonfoodtruck'` — routes correctly in webhook
- Upgraded customization UI from inline dropdown → modal (matches restaurant UX)
- Added `handleStripeReturn()` for post-payment confirmation screen
- Menu filter: `beginsWith: "ITEM-FT-"` — food truck items only
- Button: "Proceed to Payment" (was "Place Pickup Order")

**staff-dashboard.html fixed:**
- Was filtering `source: { eq: "FoodTruck" }` — missed new Stripe orders tagged `maschingonfoodtruck`
- Fixed to `or: [ FoodTruck, maschingonfoodtruck ]` — catches both old and new

**Verified end-to-end:**
- Order created in AppSync as `PendingPayment`
- Stripe checkout completed with test card `4242 4242 4242 4242`
- Webhook fired → status updated to `Pending`
- AppSync record: `ORD-1780238834923`, Chris, $13.54, `source: maschingonfoodtruck`

### 2. Render → GitLab Migration

- Render was connected to GitHub (`christopherhercules/FoodTruck`)
- Switched to GitLab (`aiagentassistance/FoodTruck`, master branch)
- Test deploy successful
- Single `git push origin master` now deploys to Render — no more dual-push required
- GitHub remote kept as mirror only

### Demo Prep Notes

- Staff password: see credentials.md
- Access code: see credentials.md
- Test card: Stripe test card (4242...)
- **Render cold start warning:** Free tier spins down on inactivity — first hit after idle takes 50-60s. Wake it up 5 min before demo by hitting the order page yourself.

### Commits This Session

| Commit | Description |
|---|---|
| `95a2e08` | feat: food truck Stripe checkout + menu seed |
| `86dec6f` | fix: staff dashboard source filter |
| `bf5bfc6` | docs: CLAUDE.md - Render on GitLab confirmed |

---

## Next Session Priorities

### 1. Staff Dashboard Overhaul — All 3 Food Sites (HIGH)

Current "mark ready / complete" flow is confusing for staff. Needs a full UX rethink.

**Problems:**
- Status transitions unclear (Pending → Preparing → Ready → Completed)
- Actions not obvious for non-technical staff
- No audio/visual alert for new incoming orders
- Needs to work cleanly on a phone or tablet (staff aren't at desks)

**Scope:** Apply fix to all 3 food dashboards: Mas Chingon Restaurant, Mas Chingon Food Truck, Bar 1859

**Idea:** Large tap-target buttons per order card. Clear color-coded status. One tap to advance status. Sound on new order.

### 2. Bar 1859 Full Build (HIGH)

Currently a stub. Needs to be brought to full parity.

**Work needed:**
- Menu seeded into AppSync (prefix `ITEM-BAR-`)
- Tables concept — bar seating layout (bar stools, booths, patio?)
- Stripe checkout wired (same flow as restaurant — dine-in + table selection)
- Staff dashboard showing Bar 1859 orders (`source: Bar1859` or `bar1859`)
- Look & feel: Bar 1859 branding (darker, more upscale than the truck)

### 3. Social Poster on Food Staff Dashboard (MEDIUM)

Staff dashboard should have a tab or button to quickly post a photo + caption to Instagram/Facebook. Ties into the social poster feature already partially built.

- Cabinets social poster is the most complete reference implementation
- Need to adapt it to food vertical (different brand colors, Instagram food content)
- Blocked on Meta tokens for each restaurant — needs client FB page admin access

### 4. Contractor Stripe Integration (HIGH)

Hunter (land clearing) and Cabinets need Stripe payment collection from customers.

**Flow idea:**
- Estimate submitted → staff reviews → sends customer a payment link
- Customer pays via Stripe Checkout (same `/food/checkout` pattern or new `/contractor/checkout`)
- On payment: AppSync estimate status → `Paid`, trigger email/SMS confirmation

**Key difference from food:** Not a real-time order — it's an estimate → approval → invoice flow. Stripe Payment Links or Checkout with manual trigger.

**Decision needed:** Use same Stripe account (AI Agent Assistance) or set up Stripe Connect for contractors too? Same argument as food — Option A (manual payout) for POC, Option B (Connect) for go-live.

### 5. Stripe Go-Live Prep (MEDIUM)

Before any real customer pays on any site:
- Switch test keys → live keys in Render env vars
- Remove `demo2026` preview gate from CloudFront (food sites)
- Decide payout model: manual vs Stripe Connect Express
- Add payout summary to staff dashboard so restaurant can see their revenue

---

## Open Questions for Chris

- Bar 1859 — what's the seating layout? How many tables, bar stools, patio?
- Stripe fee/platform fee — what % does AI Agent Assistance take per order?
- Social poster for food — does Mas Chingon have FB/IG page admin Chris can access?
- Contractor Stripe — same Stripe account or separate?
