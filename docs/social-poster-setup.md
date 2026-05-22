# Social Poster Setup — New Client SOP

One-time setup to connect a contractor's Facebook Page and Instagram Business account
to the AI Social Poster tool. Takes about 20 minutes.

---

## Prerequisites

- Client's Facebook Page (must be a Business or Professional Page)
- Client's Instagram account switched to **Business** type (not Creator, not Personal)
- Instagram account connected to the Facebook Page via Meta Business Suite
- You are added as an **Admin** on the Facebook Page
- A Meta Developer App created for this client (or use the shared app)

---

## Step 1 — Create / Configure the Meta App

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps)
2. Create a new app → type: **Business**
3. In **Use Cases**, add:
   - **"Manage everything on your Page"** → add these permissions:
     - `pages_show_list`
     - `pages_read_engagement`
     - `pages_manage_posts`
   - **"Manage messaging & content on Instagram"** → add these permissions:
     - `instagram_basic`
     - `instagram_content_publish`
4. Save the **App ID** and **App Secret** (Settings → Basic → Show)

---

## Step 2 — Connect Instagram to Facebook Page

1. Go to [business.facebook.com](https://business.facebook.com)
2. Select the client's Page
3. Click **Settings → Linked Accounts → Instagram**
4. Log into the client's Instagram account and connect it
5. Confirm the account shows as **Business** type (Instagram app → Settings → Account type)

---

## Step 3 — Get the Never-Expiring Page Token

This is the token that goes in SSM. Do this carefully — a short-lived token expires in 1 hour.

### 3a. Get a short-lived user token

1. Go to [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. Select the client's app
3. Click **Generate Access Token**
4. Check ALL of these permissions:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `instagram_basic`
   - `instagram_content_publish`
5. Approve the popup → copy the token

### 3b. Exchange for a long-lived user token

Run this (replace values):

```bash
curl "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
```

Copy the `access_token` from the response.

### 3c. Get the never-expiring page token

```bash
curl "https://graph.facebook.com/v19.0/me/accounts?access_token=LONG_LIVED_USER_TOKEN"
```

From the response, copy the `access_token` for the matching page. Also note the page `id`.

> **Why this works:** Page tokens derived from long-lived user tokens never expire,
> as long as the app remains active and the user stays as Page admin.

---

## Step 4 — Get the Instagram Business Account ID

```bash
curl "https://graph.facebook.com/v19.0/PAGE_ID?fields=instagram_business_account&access_token=PAGE_TOKEN"
```

Copy the `id` from `instagram_business_account`. This is the Instagram User ID.

---

## Step 5 — Store Credentials in AWS SSM

Run these via PowerShell (Bash will corrupt the leading `/` on Windows):

```powershell
# Page token (never expires)
aws ssm put-parameter --name "/contractor/CLIENT/facebook_token" `
  --value "PAGE_TOKEN" --type SecureString --overwrite --region us-east-1

# Facebook Page ID
aws ssm put-parameter --name "/contractor/CLIENT/facebook_page_id" `
  --value "PAGE_ID" --type String --overwrite --region us-east-1

# Instagram Business Account ID
aws ssm put-parameter --name "/contractor/CLIENT/instagram_id" `
  --value "IG_USER_ID" --type String --overwrite --region us-east-1
```

---

## Step 6 — Wire Up the Server

In `integrations/secrets.js`, add the three new mappings:

```js
'/contractor/CLIENT/facebook_token':    'CLIENT_FB_PAGE_TOKEN',
'/contractor/CLIENT/facebook_page_id':  'CLIENT_FB_PAGE_ID',
'/contractor/CLIENT/instagram_id':      'CLIENT_IG_USER_ID',
```

In `integrations/server.js`, mount the social route:

```js
const clientSocialApp = require('./CLIENT/social');
app.use(clientSocialApp);
```

Create `integrations/CLIENT/social.js` (copy from `hunter/social.js`, update env var names,
S3 bucket name, and Claude Vision prompt to match the client's business).

---

## Step 7 — Create the Public S3 Bucket

Instagram requires a publicly accessible image URL. Create a bucket:

```bash
aws s3api create-bucket --bucket CLIENT-social.myserviceflows.com --region us-east-1
aws s3api delete-public-access-block --bucket CLIENT-social.myserviceflows.com
```

Apply this bucket policy (replace bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::CLIENT-social.myserviceflows.com/*"
  }]
}
```

```bash
aws s3api put-bucket-policy --bucket CLIENT-social.myserviceflows.com --policy file://policy.json
```

---

## Step 8 — Deploy & Test

1. Commit and push to GitHub → Render auto-deploys
2. Or trigger a manual deploy from the Render dashboard
3. Open the social poster page, upload a job photo
4. Confirm AI captions generate (3 options appear)
5. Select a caption → click **Post to Facebook & Instagram**
6. Confirm both show green ✅

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `Session has expired` | Short-lived token stored in SSM | Redo Step 3, store the page token from Step 3c |
| `Requires instagram_content_publish` | Permission missing from app | Add in Use Cases → Step 1, regenerate token |
| `Cannot parse access token` | Token corrupted during copy/paste | Regenerate from Graph API Explorer |
| `me/accounts returns empty []` | `pages_show_list` not granted in OAuth flow | Regenerate token with that permission checked |
| Instagram not returned from Page query | Instagram not connected or wrong account type | Step 2 — must be Business (not Creator) |
| Captions not appearing | `show()` JS bug or server not deployed | Check Render deploy; verify `/hunter/social/caption` returns 200 |
| S3 upload fails | Bucket not public or doesn't exist | Step 7 — check Block Public Access is fully off |
