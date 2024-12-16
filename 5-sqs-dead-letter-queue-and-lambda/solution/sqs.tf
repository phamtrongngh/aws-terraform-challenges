resource "aws_sqs_queue" "queue" {
  name = "MyQueue"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dl_queue.arn
    maxReceiveCount     = 2
  })
  visibility_timeout_seconds = 15
}

resource "aws_sqs_queue" "dl_queue" {
  name = "MyDeadLetterQueue"
}

