import { InitSessionLogs } from '../models/init.session.logs.model';
import { BaseRepository } from './base.respository';
import { DataSource } from 'typeorm';

export class InitSessionLogsRepository extends BaseRepository<InitSessionLogs> {
  constructor(dataSource: DataSource) {
    super(InitSessionLogs, dataSource);
  }

  async findByEmail(email: string): Promise<InitSessionLogs | null> {
    return this.repository.findOne({ where: { email } });
  }
}
