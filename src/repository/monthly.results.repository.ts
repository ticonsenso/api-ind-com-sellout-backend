import { DataSource, Repository } from 'typeorm';
import { MonthlyResult } from '../models/monthly.results.model';
import { MonthlyResultSearchDto } from '../dtos/monthly.results.dto';

export class MonthlyResultsRepository {
  private repository: Repository<MonthlyResult>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(MonthlyResult);
  }

  async findById(id: number): Promise<MonthlyResult | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['employee'],
    });
  }

  async create(monthlyResult: MonthlyResult): Promise<MonthlyResult> {
    return this.repository.save(monthlyResult);
  }

  async update(id: number, monthlyResult: MonthlyResult): Promise<MonthlyResult> {
    await this.repository.update(id, monthlyResult);
    return this.findById(id) as Promise<MonthlyResult>;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByFilters(
    searchDto: MonthlyResultSearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: MonthlyResult[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder('monthlyResult')
      .leftJoinAndSelect('monthlyResult.employee', 'employee');

    if (searchDto.employeeId) {
      queryBuilder.andWhere('monthlyResult.employee.id = :employeeId', { employeeId: searchDto.employeeId });
    }

    if (searchDto.month) {
      queryBuilder.andWhere('monthlyResult.month = :month', { month: searchDto.month });
    }

    if (searchDto.productLine) {
      queryBuilder.andWhere('monthlyResult.productLine ILIKE :productLine', {
        productLine: `%${searchDto.productLine}%`,
      });
    }

    if (searchDto.minSaleValue) {
      queryBuilder.andWhere('monthlyResult.saleValue >= :minSaleValue', { minSaleValue: searchDto.minSaleValue });
    }

    if (searchDto.maxSaleValue) {
      queryBuilder.andWhere('monthlyResult.saleValue <= :maxSaleValue', { maxSaleValue: searchDto.maxSaleValue });
    }

    if (searchDto.bonusApplies !== undefined) {
      queryBuilder.andWhere('monthlyResult.bonusApplies = :bonusApplies', { bonusApplies: searchDto.bonusApplies });
    }

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { items, total };
  }
}
