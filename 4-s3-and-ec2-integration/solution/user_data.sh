#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
yum install -y aws-cli
aws s3 cp s3://${bucket}/students.json /var/www/html/