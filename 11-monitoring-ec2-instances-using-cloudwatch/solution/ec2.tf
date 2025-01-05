data "aws_ami" "ami" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*"]
  }
}

resource "aws_instance" "instance" {
  ami           = data.aws_ami.ami.id
  instance_type = "t2.micro"
  subnet_id     = module.vpc.public_subnets[0]
  user_data     = <<-EOF
    #!/bin/bash
    yum update -y
    amazon-linux-extras install epel -y
    yum install -y httpd stress
    systemctl start httpd
    systemctl enable httpd
    echo "<h1>Hello, World!</h1>" > /var/www/html/index.html
    EOF

  associate_public_ip_address = true
  tags = {
    Name = "web-server"
  }
}
