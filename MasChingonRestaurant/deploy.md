# Mas Chingon Restaurant — Deployment Guide

## Demo URL
`http://restaurant.aiagentassistance.com`
S3 Bucket: `restaurant.aiagentassistance.com`

---

## One-Time AWS Setup

### 1. Create S3 bucket
```bash
aws s3 mb s3://restaurant.aiagentassistance.com --region us-east-1
```

### 2. Enable static website hosting
```bash
aws s3 website s3://restaurant.aiagentassistance.com \
  --index-document index.html \
  --error-document index.html
```

### 3. Disable block public access
```bash
aws s3api put-public-access-block \
  --bucket restaurant.aiagentassistance.com \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

### 4. Set public read policy
```bash
aws s3api put-bucket-policy --bucket restaurant.aiagentassistance.com --policy "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PublicReadGetObject\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::restaurant.aiagentassistance.com/*\"}]}"
```

### 5. Add DNS record in Route 53
In Route 53 → Hosted Zone for `aiagentassistance.com`:
- Type: `CNAME`
- Name: `restaurant`
- Value: `restaurant.aiagentassistance.com.s3-website-us-east-1.amazonaws.com`

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
- `REPLACE_WITH_RESTAURANT_APPSYNC_URL` → value of `data.url`
- `REPLACE_WITH_RESTAURANT_API_KEY` → value of `data.api_key`

---

## Deploy / Update Website Files

```bash
cd "C:\Users\chris\.windsurf\FoodTruck\MasChingonRestaurant"

aws s3 cp website/index.html           s3://restaurant.aiagentassistance.com/index.html           --content-type "text/html"
aws s3 cp website/order.html           s3://restaurant.aiagentassistance.com/order.html           --content-type "text/html"
aws s3 cp website/track-order.html     s3://restaurant.aiagentassistance.com/track-order.html     --content-type "text/html"
aws s3 cp website/staff-dashboard.html s3://restaurant.aiagentassistance.com/staff-dashboard.html --content-type "text/html"
```

## Upload images
```bash
aws s3 cp images/ s3://restaurant.aiagentassistance.com/ --recursive
```

---

## When client commits — point to real domain
1. Create new bucket named `newdomain.com`
2. Run same S3 setup steps above with new bucket name
3. Upload files to new bucket
4. Update DNS at client's registrar → point to S3 website endpoint

---

## Staff Login
Password: `Restaurant2025!`
File: `website/staff-dashboard.html` → `const STAFF_PASSWORD`
