variable "region" {
  description = "The AWS region to deploy resources"
  default     = "us-east-1"
}

variable "website_folder" {
  description = "The folder containing the website files"
  default     = "../resources/fashion-website"
}

variable "bucket_name" {
  description = "The name of the S3 bucket to create"
  default     = "terraform-learn-s3-static-website-hosting"
}
