import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/base-service';
import { HealthCheckError } from './error/health-check.error';
import { HealthCheckRepository } from './port/health-check.repository';

@Injectable()
export class AppService extends BaseService {
  constructor(private healthCheckRepository: HealthCheckRepository) {
    super();
  }

  async healthCheck(): Promise<void> {
    try {
      await this.healthCheckRepository.databaseConnections();
    } catch (error) {
      this.logger.error(error);
      throw new HealthCheckError();
    }
  }
}
