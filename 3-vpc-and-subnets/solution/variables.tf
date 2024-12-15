variable "vpc_cidr" {
  type = string
  description = "The CIDR block for the VPC"
}

variable "subnet_cidrs" {
    type = list(string)
    description = "The CIDR blocks for the subnets"
}