import {MonthlyGoalSearchDto} from '../dtos/monthly.goals.dto';
import {MonthlyGoal} from '../models/monthly.goals.model';
import {DataSource as TypeORMDataSource} from 'typeorm';
import {BaseRepository} from './base.respository';

export class MonthlyGoalsRepository extends BaseRepository<MonthlyGoal> {
  constructor(dataSource: TypeORMDataSource) {
    super(MonthlyGoal, dataSource);
  }

  async findByFilters(
    searchDto: MonthlyGoalSearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: MonthlyGoal[]; total: number }> {
    const { companyPositionId, productLineId, monthStart, monthEnd } = searchDto;
    const query = this.repository
      .createQueryBuilder('monthly_goal')
      .leftJoinAndSelect('monthly_goal.companyPosition', 'companyPosition');

    const hasFilters = [companyPositionId, productLineId, monthStart, monthEnd].some((param) => param !== undefined);

    if (hasFilters) {
      if (companyPositionId !== undefined) {
        query.andWhere('monthly_goal.companyPositionId = :companyPositionId', { companyPositionId });
      }

      if (monthStart !== undefined) {
        query.andWhere('monthly_goal.monthStart = :monthStart', { monthStart });
      }

      if (monthEnd !== undefined) {
        query.andWhere('monthly_goal.monthEnd = :monthEnd', { monthEnd });
      }

      if (productLineId !== undefined) {
        query.andWhere('monthly_goal.productLineId = :productLineId', { productLineId });
      }
    } else {
      query.orderBy('monthly_goal.createdAt', 'DESC').take(10);
    }

    if (hasFilters) {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }
}
