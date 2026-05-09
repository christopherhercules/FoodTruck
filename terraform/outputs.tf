output "site_urls" {
  description = "All live site URLs"
  value = merge(
    { "main" = "https://${var.domain}" },
    { for s in var.sites : s => "https://${s}.${var.domain}" }
  )
}

output "cloudfront_ids" {
  description = "CloudFront distribution IDs for cache invalidation"
  value = merge(
    { "main" = aws_cloudfront_distribution.main.id },
    { for s in var.sites : s => try(aws_cloudfront_distribution.sites[s].id, "not-yet-imported") }
  )
}
