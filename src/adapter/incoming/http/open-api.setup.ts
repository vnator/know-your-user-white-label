import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { name, description, version } from '../../../../package.json';

const cors = (req, res, next) => {
  if (req.header('Origin')) {
    res.setHeader('Access-Control-Allow-Origin', req.header('Origin'));
  }
  next();
};
export const setupSwagger = (app: INestApplication) => {
  const docsPath = '/kyc/docs';
  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  app.use(`${docsPath}-json`, cors);
  app.use(`${docsPath}/*`, cors);
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup(docsPath, app, document);
};
