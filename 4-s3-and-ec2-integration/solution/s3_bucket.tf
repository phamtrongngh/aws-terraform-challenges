resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_object" "students_json_file" {
    bucket = aws_s3_bucket.bucket.bucket
    key    = "students.json"
    source = var.students_json_file
}