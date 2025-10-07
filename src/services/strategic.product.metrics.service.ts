import { DataSource } from 'typeorm';
import { StrategicProductMetricsRepository } from '../repository/strategic.product.metrics.repository';
export class StrategicProductMetricsService {
  private strategicProductMetricsRepository: StrategicProductMetricsRepository;

  constructor(dataSource: DataSource) {
    this.strategicProductMetricsRepository = new StrategicProductMetricsRepository(dataSource);
  }
}
