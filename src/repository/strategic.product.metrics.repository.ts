import { StrategicProductMetric } from '../models/strategic.product.metrics.model';
import { BaseRepository } from './base.respository';
import { DataSource as TypeORMDataSource } from 'typeorm';

export class StrategicProductMetricsRepository extends BaseRepository<StrategicProductMetric> {
  constructor(dataSource: TypeORMDataSource) {
    super(StrategicProductMetric, dataSource);
  }
}
