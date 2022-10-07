resource "aws_sns_topic" "kyc_create_topic" {
  name = local.notification_kyc_create_topic

  tags = local.tags
}