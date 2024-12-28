# [SOLUTION] Getting Started with ECS Fargate

## Prerequisites

- Docker installed on your local machine (https://docs.docker.com/get-docker/)
- AWS CLI installed and configured with the appropriate permissions (https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- Terraform installed on your local machine (https://learn.hashicorp.com/tutorials/terraform/install-cli)

## Step 1: Dockerize the web server

In this solution, we will use NGINX as the web server to serve a static html page.

Create a `web-server` directory and copy the `index.html` file provided in the `resources` directory to. If you want to write your own HTML content, feel free to do so.

Next, create a `Dockerfile` in the `web-server` directory with the following content:

```Dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- `FROM nginx:alpine`: This line specifies the base image for the Docker image. In this case, we are using the official NGINX image with the Alpine Linux distribution.
- `COPY index.html /usr/share/nginx/html/index.html`: This line copies the `index.html` file to the NGINX default document root directory.
- `EXPOSE 80`: This line exposes port 80, which is the default port for HTTP traffic.
- `CMD ["nginx", "-g", "daemon off;"]`: This line specifies the command to run when the container starts. In this case, it starts the NGINX web server in the foreground. It makes sure that the container does not exit immediately after starting.

Run the following command to build the Docker image:

```bash
docker build -t simple-web-server .
```

> Note: you must be in the `web-server` directory to run the above command.

To test the Docker image, run the following command:

```bash
docker run -d -p 8080:80 simple-web-server
```

Open a web browser and navigate to `http://localhost:8080` to see the web page served by the NGINX web server.

## Step 2: Initialize Terraform project

In this step, we will initialize a Terraform project.

First, create a new directory and create a `main.tf` to specifiy the AWS provider and the region where the resources will be created.

`main.tf`:

```hcl
provider "aws" {
  region = var.region
}
```

Next, we create a file `variables.tf` to define the input variables. In this case, we define the `region` variable with a default value of `us-east-1`. Feel free to change the default value to your preferred region.

`variables.tf`:

```hcl
variable "region" {
  description = "The AWS region"
  default     = "us-east-1"
}
```

Initialize the Terraform project by running the following command:

```bash
terraform init
```

## Step 3: Push the Docker image to Amazon ECR

Before we can deploy the ECS Fargate service, we need to push the Docker image to a container registry. In this solution, we will use Amazon Elastic Container Registry (ECR) to store the Docker image.

We create a file `ecr.tf` and define the ECR repository.

`ecr.tf`:

```hcl
resource "aws_ecr_repository" "ecr_repo" {
  name = "simple-web-server"
  image_scanning_configuration {
    scan_on_push = true
  }
}
```

We define an ECR repository named `simple-web-server` with image scanning enabled. The `scan_on_push` attribute specifies that the image will be scanned for vulnerabilities when pushed to the repository.

We can also create an `outputs.tf` file to output the resources' information after they are created. In this step, we will output the ECR repository URL to be used later.

`outputs.tf`:

```hcl
output "ecr_repo_url" {
  value = aws_ecr_repository.ecr_repo.repository_url
}
```

Apply the above configuration to create the ECR repository:

```bash
terraform apply
```

> Note: You will be prompted to confirm the creation of the ECR repository. Type `yes` to proceed.

After creating successfully, you will see the ECR repository URL in the output similar to the following:

```
Outputs:

ecr_repo_url = "{your-aws-account-id}.dkr.ecr.us-east-1.amazonaws.com/simple-web-server"
```

We will use this URL to tag and push the Docker image to the created ECR repository.

Login to the ECR repository using the AWS CLI:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ecr_repo_url}
```

> Note: Replace `${ecr_repo_url}` with the ECR repository URL you obtained from the output.

Next, we tag the Docker image with the ECR repository URL:

```bash
docker tag simple-web-server ${ecr_repo_url}
```

> Note: the above command is the shorthand for `docker tag simple-web-server:latest ${ecr_repo_url}:latest`. The `latest` tag is used by default if no tag is specified. In the real-world projects,
> it is recommended to use versioned tags, such as `v1`, `v2`, etc. to manage the image versions.

Finally, we push the tagged image to the ECR repository:

```bash
docker push ${ecr_repo_url}
```

You can verify that the image has been pushed successfully by checking it on the [AWS Management Console](https://console.aws.amazon.com/ecr/repositories/simple-web-server) or by running the AWS CLI command:

```bash
aws ecr describe-images --repository-name simple-web-server
```

You should see the image listed with the tag `latest`.

## Step 3: Create a VPC

The ECS Fargate service requires a VPC and subnets to run the tasks. In this step, we will create a VPC and two public subnets in different availability zones.

We add one more variable `azs` to the `variables.tf` file to specify the availability zones where the subnets will be created. In this case, we will use `us-east-1a` and `us-east-1b`. Feel free to change the availability zones to match your AWS region.

`variables.tf`:

```hcl
variable "azs" {
  description = "The Availability Zones"
  default     = ["us-east-1a", "us-east-1b"]
}
```

Defining a VPC and its associated resources can be complex and error-prone so we will use the `terraform-aws-modules/vpc/aws` module to simplify the source code. Create a file `vpc.tf` and define a `vpc` module.

`vpc.tf`:

```hcl
locals {
  vpc_cidr = "10.0.0.0/16"
  public_subnets = ["10.0.0.0/24", "10.0.0.1/24"]
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
```
We define a VPC with a CIDR block of `10.0.0.0/16` and two public subnets with CIDR blocks `10.0.0.0/24`, `10.0.1.0/24` in the availability zones specified in the `azs` variable. We also define a default security group that allows inbound traffic on port 80 from any IP address so that our web server can be accessed from the internet and allows all outbound traffic.

Apply the changes to create the VPC and subnets:
```bash
terraform init
terraform apply
```

We can verify the VPC and its associated resources have been created successfully by checking the [AWS Management Console](https://console.aws.amazon.com/vpc/home) or by running the AWS CLI command:

```bash
aws ec2 describe-vpcs
aws ec2 describe-subnets
```

## Step 5: Create the IAM Role for ECS Task
The ECS task requires an IAM role so that it can do things like pull the Docker image from ECR and write logs to CloudWatch.

We create a file `iam.tf` and define an IAM role for the ECS task. The role will have a policy `AmazonECSTaskExecutionRolePolicy` which grants the necessary permissions for the ECS task to run.

`iam.tf`:

```hcl
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs-task-execution-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      },
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
```

Apply the changes to create the IAM role:

```bash
terraform apply
```

## Step 6: Create an ECS Fargate Cluster, Task Definition, and Service
In this step, we will create an ECS Fargate cluster and define a task definition that specifies the Docker image to run. We will also create an ECS service that runs the task in the Fargate cluster.

Create a file `ecs.tf` and define the necessary resources:

`ecs.tf`:
```hcl
resource "aws_ecs_cluster" "ecs_cluster" {
  name = "ecs-cluster"
}

resource "aws_ecs_task_definition" "ecs_task_definition" {
  family = "simple-web-server"
  container_definitions = jsonencode([{
    name      = "simple-web-server"
    image     = aws_ecr_repository.ecr_repo.repository_url
    essential = true
    portMappings = [{
      containerPort = 80
      hostPort      = 80
    }]
  }])
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  cpu                      = 256
  memory                   = 1024
}

resource "aws_ecs_service" "ecs_service" {
  name            = "simple-web-server-service"
  cluster         = aws_ecs_cluster.ecs_cluster.arn
  task_definition = aws_ecs_task_definition.ecs_task_definition.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.public_subnets
    security_groups  = [module.vpc.default_security_group_id]
    assign_public_ip = true
  }
}
````

We define an ECS cluster named `ecs-cluster`, a task definition named `simple-web-server`, and a service named `simple-web-server-service`.

The task definition specifies: 
- The family name of the task definition: `simple-web-server`. 
- The container definition. In this case, we specify the Docker image we pushed to the ECR repository, the port mappings, and that the container is essential for the task to run.
- The required CPU and memory: `256` CPU units and `1024` MiB of memory.
- The network mode (`awsvpc`), which allows the task to have its own network interface
- The execution role we created earlier. 
- The compatibility mode (`FARGATE`), which specifies that the task should run on Fargate.

The service specifies:
- The name of the service: `simple-web-server-service`.
- The desired number of tasks to run: `1`.
- The launch type: `FARGATE`.
- The network configuration, which specifies the subnets, security groups. We also assign a public IP to the task so that it can be called from the internet.

Apply the changes to create the ECS Fargate cluster, task definition, and service:

```bash
terraform apply
```

After the resources have been created successfully, you can check the ECS cluster, task definition, and service on the [AWS Management Console](https://console.aws.amazon.com/ecs/home). It may take a few minutes for the service to be fully deployed and running.

## Step 7: Access the Web Server

To access the web server running in the ECS Fargate service, you need to find the public IP address of the task.

You can find the public IP address by checking the ECS service in the [AWS Management Console](https://console.aws.amazon.com/ecs/home). In the "Tasks" tab, click on the task ID of the running task to view its details. You will find the public IP address under the "Network" section. Open a web browser and navigate to the public IP address to see the web page served by the NGINX web server.


## Step 8: Clean Up

After you have completed the challenge, make sure to clean up the resources to avoid incurring unnecessary costs.

Before destroying the resources, you must empty the ECR repository by deleting the pushed Docker image. You can do this by running the following command:

```bash
aws ecr batch-delete-image --repository-name simple-web-server --image-ids imageTag=latest
```

Run the following command to destroy all the resources created by Terraform:

```bash
terraform destroy
```