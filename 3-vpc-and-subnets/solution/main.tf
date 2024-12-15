provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "subnets" {
  vpc_id     = aws_vpc.vpc.id
  count      = length(var.subnet_cidrs)
  cidr_block = var.subnet_cidrs[count.index]
}

output "output" {
  value = {
    vpc     = aws_vpc.vpc
    subnets = aws_subnet.subnets
  }
}
