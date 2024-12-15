resource "aws_iam_role" "s3_read_role" {
  name = "S3ReadRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "s3_read_policy" {
  name = "S3ReadPolicy"
  role = aws_iam_role.s3_read_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = ["s3:GetObject"],
        Resource = ["${aws_s3_bucket.bucket.arn}/students.json"] // Only allow access to the `students.json` file
      }
    ]
  })
}

