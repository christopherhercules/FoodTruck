---
source: cowork-session
captured: 2026-05-29
topic_hint: app-env, notifications, architecture
status: raw
---

# APP_ENV Pattern — Implementation Complete

## What was done

Implemented the 3-state per-site notification mode across all contractor handlers.

### Files created
- `integrations/notify-mode.js` — shared helper, modes: dev | demo | live

### Files updated
- `integrations/hunter/estimate.js` — wired `HUNTER_APP_ENV`, email + SMS gated
- `integrations/wstn/lead.js` — wired `WSTN_APP_ENV`, SMS moved after content build
- `integrations/cabinets/estimate.js` — wired `CABINETS_APP_ENV`, email only

## Behavior summary

| Mode | Email recipient | Subject prefix | SMS |
|---|---|---|---|
| `dev` (default) | admin@aiagentassistance.com | [DEV] | suppressed |
| `demo` | real client email | [DEMO] | sent with [DEMO] prefix |
| `live` | real client email | none | sent as-is |

## Render env vars to set (if not already done)

| Var | Value |
|---|---|
| `HUNTER_APP_ENV` | `demo` |
| `WSTN_APP_ENV` | `dev` |
| `CABINETS_APP_ENV` | `dev` |
| `APP_ENV` | `dev` (global fallback) |

## Notes

- Food vertical handlers (Mas Chingon, Bar 1859) skipped — no notification handlers exist yet
- `suppressSms: true` in dev means Twilio is never called, regardless of toll-free approval status
- Cabinets has no SMS — resolveNotification called with `smsBody: null`, `suppressSms` ignored
