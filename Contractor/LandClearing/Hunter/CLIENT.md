# Hunter Land Clearing — Client Reference

## Contact
| | |
|---|---|
| Owner | Jason |
| Phone | (830) 832-7065 |
| Email | hunterlandclearing@yahoo.com |
| Notification email | `hunterlandclearing@yahoo.com` (`HUNTER_EMAIL_TO` in Render) |

## Brand
| | |
|---|---|
| Primary | `#2E5E12` — forest green |
| Accent | `#D4821A` — amber |
| Light accent | `#F0A030` — amber light |
| Background | dark green/brown with outdoor image overlay |
| Logo | Image — `/assets/hunter-01-acfd7b28-1920w.png` |
| Font | Montserrat (headings), Open Sans (body) |

## Infrastructure
| | |
|---|---|
| URL | https://hunter.myserviceflows.com |
| S3 bucket | `hunter.myserviceflows.com` (contractor AWS account) |
| CloudFront | _(in Contractor/terraform — check `terraform output`)_ |
| Terraform stack | `Contractor/terraform/` |
| AWS profile | `contractor` (account `082569478855`) |

## Backend
| | |
|---|---|
| AppSync endpoint | `https://hri5vhqwvjd3flmcdxk6rzvi4e.appsync-api.us-east-1.amazonaws.com/graphql` |
| Amplify stack | `amplify-contractorplatform-chris-sandbox-6c197c7d8a` |
| Models | `HunterEstimate` |
| Dashboard | https://hunter.myserviceflows.com/dashboard.html |

## Render Env Vars
| Var | Value |
|---|---|
| `HUNTER_EMAIL_TO` | `hunterlandclearing@yahoo.com` (visible in Render) |

## Open Items
- [ ] Social poster: `WSTN_FB_PAGE_TOKEN` pattern — Hunter social routes already built
- [ ] Confirm CloudFront ID (not in cloudfront_imports.tf — contractor stack is separate)
