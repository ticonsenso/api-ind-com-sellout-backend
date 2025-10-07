import { DataSource, Repository, Between, Like } from 'typeorm';
import { SettlementPeriod } from '../models/settlement.periods.model';
import { SettlementPeriodSearchDto } from '../dtos/settlement.periods.dto';
import { BaseRepository } from './base.respository';

export class SettlementPeriodsRepository extends BaseRepository<SettlementPeriod> {
  constructor(dataSource: DataSource) {
    super(SettlementPeriod, dataSource);
  }

  async findByFilters(
    searchDto: SettlementPeriodSearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: SettlementPeriod[]; total: number }> {
    const { companyId, startDate, endDate, status } = searchDto;
    const query = this.repository
      .createQueryBuilder('settlementPeriod')
      .leftJoinAndSelect('settlementPeriod.company', 'company');

    const hasFilters = [companyId, startDate, endDate, status].some((param) => param !== undefined);

    if (hasFilters) {
      if (companyId !== undefined) {
        query.andWhere('settlementPeriod.company.id = :companyId', { companyId });
      }

      if (startDate !== undefined && endDate !== undefined) {
        query.andWhere('settlementPeriod.startDate BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      } else if (startDate !== undefined) {
        query.andWhere('settlementPeriod.startDate >= :startDate', { startDate });
      } else if (endDate !== undefined) {
        query.andWhere('settlementPeriod.endDate <= :endDate', { endDate });
      }

      if (status !== undefined) {
        query.andWhere('settlementPeriod.status = :status', { status });
      }
    } else {
      query.orderBy('settlementPeriod.startDate', 'DESC').take(10);
    }

    if (hasFilters) {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }
}
