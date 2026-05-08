# MasChingon Food Truck — Deploy Notes

## Live URL
`http://maschingonfoodtruck.aiagentassistance.com.s3-website-us-east-1.amazonaws.com`

After Route 53 CNAME:
`http://maschingonfoodtruck.aiagentassistance.com`

## S3 Bucket
`maschingonfoodtruck.aiagentassistance.com`

## Backend
Shares the MasChingon Restaurant backend (same AppSync + DynamoDB).
No separate sandbox needed.

AppSync URL: `https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql`
API Key: `da2-6l2dtmahczbbnlp3m2vmgihqby`

## Staff Login
Password: `FoodTruck2025!`

## Pages
| Page | URL |
|------|-----|
| Homepage | `/index.html` |
| Order (Pickup only) | `/order.html` |
| Track Order | `/track-order.html` |
| Staff Dashboard | `/staff-dashboard.html` |

## Upload Commands
```bash
cd C:\Users\chris\.windsurf\FoodTruck\MasChingonFoodTruck
aws s3 cp website/index.html s3://maschingonfoodtruck.aiagentassistance.com/index.html --content-type "text/html"
aws s3 cp website/order.html s3://maschingonfoodtruck.aiagentassistance.com/order.html --content-type "text/html"
aws s3 cp website/track-order.html s3://maschingonfoodtruck.aiagentassistance.com/track-order.html --content-type "text/html"
aws s3 cp website/staff-dashboard.html s3://maschingonfoodtruck.aiagentassistance.com/staff-dashboard.html --content-type "text/html"
```

## Route 53 — Manual Step
Add a CNAME record in Route 53 for `aiagentassistance.com`:
- **Name:** `maschingonfoodtruck`
- **Type:** CNAME
- **Value:** `maschingonfoodtruck.aiagentassistance.com.s3-website-us-east-1.amazonaws.com`
- **TTL:** 300

## Notes
- Pickup-only ordering (no dine-in, no table number)
- Staff dashboard password: `FoodTruck2025!`
- Shares same AppSync backend as MasChingon Restaurant
- Color scheme: dark background, yellow (#F5C518) accent, red (#D62828)
- Fonts: Bebas Neue (headings), Outfit (body)
