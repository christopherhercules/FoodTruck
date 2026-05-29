# Shawn's Cabinets — Client Reference

## Contact
| | |
|---|---|
| Owner | Shawn |
| Phone | (254) 444-9135 |
| Email | christopherhercules@outlook.com _(placeholder — update with Shawn's real email)_ |

## Brand
| | |
|---|---|
| Primary | `#c4a35a` — warm gold/brass (accent) |
| Secondary | `#e6a817` — amber |
| Background | `#0f0d0b` — near black |
| Card bg | `#1e1a16` — dark walnut |
| Text | `#f0e8d5` — warm cream |
| Font (logo) | Playfair Display, serif |
| Logo markup | `<span style="font-family:Georgia,serif;color:#c4a35a;">Shawn's <em style="font-style:normal;">Cabinets</em></span>` |

## Infrastructure
| | |
|---|---|
| URL | https://cabinets.myserviceflows.com |
| S3 bucket | `cabinets.myserviceflows.com` (contractor AWS account) |
| CloudFront | `EKL5C73BJZJER` |
| Terraform stack | `Contractor/terraform/` |
| AWS profile | `contractor` (account `082569478855`) |

## Backend
| | |
|---|---|
| AppSync endpoint | `https://hri5vhqwvjd3flmcdxk6rzvi4e.appsync-api.us-east-1.amazonaws.com/graphql` |
| Amplify stack | `amplify-contractorplatform-chris-sandbox-6c197c7d8a` |
| Models | `CabinetsEstimate` |
| Dashboard | https://cabinets.myserviceflows.com/dashboard.html |

## Open Items
- [ ] Confirm Shawn's real contact email and update site + CLIENT.md
- [ ] Confirm Render env vars for Cabinets email notifications
