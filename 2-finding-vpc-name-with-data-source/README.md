# Finding VPC Name with Data Source

## Problem statement
There are two parts to this problem.
### Part one
Make a Terraform project that creates a VPC and accept a variable `vpc_name` for the Name tag. The VPC should have the Name tag set to the value of the variable. The VPC should have a CIDR range of `10.0.0.0/16`.

### Part two
Create another Terraform project that looks up that VPC using a data block filtering on the Name tag and outputs the CIDR range of the VPC to the terminal. The name of the VPC should be also passed as a variable.

## Output
Subfolder part1 creates the VPC with the Name tag. Subfolder part2 shows how to look this up by data block and output its CIDR range.