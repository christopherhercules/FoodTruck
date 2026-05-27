# AiagentAssistance Platform — Session Context

> Read this at the start of every session to get up to speed instantly.

---

## KarpKnows — Personal Knowledge Base

Self-improving KB lives at `Knowledge/`. Inspired by Karpathy's LLM-managed wiki workflow.

**Trigger:** when Chris says "KarpKnows" (or "load Knowledge/CLAUDE.md"), load `Knowledge/CLAUDE.md` and follow the librarian protocol.

**Once loaded, quick verbs:**
- "ingest" — file new items from `Knowledge/RAW/` into the Wiki
- "synthesize X" / "what do I know about X?" — cross-Wiki distillation
- "brief me on X" / "generate Y" — Wiki → Outputs deliverable
- "clean up the KB" / "maintain" — housekeeping sweep

---

## Coding Behavioral Guidelines

**These guidelines reduce common LLM coding mistakes. Tradeoff: they bias toward caution over speed. For trivial tasks, use judgment.**

### 1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them—don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes
Touch only what you must. Clean up only your own mess.

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it—don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

**The test:** Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution
Define success criteria. Loop until verified.

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan with clear verification steps.

---

## What This Is

A multi-tenant food truck/restaurant website platform. Each business gets a subdomain
(e.g. `maschingonrestaurant.aiagentassistance.com`) with a static React/HTML site served
from S3 via CloudFront. Customers can place orders with SMS confirmation via Twilio.

---

## Repo & Infrastructure

| Thing | Detail |
|---|---|
| GitLab repo | `gitlab.com/aiagentassistant/FoodTruck` |
| Primary domain | `aiagentassistance.com` |
| AWS account | `699242704305` |
| AWS region | `us-east-1` |
| AWS profile | default (`AKIA2FTQ45WYXGTXHNP2`) |
| Terraform state bucket | `terraform-state-foodtruck-699242704305` |
| Route53 hosted zone | `Z07479021E42SUEMRPV9M` |
| CloudFront OAC | `E133527N3SYJFW` |
| ACM certificate | stored in `terraform/variables.tf` as `acm_certificate_arn` |

---

## Architecture

```
Customer browser
    → CloudFront (HTTPS, per-site distribution)
    → S3 bucket (static site per subdomain)
    → AppSync GraphQL API (orders, menu data)
    → DynamoDB (tables managed by Amplify)

Inbound SMS
    → Twilio toll-free (844) 321-4664
    → Render webhook server (https://foodtruck-cymz.onrender.com)
    → Toast POS webhook also on same server
```

---

## Platform reality (as of 2026-05-26)

Multi-vertical POC platform. No paying customers yet. Focus narrowed to **6 active
sites** Chris wants to perfect. The other 12 food sites are dormant — kept around
as redeploy-able demo material, not under active improvement.

### Active — to perfect (6)

| # | Site | Vertical | Domain | Status |
|---|---|---|---|---|
| 1 | Mas Chingon Restaurant | Food / hospitality | `maschingonrestaurant.aiagentassistance.com` | POC, active |
| 2 | Mas Chingon Food Truck | Food / hospitality | `maschingonfoodtruck.aiagentassistance.com` | POC, active |
| 3 | Bar 1859 | Food / hospitality | `bar1859.aiagentassistance.com` | POC, active |
| 4 | Hunter (Land Clearing) | Contractor | `hunter.myserviceflows.com` | POC, active |
| 5 | Cabinet | Contractor | TBD on `myserviceflows.com` | Scaffolded — to be approached/built |
| 6 | WSTN (apartment locating) | Real estate | TBD | Built, not yet tested or deployed |

### Dormant — redeploy-able demos (12)

Removed from live or in process of removal. Code retained for future demos / sales pitches.

sylviastacos, donjuliostacos, hechoenqueso, happypizza, sacredsandwich,
thatgreentrailer, bigtonys, potatowagon, ribtips, simplyporkfection, bobbyque,
sodafusion

> **Open question Chris flagged:** as Mas Chingon improves, do these 12 demo sites
> share enough code to auto-benefit, or are they forks that will drift? Drift risk
> means demos shown to prospects feel year-stale relative to the real product.
> Needs a focused session to inspect the relationship before deciding whether to
> (a) wipe and template-regenerate on demand, (b) keep frozen as-is, or (c) do
> incremental sync.

### Domains and Terraform stacks

- **`aiagentassistance.com`** — food vertical. Terraform stack: `terraform/`. All 15 food sites (active + dormant) currently in `variable "sites"`.
- **`myserviceflows.com`** — contractor and real-estate verticals. Terraform stack: `Contractor/terraform/` (independent from the food stack). Currently only `hunter` in `variable "contractors"`. Cabinet and WSTN not yet wired in.

### Backends

- **Food backend:** `Food/platform-backend/` — Amplify Gen2 backend (AppSync + DynamoDB) for food vertical only. Models: Order, MenuItem, TableAssignment, Customer. Stack: `amplify-maschingonordering-chris-sandbox-344c629bf8`. Endpoint: `https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql`.
- **Contractor backend:** `Contractor/platform-backend/` — Amplify Gen2 backend for contractor vertical. Models: HunterEstimate, CabinetsEstimate. Stack: `amplify-contractorplatform-chris-sandbox-6c197c7d8a`. Endpoint: `https://hri5vhqwvjd3flmcdxk6rzvi4e.appsync-api.us-east-1.amazonaws.com/graphql`. AWS account: `082569478855` (profile: `contractor`).

## Known fragments — to be triaged into Knowledge/

- `SecondBrain/` (empty) — Chris's earlier KB attempt before `Knowledge/` was set up. Decision pending after he watches more of the YouTube guide.
- `AI_PLATFORM_ARCHITECTURE.md`, `EXECUTION_CHECKLIST.md`, `HUNTER_SOCIAL_AUTOPOST_CONTEXT.md`, `INSTRUCTIONS_FOR_HUNTER_DAUGHTER.md`, `SOCIAL_AUTOPOSTING_CONTEXT.md` — top-level context docs that probably belong as Wiki pages or in `Knowledge/RAW/`. Not yet filed.
- `Dashboards/` — contains the AWS cost dashboard (used by the `/costs` skill). Keep where it is, just noting it.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Static HTML/CSS/JS per site |
| Backend | AWS Amplify Gen2 (AppSync + DynamoDB) |
| Auth | Single admin user (no Cognito yet — add when live customers needed) |
| SMS | Twilio (toll-free `+18443214664`) |
| POS | Toast webhook integration |
| Webhook server | Node.js on Render.com (`integrations/server.js`) |
| Hosting infra | Terraform (S3 + CloudFront + Route53) |
| CI/CD | GitLab CI — validate → plan → manual apply |

---

## Key File Locations

```
AiagentAssistance/                     ← local folder name (GitLab repo: FoodTruck)
├── CLAUDE.md                          ← this file
├── .gitignore                         ← excludes node_modules, .terraform/, .env
├── .gitlab-ci.yml                     ← CI/CD pipeline (validate/plan/apply)
├── terraform/
│   ├── providers.tf                   ← S3 backend, AWS provider
│   ├── variables.tf                   ← domain, sites list, OAC ID, cert ARN
│   ├── s3.tf                          ← S3 buckets + OAC bucket policies
│   ├── cloudfront.tf                  ← CloudFront distributions (main + 15 sites)
│   ├── cloudfront_imports.tf          ← Terraform import blocks for all 15 CFs
│   ├── route53.tf                     ← A records pointing to CloudFront
│   ├── outputs.tf                     ← site_urls, cloudfront_ids
│   └── import.ps1                     ← one-time import script (already run)
├── integrations/
│   ├── server.js                      ← combined Twilio+Toast webhook server
│   ├── package.json                   ← start: node server.js, node>=18
│   ├── twilio/
│   │   ├── config.js                  ← uses env vars (TWILIO_ACCOUNT_SID etc.)
│   │   └── webhook.js                 ← inbound SMS handler, trust proxy=1
│   └── toast/
│       └── webhook.js                 ← Toast POS event handler
├── Food/
│   ├── platform-backend/              ← Amplify Gen2 backend — food vertical only
│   │   └── amplify/data/resource.ts   ← AppSync schema (Order, MenuItem, TableAssignment, Customer)
│   ├── MasChingon/                    ← legacy folder — Website/ subfolder only, no backend
│   ├── 1859Bar/
│   ├── BigTonys/ BobbyQue/ DonJuliosTacos/ HappyPizza/ HechoEnQueso/
│   ├── MasChingonFoodTruck/ MasChingonRestaurant/
│   └── PotatoWagon/ RibTips/ SacredSandwich/ SimplyPorkFection/
│       SodaFusion/ SylviasTacos/ ThatGreenTrailer/
└── Contractor/
    ├── platform-backend/              ← Amplify Gen2 backend — contractor vertical
    │   └── amplify/data/resource.ts   ← AppSync schema (HunterEstimate, CabinetsEstimate)
    ├── LandClearing/
    │   └── Hunter/                    ← hunter.myserviceflows.com
    │       ├── CLAUDE.md              ← Hunter-specific context
    │       ├── index.html / estimate.html / dashboard.html / job.html
    │       └── assets/
    ├── Cabinets/
    │   └── estimate.html / dashboard.html / job.html
    └── RealEstate/
        └── WSTN/                      ← livewstn.myserviceflows.com
```

---

## Twilio

| Thing | Detail |
|---|---|
| Account SID | see Render env var `TWILIO_ACCOUNT_SID` |
| Auth Token | stored as Render env var only — not in code |
| From number | `+18443214664` (toll-free) |
| Render URL | `https://foodtruck-cymz.onrender.com` |
| Signature validation | `SKIP_TWILIO_VALIDATION=true` on Render (toll-free pending) |
| Verification status | **In progress** as of 2026-05-26 — outbound SMS blocked until approved |

---

## GitLab CI/CD Variables (already set)

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_DEFAULT_REGION` = `us-east-1`

---

## Terraform — Current State

All AWS resources imported. `terraform plan` shows **No changes**.

```powershell
# Run from FoodTruck/terraform/
terraform state list          # see all managed resources
terraform plan                # verify no drift
terraform output              # see all site URLs + CloudFront IDs
terraform output cloudfront_ids
terraform output site_urls
```

Note: DynamoDB, AppSync, and Cognito are **not** in Terraform — they are managed by
Amplify. This is intentional. Do not import them.

---

## Completed This Session

- [x] SSH keys set up for GitLab and GitHub — no more tokens needed
- [x] Exposed tokens revoked (GitHub PATs + old GitLab token)
- [x] Admin sales dashboard live at `https://aiagentassistance.com/admin/index.html`
      - Password: `Michele2025!`
      - Tabs: Sales Pitch, Client Sites (15), Prospects (31 businesses)
      - Contact card modal per client/prospect — saves to localStorage
      - Prospect status tracking (Not Contacted / Demo Scheduled / Follow Up / Not Interested)
- [x] Terraform drift detection tested and confirmed working
- [x] DynamoDB PITR discussed — not yet enabled
- [x] IAM user `corp-tf-test` created for second GitLab environment testing
      - Access Key: `AKIA2FTQ45WYSFG2EOAI` (delete when done testing)
- [x] Terraform state versioning discussed — not yet enabled on state bucket

---

## Pending / Next Steps

- [ ] **Twilio toll-free approval** — waiting on Twilio (submitted 2026-05-08). Once
      approved, remove `SKIP_TWILIO_VALIDATION=true` from Render and set real
      `TWILIO_AUTH_TOKEN` env var.
- [ ] **Cognito** — add when real customers need accounts (not needed yet)
- [ ] **Render → GitLab** — check if Render service is connected to GitHub; if so,
      switch to GitLab repo for auto-deploys
- [ ] **Enable S3 versioning on state bucket** — one-liner:
      `aws s3api put-bucket-versioning --bucket terraform-state-foodtruck-699242704305 --versioning-configuration Status=Enabled`
- [ ] **Enable DynamoDB PITR** — point-in-time recovery on Orders table
- [ ] **Delete IAM user corp-tf-test** when done testing second GitLab env
- [ ] **Second GitLab environment** — in progress, Terraform setup for corp environment

---

## Git Remotes

| Remote | URL | Auth |
|---|---|---|
| `origin` | `git@gitlab.com:aiagentassistant/FoodTruck.git` | SSH key |
| `github` | `git@github.com:christopherhercules/FoodTruck.git` | SSH key |

SSH key is at `~/.ssh/id_ed25519` — added to both GitLab and GitHub. No tokens needed.

---

## AWS Cost Check

Run at start of session to check current spend:

```powershell
aws ce get-cost-and-usage --time-period Start=2026-05-01,End=2026-05-31 --granularity MONTHLY --metrics "BlendedCost" --group-by Type=DIMENSION,Key=SERVICE --profile default --region us-east-1
```

Flag anything not in: S3, CloudFront, Route53, ACM, AppSync, DynamoDB, Amplify, Lambda

---

## Known Gotchas

- `terraform/.terraform/` must never be committed — it contains a 686 MB provider binary
- CloudFront origin IDs use uppercase `S3-` prefix (e.g. `S3-maschingonrestaurant.aiagentassistance.com`)
- CloudFront distributions require `is_ipv6_enabled = true` to match existing config
- Twilio HMAC validation breaks behind Render's proxy — use `SKIP_TWILIO_VALIDATION=true`
  until toll-free is verified and `PUBLIC_URL` env var is set
- Amplify regenerates DynamoDB/AppSync on each deploy — do not manage with Terraform
- Windows PowerShell: use `.ps1` scripts, not `.sh`; `bash` is not in PATH
- Terraform only detects drift on resources IN state — unmanaged resources are invisible
- DynamoDB/AppSync/Cognito are Amplify-managed — revert via Git + redeploy, not Terraform
