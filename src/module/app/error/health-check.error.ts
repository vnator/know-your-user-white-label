import { CustomError } from 'src/shared/custom-error.error';

export class HealthCheckError extends CustomError {
  public code = 'HEALTH_CHECK_ERROR';
  public message = 'Health check failed';
}
