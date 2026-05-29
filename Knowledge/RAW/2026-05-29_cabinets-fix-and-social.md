---
source: cowork-session
captured: 2026-05-29
topic_hint: cabinets, appsync, deployment, social-poster
status: raw
---

# Cabinets Fix + Social Poster — Session Report

## Bug fixed: estimate form "Something went wrong"

**Root cause:** `estimate.html` (and all other Cabinets HTML pages) in S3 were from
May 20 — before the contractor backend split on May 27. All four pages had the food
backend hardcoded:

- Wrong URL: `https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql`
- Wrong key: `da2-6l2dtmahczbbnlp3m2vmgihqby`
- Correct URL: `https://hri5vhqwvjd3flmcdxk6rzvi4e.appsync-api.us-east-1.amazonaws.com/graphql`
- Correct key: `da2-56ubwyy3q5fc5km4msrx6m75ge`

**Fix applied:**
- Redeployed all 4 HTML pages to `s3://cabinets.myserviceflows.com/`
- CloudFront `EKL5C73BJZJER` invalidated with `/*`
- All pages now point to contractor backend

**How to detect in future:** After any `amplify sandbox` or backend redeploy on the
contractor account, also redeploy every site that depends on it:
`cabinets.myserviceflows.com`, `hunter.myserviceflows.com`, `livewstn.myserviceflows.com`

---

## Social poster built for Cabinets

Backend routes added to `integrations/cabinets/social.js`:
- `POST /cabinets/social/caption` — uploads photo to S3, returns 3 Claude-written captions
- `POST /cabinets/social/post` — posts to Facebook Page + Instagram Business

S3 bucket reused: `contractor-social.myserviceflows.com` (same as WSTN, different key prefix `cabinets/social/`)

SSM params needed (not yet created — tokens not available):
- `/contractor/cabinets/facebook_token` → `CABINETS_FB_PAGE_TOKEN`
- `/contractor/cabinets/facebook_page_id` → `CABINETS_FB_PAGE_ID`
- `/contractor/cabinets/instagram_id` → `CABINETS_IG_USER_ID`

Social tab added to `Contractor/Cabinets/dashboard.html` — same UI pattern as WSTN.

**To go live:** get FB Page token + Page ID + IG Business ID from Shawn's Meta account,
add to SSM under `contractor` profile, then redeploy Render (or the params load on next
cold start via secrets.js).
