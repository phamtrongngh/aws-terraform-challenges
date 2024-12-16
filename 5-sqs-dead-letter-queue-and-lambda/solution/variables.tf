variable "region" {
  description = "The AWS region to deploy resources."
  default     = "us-east-1"
}

variable "lambda_function_file" {
  description = "The path to the Lambda function file."
  default     = "../resources/lambda"
}
