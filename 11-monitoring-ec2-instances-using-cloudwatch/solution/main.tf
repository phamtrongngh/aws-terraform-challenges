provider "aws" {
  region = var.region
}

data "aws_region" "current" {} # To get the current region