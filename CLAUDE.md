# FoodTruck Project — Session Context

> Read this at the start of every session to get up to speed instantly.

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

## Active Sites (15 food trucks)

maschingonrestaurant, maschingonfoodtruck, bar1859, sylviastacos, donjuliostacos,
hechoenqueso, happypizza, sacredsandwich, thatgreentrailer, bigtonys, potatowagon,
ribtips, simplyporkfection, bobbyque, sodafusion

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
FoodTruck/
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
└── MasChingon/
    └── backend/
        └── amplify/data/resource.ts   ← AppSync schema (includes smsConsent field)
```

---

## Twilio

| Thing | Detail |
|---|---|
| Account SID | `AC6f289213a19a78c53cbde8faab6b1124` |
| Auth Token | stored as Render env var only — not in code |
| From number | `+18443214664` (toll-free) |
| Render URL | `https://foodtruck-cymz.onrender.com` |
| Signature validation | `SKIP_TWILIO_VALIDATION=true` on Render (toll-free pending) |
| Verification status | **In progress** as of 2026-05-08 — outbound SMS blocked until approved |

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

## Pending / Next Steps

- [ ] **Twilio toll-free approval** — waiting on Twilio (submitted 2026-05-08). Once
      approved, remove `SKIP_TWILIO_VALIDATION=true` from Render and set real
      `TWILIO_AUTH_TOKEN` env var.
- [ ] **Revoke exposed tokens** — GitHub PATs and GitLab token were shared in chat.
      Revoke at github.com/settings/tokens and gitlab.com/-/profile/personal_access_tokens
- [ ] **Cognito** — add when real customers need accounts (not needed yet)
- [ ] **Render → GitLab** — check if Render service is connected to GitHub; if so,
      switch to GitLab repo for auto-deploys

---

## Known Gotchas

- `terraform/.terraform/` must never be committed — it contains a 686 MB provider binary
- CloudFront origin IDs use uppercase `S3-` prefix (e.g. `S3-maschingonrestaurant.aiagentassistance.com`)
- CloudFront distributions require `is_ipv6_enabled = true` to match existing config
- Twilio HMAC validation breaks behind Render's proxy — use `SKIP_TWILIO_VALIDATION=true`
  until toll-free is verified and `PUBLIC_URL` env var is set
- Amplify regenerates DynamoDB/AppSync on each deploy — do not manage with Terraform
- Windows PowerShell: use `.ps1` scripts, not `.sh`; `bash` is not in PATH
