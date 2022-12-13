# Configuration Module

Loaded with [Nest Config Module](https://docs.nestjs.com/techniques/configuration#configuration) for a [root scope](./config.module.ts#L6)

- `config/base.config.ts`: base config class with app prefix to be used in environment variables to avoid name conflict.
- `config/app.config.ts`: application config extended from `BaseConfig` class (aws region, environment)
- `config/database.config.ts`: database config extended from `BaseConfig` class
- `config/port.config.ts`: port config extended from `BaseConfig` class (protocols, http port)
