---
source: cowork-session
captured: 2026-05-29
topic_hint: app-env, cabinets, social-poster, deployment
status: raw
---

# Session Completion Report — 2026-05-29

## Tasks completed this session

---

### 1. APP_ENV per-site notification mode (all contractor handlers)

**What:** 3-state env flag (dev / demo / live) that controls email routing and SMS
suppression per site. Created shared helper, wired into all three handlers.

**Files:**
- `integrations/notify-mode.js` — new shared helper
- `integrations/hunter/estimate.js` — wired `HUNTER_APP_ENV`
- `integrations/wstn/lead.js` — wired `WSTN_APP_ENV`
- `integrations/cabinets/estimate.js` — wired `CABINETS_APP_ENV`

**Current Render state:**
- `HUNTER_APP_ENV=demo` — Hunter emails go to real client, SMS fires
- `WSTN_APP_ENV=dev` — WSTN emails go to admin@, SMS suppressed
- `CABINETS_APP_ENV=dev` — Cabinets emails go to admin@, SMS suppressed (no SMS anyway)
- `APP_ENV=dev` — global fallback

**Deployed** — merged to master and pushed to GitHub. Render auto-deploying.

---

### 2. Cabinets estimate form "Something went wrong" — fixed

**Root cause:** All 4 Cabinets HTML pages in S3 were stale (deployed May 20, before
backend split on May 27). They were pointing at the **food backend** URL
(`d2zlzofjerf4hd6gltypy2rnlm`) with an old API key.

**Fix:** Redeployed all 4 HTML files to `s3://cabinets.myserviceflows.com/` using
`contractor` AWS profile. CloudFront `EKL5C73BJZJER` invalidated.

**Rule going forward:** After any `amplify sandbox` or backend redeploy on the
contractor account (`082569478855`), redeploy all three sites:
`cabinets.myserviceflows.com`, `hunter.myserviceflows.com`, `livewstn.myserviceflows.com`.
The HTML files hardcode the AppSync URL and API key — they don't auto-update.

---

### 3. Cabinets social poster — built and deployed

**Backend:** `integrations/cabinets/social.js`
- `POST /cabinets/social/caption` — uploads photo to S3, Claude Vision writes 3 captions
- `POST /cabinets/social/post` — posts to Facebook Page + Instagram Business via Meta Graph API
- S3 bucket: `contractor-social.myserviceflows.com`, key prefix `cabinets/social/`
- Mounted in `server.js`

**Frontend:** Social section added to `Contractor/Cabinets/dashboard.html`
- "📱 Social" button in header scrolls to section
- Upload zone with drag-and-drop, camera, and gallery shortcuts
- AI caption picker with 3 options (editable before posting)
- FB + IG post button with result display
- `dashboard.html` deployed to S3 and CloudFront invalidated

**Status:** Caption generation works now (uses `ANTHROPIC_API_KEY` already in SSM).
Live posting blocked until these SSM params are added:
- `/contractor/cabinets/facebook_token` → `CABINETS_FB_PAGE_TOKEN`
- `/contractor/cabinets/facebook_page_id` → `CABINETS_FB_PAGE_ID`
- `/contractor/cabinets/instagram_id` → `CABINETS_IG_USER_ID`

---

## Pending / follow-up

- [x] Merged branch `claude/gallant-panini-7d6656` → master, pushed to GitHub, Render deploying
- [ ] Get Shawn's Meta tokens (FB Page token, Page ID, IG Business ID) and add to SSM
- [ ] Set `CABINETS_APP_ENV=demo` in Render once Shawn is actively testing
- [ ] WSTN social poster already built last session — same token-pending state
