terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.27"
    }
  }

  required_version = ">= 1.2.7"
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "kuarsis-products-s3-public-dev" {
  bucket = "kuarsis-products-s3-public-dev"
}

resource "aws_s3_bucket_cors_configuration" "kuarsis-products-s3-public-cors-dev" {
  bucket = aws_s3_bucket.kuarsis-products-s3-public-dev.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["HEAD", "GET", "PUT", "POST", "DELETE", ]
    allowed_origins = ["*"]
  }
}

# aws_s3_bucket_policy.allow_s3_get_objects_all:
resource "aws_s3_bucket_policy" "allow_s3_get_objects_all" {
  bucket = aws_s3_bucket.kuarsis-products-s3-public-dev.id
  policy = jsonencode(
    {
      Id = "KuarsisPublicBucketPoliciesDev"
      Statement = [
        {
          Action    = "s3:GetObject"
          Effect    = "Allow"
          Principal = "*"
          Resource  = "arn:aws:s3:::kuarsis-products-s3-public-dev/*"
          Sid       = "AllowS3GetObjectAll"
        },
      ]
      Version = "2012-10-17"
    }
  )
}

resource "aws_s3_bucket" "kuarsis-products-s3-private-dev" {
  bucket = "kuarsis-products-s3-private-dev"
}


resource "aws_s3_bucket_cors_configuration" "kuarsis-products-s3-private-cors-dev" {
  bucket = aws_s3_bucket.kuarsis-products-s3-private-dev.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["HEAD", "GET", "PUT", "POST", "DELETE", ]
    allowed_origins = ["*"]
  }
}

resource "aws_s3_bucket_public_access_block" "kuarsis-products-s3-private-block-public-dev" {
  bucket = aws_s3_bucket.kuarsis-products-s3-private-dev.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# aws_s3_bucket_policy.allow_s3_get_objects_all:
resource "aws_s3_bucket_policy" "allow_s3_get_object_admin_only_dev" {
  bucket = aws_s3_bucket.kuarsis-products-s3-private-dev.id
  policy = jsonencode(
    {
      Statement = [
        {
          Action = "s3:GetObject"
          Effect = "Allow"
          Principal = {
            AWS = "arn:aws:iam::704484783207:user/kuarsis-s3-admin1"
          }
          Resource = "arn:aws:s3:::kuarsis-products-s3-private-dev/*"
          Sid      = "AllowGetObject"
        },
      ]
      Version = "2012-10-17"
    }
  )
}


