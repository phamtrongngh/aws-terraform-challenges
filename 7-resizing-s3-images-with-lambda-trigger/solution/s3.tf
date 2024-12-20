# Create an S3 bucket to store the original images
resource "aws_s3_bucket" "original_bucket" {
  bucket = var.original_bucket_name
  
  // This will allow the bucket to be destroyed even if it contains objects, do not use in production
  force_destroy = true 
}

# Create an S3 bucket to store the resized images
resource "aws_s3_bucket" "resized_bucket" {
  bucket = var.resized_bucket_name

  // This will allow the bucket to be destroyed even if it contains objects, do not use in production
  force_destroy = true 
}

# Create an S3 bucket notification configuration that triggers the Lambda function when an object is created in the original S3 bucket.
resource "aws_s3_bucket_notification" "original_bucket_notification" {
  bucket = aws_s3_bucket.original_bucket.bucket

  lambda_function {
    lambda_function_arn = aws_lambda_function.image_resizer_function.arn
    events              = ["s3:ObjectCreated:*"]
  }
}
