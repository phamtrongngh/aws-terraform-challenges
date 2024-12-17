output "bucket_website_endpoint" {
  value = "${var.bucket_name}.s3-website.${var.region}.amazonaws.com"
}
