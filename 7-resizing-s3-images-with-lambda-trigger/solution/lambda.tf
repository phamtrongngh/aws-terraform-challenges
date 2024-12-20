# resource "null_resource" "download_sharp_layer" {
#   provisioner "local-exec" {
#     command = "curl -L https://github.com/pH200/sharp-layer/releases/download/0.33.5/release-x64.zip -o ${path.module}/sharp-layer.zip"
#   }
# }

data "http" "sharp_layer_zip_download" {
  url = "https://github.com/pH200/sharp-layer/releases/download/0.33.5/release-x64.zip"

  request_headers = {
    Accept = "application/octet-stream"
  }
}

resource "local_file" "sharp_layer_zip_file" {
  filename       = "${path.module}/sharp-layer.zip"
  content_base64 = data.http.sharp_layer_zip_download.response_body_base64
}

# Create Lambda Layer using pre-built sharp module. 
# The reason why we use a pre-built layer is that the sharp module requires native dependencies that are platform-specific. 
# The pre-built layer contains the sharp module compiled for the AWS Lambda environment.
resource "aws_lambda_layer_version" "sharp" {
  filename            = local_file.sharp_layer_zip_file.filename
  layer_name          = "sharp"
  compatible_runtimes = ["nodejs22.x"]
}

# Create a ZIP archive of the Lambda function code.
# IMPORTANT: If you use the image resizer sample lambda project from the `resources` directory, you must run `npm install` in that directory to install the required dependencies before running `terraform apply`.
data "archive_file" "image_resizer_zip" {
  type        = "zip"
  source_dir  = var.lambda_function_path
  output_path = "${path.module}/image-resizer-lambda.zip"
}

# Create an IAM role for the Lambda function.
resource "aws_iam_role" "lambda_exec_role" {
  name = "LambdaExecutionRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

}

# Attach a policy to the IAM role that allows the Lambda function to access the S3 buckets and CloudWatch Logs.
resource "aws_iam_role_policy" "lambda_exec_role_policy" {
  name = "LambdaExecutionRolePolicy"
  role = aws_iam_role.lambda_exec_role.name

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ],
        Resource = [
          "${aws_s3_bucket.original_bucket.arn}/*",
          "${aws_s3_bucket.resized_bucket.arn}/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "*"
      }
    ]
  })
}

# Create a Lambda function that resizes images uploaded to the original S3 bucket.
resource "aws_lambda_function" "image_resizer_function" {
  function_name    = var.lambda_function_name
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  role             = aws_iam_role.lambda_exec_role.arn
  filename         = data.archive_file.image_resizer_zip.output_path
  source_code_hash = data.archive_file.image_resizer_zip.output_base64sha256
  environment {
    variables = {
      RESIZED_BUCKET = aws_s3_bucket.resized_bucket.bucket
    }
  }
  layers = [aws_lambda_layer_version.sharp.arn]
  timeout = 30
}

# Grant the S3 bucket permission to invoke the Lambda function.
resource "aws_lambda_permission" "s3_lambda_trigger_permission" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.image_resizer_function.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.original_bucket.arn
}
