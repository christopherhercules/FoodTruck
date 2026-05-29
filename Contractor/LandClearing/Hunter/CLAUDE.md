# Hunter Land Clearing — Session Context

> Read this at the start of every session to get up to speed instantly.

---

## What This Is

A lead-capture + job-tracking web app for **Hunter Land Clearing**, a land clearing
contractor run by Jason Merz in New Braunfels, TX area. Hosted at:

- **Public site:** `https://hunter.aiagentassistance.com/` (index.html)
- **Estimate tool:** `https://hunter.aiagentassistance.com/estimate.html`
- **Jason's dashboard:** `https://hunter.aiagentassistance.com/dashboard.html` — Password: `Hunter2025!`
- **Customer job tracker:** `https://hunter.aiagentassistance.com/job.html?id=<estimateId>`

Hosted on the same AWS S3 + CloudFront infrastructure as the FoodTruck project.

---

## Infrastructure

| Thing | Detail |
|---|---|
| S3 bucket | `hunter.aiagentassistance.com` |
| CloudFront distribution ID | `E2P421R4KKX8BY` |
| Route53 hosted zone | same as FoodTruck: `Z07479021E42SUEMRPV9M` |
| Backend (AppSync) | Contractor backend — `Contractor/platform-backend/amplify/` |
| AppSync endpoint | `https://hri5vhqwvjd3flmcdxk6rzvi4e.appsync-api.us-east-1.amazonaws.com/graphql` |
| API Key | `da2-56ubwyy3q5fc5km4msrx6m75ge` |
| DynamoDB table | `HunterEstimate` (managed by Amplify, not Terraform) |

### Deploy workflow

```powershell
# Upload a file:
aws s3 cp HunterLandClearing\<file>.html s3://hunter.aiagentassistance.com/<file>.html --content-type "text/html" --cache-control "no-cache"

# Invalidate CloudFront:
aws cloudfront create-invalidation --distribution-id E2P421R4KKX8BY --paths "/*"
```

---

## Files

```
HunterLandClearing/
├── CLAUDE.md          ← this file
├── index.html         ← public marketing/landing page
├── estimate.html      ← 4-step estimate intake wizard
├── dashboard.html     ← Jason's internal CRM/job management dashboard
├── job.html           ← customer-facing job progress tracker
└── assets/            ← images
```

---

## AppSync Schema (HunterEstimate model)

Defined in `Food/MasChingon/backend/amplify/data/resource.ts`:

```typescript
HunterEstimate: a.model({
  // Contact
  name: a.string().required(),
  phone: a.string().required(),
  email: a.string(),

  // Property
  address: a.string().required(),
  lat: a.float(), lng: a.float(),
  parcelOwner: a.string(),
  parcelCounty: a.string(),
  parcelGeoJSON: a.string(),    // full parcel boundary GeoJSON (for map rendering)

  // Clearing area
  acres: a.float(),
  drawnGeoJSON: a.string(),     // user's drawn polygon(s) GeoJSON

  // Internal workflow (Jason only)
  status: a.string().required(),  // "New" | "Called" | "Quoted" | "Won" | "Lost"
  notes: a.string(),

  // Customer-facing job progress
  jobStatus: a.string(),          // "Pending Review" | "Quoted" | "Scheduled" | "In Progress" | "Completed"
  quotedPrice: a.float(),
  finalPrice: a.float(),
  scheduledDate: a.datetime(),
  startedDate: a.datetime(),
  completedDate: a.datetime(),
  percentComplete: a.integer(),   // 0–100
  customerNotes: a.string(),      // visible to customer in job.html
  photoUrls: a.string(),          // JSON array of photo URLs
  invoiceSent: a.boolean(),

  submittedAt: a.datetime().required(),
}).authorization((allow) => [allow.publicApiKey()])
```

To redeploy after schema changes:
```powershell
# From Food/MasChingon/backend/
npx ampx sandbox --once
```

---

## estimate.html — Key Details

4-step wizard:
1. **Property** — address → Mapbox geocode → show map → parcel boundary lookup
2. **Draw Area** — custom click-to-draw polygon on map
3. **Your Info** — name, phone, email
4. **Review & Submit** — summary → `createHunterEstimate` mutation → success page with tracking link

### Map & Drawing
- **Mapbox GL JS v2.15.0** (v3 is incompatible with drawing approach — do NOT upgrade)
- Token: `pk.eyJ1IjoiY2hyaXN0b3BoZXJoZXJjdWxlcyIsImEiOiJjbXA4aHRrMHcwN3RiMnJzNjBzeWZ3ZHIxIn0.Kgx5YEB2aA4TchyXR989Zw`
- Token URL restriction: must be `https://hunter.aiagentassistance.com/*` (wildcard path required)
- Custom drawing (no mapbox-gl-draw plugin): click to add vertices, button toggles to "✓ Finish Drawing (N pts)", click first vertex to close polygon when 3+ points placed
- Vertex markers: orange dots; first vertex becomes large/green when closeable

### Parcel Boundary Lookup
- Service: **Texas StratMap statewide parcels** (TNRIS, no auth required)
- URL: `https://tnris-api.tnris.org/api/v1/services/tnris-stratmap/StratMap_Land_Parcels_48_most_recent/FeatureServer/0/query`
- 3-attempt retry: point query → point retry → envelope fallback (25s timeout each)
- Saves full GeoJSON to `parcelGeoJSON` field on submit

---

## dashboard.html — Key Details

### Auth
- Password: `Hunter2025!` (sessionStorage — clears on tab close)

### Layout
- Stats bar: total leads / New / Called / Quoted / Won / total acres
- Filter tabs: All / New / Called / Quoted / Won / Lost
- Search box: filters by name, address, phone
- Table: date / name / phone / address / acres / county / status

### Detail Modal
Opens on row click. Contains:
- Map showing parcel boundary (green dashed) + drawn clearing area (amber solid)
- Internal section: lead status dropdown + internal notes → "Save Internal"
- **6 action-stage cards** (each saves to DB + opens native SMS app):
  1. 📄 **Send Quote** — price input → SMS quote template
  2. 📅 **Schedule Job** — date picker → SMS schedule template
  3. 🚜 **Start Work** — one click → SMS start notification
  4. 📊 **Update Progress** — 0–100% slider → SMS progress update
  5. ✅ **Mark Complete** — final price input → SMS completion template
  6. 💰 **Send Bill** — email invoice template OR SMS text reminder
- Stage cards auto-highlight: green = done, amber = active (next step)
- 🗑️ **Delete button** in header — confirms then calls `deleteHunterEstimate` mutation

### Key JS functions
`openModal()`, `closeModal()`, `deleteEstimate()`, `saveInternal()`,
`applyAndRefresh()`, `refreshStageStates()`, `openSMS()`,
`actionSendQuote()`, `actionSchedule()`, `actionStartJob()`,
`actionUpdateProgress()`, `actionComplete()`, `actionSendBill()`, `actionTextBill()`

---

## job.html — Key Details

Customer-facing tracker loaded via `job.html?id=<estimateId>`.
- Reads `HunterEstimate` by ID from AppSync
- 5-step animated timeline (pulsing amber = current step)
- Shows: address, acres, quoted/final price, scheduled/completed dates
- Map with parcel boundary + drawn clearing area
- Customer notes from Jason + photo grid
- Contact Jason buttons (call / email)

---

## SMS Integration

All customer comms use `sms:` protocol (opens native phone app — no Twilio needed).
Pattern: `openSMS(phone, messageText)` → `window.open('sms:' + phone + '?body=' + encodeURIComponent(msg))`

Jason's phone (used in job.html contact buttons): `(830) 832-7065`
Jason's email (used in bill template + contact buttons): `hunterlandclearing@yahoo.com`

---

## Known Gotchas

- **Mapbox v2 only** — v3.x breaks the custom drawing implementation
- **Mapbox token needs `/*` wildcard** — `https://hunter.aiagentassistance.com/*` not just the domain
- **Texas StratMap cold starts** — first query of the day can be slow; 25s timeout handles it
- **Parcel boundary intermittently fails** — TNRIS service is external; 3-retry logic mitigates but doesn't eliminate
- **AppSync schema changes require sandbox redeploy** — run `npx ampx sandbox --once` from `MasChingon/backend/`
- **CloudFront `--paths` needs wildcard** — `"/*"` not `"/dashboard.html"` (the latter throws InvalidArgument)
- **Backend is shared** — `HunterEstimate` table lives in the same Amplify project as FoodTruck orders

---

## Completed Features

- [x] Marketing landing page (index.html)
- [x] 4-step estimate intake wizard with map + parcel lookup + custom drawing
- [x] Parcel boundary saved to DB and displayed in dashboard + job tracker
- [x] Jason's CRM dashboard with lead management
- [x] Action-stage workflow cards with SMS templates
- [x] Customer job tracker page (job.html)
- [x] Delete lead functionality in dashboard

## Pending / Ideas

- [ ] Photo upload for job progress (photoUrls field exists, UI not built)
- [ ] Parcel lookup reliability improvements (TNRIS can be slow/unavailable)
- [ ] Email invoice — Jason's email confirmed: `hunterlandclearing@yahoo.com`
- [ ] Consider adding estimate request notifications (email/SMS to Jason on new submission)
