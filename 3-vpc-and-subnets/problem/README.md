# VPC And Subnets

## Problem
Write a Terraform module that creates a VPC and its subnets. The module takes inputs for the CIDR ranges for the VPC and subnets and should return the created VPC and each subnet as an output. Create a Terraform project that uses the module and print the output of the module to the console.

## Inputs
As defined in the problem statement, the module takes inputs for the CIDR ranges and for the VPC and subnets.

Example:
```
vpc_cidr = "10.0.0.0/16"
subnet_cidrs = ["10.0.0.0/24", "10.0.1.0/24"]
```

## Output
The module should return the created VPC and each subnet as an output.

After running the terraform apply command, the output on the terminal should look like this:
```
output = {
  "subnets" = [
    {
      "arn" = "arn:aws:ec2:us-east-1:111894800502:subnet/subnet-0b3ce502f03475292"
      "assign_ipv6_address_on_creation" = false
      "availability_zone" = "us-east-1c"
      "availability_zone_id" = "use1-az6"
      "cidr_block" = "10.0.0.0/24"
      "customer_owned_ipv4_pool" = ""
      "enable_dns64" = false
      "enable_lni_at_device_index" = 0
      "enable_resource_name_dns_a_record_on_launch" = false
      "enable_resource_name_dns_aaaa_record_on_launch" = false
      "id" = "subnet-0b3ce502f03475292"
      "ipv6_cidr_block" = ""
      "ipv6_cidr_block_association_id" = ""
      "ipv6_native" = false
      "map_customer_owned_ip_on_launch" = false
      "map_public_ip_on_launch" = false
      "outpost_arn" = ""
      "owner_id" = "111894800502"
      "private_dns_hostname_type_on_launch" = "ip-name"
      "tags" = tomap({})
      "tags_all" = tomap({})
      "timeouts" = null /* object */
      "vpc_id" = "vpc-066b473e78c74d9d9"
    },
    {
      "arn" = "arn:aws:ec2:us-east-1:111894800502:subnet/subnet-07c9fd9038914f58c"
      "assign_ipv6_address_on_creation" = false
      "availability_zone" = "us-east-1c"
      "availability_zone_id" = "use1-az6"
      "cidr_block" = "10.0.1.0/24"
      "customer_owned_ipv4_pool" = ""
      "enable_dns64" = false
      "enable_lni_at_device_index" = 0
      "enable_resource_name_dns_a_record_on_launch" = false
      "enable_resource_name_dns_aaaa_record_on_launch" = false
      "id" = "subnet-07c9fd9038914f58c"
      "ipv6_cidr_block" = ""
      "ipv6_cidr_block_association_id" = ""
      "ipv6_native" = false
      "map_customer_owned_ip_on_launch" = false
      "map_public_ip_on_launch" = false
      "outpost_arn" = ""
      "owner_id" = "111894800502"
      "private_dns_hostname_type_on_launch" = "ip-name"
      "tags" = tomap({})
      "tags_all" = tomap({})
      "timeouts" = null /* object */
      "vpc_id" = "vpc-066b473e78c74d9d9"
    },
  ]
  "vpc" = {
    "arn" = "arn:aws:ec2:us-east-1:111894800502:vpc/vpc-066b473e78c74d9d9"
    "assign_generated_ipv6_cidr_block" = false
    "cidr_block" = "10.0.0.0/16"
    "default_network_acl_id" = "acl-0c2344d10f7dfbcf9"
    "default_route_table_id" = "rtb-0fc7556736322bbf3"
    "default_security_group_id" = "sg-062f043e207c4e7a0"
    "dhcp_options_id" = "dopt-0b2a0623758475be3"
    "enable_dns_hostnames" = false
    "enable_dns_support" = true
    "enable_network_address_usage_metrics" = false
    "id" = "vpc-066b473e78c74d9d9"
    "instance_tenancy" = "default"
    "ipv4_ipam_pool_id" = tostring(null)
    "ipv4_netmask_length" = tonumber(null)
    "ipv6_association_id" = ""
    "ipv6_cidr_block" = ""
    "ipv6_cidr_block_network_border_group" = ""
    "ipv6_ipam_pool_id" = ""
    "ipv6_netmask_length" = 0
    "main_route_table_id" = "rtb-0fc7556736322bbf3"
    "owner_id" = "111894800502"
    "tags" = tomap({})
    "tags_all" = tomap({})
  }
}
```