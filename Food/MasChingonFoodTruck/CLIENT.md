# Mas Chingon Food Truck — Client Reference

## Contact
| | |
|---|---|
| Phone | (254) 721-5510 |

## Brand
| | |
|---|---|
| Primary | `#D62828` — red |
| Primary dark | `#A81F1F` — red dark |
| Accent | `#F5C518` — yellow |
| Accent dark | `#D4A800` — yellow dark |
| Background | `#1A1A1A` — dark |
| Light bg | `#FFFBF0` |
| Logo markup | `MAS <span style="color:#F5C518;">CHINGON</span>` |
| Hero image | `https://aiagentassistance.com/FoodTruck.jpg` |

## Infrastructure
| | |
|---|---|
| URL | https://maschingonfoodtruck.aiagentassistance.com |
| S3 bucket | `maschingonfoodtruck.aiagentassistance.com` |
| CloudFront | `E1JCENEMMOA1XD` |
| Terraform stack | `terraform/` (food vertical) |
| AWS profile | `default` (account `699242704305`) |

## Backend
| | |
|---|---|
| AppSync endpoint | `https://d2zlzofjerf4hd6gltypy2rnlm.appsync-api.us-east-1.amazonaws.com/graphql` |
| Amplify stack | `amplify-maschingonordering-chris-sandbox-344c629bf8` |
| Models | `Order`, `MenuItem`, `TableAssignment`, `Customer` |
| SMS ordering | Twilio `+18443214664` → Render webhook |

## Open Items
- [ ] Twilio toll-free approval — SMS blocked until approved
- [ ] AppSync not yet wired to frontend
