variable "squad" {
  type = string
}

variable "product" {
  type = string
}

variable "app" {
  type = string
}

variable "domain" {
  type = string
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "container_port" {
  type = number
}

variable "tribe" {
  type = string
}

variable "secrets" {
  type = list(string)
  default = [
    "KYC_INGESTION_API_KEY",
  ]
}

variable "image_version" {
  type    = string
  default = "latest"
}

variable "environment_variables" {
  type = object({
    dev = object({
      node_env              = string
      kyc_dynamo_table_name = string
      ingest_endpoint       = string
    })
    staging = object({
      node_env              = string
      kyc_dynamo_table_name = string
      ingest_endpoint       = string
    })
    prod = object({
      node_env              = string
      kyc_dynamo_table_name = string
      ingest_endpoint       = string
    })
  })
  default = {
    dev = {
      node_env              = "development"
      kyc_dynamo_table_name = "kyc-dev"
      ingest_endpoint       = "https://api.vnator-data-lake.dev"
    }
    staging = {
      node_env              = "staging"
      kyc_dynamo_table_name = "kyc-staging"
      ingest_endpoint       = "https://api.vnator-data-lake.dev"
    }
    prod = {
      node_env              = "production"
      kyc_dynamo_table_name = "kyc-prod"
      ingest_endpoint       = "https://api.vnator-data-lake.us"
    }
  }
}

variable "new_relic_insert_api_key" {
  type = string
}

variable "ingestion_api_key" {
  type = string
}