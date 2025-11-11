import {CommissionSettlement} from '../models/commission.settlements.model';
import {BaseRepository} from './base.respository';
import {DataSource as TypeORMDataSource} from 'typeorm';

export class CommissionSettlementsRepository extends BaseRepository<CommissionSettlement> {
  constructor(dataSource: TypeORMDataSource) {
    super(CommissionSettlement, dataSource);
  }
}
