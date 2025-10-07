import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import {
  CreateMonthlyGoalDto,
  MonthlyGoalResponseDto,
  MonthlyGoalResponseSearchDto,
  MonthlyGoalSearchDto,
  UpdateMonthlyGoalDto,
} from '../dtos/monthly.goals.dto';
import { MonthlyGoal } from '../models/monthly.goals.model';
import { CompanyPositionsRepository } from '../repository/company.positions.repository';
import { EmployeesRepository } from '../repository/employees.repository';
import { MonthlyGoalsRepository } from '../repository/monthly.goals.repository';
import { ProductLinesRepository } from '../repository/product.lines.repository';
export class MonthlyGoalsService {
  private monthlyGoalRepository: MonthlyGoalsRepository;
  private employeeRepository: EmployeesRepository;
  private productLineRepository: ProductLinesRepository;
  private companyPositionRepository: CompanyPositionsRepository;
  constructor(dataSource: DataSource) {
    this.monthlyGoalRepository = new MonthlyGoalsRepository(dataSource);
    this.employeeRepository = new EmployeesRepository(dataSource);
    this.productLineRepository = new ProductLinesRepository(dataSource);
    this.companyPositionRepository = new CompanyPositionsRepository(dataSource);
  }

  async createMonthlyGoal(monthlyGoal: CreateMonthlyGoalDto): Promise<MonthlyGoalResponseDto> {
    const companyPosition = await this.companyPositionRepository.findById(monthlyGoal.companyPositionId);
    if (!companyPosition) {
      throw new Error('Cargo no encontrado al crear meta mensual');
    }
    const productLine = await this.productLineRepository.findById(monthlyGoal.productLineId);
    if (!productLine) {
      throw new Error('Línea de producto no encontrada al crear meta mensual');
    }
    const monthlyGoalEntity = plainToInstance(MonthlyGoal, monthlyGoal, { excludePrefixes: ['companyPositionId'] });
    monthlyGoalEntity.companyPosition = companyPosition;
    monthlyGoalEntity.productLine = productLine;
    const savedMonthlyGoal = await this.monthlyGoalRepository.create(monthlyGoalEntity);
    return plainToInstance(MonthlyGoalResponseDto, savedMonthlyGoal, { excludeExtraneousValues: true });
  }

  async updateMonthlyGoal(id: number, monthlyGoal: UpdateMonthlyGoalDto): Promise<MonthlyGoalResponseDto> {
    const monthlyGoalSaved = await this.monthlyGoalRepository.findById(id);
    if (!monthlyGoalSaved) {
      throw new Error('Meta mensual no encontrada al actualizar');
    }
    if (monthlyGoal.productLineId) {
      const productLine = await this.productLineRepository.findById(Number(monthlyGoal.productLineId));
      if (!productLine) {
        throw new Error('Línea de producto no encontrada al actualizar meta mensual');
      }
    }
    if (monthlyGoal.companyPositionId) {
      const companyPosition = await this.companyPositionRepository.findById(Number(monthlyGoal.companyPositionId));
      if (!companyPosition) {
        throw new Error('Cargo no encontrado al actualizar meta mensual');
      }
    }
    const monthlyGoalToUpdate = new MonthlyGoal();
    monthlyGoalToUpdate.id = id;
    monthlyGoalToUpdate.monthStart = monthlyGoal.monthStart || monthlyGoalSaved.monthStart;
    monthlyGoalToUpdate.monthEnd = monthlyGoal.monthEnd || monthlyGoalSaved.monthEnd;
    monthlyGoalToUpdate.goalValue = monthlyGoal.goalValue || monthlyGoalSaved.goalValue;
    monthlyGoalToUpdate.companyPosition = monthlyGoalSaved.companyPosition;
    monthlyGoalToUpdate.productLine = monthlyGoalSaved.productLine;
    const savedMonthlyGoal = await this.monthlyGoalRepository.update(id, monthlyGoalToUpdate);
    return plainToInstance(MonthlyGoalResponseDto, savedMonthlyGoal, { excludeExtraneousValues: true });
  }

  async deleteMonthlyGoal(id: number): Promise<void> {
    const monthlyGoalSaved = await this.monthlyGoalRepository.findById(id);
    if (!monthlyGoalSaved) {
      throw new Error('Meta mensual no encontrada al eliminar');
    }
    await this.monthlyGoalRepository.delete(id);
  }

  async searchMonthlyGoalPaginated(
    searchDto: MonthlyGoalSearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<MonthlyGoalResponseSearchDto> {
    const monthlyGoals = await this.monthlyGoalRepository.findByFilters(searchDto, page, limit);
    const monthlyGoalsResponse = monthlyGoals.items.map((monthlyGoal) =>
      plainToInstance(MonthlyGoalResponseDto, monthlyGoal, { excludeExtraneousValues: true }),
    );
    return plainToInstance(
      MonthlyGoalResponseSearchDto,
      {
        items: monthlyGoalsResponse,
        total: monthlyGoals.total,
      },
      { excludeExtraneousValues: true },
    );
  }
}
