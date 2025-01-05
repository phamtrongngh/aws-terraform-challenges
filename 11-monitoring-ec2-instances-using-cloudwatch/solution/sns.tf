resource "aws_sns_topic" "sns_topic" {
  name = "ec2-cpu-alarm-topic"
  
}

resource "aws_sns_topic_subscription" "subscription" {
  topic_arn = aws_sns_topic.sns_topic.arn
  protocol  = "email"
  endpoint  = var.notification_email
}