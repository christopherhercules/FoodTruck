variable "domain" {
  description = "Root domain for all contractor sites"
  default     = "myserviceflows.com"
}

variable "contractors" {
  description = "List of contractor subdomain slugs — each gets {slug}.myserviceflows.com"
  default     = ["hunter", "livewstn"]
}
