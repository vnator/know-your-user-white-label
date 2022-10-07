# Know Your Customer Onboarding Whitelabel
KYC application using [NestJS framework](https://nestjs.com/), for data injestion of ONBOARDING-WHITELABEL.

## Installation

```bash
$ yarn
```

## Running the app

To use `.env` as environment variables copy .`env-example` to `.env` file

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Build

```bash
$ yarn build
```

## Lint

```bash
$ yarn lint
```

## Structure

### directory tree

- [config](./src/config)
- [adapter](./src/adapter)
- [module](./src/module): nest modules source root (command `nest generate` will create entries here)
- index.ts: bootstrap application in a port (http protocol for example)

```
|index.ts
|____config
| |____config.module.ts
| |____base.config.ts
| |____database.config.ts
| |____app.config.ts
| |____http.config.ts
| |____publisher.config.ts
|____module
| |____main.ts
| |____app.service.ts
| |____app.module.ts
| |____app.controller.spec.ts
| |____app.controller.ts
|____adapter
| |____entity
| |____port
| |____outgoing
| | |____client
| | | |____aws.client.ts
| | |____database
| | | |____dynamo-db.ts
| | |____publisher
| | |____repository
| |____incoming
| | |____http
| |____adapter.module.ts

```

## Release
To create a new release you need to bump the version number in `package.json` and commit the changes.
A changelog will be added to release, a tag will be created for the new version and a tagged deploy to production will be triggered.

## Deploy
This service uses AWS ECS fargate deployed by [terraform](./infrastructure/terraform/)

The [docker image](./Dockerfile) is pulled automatic to dev environment on every main branch push triggered by [github actions](./.github/workflows/deploy.yml). If you want to use it in development you need to run [github workflow](../../actions/workflows/deploy-image.yml) manually.

| Environment | Url                                      |
| ----------- | ---------------------------------------- |
| Local       | http://localhost:3000                    |
| dev     | http://api-kyc-dev.internal.vnator.dev |

## Infrastructure

To change the infrastructure on AWS you need update [terraform](./infrastructure/terraform/), the [github workflow](../../actions/workflows/deploy-infra.yml) with be triggered automatically on pull request showing terraform plan and triggered again on push to apply changes on dev environment. If you need to apply changes in other environments you need to run [github workflow](../../actions/workflows/deploy-infra.yml) manually.
