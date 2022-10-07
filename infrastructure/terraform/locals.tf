locals {
  region                        = var.region
  new_relic_insert_api_key      = var.new_relic_insert_api_key
  ingestion_api_key             = var.ingestion_api_key
  ssm_path                      = "/${local.environment}/${var.squad}/${var.app}"
  service_name                  = "${var.app}-${local.environment}"
  parameters                    = var.secrets
  container_port                = var.container_port
  domain                        = var.domain
  environment                   = terraform.workspace
  app                           = var.app
  image_version                 = var.image_version
  notification_kyc_create_topic = "${local.service_name}-create-topic"
  tags = {
    "Application" = title(var.app)
    "Tribe"       = title(var.tribe)
    "Environment" = title(local.environment)
    "Domain"      = title(var.domain)
    "Squad"       = title(var.squad)
    "Product"     = title(var.product)
  }

  environment_variables = {
    "NODE_ENV"                           = lookup(var.environment_variables, local.environment).node_env
    "KYC_DYNAMO_TABLE"                   = lookup(var.environment_variables, local.environment).kyc_dynamo_table_name
    "KYC_INGESTION_URL"                  = lookup(var.environment_variables, local.environment).ingest_endpoint
    "KYC_SNS_CREATE_TOPIC_ARN"           = aws_sns_topic.kyc_create_topic.arn
    "KYC_MGM_ANSWERED_TOPIC"             = aws_sns_topic.kyc_create_topic.arn
    "KYC_REFERRAL_ANSWERED_TOPIC"        = aws_sns_topic.kyc_create_topic.arn
    "KYC_PLAN_PREFERENCE_ANSWERED_TOPIC" = aws_sns_topic.kyc_create_topic.arn
  }

  task_role_policies = [{
    name = "dynamodb-policy"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Action = [
            "dynamodb:DescribeTable",
            "dynamodb:UpdateItem",
            "dynamodb:GetItem",
            "dynamodb:Query",
          ]
          Effect = "Allow"
          Resource = [
            aws_dynamodb_table.kyc_table.arn,
            "${aws_dynamodb_table.kyc_table.arn}/index/CustomerIndex"
          ]
        },
      ]
    })
    },
    {
      name = "sns-policy"
      policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
          {
            Action = [
              "SNS:Publish",
            ]
            Effect   = "Allow"
            Resource = aws_sns_topic.kyc_create_topic.arn
          },
        ]
      })
  }]
}
