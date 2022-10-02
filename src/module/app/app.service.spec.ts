import { instance, mock, verify, when } from 'ts-mockito';
import { AppService } from './app.service';
import { HealthCheckError } from './error/health-check.error';
import { HealthCheckRepository } from './port/health-check.repository';

describe('AppService', () => {
  let service: AppService;
  let repositoryMock: HealthCheckRepository;
  let repository: HealthCheckRepository;

  beforeEach(() => {
    repositoryMock = mock<HealthCheckRepository>();
    repository = instance(repositoryMock);
    service = new AppService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('HealthCheck', () => {
    it('should verify database health', async () => {
      await service.healthCheck();
      verify(repositoryMock.databaseConnections()).once();
    });
    it('should throw error when database fail', async () => {
      when(repositoryMock.databaseConnections()).thenReject(new Error());
      await expect(() => service.healthCheck()).rejects.toThrowError(
        HealthCheckError,
      );
      verify(repositoryMock.databaseConnections()).once();
    });
  });
});
