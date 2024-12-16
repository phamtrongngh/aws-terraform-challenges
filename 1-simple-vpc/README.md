# Simple VPC

## Problem statement
Write a Terraform project that creates a VPC with a CIDR range set from a variable in a region set by another variable. Then apply the project and set the CIDR variable using a file and the region using an environment variable.

## Input
```
region = "us-east-2"
cidr = "10.0.0.0/16"
```

## Output
```
aws_vpc.vpc: Creating...
aws_vpc.vpc: Creation complete after 6s [id=vpc-03ec583d3a6812019]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

## Files structure
We can use the following files to implement the project:
```
main.tf
variables.tf
terraform.tfvars
```

### variables.tf
Use variables.tf file to define variables.

### terraform.tfvars
Use terraform.tfvars file to set cidr.

### main.tf
Implement your complete solution here.