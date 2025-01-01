resource "aws_ecs_cluster" "ecs_cluster" {
  name = "ecs-cluster"
}

resource "aws_ecs_task_definition" "product_svc_task_def" {
  family = "product-svc-td"
  container_definitions = jsonencode([{
    name      = "product-svc"
    image     = "phamtrongnghia1105/product-svc"
    essential = true
    portMappings = [{
      containerPort = 3000
      hostPort      = 3000
    }]
  }])
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  cpu                      = 256
  memory                   = 1024
}

resource "aws_ecs_task_definition" "user_svc_task_def" {
  family = "user-svc-td"
  container_definitions = jsonencode([{
    name      = "user-svc"
    image     = "phamtrongnghia1105/user-svc"
    essential = true
    portMappings = [{
      containerPort = 3000
      hostPort      = 3000
    }]
  }])
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  cpu                      = 256
  memory                   = 1024
}

resource "aws_ecs_service" "product_svc" {
  name            = "product-svc"
  cluster         = aws_ecs_cluster.ecs_cluster.arn
  task_definition = aws_ecs_task_definition.product_svc_task_def.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = module.vpc.private_subnets
    security_groups = [aws_security_group.private_sg.id]
  }
  availability_zone_rebalancing = "ENABLED"
  load_balancer {
    target_group_arn = aws_alb_target_group.product_svc_tg.arn
    container_name   = "product-svc"
    container_port   = 3000
  }
}

resource "aws_ecs_service" "user_svc" {
  name            = "user-svc"
  cluster         = aws_ecs_cluster.ecs_cluster.arn
  task_definition = aws_ecs_task_definition.user_svc_task_def.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = module.vpc.private_subnets
    security_groups = [aws_security_group.private_sg.id]
  }
  availability_zone_rebalancing = "ENABLED"
  load_balancer {
    target_group_arn = aws_alb_target_group.user_svc_tg.arn
    container_name   = "user-svc"
    container_port   = 3000
  }
}
