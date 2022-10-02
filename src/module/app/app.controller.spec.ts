import { Test, TestingModule } from "@nestjs/testing";
import { instance, mock, verify } from "ts-mockito";
import { AppController } from "./app.controller";
import { AppModule } from "./app.module";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;
  let service: AppService;
  let serviceMock: AppService;

  beforeEach(async () => {
    serviceMock = mock(AppService);
    service = instance(serviceMock);
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue(service)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe("health check", () => {
    it('should check app health!"', async () => {
      const result = await appController.healthCheck();
      verify(serviceMock.healthCheck()).once();
      expect(result).toHaveProperty(
        "name",
        "onboarding-whitelabel-know-your-customer",
      );
      expect(result).toHaveProperty("version", expect.any(String));
    });
  });
});
