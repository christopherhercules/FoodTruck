---
title: Client Onboarding Guide — Template
aliases: [onboarding template, client guide template, brogan guide template]
tags: [template, operations, client-onboarding]
created: 2026-05-29
updated: 2026-05-29
---

# Client Onboarding Guide — Template

**Purpose:** Generate a `[BUSINESS]_GUIDE.md` for each client explaining their site, dashboard, notifications, and social setup in plain user language. Drop this into the client's site folder (e.g., `Contractor/RealEstate/WSTN/BROGAN_GUIDE.md`).

**Reference implementation:** `Contractor/RealEstate/WSTN/BROGAN_GUIDE.md` (Brogan / WSTN)

---

## How to use this template

1. Copy the **Client Guide Template** section below into a new file in the client's folder
2. Fill in all `[PLACEHOLDERS]` — a list of every variable is at the bottom of this page
3. Replace the **Vertical-specific** sections with the correct flow for that business type
4. Delete any sections that don't apply (e.g., no social poster yet → remove that section)
5. Commit to the repo and share the file with the client

---

## Vertical quick-reference

Different business types have different chat flows and dashboard tabs. Use the right block for **Section 2** and **Section 4**.

### Food / Restaurant
- **Chat flows:** Order pickup, Reserve a table, Ask about the menu
- **Dashboard tabs:** Orders, Menu Editor, Reservations
- **Lead type:** Orders (not leads) — customer name, items, pickup time
- **Notification subject:** `🍔 New Order: [Name] — Pickup [Time]`
- **No social poster** (not yet built for food vertical)

### Contractor (Land Clearing, Cabinets, etc.)
- **Chat flows:** Request an estimate — collects property address (with map pin), project details, contact info
- **Dashboard tabs:** Estimates, Job Tracker (status, photos, invoice), Social Poster
- **Lead type:** Estimates — name, phone, address, project scope, drawn area (land clearing) or floor plan (cabinets)
- **Notification subject:** `🌲 New Estimate: [Name] — [Address]` (land) or `🪵 New Estimate: [Name]` (cabinets)
- **Social poster:** active for both (photo → AI caption → FB/IG post)

### Real Estate / Apartment Locating
- **Chat flows:** Find an Apartment, Buy a Home, Sell Your Home
- **Dashboard tabs:** Leads, Properties (cross-device property suggestions), Social Poster
- **Lead type:** Leads — name, phone, type (rent/buy/sell), budget, beds, area, notes
- **Notification subject:** `🏢 New Apartment Seeker`, `🏡 New Home Buyer`, `🏠 New Home Seller`
- **Social poster:** active (photo → AI caption → FB/IG post)

---

## Client Guide Template

> Everything below this line is the client-facing guide. Customize and remove this instruction block before sending.

---

# [BUSINESS_NAME] — [CONTACT_FIRST_NAME]'s Complete Guide

**Your live website:** [SITE_URL]
**Your dashboard:** [DASHBOARD_URL]
**Dashboard password:** `[DASHBOARD_PASSWORD]`

---

## Table of Contents

1. [What the website does](#1-what-the-website-does)
2. [How a customer uses the site](#2-how-a-customer-uses-the-site)
3. [What you receive when a lead comes in](#3-what-you-receive-when-a-lead-comes-in)
4. [Your dashboard — complete walkthrough](#4-your-dashboard--complete-walkthrough)
5. [How to test everything yourself](#5-how-to-test-everything-yourself)
6. [Social media poster — how it works](#6-social-media-poster--how-it-works)  *(remove if not active)*
7. [Facebook & Instagram setup](#7-facebook--instagram-setup--what-you-need-to-do)  *(remove if not needed)*
8. [Providing your email for notifications](#8-providing-your-email-for-notifications)
9. [Phone text notifications](#9-phone-text-notifications)

---

## 1. What the website does

[2–4 sentences in plain language. What problem does this site solve for the business owner? What does it do for their customers?]

**Example (WSTN):** Your website finds you apartment-seeking clients, home buyers, and home sellers. Visitors chat with your AI assistant which collects their contact and search details, then you get an email notification and the lead appears in your dashboard.

**Example (Hunter):** Your website captures land clearing estimate requests automatically. Customers drop a pin on their property, draw their clearing area, and the AI walks them through project details — no phone tag to get basic info.

---

## 2. How a customer uses the site

[Describe each chat flow step by step. Numbered list. Use the Vertical quick-reference above.]

The chat bubble appears in the bottom-right corner of the site. When a customer clicks it:

**[FLOW NAME — e.g., "Find an Apartment"]:**
1. Step 1
2. Step 2
3. ...
4. After the chat closes: [what happens — confirmation message, lead saved, notification sent]

[Repeat for each flow.]

[Add any "bonus" behavior — e.g., property suggestions for WSTN, map pin for Hunter.]

---

## 3. What you receive when a lead comes in

### Email notification

You will receive a branded email for every new lead. Subject line format:

`[EMOJI] New [LEAD_TYPE]: [Name] — [Location or detail]`

The email contains:
- **Contact:** Name, phone (clickable), email if provided
- **[VERTICAL-SPECIFIC DETAILS]** — e.g., budget/beds/area for renters, address/acres for land clearing
- **Notes:** Anything the client typed in the notes field
- **"Open Dashboard" button** — takes you directly to your dashboard

> **Important:** Until you provide your preferred email to Chris, notifications go to his inbox. See Section 8.

### Text message notification

[Either: "A text will be sent to [PHONE] with lead details and a dashboard link." — OR: "Text notifications are pending phone number carrier approval. See Section 9."]

---

## 4. Your dashboard — complete walkthrough

Go to: **[DASHBOARD_URL]**
Password: **`[DASHBOARD_PASSWORD]`**

### Tab 1: [MAIN TAB NAME — Leads / Orders / Estimates]

[Describe the main working view. What columns are shown? What does clicking a row do? What statuses exist?]

**Statuses:**
- `New` — just submitted
- `[VERTICAL STATUS]` — ...
- `Closed` / `Won` / `Lost`

**Internal Notes:** [Describe — private, never shown to client.]

### Tab 2: [SECOND TAB — Properties / Job Tracker / Menu Editor]

[Describe. Include any cross-device notes if relevant.]

### Tab 3: Social Poster *(remove if not active)*

[Describe: upload photo → AI writes 3 captions → pick one → post to FB + Instagram simultaneously.]

---

## 5. How to test everything yourself

### Test the customer experience

1. Open **[SITE_URL]** in your browser (or a different device/incognito window)
2. Click the chat bubble
3. Select **[FLOW NAME]** and go through the full flow using your own name and phone
4. Confirm: [what should happen — e.g., confirmation message, lead in dashboard, email received]

### Test the [SECOND FEATURE — Properties / Job Tracker]

[Step-by-step test for the second tab if applicable.]

### Test the email notification

Once Chris has set your email (Section 8):
1. Go through a test chat
2. Check your inbox for the notification email
3. Confirm subject line, contact details, and dashboard button are correct
4. Mark as Not Spam the first time

---

## 6. Social media poster — how it works

*(Remove this section if social poster is not yet active for this client.)*

From the Social tab in your dashboard:

1. **Upload a photo** — drag and drop, click to select, or use your phone camera
2. **AI generates 3 captions** — written in your brand voice, ready to post
3. **Pick and optionally edit** the caption you prefer
4. **Click Post** — goes live on Facebook and Instagram simultaneously

Good uses: available units/jobs, neighborhood photos, before/afters, team shots, deal closings.

> This feature requires a one-time Facebook and Instagram setup — see Section 7.

---

## 7. Facebook & Instagram setup — what you need to do

*(Remove if social poster is not being set up yet.)*

Chris needs three things to activate the Social Poster:

---

### Step A: Make sure you have a Facebook Business Page

If you already have one, skip to Step B.

1. Go to **facebook.com/pages/create**
2. Choose "Business or Brand"
3. Page name: **[BUSINESS_NAME]**
4. Category: **[RELEVANT CATEGORY]**
5. Add profile photo and cover photo → Publish

---

### Step B: Connect Instagram to your Facebook Page

Your Instagram must be a Business account linked to your Facebook Page.

1. Open Instagram → Profile → Settings and Privacy → Account
2. Tap "Switch to Professional Account" → choose **Business**
3. When prompted, connect to your **[BUSINESS_NAME] Facebook Page**

If already a Business account but not linked:
1. Instagram → Profile → Settings → "Linked accounts" → Facebook → select your Page

---

### Step C: Add Chris as an Admin on your Facebook Page

1. Go to your **[BUSINESS_NAME] Facebook Page** (not your personal profile)
2. Click "Manage" or the gear/settings icon
3. Left sidebar → **"Page Access"**
4. Under "People with Facebook Access" → **"Add New"**
5. Search for **Christopher Hercules** — look for his profile photo to confirm the right account
6. Toggle on **"Allow this person to have full control of your Page"**
7. Click "Give Access" → confirm with your Facebook password

---

### Step D: Find your Facebook Page ID

1. Go to your Facebook Page → three dots (···) → "About"
2. Scroll to the bottom — look for **"Page ID"** (a long number like `287364891234567`)
3. Copy it and send to Chris

---

### Step E: Find your Instagram Business Account ID

1. Go to **business.facebook.com**
2. Grid icon (≡) → Settings → Accounts → Instagram accounts
3. Click your account — the **Instagram Account ID** appears (long number like `17841400123456789`)
4. Send to Chris

---

### What to send Chris when done

1. Confirm you added Christopher Hercules as admin (he'll get a Facebook notification)
2. Your **Facebook Page ID**
3. Your **Instagram Business Account ID**

---

## 8. Providing your email for notifications

Lead notifications currently go to Chris's inbox while your site is being set up. To receive them yourself:

**Send Chris your preferred business email address.** He will update the system so notifications come directly to you.

Once updated:
- New leads will email you directly
- From name: **[BUSINESS_NAME]**
- From address: **notifications@myserviceflows.com** (or `notifications@aiagentassistance.com` for food sites)
- Check spam the first time and mark as Not Spam

---

## 9. Phone text notifications

[Choose one:]

**Option A — Active:**
A text is sent to **[PHONE]** for every new lead. It includes the client's name, phone, key details, and a dashboard link.

**Option B — Pending:**
Text notifications to **[PHONE]** are set up but waiting on phone number carrier approval (submitted — typically 2–4 weeks). Chris will notify you when active. Email notifications (Section 8) are fully working in the meantime.

---

## Quick Reference

| Thing | Value |
|---|---|
| Your website | [SITE_URL] |
| Your dashboard | [DASHBOARD_URL] |
| Dashboard password | `[DASHBOARD_PASSWORD]` |
| Your business phone | [BUSINESS_PHONE] |
| Notification email | Send Chris your email to activate |
| Text notifications | [Active / Pending carrier approval] |
| Social poster | [Active / Pending Facebook/Instagram setup] |
| Support | chris@aiagentassistance.com |

---

## Placeholder reference

| Placeholder | Description | Example |
|---|---|---|
| `[BUSINESS_NAME]` | Full business name | WSTN Apartment Locating |
| `[CONTACT_FIRST_NAME]` | Client's first name | Brogan |
| `[SITE_URL]` | Public site URL | https://livewstn.myserviceflows.com |
| `[DASHBOARD_URL]` | Dashboard URL | https://livewstn.myserviceflows.com/dashboard.html |
| `[DASHBOARD_PASSWORD]` | Dashboard login | WSTN2025! |
| `[PHONE]` | SMS notification number | (210) 394-0238 |
| `[BUSINESS_PHONE]` | Business's public phone | (210) 394-0238 |
| `[EMOJI]` | Lead type emoji | 🏢 🏡 🏠 🌲 🪵 🍔 |
| `[LEAD_TYPE]` | Lead type label | Apartment Seeker, Home Buyer, Estimate |
| `[FLOW NAME]` | Chat flow name | Find an Apartment, Request an Estimate |
| `[MAIN TAB NAME]` | First dashboard tab | Leads, Orders, Estimates |
| `[SECOND TAB]` | Second dashboard tab | Properties, Job Tracker, Menu Editor |
| `[VERTICAL STATUS]` | Status options for that vertical | Showing, Quoted, Scheduled |
| `[RELEVANT CATEGORY]` | Facebook page category | Real Estate Agent, General Contractor |
