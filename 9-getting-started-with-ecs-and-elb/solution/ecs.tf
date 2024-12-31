resource "aws_ecs_cluster" "ecs_cluster" {
  name = "ecs-cluster"
}

resource "aws_ecs_task_definition" "ecs_task_def" {
  family = "hello-nginx"
  container_definitions = jsonencode([{
    name      = "hello-nginx"
    image     = "phamtrongnghia1105/hello-nginx"
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

resource "aws_ecs_service" "ecs_svc" {
  name            = "nginx-hello-svc"
  cluster         = aws_ecs_cluster.ecs_cluster.arn
  task_definition = aws_ecs_task_definition.ecs_task_def.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = module.vpc.private_subnets
    security_groups = [aws_security_group.private_sg.id]
  }
  load_balancer {
    target_group_arn = aws_alb_target_group.alb_tg.arn
    container_name   = "hello-nginx"
    container_port   = 80
  }
}
