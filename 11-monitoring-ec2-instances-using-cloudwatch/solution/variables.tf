variable "region" {
  description = "The AWS region"
  default     = "us-east-1"
}

variable "azs" {
  description = "The Availability Zones"
  default     = ["us-east-1a"]
}

variable "notification_email" {
  description = "The email address that will receive the notifications"
}