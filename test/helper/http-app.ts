import { TestingModule, Test } from '@nestjs/testing';
import { config } from 'src/adapter/incoming/http';
import { AppModule } from 'src/module/app/app.module';

export const getApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication({
    logger: false,
  });
  config(app);
  return app;
};
