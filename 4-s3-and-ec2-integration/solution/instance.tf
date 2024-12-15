data "aws_ami" "ami" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_iam_instance_profile" "s3_read_instance_profile" {
  name = "S3ReadInstanceProfile"
  role = aws_iam_role.s3_read_role.name
}

resource "aws_instance" "ec2" {
  ami                  = data.aws_ami.ami.id
  instance_type        = "t2.micro"
  iam_instance_profile = aws_iam_instance_profile.s3_read_instance_profile.name
  user_data = templatefile("${path.module}/user_data.sh", {
    bucket = aws_s3_bucket.bucket.bucket
  })
  subnet_id = aws_subnet.public_subnet.id
  associate_public_ip_address = true
  security_groups = [aws_security_group.public_sg.id]
}

