# setup-ssm.ps1
#
# Run this once (or after rotating) to create/update all secrets in SSM Parameter Store.
# All parameters are stored as SecureString (encrypted with AWS managed KMS key — free).
#
# Usage:
#   .\setup-ssm.ps1
#
# To update a single parameter after rotation:
#   aws ssm put-parameter --name "/foodtruck/twilio/auth_token" --value "NEW_VALUE" --type SecureString --overwrite

$Region = "us-east-1"

function Set-Param {
  param(
    [string]$Name,
    [string]$Value,
    [string]$Description
  )
  if (-not $Value -or $Value -match "^REPLACE_") {
    Write-Host "  SKIP  $Name (no value provided)" -ForegroundColor Yellow
    return
  }
  aws ssm put-parameter `
    --name        $Name `
    --value       $Value `
    --type        SecureString `
    --description $Description `
    --overwrite `
    --region      $Region | Out-Null
  Write-Host "  OK    $Name" -ForegroundColor Green
}

Write-Host "`nCreating SSM parameters in $Region...`n"

# ── APPSYNC ────────────────────────────────────────────────────────────────
Set-Param "/foodtruck/appsync/api_key" `
  "REPLACE_WITH_APPSYNC_API_KEY" `
  "AppSync API key for food truck GraphQL backend"

# ── TWILIO ─────────────────────────────────────────────────────────────────
Set-Param "/foodtruck/twilio/account_sid" `
  "REPLACE_WITH_TWILIO_ACCOUNT_SID" `
  "Twilio Account SID (starts with AC...)"

Set-Param "/foodtruck/twilio/auth_token" `
  "REPLACE_WITH_TWILIO_AUTH_TOKEN" `
  "Twilio Auth Token"

Set-Param "/foodtruck/twilio/from_number" `
  "+18443214664" `
  "Twilio toll-free from number"

# ── TOAST POS ──────────────────────────────────────────────────────────────
Set-Param "/foodtruck/toast/client_id" `
  "REPLACE_WITH_TOAST_CLIENT_ID" `
  "Toast API Client ID"

Set-Param "/foodtruck/toast/client_secret" `
  "REPLACE_WITH_TOAST_CLIENT_SECRET" `
  "Toast API Client Secret"

Set-Param "/foodtruck/toast/restaurant_guid" `
  "REPLACE_WITH_TOAST_RESTAURANT_GUID" `
  "Toast Restaurant GUID"

Set-Param "/foodtruck/toast/webhook_secret" `
  "REPLACE_WITH_TOAST_WEBHOOK_SECRET" `
  "Toast webhook signature secret"

# ── ANTHROPIC ──────────────────────────────────────────────────────────────
Set-Param "/foodtruck/anthropic/api_key" `
  "REPLACE_WITH_ANTHROPIC_API_KEY" `
  "Anthropic API key for Cabinets AI plan analysis"

# ── HUNTER LAND CLEARING ───────────────────────────────────────────────────
Set-Param "/contractor/hunter/notify_phone" `
  "+18308327065" `
  "Jason phone — receives SMS on new Hunter estimates"

Set-Param "/contractor/hunter/email_from" `
  "REPLACE_WITH_HUNTER_EMAIL_FROM" `
  "SES verified sender address for Hunter notifications"

Set-Param "/contractor/hunter/email_to" `
  "REPLACE_WITH_HUNTER_EMAIL_TO" `
  "Recipient address for Hunter estimate notifications"

# ── SHAWN CABINETS ─────────────────────────────────────────────────────────
Set-Param "/contractor/cabinets/notify_email" `
  "REPLACE_WITH_CABINETS_NOTIFY_EMAIL" `
  "Recipient address for Cabinets estimate notifications"

# ── MAPBOX ─────────────────────────────────────────────────────────────────
Set-Param "/contractor/hunter/mapbox_token" `
  "pk.eyJ1IjoiY2hyaXN0b3BoZXJoZXJjdWxlcyIsImEiOiJjbXA4aHRrMHcwN3RiMnJzNjBzeWZ3ZHIxIn0.Kgx5YEB2aA4TchyXR989Zw" `
  "Mapbox public token for Hunter job maps"

Write-Host "`nDone. Verify with:`n  aws ssm get-parameters-by-path --path / --recursive --with-decryption --region $Region`n"
