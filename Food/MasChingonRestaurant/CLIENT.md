# Mas Chingon Restaurant — Client Reference

## Contact
| | |
|---|---|
| Phone | (254) 721-5510 |

## Brand
| | |
|---|---|
| Primary | `#D62828` — red |
| Primary dark | `#A81F1F` — red dark |
| Accent | `#F4A261` — amber |
| Green | `#52B788` |
| Background | `#1A1A1A` — dark |
| Light bg | `#F8F6F2` |
| Logo markup | `Mas <span style="color:#F4A261;">Chingon</span>` |
| Font | system sans-serif (nav), styled text logo |

## Infrastructure
| | |
|---|---|
| URL | https://maschingonrestaurant.aiagentassistance.com |
| S3 bucket | `maschingonrestaurant.aiagentassistance.com` |
| CloudFront | `E1JMALNI27Q99W` |
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
- [ ] AppSync not yet wired to frontend (same status as WSTN)
