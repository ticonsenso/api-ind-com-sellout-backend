import {DataSource} from 'typeorm';
import {CommissionSettlementsRepository} from '../repository/commission.settlements.repository';

export class CommissionSettlementsService {
  private commissionSettlementRepository: CommissionSettlementsRepository;

  constructor(dataSource: DataSource) {
    this.commissionSettlementRepository = new CommissionSettlementsRepository(dataSource);
  }
}
