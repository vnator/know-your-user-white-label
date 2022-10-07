terraform {
  backend "s3" {}
}

provider "aws" {
  region = local.region
}

module "app" {
  source                    = "git@github.com:vnator/terraform-modules.git//service-app"
  tags                      = local.tags
  app                       = local.app
  environment               = local.environment
  container_port            = local.container_port
  environment_variables     = local.environment_variables
  parameters                = local.parameters
  task_role_inline_policies = local.task_role_policies
  image_version             = local.image_version
}
