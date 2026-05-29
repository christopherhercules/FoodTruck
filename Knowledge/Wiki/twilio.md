# Twilio

Platform SMS provider. Used for order-status notifications (food vertical) and lead
notifications (contractor/real-estate vertical).

---

## Account

| Field | Value |
|---|---|
| Account SID | `AC6f289213a19a78c53cbde8faab6b1124` |
| Auth Token | stored as Render env var `TWILIO_AUTH_TOKEN` only — not in code |
| Config file | `integrations/twilio/config.js` |

---

## Phone Numbers

### +1 (844) 321-4664 — toll-free (the only registered number)

| Field | Value |
|---|---|
| SID | `PN0a6107cefe5d02b8715c1aa1bb568726` |
| Capabilities | SMS ✓ MMS ✓ Voice ✓ |
| Purchased | 2026-05-08 |
| Status | **Active / in-use** |
| Used for | All SMS on the platform (food order updates + WSTN lead alerts) |

---

## Toll-Free Verification

Outbound SMS is blocked until toll-free verification is approved by carriers.
`SKIP_TWILIO_VALIDATION=true` is set on Render as a workaround during this window.

| Field | Value |
|---|---|
| Verification SID | `HH532fb1e5ebfb188e1e30bab227586e28` |
| Status | **IN_REVIEW** |
| Submitted | 2026-05-23 (second submission — first rejected, resubmitted with corrected opt-in image) |
| Business | AiAgentAssistance — Christopher Hercules, Salado TX |
| Use case | Transactional only: order-status SMS + lead notifications. No marketing. |
| Opt-in type | `WEB_FORM` — customer enters phone on order form; consent disclosure shown above "Place Order" |
| Opt-in image URL | `https://aiagentassistance.com/sms-optin-form.png` |
| Message sample | "Your order at Mas Chingon is ready for pickup! Show this text at the window. Reply STOP to opt out." |
| Use case categories | `CUSTOMER_CARE`, `DELIVERY_NOTIFICATIONS` |
| Notification email | admin@aiagentassistance.com |
| Trust product SID | `BU42732fcfd615cde3f780c5481555e461` |
| Customer profile SID | `BU2fa3a29eb107596dcff5d61d8bce25a7` |

---

## Messaging Services

None configured. All messages sent directly from the toll-free number.

---

## What To Do When Approved

1. Remove `SKIP_TWILIO_VALIDATION=true` from Render env vars.
2. Set the real `TWILIO_AUTH_TOKEN` env var on Render (it may already be there — confirm the value matches the account).
3. Test an end-to-end SMS: submit a test order on Mas Chingon and a test lead on WSTN.
4. Update this page: change status from IN_REVIEW → Approved, note the date.

---

## Known Gotchas

- Twilio HMAC signature validation fails behind Render's reverse proxy unless `PUBLIC_URL`
  env var is set. `SKIP_TWILIO_VALIDATION=true` bypasses this. Don't remove it until the
  toll-free number is verified AND `PUBLIC_URL` is confirmed correct.
- The contractor WSTN lead handler (`integrations/wstn/lead.js`) also uses this same
  toll-free number and Twilio account — no separate contractor Twilio account.
