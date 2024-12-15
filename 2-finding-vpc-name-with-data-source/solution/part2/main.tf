provider "aws" {
  region = "us-east-1"
}

data "aws_vpc" "vpc" {
  tags = {
    Name = var.vpc_name
  }
}

output "vpc_cidr_block" {
  value = data.aws_vpc.vpc.cidr_block
}
