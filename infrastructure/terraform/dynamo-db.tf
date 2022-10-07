resource "aws_dynamodb_table" "kyc_table" {
  name             = "kyc-${local.environment}"
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "id"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
  tags             = local.tags

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "customerReferenceId"
    type = "S"
  }

  global_secondary_index {
    name            = "CustomerIndex"
    hash_key        = "customerReferenceId"
    projection_type = "ALL"
  }
}