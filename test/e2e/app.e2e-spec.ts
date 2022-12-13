import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getApp } from 'test/helper/http-app';
import { name, version } from '../../package.json';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await getApp();
    await app.init();
  });

  it('/ (GET) - health check', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.OK)
      .expect('Request-Id', /.*/)
      .expect({ name, version });
  });
});
