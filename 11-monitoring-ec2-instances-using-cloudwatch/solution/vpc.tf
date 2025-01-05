locals {
  vpc_cidr       = "10.0.0.0/16"
  public_subnets = ["10.0.0.0/24"]
}

data "http" "my_ip" {
  url = "http://checkip.amazonaws.com/"
}

module "vpc" {
  source         = "terraform-aws-modules/vpc/aws"
  name           = "vpc"
  azs            = var.azs
  cidr           = local.vpc_cidr
  public_subnets = local.public_subnets

  default_security_group_ingress = [
    {
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0"
      description = "Allow HTTP inbound traffic"
    },
    {
      from_port = 22
      to_port   = 22
      protocol  = "tcp"
      #   cidr_blocks = "${trimspace(data.http.my_ip.response_body)}/32" # We must trim the response body to remove the newline character ("\n")
      cidr_blocks = "0.0.0.0/0"
      description = "Allow SSH inbound traffic from my IP"
    }
  ]

  default_security_group_egress = [
    {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = "0.0.0.0/0"
      description = "Allow all outbound traffic"
    }
  ]
}
