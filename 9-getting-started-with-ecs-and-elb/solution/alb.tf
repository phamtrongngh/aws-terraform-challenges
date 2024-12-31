resource "aws_alb" "alb" {
  name            = "ecs-alb"
  subnets         = module.vpc.public_subnets
  security_groups = [aws_security_group.public_sg.id]
}

resource "aws_alb_target_group" "alb_tg" {
  name        = "ecs-hello-nginx-svc-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"
  health_check {
    protocol            = "HTTP"
    port                = 80
    path                = "/"
    interval            = 10
    healthy_threshold   = 3
    unhealthy_threshold = 2
    timeout             = 5
  }
}

resource "aws_alb_listener" "alb_listener" {
  load_balancer_arn = aws_alb.alb.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.alb_tg.arn
  }
}
