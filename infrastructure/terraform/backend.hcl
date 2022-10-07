bucket          = "terraform-state-vnator-dev"
key             = "dev/customer/kyc/terraform.tfstate"
encrypt         = true 
region          = "us-east-1"
dynamodb_table  = "terraform-state-locking"