# 1859 Bar — Deployment Guide

## Demo URL
`http://bar.aiagentassistance.com`
S3 Bucket: `bar.aiagentassistance.com`

---

## One-Time AWS Setup

### 1. Create S3 bucket
```bash
aws s3 mb s3://bar.aiagentassistance.com --region us-east-1
```

### 2. Enable static website hosting
```bash
aws s3 website s3://bar.aiagentassistance.com \
  --index-document index.html \
  --error-document index.html
```

### 3. Disable block public access
```bash
aws s3api put-public-access-block \
  --bucket bar.aiagentassistance.com \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

### 4. Set public read policy
```bash
aws s3api put-bucket-policy --bucket bar.aiagentassistance.com --policy "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PublicReadGetObject\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::bar.aiagentassistance.com/*\"}]}"
```

### 5. Add DNS record in Route 53
In Route 53 → Hosted Zone for `aiagentassistance.com`:
- Type: `CNAME`
- Name: `bar`
- Value: `bar.aiagentassistance.com.s3-website-us-east-1.amazonaws.com`

### 6. Deploy Amplify backend (new AppSync + DynamoDB for this site)
```bash
cd backend
npm install
npx ampx sandbox
```
When done, open `amplify_outputs.json` and update these 3 files:
- `website/order.html`
- `website/track-order.html`
- `website/staff-dashboard.html`

Replace:
- `REPLACE_WITH_1859BAR_APPSYNC_URL` → value of `data.url`
- `REPLACE_WITH_1859BAR_API_KEY` → value of `data.api_key`

### 7. Populate bar menu & tables (run once after sandbox is up)
```bash
cd backend
node scripts/populate-bar-menu.js
node scripts/populate-bar-tables.js
node scripts/test-bar-order.js
```

---

## Deploy / Update Website Files

```bash
cd "C:\Users\chris\.windsurf\FoodTruck\1859Bar"

aws s3 cp website/index.html           s3://bar.aiagentassistance.com/index.html           --content-type "text/html"
aws s3 cp website/order.html           s3://bar.aiagentassistance.com/order.html           --content-type "text/html"
aws s3 cp website/track-order.html     s3://bar.aiagentassistance.com/track-order.html     --content-type "text/html"
aws s3 cp website/staff-dashboard.html s3://bar.aiagentassistance.com/staff-dashboard.html --content-type "text/html"
```

## Upload images
```bash
aws s3 cp images/ s3://bar.aiagentassistance.com/ --recursive
```

---

## When client commits — point to real domain
1. Create new bucket named `newdomain.com`
2. Run same S3 setup steps above with new bucket name
3. Upload files to new bucket
4. Update DNS at client's registrar → point to S3 website endpoint

---

## Staff Login
Password: `1859Bar2025!`
File: `website/staff-dashboard.html` → `const STAFF_PASSWORD`
