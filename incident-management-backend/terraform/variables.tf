variable "aws_region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "ticket-management-system"
}

variable "instance_type" {
  description = "EC2 instance type for backend stack"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Existing AWS EC2 key pair name for SSH access"
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "CIDR allowed to SSH into EC2. Use your IP/32 ideally."
  type        = string
  default     = "0.0.0.0/0"
}

variable "frontend_bucket_name" {
  description = "Globally unique S3 bucket name for frontend static files"
  type        = string
}