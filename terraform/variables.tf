variable "domain" {
  default = "aiagentassistance.com"
}

variable "hosted_zone_id" {
  default = "Z07479021E42SUEMRPV9M"
}

variable "acm_certificate_arn" {
  default = "arn:aws:acm:us-east-1:699242704305:certificate/bab60c7b-9966-4487-85fb-94cc1c609fa6"
}

variable "oac_id" {
  default = "E133527N3SYJFW"
}

# All food truck subdomains — add new trucks here
variable "sites" {
  default = [
    "maschingonrestaurant",
    "maschingonfoodtruck",
    "bar1859",
    "sylviastacos",
    "donjuliostacos",
    "hechoenqueso",
    "happypizza",
    "sacredsandwich",
    "thatgreentrailer",
    "bigtonys",
    "potatowagon",
    "ribtips",
    "simplyporkfection",
    "bobbyque",
    "sodafusion",
  ]
}
