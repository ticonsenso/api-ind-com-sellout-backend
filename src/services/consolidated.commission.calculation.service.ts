import {plainToInstance} from "class-transformer";
import {DataSource} from "typeorm";
import {CalculationProductExtrategicResponseDto} from "../dtos/calculation.product.extrategic.dto";
import {
    ConsolidateDataResponseDto,
    ConsolidatedCommissionCalculationPaginationResponseDto,
    ConsolidatedCommissionCalculationResponseDto,
} from "../dtos/consolidated.commission.calculation.dto";

import {ProductComplianceResponseDto} from "../dtos/product.compliance.dto";
import {ConsolidatedCommissionCalculation} from "../models/consolidated.commission.calculation.model";
import {CalculationProductExtrategicRepository} from "../repository/calculation.product.extrategic.repository";
import {
    ConsolidatedCommissionCalculationRepository
} from "../repository/consolidated.commission.calculation.repository";
import {ProductComplianceRepository} from "../repository/product.compliance.repository";
import {ParameterLinesRepository} from "../repository/parameter.lines.repository";
import {CompanyPositionSnapshotDto, EmployeeHistoryResponseDto} from "../dtos/employees.history.dto";
import {EmployeesHistoryRepository} from "../repository/employees.history.repository";
import {CompanyPositionSnapshot} from "../models/employees.history.model";
import {EmployeesRepository} from "../repository/employees.repository";

export class ConsolidatedCommissionCalculationService {
  private consolidatedCommissionCalculationRepository: ConsolidatedCommissionCalculationRepository;
  private productComplianceRepository: ProductComplianceRepository;
  private calculationProductExtrategicRepository: CalculationProductExtrategicRepository;
  private parameterLineRepository: ParameterLinesRepository;
  private employeeHistoryRepository: EmployeesHistoryRepository;
  private employeeRepository: EmployeesRepository;
  constructor(dataSource: DataSource) {
    this.consolidatedCommissionCalculationRepository =
      new ConsolidatedCommissionCalculationRepository(dataSource);
    this.employeeRepository = new EmployeesRepository(dataSource);
    this.productComplianceRepository = new ProductComplianceRepository(
      dataSource
    );
    this.calculationProductExtrategicRepository =
      new CalculationProductExtrategicRepository(dataSource);
    this.employeeRepository = new EmployeesRepository(dataSource);
    this.parameterLineRepository = new ParameterLinesRepository(dataSource);
    this.employeeHistoryRepository = new EmployeesHistoryRepository(dataSource);
  }

  async createConsolidatedCommissionCalculation(
    consolidatedCommissionCalculation: ConsolidatedCommissionCalculation
  ): Promise<void> {
    await this.consolidatedCommissionCalculationRepository.create(
      consolidatedCommissionCalculation
    );
  }

  async getConsolidatedCommissionCalculation(
    search: string,
    calculateDate: Date | null,
    page?: number,
    limit?: number
  ): Promise<ConsolidatedCommissionCalculationPaginationResponseDto> {

    const consolidatedCommissionCalculation =
      await this.consolidatedCommissionCalculationRepository.findByEmployeeAndCalculateDateWithPagination(
        search,
        calculateDate as Date,
        page,
        limit
      );

    const response = await Promise.all(
      consolidatedCommissionCalculation.items.map(async ({ employee, ...calc }) => {
        const history = await this.employeeRepository.findByCode(employee?.code, calculateDate?.toISOString().split('T')[0]);

        if (!history) {
          return {
            ...plainToInstance(
              ConsolidatedCommissionCalculationResponseDto,
              calc,
              { excludeExtraneousValues: true },
            ),
            employee: null,
          };
        }

        const companyPosition = history.companyPosition
          ? plainToInstance(
            CompanyPositionSnapshotDto,
            history.companyPosition,
            { excludeExtraneousValues: true },
          )
          : null;

        const employeeHistory = plainToInstance(
          EmployeeHistoryResponseDto,
          history,
          { excludeExtraneousValues: true },
        );

        employeeHistory.companyPosition = companyPosition as CompanyPositionSnapshot;

        const calcDto = plainToInstance(
          ConsolidatedCommissionCalculationResponseDto,
          calc,
          { excludeExtraneousValues: true },
        );

        return {
          ...calcDto,
          employee: {
            ...employeeHistory,
            id: history.id,
          },
          employeeId: history.id,

        };
      }),
    );

    return {
      data: response,
      total: consolidatedCommissionCalculation.total,
    };
  }

  async consolidateData(
    employeeId: number,
    calculateDate: Date
  ): Promise<ConsolidateDataResponseDto> {
    const consolidatedCommissionCalculation =
      await this.consolidatedCommissionCalculationRepository.findByEmployeeAndCalculateDate(
        employeeId,
        calculateDate
      );
    const productCompliance =
      await this.productComplianceRepository.findByEmployeeAndMonthDetail(
        employeeId,
        calculateDate
      );

    const calculationProductExtrategic =
      await this.calculationProductExtrategicRepository.findByEmployeeAndCalculateDateDetail(
        employeeId,
        calculateDate
      );

    return {
      consolidatedCommissionCalculation: plainToInstance(
        ConsolidatedCommissionCalculationResponseDto,
        consolidatedCommissionCalculation
      ),
      productCompliance: plainToInstance(
        ProductComplianceResponseDto,
        productCompliance
      ),
      calculationProductExtrategic: plainToInstance(
        CalculationProductExtrategicResponseDto,
        calculationProductExtrategic
      ),
    };
  }

}
