variable "region" {
  description = "The AWS region where the resources will be created."
  default = "us-east-1"
}

variable "original_bucket_name" {
  description = "The name of the S3 bucket where the original images are stored."
}

variable "resized_bucket_name" {
  description = "The name of the S3 bucket where the resized images will be stored."
}

variable "lambda_function_name" {
  description = "The name of the Lambda function that will resize the images."
}

variable "lambda_function_path" {
  description = "The path to the directory containing the Lambda function code."
  default = "../resources/image-resizer-lambda"
}