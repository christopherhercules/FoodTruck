# WSTN Apartment Locating — Client Reference

## Contact
| | |
|---|---|
| Agent | Brogan |
| Phone | (210) 394-0238 |
| Email | wstnapartmentlocating@gmail.com |
| SMS notify | +12103940238 (`WSTN_NOTIFY_PHONE`) |

## Brand
| | |
|---|---|
| Primary | `#C8913A` — gold |
| Background | `#0D1B2A` — navy |
| Font (logo) | Playfair Display, serif |
| Logo markup | `<span style="font-family:Georgia,serif;color:#C8913A;font-size:26px;font-weight:700;letter-spacing:.08em;">WSTN</span>` + `<span style="font-size:9px;color:rgba(255,255,255,.45);letter-spacing:.18em;text-transform:uppercase;display:block;margin-top:3px;">Apartment Locating</span>` |

## Infrastructure
| | |
|---|---|
| URL | https://livewstn.myserviceflows.com |
| S3 bucket | `livewstn.myserviceflows.com` (contractor AWS account) |
| CloudFront | `E3PM5DNV9RRO3N` |
| Terraform stack | `Contractor/terraform/` |
| AWS profile | `contractor` (account `082569478855`) |

## Backend
| | |
|---|---|
| AppSync endpoint | `https://fatiu5musjes5clnyalazphytu.appsync-api.us-east-1.amazonaws.com/graphql` |
| API key | `da2-k2xaghsoq5ggjdsgta4tzf2zha` |
| Amplify stack | `amplify-contractorplatform-chris-sandbox-6c197c7d8a` |
| Models | `WSTNLead` |
| Dashboard | https://livewstn.myserviceflows.com/dashboard.html |

## Render Env Vars
| Var | Value |
|---|---|
| `WSTN_NOTIFY_EMAIL` | `admin@aiagentassistance.com` (set in Render) |
| `WSTN_NOTIFY_PHONE` | `+12103940238` |
| `WSTN_EMAIL_FROM` | _(not set — falls back to `christopherhercules@outlook.com`)_ |
| `WSTN_FB_PAGE_TOKEN` | _(pending — Brogan must grant FB Page Admin)_ |
| `WSTN_FB_PAGE_ID` | _(pending)_ |
| `WSTN_IG_USER_ID` | _(pending)_ |

## Open Items
- [ ] Twilio toll-free approval — SMS blocked until approved
- [ ] Wire properties to AppSync (currently localStorage — broken cross-device)
- [ ] Social poster: create S3 bucket `wstn-social.myserviceflows.com`, add FB/IG env vars
- [ ] Add WSTN to `variable "contractors"` in `Contractor/terraform/variables.tf`
