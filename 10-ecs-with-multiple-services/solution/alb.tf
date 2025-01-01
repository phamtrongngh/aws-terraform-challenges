resource "aws_alb" "alb" {
  name            = "ecs-alb"
  subnets         = module.vpc.public_subnets
  security_groups = [aws_security_group.public_sg.id]
}

resource "aws_alb_target_group" "product_svc_tg" {
  name        = "product-svc-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"
  health_check {
    protocol            = "HTTP"
    port                = 3000
    path                = "/health"
    interval            = 10
    healthy_threshold   = 3
    unhealthy_threshold = 2
    timeout             = 5
  }
}

resource "aws_alb_target_group" "user_svc_tg" {
  name        = "user-svc-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"
  health_check {
    protocol            = "HTTP"
    port                = 3000
    path                = "/health"
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
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Not Found"
      status_code  = "404"
    }
  }
}

resource "aws_alb_listener_rule" "product_svc_rule" {
  listener_arn = aws_alb_listener.alb_listener.arn
  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.product_svc_tg.arn
  }
  condition {
    path_pattern {
      values = ["/product-svc*"]
    }
  }
}

resource "aws_alb_listener_rule" "user_svc_rule" {
  listener_arn = aws_alb_listener.alb_listener.arn
  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.user_svc_tg.arn
  }
  condition {
    path_pattern {
      values = ["/user-svc*"]
    }
  }
}
