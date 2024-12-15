provider "aws" {
  region = "us-east-1"
}

data "aws_vpc" "vpc" {
  filter {
    name   = "tag:Name"
    values = [var.vpc_name]
  }
}

output "vpc_cidr_block" {
  value = data.aws_vpc.vpc.cidr_block
}
