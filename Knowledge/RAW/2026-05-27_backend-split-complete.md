---
source: claude-code-session
captured: 2026-05-27
topic_hint: platform-backend-split
status: processed
---

# Backend Split — Completion Report

## What was accomplished

- [x] Task 1: Created `Contractor/platform-backend/` Amplify Gen2 project from scratch
- [x] Task 2: HunterEstimate and CabinetsEstimate schemas copied into contractor backend
- [x] Task 3: Deployed contractor backend sandbox to AWS account 082569478855 (required CDK bootstrap first — one-time step)
- [x] Task 4: Updated Hunter HTML files (estimate.html, dashboard.html, job.html)
- [x] Task 5: Updated Cabinets HTML files (estimate.html, dashboard.html, job.html — handoff doc missed dashboard+job, caught during execution)
- [x] Task 6: Removed HunterEstimate and CabinetsEstimate from food schema
- [x] Task 7: Redeployed food backend — both contractor nested stacks deleted cleanly
- [x] Task 8: Folder rename already done in git (Food/MasChingon/backend → Food/platform-backend was tracked by git automatically)
- [x] Task 9: Updated CLAUDE.md (root), Contractor/CLAUDE.md, Contractor/LandClearing/Hunter/CLAUDE.md, Contractor/Contractor/CLAUDE.md

## New contractor backend
- Endpoint: https://hri5vhqwvjd3flmcdxk6rzvi4e.appsync-api.us-east-1.amazonaws.com/graphql
- API key: da2-56ubwyy3q5fc5km4msrx6m75ge
- Stack name: amplify-contractorplatform-chris-sandbox-6c197c7d8a
- AWS account: 082569478855
- Location: Contractor/platform-backend/

## Food backend (post-split)
- Endpoint: https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql (unchanged)
- Models remaining: Order, MenuItem, TableAssignment, Customer
- Stack name: amplify-maschingonordering-chris-sandbox-344c629bf8
- Location: Food/platform-backend/ (renamed from Food/MasChingon/backend/)

## Files changed
- `Contractor/platform-backend/` — created (new Amplify Gen2 project, 5 files)
- `Contractor/LandClearing/Hunter/estimate.html` — new contractor endpoint + API key
- `Contractor/LandClearing/Hunter/dashboard.html` — new contractor endpoint + API key
- `Contractor/LandClearing/Hunter/job.html` — new contractor endpoint + API key
- `Contractor/Cabinets/estimate.html` — new contractor endpoint + API key
- `Contractor/Cabinets/dashboard.html` — new contractor endpoint + API key
- `Contractor/Cabinets/job.html` — new contractor endpoint + API key
- `Food/MasChingon/backend/amplify/data/resource.ts` → `Food/platform-backend/amplify/data/resource.ts` — renamed + HunterEstimate + CabinetsEstimate models removed
- All other `Food/MasChingon/backend/` files — renamed to `Food/platform-backend/`
- `CLAUDE.md` (root) — backends section updated, file tree updated
- `Contractor/CLAUDE.md` — AppSync endpoint, API key, backend path updated
- `Contractor/LandClearing/Hunter/CLAUDE.md` — AppSync endpoint, API key, backend path updated
- `Contractor/Contractor/CLAUDE.md` — AppSync endpoint, API key, backend path updated

## Git status
Tracked changes before commit:
- M CLAUDE.md
- M Contractor/Cabinets/dashboard.html
- M Contractor/Cabinets/estimate.html
- M Contractor/Cabinets/job.html
- M Contractor/LandClearing/Hunter/dashboard.html
- M Contractor/LandClearing/Hunter/estimate.html
- M Contractor/LandClearing/Hunter/job.html
- R Food/MasChingon/backend/* → Food/platform-backend/* (all backend files renamed)
- RM Food/MasChingon/backend/amplify/data/resource.ts → Food/platform-backend/amplify/data/resource.ts (renamed + modified)

## Verification results
- CDK bootstrap ran clean on contractor account 082569478855
- Contractor sandbox deployed in 165 seconds, all AppSync resolvers created for HunterEstimate and CabinetsEstimate
- Food backend redeployed — HunterEstimate and CabinetsEstimate nested stacks DELETE_COMPLETE
- Grep on Contractor/**/*.html confirms zero references to old food endpoint
- All 3 Contractor CLAUDE.md docs updated to new endpoint

## Issues or decisions made during execution
- Handoff doc only listed Cabinets/estimate.html — dashboard.html and job.html also had the old URL and were updated
- CDK bootstrap was required on the contractor account before first Amplify sandbox deploy (one-time, not in handoff doc)
- Food/platform-backend already existed with correct food-only schema (created in prior session) — git already tracked the rename, no manual git mv needed
- Both sandboxes ran in watch mode after deployment; had to kill node processes before git mv would succeed (but rename turned out to be already done)

## What's still needed
- Contractor/platform-backend/ is untracked (in .gitignore or just unstaged) — node_modules and .amplify/ should be gitignored
- amplify_outputs.json for contractor backend not committed (contains API key — treat as sensitive or add to .gitignore)
- Verify Hunter estimate form end-to-end (submit test estimate, confirm it hits contractor AppSync not food one)
- Verify Mas Chingon order flow still works on food endpoint
- WSTN still shares no backend — open question whether it gets its own or shares contractor backend
