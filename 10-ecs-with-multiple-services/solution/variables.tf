variable "region" {
  description = "The AWS region"
  default     = "us-east-1"
}

variable "azs" {
  description = "The availability zones"
  default     = ["us-east-1a", "us-east-1b"]
}