# ── MAIN LANDING PAGE BUCKET ──────────────────────────────────────────────────
resource "aws_s3_bucket" "main" {
  bucket = var.domain
}

resource "aws_s3_bucket_public_access_block" "main" {
  bucket                  = aws_s3_bucket.main.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "main" {
  bucket = aws_s3_bucket.main.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowCloudFrontOAC"
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.main.arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.main.arn
        }
      }
    }]
  })
}

# ── FOOD TRUCK SITE BUCKETS (one per site) ─────────────────────────────────────
resource "aws_s3_bucket" "sites" {
  for_each = toset(var.sites)
  bucket   = "${each.key}.${var.domain}"
}

resource "aws_s3_bucket_public_access_block" "sites" {
  for_each                = toset(var.sites)
  bucket                  = aws_s3_bucket.sites[each.key].id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "sites" {
  for_each = toset(var.sites)
  bucket   = aws_s3_bucket.sites[each.key].id
  policy   = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowCloudFrontOAC"
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.sites[each.key].arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.sites[each.key].arn
        }
      }
    }]
  })
}
