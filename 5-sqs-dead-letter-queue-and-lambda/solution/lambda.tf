data "archive_file" "lambda_zip_file" {
  type        = "zip"
  source_dir  = var.lambda_function_file
  output_path = "${path.module}/lambda_function.zip"
}

resource "aws_lambda_function" "lambda" {
  function_name = "QueueProcessor"
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.8"
  role          = aws_iam_role.lambda_sqs_execution_role.arn
  timeout       = 15
  environment {
    variables = {
      QUEUE_URL = aws_sqs_queue.queue.url
    }
  }
  filename         = data.archive_file.lambda_zip_file.output_path
  source_code_hash = data.archive_file.lambda_zip_file.output_base64sha256
}

resource "aws_lambda_event_source_mapping" "event_source_mapping" {
  event_source_arn = aws_sqs_queue.queue.arn
  function_name    = aws_lambda_function.lambda.function_name
  batch_size       = 1
}
