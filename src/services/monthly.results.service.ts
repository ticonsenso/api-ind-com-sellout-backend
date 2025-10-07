import { DataSource } from 'typeorm';
import { MonthlyResultsRepository } from '../repository/monthly.results.repository';
import {
  CreateMonthlyResultDto,
  UpdateMonthlyResultDto,
  MonthlyResultSearchDto,
  MonthlyResultResponseDto,
  MonthlyResultResponseSearchDto,
} from '../dtos/monthly.results.dto';
import { MonthlyResult } from '../models/monthly.results.model';
import { plainToInstance } from 'class-transformer';
import { EmployeesRepository } from '../repository/employees.repository';

export class MonthlyResultsService {
  private monthlyResultRepository: MonthlyResultsRepository;
  private employeeRepository: EmployeesRepository;

  constructor(dataSource: DataSource) {
    this.monthlyResultRepository = new MonthlyResultsRepository(dataSource);
    this.employeeRepository = new EmployeesRepository(dataSource);
  }

  async createMonthlyResult(result: CreateMonthlyResultDto): Promise<MonthlyResultResponseDto> {
    const employee = await this.employeeRepository.findById(result.employeeId);
    if (!employee) {
      throw new Error('Empleado no encontrado al crear resultado mensual');
    }
    const monthlyResultEntity = plainToInstance(MonthlyResult, result, { excludePrefixes: ['employeeId'] });
    monthlyResultEntity.employee = employee;
    const savedResult = await this.monthlyResultRepository.create(monthlyResultEntity);
    return plainToInstance(MonthlyResultResponseDto, savedResult, { excludeExtraneousValues: true });
  }

  async updateMonthlyResult(id: number, result: UpdateMonthlyResultDto): Promise<MonthlyResultResponseDto> {
    const existingResult = await this.monthlyResultRepository.findById(id);
    if (!existingResult) {
      throw new Error('Resultado mensual no encontrado al actualizar');
    }
    const employee = await this.employeeRepository.findById(Number(result.employeeId));
    if (!employee) {
      throw new Error('Empleado no encontrado al actualizar resultado mensual');
    }
    const resultToUpdate = new MonthlyResult();
    resultToUpdate.id = id;
    resultToUpdate.productLine = result.productLine || existingResult.productLine;
    resultToUpdate.saleValue = result.saleValue || existingResult.saleValue;
    resultToUpdate.compliance = result.compliance || existingResult.compliance;
    resultToUpdate.productivity = result.productivity || existingResult.productivity;
    resultToUpdate.bonusApplies = result.bonusApplies ?? existingResult.bonusApplies;
    resultToUpdate.commissionAmount = result.commissionAmount || existingResult.commissionAmount;
    resultToUpdate.observations = result.observations || existingResult.observations;
    resultToUpdate.employee = employee;
    resultToUpdate.month = result.month || existingResult.month;

    const savedResult = await this.monthlyResultRepository.update(id, resultToUpdate);
    return plainToInstance(MonthlyResultResponseDto, savedResult, { excludeExtraneousValues: true });
  }

  async deleteMonthlyResult(id: number): Promise<void> {
    const existingResult = await this.monthlyResultRepository.findById(id);
    if (!existingResult) {
      throw new Error('Resultado mensual no encontrado al eliminar');
    }
    await this.monthlyResultRepository.delete(id);
  }

  async searchMonthlyResultsPaginated(
    searchDto: MonthlyResultSearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<MonthlyResultResponseSearchDto> {
    const results = await this.monthlyResultRepository.findByFilters(searchDto, page, limit);
    const resultsResponse = results.items.map((result) =>
      plainToInstance(MonthlyResultResponseDto, result, { excludeExtraneousValues: true }),
    );

    return plainToInstance(
      MonthlyResultResponseSearchDto,
      {
        items: resultsResponse,
        total: results.total,
      },
      { excludeExtraneousValues: true },
    );
  }
}
