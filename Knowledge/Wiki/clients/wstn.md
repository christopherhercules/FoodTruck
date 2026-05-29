---
title: WSTN (Apartment Locating)
aliases: [WSTN, wstn, apartment locating, live wstn]
tags: [client, real-estate, live]
created: 2026-05-27
updated: 2026-05-29 (backend + guide)
sources:
  - raw/2026-05-28_wstn-appsync-properties-social.md
  - raw/2026-05-28_wstn-chatbot-deploy-complete.md
  - raw/2026-05-29_session-complete-wstn-email-twilio-wiki.md
  - raw/2026-05-29_cowork-handoff-wstn-email-clients.md
status: live
---

# WSTN (Apartment Locating)

**TL;DR:** The platform's first real-estate vertical POC. Live at `https://livewstn.myserviceflows.com`. AI chat, lead capture, AppSync persistence, and dashboard all built and deployed. Email notifications tested end-to-end.

## What it is

A website for an apartment locating service — the first (and currently only) real-estate vertical entry. Includes an AI chat widget, a staff dashboard (leads, properties, social poster tabs), and a sell-homes flow. Lead data persists to AppSync (`WSTNLead` model) with localStorage as offline fallback.

## Vertical

Real estate — apartment locating

## Client

**Brogan Merz** — human locator agent, AI-assisted. The platform handles lead capture and follow-up; Brogan does the actual locating work. Phone: (210) 394-0238. Email: wstnapartmentlocating@gmail.com

Instagram: [@wstnapartmentlocating](https://www.instagram.com/wstnapartmentlocating)

## URLs

| Page | URL |
|---|---|
| Public site | https://livewstn.myserviceflows.com |
| Dashboard | https://livewstn.myserviceflows.com/dashboard.html |
| Password | `WSTN2025!` |

## Infrastructure

- **AWS account:** Contractors (`082569478855`, profile: `contractor`)
- **CloudFront:** `E3PM5DNV9RRO3N`
- **S3 bucket:** `livewstn.myserviceflows.com`
- **Repo path:** `Contractor/RealEstate/WSTN/`
- **Terraform stack:** `Contractor/terraform/`
- **Client reference:** `Contractor/RealEstate/WSTN/CLIENT.md`

## Backend

AppSync `WSTNLead` model deployed to the **contractor** Amplify sandbox (not a separate real-estate account — same contractor account `082569478855` is fine).

| Field | Value |
|---|---|
| AppSync endpoint | `https://fatiu5musjes5clnyalazphytu.appsync-api.us-east-1.amazonaws.com/graphql` |
| API key | `da2-k2xaghsoq5ggjdsgta4tzf2zha` |
| Amplify stack | `amplify-contractorplatform-chris-sandbox-6c197c7d8a` |
| Models | `WSTNLead`, `WSTNProperty` |
| API key | `da2-56ubwyy3q5fc5km4msrx6m75ge` (rotated 2026-05-29 after WSTNProperty deploy) |

Chatbot writes leads to AppSync fire-and-forget on submit. Dashboard reads/updates/deletes via AppSync. localStorage retained as offline fallback only.

`WSTNProperty` model deployed 2026-05-29 — fixes the cross-device property suggestion bug. Dashboard properties tab now reads/writes AppSync instead of localStorage. Chatbot `showPreferredProperties()` fetches active properties from AppSync at runtime with localStorage fallback.

## Email / SMS Notifications

Lead submissions trigger `POST /wstn/lead` on the Render webhook server.

| Field | Value |
|---|---|
| Notify TO | `WSTN_NOTIFY_EMAIL` env var (Render) — falls back to `admin@aiagentassistance.com` |
| Notify FROM | `WSTN Apartment Locating <notifications@myserviceflows.com>` |
| SMS TO | `+12103940238` (Brogan) via Twilio toll-free |
| Email template | Navy header with inline WSTN gold serif logo + lead details table |

Email tested end-to-end 2026-05-29 — arrives at `admin@aiagentassistance.com` ✓

## Client Guide

A full plain-language guide for Brogan lives at `Contractor/RealEstate/WSTN/BROGAN_GUIDE.md`. Covers: site flows, dashboard walkthrough, email/SMS notifications, how to test, social poster, and step-by-step Facebook/Instagram setup. Generated from [[client-onboarding-guide-template]].

## Known Issues / Improvement Backlog

- **Social poster** — routes built (`integrations/wstn/social.js`), S3 bucket created (`wstn-social.myserviceflows.com`). Blocked on Brogan granting FB Page Admin access (Christopher Hercules) and providing Page ID + IG account ID.
- **WSTN_NOTIFY_EMAIL** — currently `admin@aiagentassistance.com`. Update Render env var to Brogan's email once she provides it.
- **Content gap** — site needs richer area guides; Brogan's Instagram is a good starting point

### Fixed

- Duplicate lead submissions (2026-05-28) — double-click guard + `chatSubmitted` flag
- Name capture autocomplete bleed (2026-05-28) — `autocomplete="off"` + `hideInput()` clears value
- Closing message (2026-05-28) — "Westin will call" → "Brogan will contact you"
- Email fallback recipient (2026-05-29) — was `chris@aiagentassistance.com`, now `admin@aiagentassistance.com`
- Email logo (2026-05-29) — inline WSTN gold serif brand mark added to HTML email header
- Email FROM display name (2026-05-29) — `WSTN Apartment Locating <notifications@myserviceflows.com>`
- All "Westin" agent-name references → "Brogan" (2026-05-29) — 10 occurrences in index.html
- Properties cross-device bug (2026-05-29) — WSTNProperty model deployed, dashboard + chatbot use AppSync
- WSTN added to contractor Terraform (2026-05-29) — all 5 resources imported, `terraform plan` shows No changes

## Related

- [[hunter-land-clearing]]
- [[cabinet]]
- [[twilio]]
