resource "aws_ssm_parameter" "new_relic_insert_api_key" {
  name        = "${local.ssm_path}/NEW_RELIC_INSERT_API_KEY"
  description = "New Relic insert API key"
  type        = "SecureString"
  value       = local.new_relic_insert_api_key
  overwrite   = true
  tags        = local.tags
}

resource "aws_ssm_parameter" "ingestion_api_key" {
  name        = "${local.ssm_path}/KYC_INGESTION_API_KEY"
  description = "Ingestion API key"
  type        = "SecureString"
  value       = local.ingestion_api_key
  overwrite   = true
  tags        = local.tags
}