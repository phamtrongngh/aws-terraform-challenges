resource "aws_cloudwatch_metric_alarm" "ec2_cpu_alarm" {
  namespace           = "AWS/EC2"
  metric_name         = "CPUUtilization"
  alarm_name          = "ec2-cpu-alarm"
  alarm_description   = "This metric monitors ec2 instance CPU utilization: stops the instance and sends an email notification if the CPU utilization is greater than 80%."
  comparison_operator = "GreaterThanOrEqualToThreshold"
  period              = 60
  evaluation_periods  = 1
  statistic           = "Average"
  threshold           = "80"
  dimensions = {
    InstanceId = aws_instance.instance.id
  }
  alarm_actions = [
    "arn:aws:automate:${data.aws_region.current.name}:ec2:stop",
    aws_sns_topic.sns_topic.arn
  ]
}
