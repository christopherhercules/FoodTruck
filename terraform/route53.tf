# ── MAIN DOMAIN ───────────────────────────────────────────────────────────────
resource "aws_route53_record" "main" {
  zone_id = var.hosted_zone_id
  name    = var.domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.main.domain_name
    zone_id                = "Z2FDTNDATAQYW2" # CloudFront hosted zone (always this value)
    evaluate_target_health = false
  }
}

# ── FOOD TRUCK SUBDOMAINS ──────────────────────────────────────────────────────
resource "aws_route53_record" "sites" {
  for_each = toset(var.sites)
  zone_id  = var.hosted_zone_id
  name     = "${each.key}.${var.domain}"
  type     = "A"

  alias {
    name                   = aws_cloudfront_distribution.sites[each.key].domain_name
    zone_id                = "Z2FDTNDATAQYW2"
    evaluate_target_health = false
  }
}
