locals {
  vpc_cidr       = "10.0.0.0/16"
  public_subnets = ["10.0.0.0/24", "10.0.1.0/24"]
}

module "vpc" {
  source         = "terraform-aws-modules/vpc/aws"
  name           = "ecs-vpc"
  azs            = var.azs
  cidr           = local.vpc_cidr
  public_subnets = local.public_subnets
  default_security_group_ingress = [
    {
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
  default_security_group_egress = [
    {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
}
