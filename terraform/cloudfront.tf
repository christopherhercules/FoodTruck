# ── MAIN LANDING PAGE DISTRIBUTION ────────────────────────────────────────────
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  aliases             = [var.domain]

  origin {
    domain_name              = aws_s3_bucket.main.bucket_regional_domain_name
    origin_id                = "s3-${var.domain}"
    origin_access_control_id = var.oac_id
  }

  default_cache_behavior {
    target_origin_id       = "s3-${var.domain}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }
}

# ── FOOD TRUCK SITE DISTRIBUTIONS (one per site) ───────────────────────────────
resource "aws_cloudfront_distribution" "sites" {
  for_each            = toset(var.sites)
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  aliases             = ["${each.key}.${var.domain}"]

  origin {
    domain_name              = aws_s3_bucket.sites[each.key].bucket_regional_domain_name
    origin_id                = "s3-${each.key}.${var.domain}"
    origin_access_control_id = var.oac_id
  }

  default_cache_behavior {
    target_origin_id       = "s3-${each.key}.${var.domain}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }
}
