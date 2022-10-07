bucket          = "terraform-state-vnator-prod"
key             = "prod/customer/kyc/terraform.tfstate"
encrypt         = true 
region          = "us-east-1"
dynamodb_table  = "terraform-state-locking"