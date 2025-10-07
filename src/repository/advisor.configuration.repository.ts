import { EmployForMonth } from '../models/advisor.configuration.model';
import { BaseRepository } from './base.respository';
import { DataSource } from 'typeorm';

export class AdvisorConfigurationRepository extends BaseRepository<EmployForMonth> {
  constructor(dataSource: DataSource) {
    super(EmployForMonth, dataSource);
  }

  async findByStoreConfigurationId(storeConfigurationId: number): Promise<EmployForMonth[]> {
    return this.repository.find({
      where: { storeConfiguration: { id: storeConfigurationId } },
      order: { month: "ASC" }
    });
  }

  async findAllByStoreId(storeId: number): Promise<EmployForMonth[]> {
    return this.repository.find({
      where: {
        storeConfiguration: { id: storeId },
      },
      order: {
        month: 'ASC',
      },
    });
  }

}
