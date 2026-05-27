output "backend_public_ip" {
  description = "Public IP address of the EC2 backend server"
  value       = aws_instance.backend.public_ip
}

output "backend_api_url" {
  description = "Backend Flask API URL"
  value       = "http://${aws_instance.backend.public_ip}:5000"
}

output "grafana_url" {
  description = "Grafana URL"
  value       = "http://${aws_instance.backend.public_ip}:3000"
}

output "prometheus_url" {
  description = "Prometheus URL"
  value       = "http://${aws_instance.backend.public_ip}:9090"
}

output "frontend_bucket_name" {
  description = "S3 bucket for frontend files"
  value       = aws_s3_bucket.frontend.bucket
}

output "frontend_cloudfront_url" {
  description = "CloudFront URL for frontend"
  value       = "https://${aws_cloudfront_distribution.frontend_cdn.domain_name}"
}