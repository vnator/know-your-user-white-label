export abstract class HealthCheckRepository {
  abstract databaseConnections(): Promise<void>;
}
