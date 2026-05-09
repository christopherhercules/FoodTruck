# Run this ONCE to import existing AWS resources into Terraform state.
# Usage: cd terraform && .\import.ps1

$ErrorActionPreference = "Stop"
Write-Output "Importing existing AWS resources into Terraform state..."

# ── S3 BUCKETS ─────────────────────────────────────────────────────────────────
Write-Output "`nImporting S3 buckets..."
terraform import aws_s3_bucket.main aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"maschingonrestaurant\"]'  maschingonrestaurant.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"maschingonfoodtruck\"]'   maschingonfoodtruck.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"bar1859\"]'               bar1859.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"sylviastacos\"]'          sylviastacos.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"donjuliostacos\"]'        donjuliostacos.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"hechoenqueso\"]'          hechoenqueso.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"happypizza\"]'            happypizza.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"sacredsandwich\"]'        sacredsandwich.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"thatgreentrailer\"]'      thatgreentrailer.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"bigtonys\"]'              bigtonys.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"potatowagon\"]'           potatowagon.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"ribtips\"]'               ribtips.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"simplyporkfection\"]'     simplyporkfection.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"bobbyque\"]'              bobbyque.aiagentassistance.com
terraform import 'aws_s3_bucket.sites[\"sodafusion\"]'            sodafusion.aiagentassistance.com

# ── CLOUDFRONT DISTRIBUTIONS ───────────────────────────────────────────────────
Write-Output "`nImporting CloudFront distributions..."
terraform import aws_cloudfront_distribution.main                                   E2XZO5W5USC953
terraform import 'aws_cloudfront_distribution.sites[\"maschingonrestaurant\"]'     E1JMALNI27Q99W
terraform import 'aws_cloudfront_distribution.sites[\"maschingonfoodtruck\"]'      E1JCENEMMOA1XD
terraform import 'aws_cloudfront_distribution.sites[\"bar1859\"]'                  E3VZ9ZHVDGRQL8
terraform import 'aws_cloudfront_distribution.sites[\"sylviastacos\"]'             E2VWHO9M9WSI5I
terraform import 'aws_cloudfront_distribution.sites[\"donjuliostacos\"]'           E3MLXW70MN82OV
terraform import 'aws_cloudfront_distribution.sites[\"hechoenqueso\"]'             EACJN8TEZHVJO
terraform import 'aws_cloudfront_distribution.sites[\"happypizza\"]'               EZKNUVWNIYDUJ
terraform import 'aws_cloudfront_distribution.sites[\"sacredsandwich\"]'           E3VEJ8NHBS05R7
terraform import 'aws_cloudfront_distribution.sites[\"thatgreentrailer\"]'         E5JF2RFLX00SM
terraform import 'aws_cloudfront_distribution.sites[\"bigtonys\"]'                 E3I4GOPRU4FLQK
terraform import 'aws_cloudfront_distribution.sites[\"potatowagon\"]'              EBNQK0ZWMCUQK
terraform import 'aws_cloudfront_distribution.sites[\"ribtips\"]'                  E1DHR59ENQ5PG8
terraform import 'aws_cloudfront_distribution.sites[\"simplyporkfection\"]'        E1FP8878DA9K48
terraform import 'aws_cloudfront_distribution.sites[\"bobbyque\"]'                 E2C4ZZFCKUKJE5
terraform import 'aws_cloudfront_distribution.sites[\"sodafusion\"]'               E296LW6N5LIB7M

# ── ROUTE53 RECORDS ────────────────────────────────────────────────────────────
Write-Output "`nImporting Route53 records..."
terraform import aws_route53_record.main                                          Z07479021E42SUEMRPV9M_aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"maschingonrestaurant\"]'  Z07479021E42SUEMRPV9M_maschingonrestaurant.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"maschingonfoodtruck\"]'   Z07479021E42SUEMRPV9M_maschingonfoodtruck.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"bar1859\"]'               Z07479021E42SUEMRPV9M_bar1859.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"sylviastacos\"]'          Z07479021E42SUEMRPV9M_sylviastacos.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"donjuliostacos\"]'        Z07479021E42SUEMRPV9M_donjuliostacos.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"hechoenqueso\"]'          Z07479021E42SUEMRPV9M_hechoenqueso.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"happypizza\"]'            Z07479021E42SUEMRPV9M_happypizza.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"sacredsandwich\"]'        Z07479021E42SUEMRPV9M_sacredsandwich.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"thatgreentrailer\"]'      Z07479021E42SUEMRPV9M_thatgreentrailer.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"bigtonys\"]'              Z07479021E42SUEMRPV9M_bigtonys.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"potatowagon\"]'           Z07479021E42SUEMRPV9M_potatowagon.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"ribtips\"]'               Z07479021E42SUEMRPV9M_ribtips.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"simplyporkfection\"]'     Z07479021E42SUEMRPV9M_simplyporkfection.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"bobbyque\"]'              Z07479021E42SUEMRPV9M_bobbyque.aiagentassistance.com_A
terraform import 'aws_route53_record.sites[\"sodafusion\"]'            Z07479021E42SUEMRPV9M_sodafusion.aiagentassistance.com_A

Write-Output "Import complete. Run terraform plan to verify - should show no changes."
