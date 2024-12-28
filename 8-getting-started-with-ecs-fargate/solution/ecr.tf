resource "aws_ecr_repository" "ecr_repo" {
  name = "simple-web-server"
  image_scanning_configuration {
    scan_on_push = true
  }
}