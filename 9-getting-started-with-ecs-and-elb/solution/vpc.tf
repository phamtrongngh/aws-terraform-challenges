locals {
  vpc_cidr        = "10.0.0.0/16"
  public_subnets  = ["10.0.0.0/24", "10.0.1.0/24"]
  private_subnets = ["10.0.2.0/24", "10.0.3.0/24"]
}

module "vpc" {
  source             = "terraform-aws-modules/vpc/aws"
  name               = "ecs-vpc"
  azs                = var.azs
  cidr               = local.vpc_cidr
  public_subnets     = local.public_subnets
  private_subnets    = local.private_subnets
  enable_nat_gateway = true
  single_nat_gateway = true
}

resource "aws_security_group" "public_sg" {
  vpc_id = module.vpc.vpc_id
  name   = "public-sg"
  ingress = [
    {
      from_port        = 80
      to_port          = 80
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0"]
      description      = "Allow HTTP inbound traffic"
      ipv6_cidr_blocks = []
      security_groups  = []
      prefix_list_ids  = []
      self             = false
    }
  ]
  egress = [
    {
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"]
      description      = "Allow all outbound traffic"
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      security_groups  = []
      self             = false
    }
  ]
}

resource "aws_security_group" "private_sg" {
  vpc_id = module.vpc.vpc_id
  name   = "private-sg"
  ingress = [
    {
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"],
      description      = "Allow all inbound traffic from the public subnet"
      security_groups  = [aws_security_group.public_sg.id]
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      security_groups  = []
      self             = false
    }
  ]
  egress = [
    {
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"]
      description      = "Allow all outbound traffic"
      security_groups  = []
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      security_groups  = []
      self             = false
    }
  ]
}
