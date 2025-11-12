import {plainToInstance} from "class-transformer";
import {DataSource} from "typeorm";
import {
    CalculationProductExtrategicPaginationResponseDto,
    CalculationProductExtrategicResponseDto,
    CreateCalculationProductExtrategicDto,
} from "../dtos/calculation.product.extrategic.dto";
import {EmployeeResponseDto} from "../dtos/employees.dto";
import {CalculationProductExtrategic} from "../models/calculation.product.extrategic.model";
import {ConsolidatedCommissionCalculation} from "../models/consolidated.commission.calculation.model";
import {Employee} from "../models/employees.model";
import {CalculationProductExtrategicRepository} from "../repository/calculation.product.extrategic.repository";
import {
    ConsolidatedCommissionCalculationRepository
} from "../repository/consolidated.commission.calculation.repository";
import {EmployeesRepository} from "../repository/employees.repository";
import {KpiConfigRepository} from "../repository/kpi.config.repository";
import {ProductComplianceRepository} from "../repository/product.compliance.repository";
import {SeasonsRepository} from "../repository/seasons.repository";
import {VariableScalesRepository} from "../repository/variable.scales.repository";
import {EmployeesHistoryRepository} from "../repository/employees.history.repository";
import {CommissionConfigurationsHistory} from "../models/commission.configurations.history.model";
import {CommissionConfigurationsHistoryRepository} from "../repository/commision.configurations.history.repository";
import {EmployeesHistory} from "../models/employees.history.model";
import {CommissionConfiguration} from "../models/commission.configurations.model";
import {CommissionConfigurationsRepository} from "../repository/commission.configurations.repository";
import {ProductLinesRepository} from "../repository/product.lines.repository";
import {SalesRotationConfigurationsRepository} from "../repository/sales.rotation.configurations.repository";
import {CommissionRulesRepository} from "../repository/commission.rules.repository";
import {Company} from "../models/companies.model";
import {CompanyPosition} from "../models/company.positions.model";
import {ExtractedDataRepository} from "../repository/extracted.data.repository";
import {CommissionParametersRepository} from "../repository/commission.parameters.repository";
import {getLastDayOfMonth} from "../utils/utils";
import {CommissionParameter} from "../models/commission.parameters.model";

export class CalculationProductExtrategicService {
  private calculationProductExtrategicRepository: CalculationProductExtrategicRepository;
  private employeeRepository: EmployeesRepository;
  private kpiConfigRepository: KpiConfigRepository;
  private commissionConfigurationHistoryRepository: CommissionConfigurationsHistoryRepository;
  private commissionConfigurationRepository: CommissionConfigurationsRepository;
  private seasonRepository: SeasonsRepository;
  private salesRotationConfigurationsRepository: SalesRotationConfigurationsRepository;
  private variableScalesRepository: VariableScalesRepository;
  private productComplianceRepository: ProductComplianceRepository;
  private consolidatedCommissionCalculationRepository: ConsolidatedCommissionCalculationRepository;
  private employeeHistoryRepository: EmployeesHistoryRepository;
  private productLineRepository: ProductLinesRepository;
  private commissionRulesRepository: CommissionRulesRepository;
  private extractedDataRepository: ExtractedDataRepository;
  private commissionParametersRepository: CommissionParametersRepository;
  constructor(dataSource: DataSource) {
    this.calculationProductExtrategicRepository =
      new CalculationProductExtrategicRepository(dataSource);
    this.employeeRepository = new EmployeesRepository(dataSource);
    this.kpiConfigRepository = new KpiConfigRepository(dataSource);
    this.seasonRepository = new SeasonsRepository(dataSource);
    this.productLineRepository = new ProductLinesRepository(dataSource);
    this.commissionConfigurationHistoryRepository = new CommissionConfigurationsHistoryRepository(dataSource);
    this.commissionConfigurationRepository = new CommissionConfigurationsRepository(dataSource);
    this.salesRotationConfigurationsRepository = new SalesRotationConfigurationsRepository(dataSource);
    this.employeeHistoryRepository = new EmployeesHistoryRepository(dataSource);
    this.variableScalesRepository = new VariableScalesRepository(dataSource);
    this.commissionRulesRepository = new CommissionRulesRepository(dataSource);
    this.productLineRepository = new ProductLinesRepository(dataSource);
    this.productComplianceRepository = new ProductComplianceRepository(
      dataSource
    );
    this.consolidatedCommissionCalculationRepository =
      new ConsolidatedCommissionCalculationRepository(dataSource);
    this.extractedDataRepository = new ExtractedDataRepository(dataSource);
    this.commissionParametersRepository = new CommissionParametersRepository(dataSource);
  }

  async createCalculationProductExtrategic(
    createCalculationProductExtrategicsDto: CreateCalculationProductExtrategicDto[]
  ): Promise<{ count: number; errorCount: number; smsErrors: string[] }> {
    let count = 0;
    let errorCount = 0;
    let smsErrors: string[] = [];
    for (const dto of createCalculationProductExtrategicsDto) {
      try {
        const employee = await this.employeeRepository.findByCode(
          dto.employeeCode.trim(),
          String(dto.calculateDate)
        );
        if (!employee) {
          smsErrors.push(
            "Empleado no encontrado en la nominacion. " + dto.employeeCode
          );
          errorCount++;
          continue;
        }
        if (!employee.companyPosition) {
          smsErrors.push(
            "Cargo no encontrado en la nominacion. " + dto.employeeCode
          );
          errorCount++;
          continue;
        }
        const kpiConfig =
          await this.kpiConfigRepository.findByPositionAndVersion(
            employee.companyPosition?.id || 0
          );

        const entity = await this.createCalculationEntity(
          dto,
          employee,
          kpiConfig
        );

        await this.processVariableScales(entity, employee);
        const savedEntity =
          await this.calculationProductExtrategicRepository.create(entity);
        const calculateConsolidatedCommissionCalculation = await this.calculateConsolidatedCommissionCalculation(
          employee,
          savedEntity
        );
        if (typeof calculateConsolidatedCommissionCalculation === 'string') {
          smsErrors.push(calculateConsolidatedCommissionCalculation + " " + dto.employeeCode);
          errorCount++;
          continue;
        }
        const commisionConfiguration = await this.commissionConfigurationRepository.findByCompanyAndPosition(
          calculateConsolidatedCommissionCalculation?.company?.id || 0,
          calculateConsolidatedCommissionCalculation?.companyPosition?.id || 0
        );
        // if (calculateConsolidatedCommissionCalculation) {
        //   await this.createEmployeeHistory(employee, calculateConsolidatedCommissionCalculation, smsErrors, errorCount);
        // } else {
        //   smsErrors.push("No se pudo crear el cálculo consolidado de comisiones de producto estratégico. " + dto.employeeCode);
        //   errorCount++;
        //   continue;
        // }

        if (commisionConfiguration && calculateConsolidatedCommissionCalculation) {
          await this.createCommissionConfigurationHistory(commisionConfiguration, calculateConsolidatedCommissionCalculation, employee, smsErrors, errorCount);
        } else {
          smsErrors.push("No se pudo crear la historia de comisiones de producto estratégico. " + dto.employeeCode);
          errorCount++;
          continue;
        }

        count++;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al crear el producto estratégico";
        smsErrors.push(errorMessage + " " + dto.employeeCode);
        errorCount++;
        continue;
      }
    }
    return { count, errorCount, smsErrors };
  }

  async createCommissionConfigurationHistory(commissionConfiguration: CommissionConfiguration, consolidatedCommissionCalculation: ConsolidatedCommissionCalculation, employee: Employee, smsErrors: string[], errorCount: number) {

    const kpiConfig = await this.kpiConfigRepository.getKpiConfigByCommissionConfigurationId(commissionConfiguration.id);
    const commissionParameters = await this.commissionConfigurationRepository.findByCommissionConfigurationId(commissionConfiguration.id);
    const productLines = await this.productLineRepository.findByCommissionConfigurationId(commissionConfiguration.id);
    const salesRotationConfigurations = await this.salesRotationConfigurationsRepository.findByCommissionConfigurationId(commissionConfiguration.id);
    const commissionRules = await this.commissionRulesRepository.findByCommissionConfigurationId(commissionConfiguration.id);
    const variableScales = await this.variableScalesRepository.findByCommissionConfigurationId(commissionConfiguration.id);

    const commissionConfigurationHistory = new CommissionConfigurationsHistory();

    commissionConfigurationHistory.commissionConfiguration = commissionConfiguration;
    commissionConfigurationHistory.consolidatedCommissionCalculation = consolidatedCommissionCalculation;
    commissionConfigurationHistory.company = employee.company;
    commissionConfigurationHistory.companyPosition = employee.companyPosition;
    commissionConfigurationHistory.name = commissionConfiguration?.name;
    commissionConfigurationHistory.description = commissionConfiguration?.description;
    commissionConfigurationHistory.status = commissionConfiguration?.status;
    commissionConfigurationHistory.version = commissionConfiguration?.version;
    commissionConfigurationHistory.noteVersion = commissionConfiguration?.noteVersion;
    commissionConfigurationHistory.isRuleCommission = commissionConfiguration?.isRuleCommission;
    commissionConfigurationHistory.kpiConfig = kpiConfig;
    commissionConfigurationHistory.commissionParameters = commissionParameters;
    commissionConfigurationHistory.productLines = productLines;
    commissionConfigurationHistory.commissionRules = commissionRules;
    commissionConfigurationHistory.salesRotationConfigurations = salesRotationConfigurations;
    commissionConfigurationHistory.variableScales = variableScales;
    try {
      await this.commissionConfigurationHistoryRepository.create(commissionConfigurationHistory);
    } catch (error) {
      smsErrors.push("Commission Configuration History error:  " + error);
      errorCount++;
    }
  }

  async deleteByYearMonth(
    year: number,
    month: number
  ): Promise<{
    resultEmployeeHistoryRepository: { affected: number | null | undefined; raw: any };
    resultProductExtrategic: { affected: number | null | undefined; raw: any };
    resultConsolidatedCommissionCalculation: { affected: number | null | undefined; raw: any };
    resultProductCompliance: { affected: number | null | undefined; raw: any };
    resultExtractedData: { affected: number | null | undefined; raw: any };
  }> {
    month = month - 1;
    try {
      const resultEmployeeHistoryRepository = await this.employeeHistoryRepository.deleteByDateRange(
        new Date(year, month, 1),
        new Date(year, month + 1, 0)
      );
      const resultProductExtrategic = await this.calculationProductExtrategicRepository.deleteByDateRange(
        new Date(year, month, 1),
        new Date(year, month + 1, 0)
      );
      const resultConsolidatedCommissionCalculation = await this.consolidatedCommissionCalculationRepository.deleteByDateRange(
        new Date(year, month, 1),
        new Date(year, month + 1, 0)
      );
      const resultProductCompliance = await this.productComplianceRepository.deleteByDateRange(
        new Date(year, month, 1),
        new Date(year, month + 1, 0)
      );
      const resultExtractedData = await this.extractedDataRepository.deleteExtractedDataByCurrentMonth();
      return {
        resultEmployeeHistoryRepository,
        resultProductExtrategic,
        resultConsolidatedCommissionCalculation,
        resultProductCompliance,
        resultExtractedData,
      }
    } catch (error) {
      throw new Error(`Error al eliminar los datos: ${error}`);
    }
  }

  async createEmployeeHistory(employee: Employee, consolidatedCommissionCalculation: ConsolidatedCommissionCalculation, smsErrors: string[], errorCount: number) {

    const companyPositionHistory = {
      id: employee.companyPosition.id,
      name: employee.companyPosition.name,
      companyId: employee.company.id,
    };

    const employeesHistory = new EmployeesHistory();
    employeesHistory.employee = { id: employee.id } as Employee;
    employeesHistory.company = { id: employee.company.id } as Company;
    employeesHistory.companyPosition = { id: employee.companyPosition.id } as CompanyPosition;
    employeesHistory.code = employee.code;
    employeesHistory.name = employee.name;
    employeesHistory.documentNumber = employee.documentNumber;
    employeesHistory.email = employee.email;
    employeesHistory.phone = employee.phone!;
    employeesHistory.city = employee.city!;
    employeesHistory.dateInitialContract = employee.dateInitialContract;
    employeesHistory.isActive = employee.isActive;
    //employeesHistory.supervisorId = employee.supervisorId!;
    employeesHistory.salary = employee.salary;
    employeesHistory.variableSalary = employee.variableSalary;
    employeesHistory.consolidatedCommissionCalculation = { id: consolidatedCommissionCalculation.id } as ConsolidatedCommissionCalculation;
    employeesHistory.companyPositionHistory = companyPositionHistory;
    try {
      await this.employeeHistoryRepository.create(employeesHistory);

    } catch (error) {

      smsErrors.push("Empleado historico error:  " + error);
      errorCount++;
    }
  }

  /**
   * Crea una entidad de cálculo de producto estratégico a partir de los datos proporcionados
   * @param dto - DTO con los datos del cálculo
   * @param employee - Empleado asociado al cálculo
   * @param kpiConfig - Configuración de KPI
   * @returns Entidad de cálculo de producto estratégico
   */
  private async createCalculationEntity(
    dto: CreateCalculationProductExtrategicDto,
    employee: Employee,
    kpiConfig: any[]
  ): Promise<CalculationProductExtrategic> {
    const entity = plainToInstance(CalculationProductExtrategic, dto, {
      excludePrefixes: ["employeeCode"],
    });
    entity.strategicCompliancePct =
      dto.budgetValue > 0 ? (entity.ubReal / dto.budgetValue) * 100 : 0;
    entity.exhibitionPct =
      dto.totalExhibition > 0
        ? (entity.exhibition / dto.totalExhibition) * 100
        : 0;
    entity.rotationPct =
      dto.unitsExhibited > 0 ? entity.unitsSold / dto.unitsExhibited : 0;
    entity.productivityPct = await this.calculateProductivityPct(
      entity.strategicCompliancePct,
      entity.rotationPct,
      entity.exhibitionPct,
      kpiConfig,
      dto.calculateDate
    );

    entity.employee = employee;
    entity.company = employee.company;
    entity.companyPosition = employee.companyPosition;

    return entity;
  }

  /**
   * Procesa las escalas de variable para determinar el valor del producto estratégico
   * @param entity - Entidad de cálculo de producto estratégico
   * @param employee - Empleado asociado al cálculo
   */
  private async processVariableScales(
    entity: CalculationProductExtrategic,
    employee: Employee
  ): Promise<void> {
    const variableScales =
      await this.variableScalesRepository.findByFiltersWithoutVersion({
        companyId: employee.company.id,
        companyPositionId: entity.companyPosition?.id || 0,
      });

    const productComplianceSummary =
      await this.productComplianceRepository.getProductComplianceSummary(
        employee.id,
        entity.calculateDate
      );

    const productivityPct = entity.productivityPct;
    let bonusApplied = false;

    for (const scale of variableScales.items) {
      const isWithinScale =
        Number(scale.minScore) <= Number(productivityPct) &&
        Number(scale.maxScore) >= Number(productivityPct);

      if (isWithinScale) {
        const hasFullCompliance = Number(productComplianceSummary.ratio) >= 100;

        entity.valueProductExtrategic = hasFullCompliance
          ? scale.variableAmount
          : 0;
        entity.appliesBonus = hasFullCompliance;
        bonusApplied = true;
        break;
      }
    }

    if (!bonusApplied) {
      const hasFullProductivity = Number(productivityPct) >= 100;
      const hasFullCompliance = Number(productComplianceSummary.ratio) >= 100;
      const qualifiesForBonus = hasFullProductivity && hasFullCompliance;

      entity.appliesBonus = qualifiesForBonus;
      entity.valueProductExtrategic = qualifiesForBonus
        ? variableScales.items[0].variableAmount
        : 0;
    }
  }

  private async calculateProductivityPct(
    strategicCompliancePct: number, //Utilidad Bruta
    rotationPct: number, //Rotación de Venta
    exhibitionPct: number, //Participación de la exhibición
    kpiConfig: any[],
    calculeDate: Date
  ): Promise<number> {
    let utilidadBrutaCumplimiento = 0;
    let participacionExhibicionCumplimiento = 0;
    let rotacionVentaCumplimiento = 0;
    const calculeDateStr = String(calculeDate);
    const month = parseInt(calculeDateStr.split("-")[1]);
    const season = await this.seasonRepository.findByFilters({ month }, 1, 1);
    const isHighSeason = season.items[0].isHighSeason;
    for (const kpi of kpiConfig) {
      const name = kpi.kpiConfig_kpi_name.trim();
      const kpiConfigWeight: number = kpi.kpiConfig_weight;
      const kpiConfigMeta: number = kpi.kpiConfig_meta;
      switch (name) {
        case "Utilidad Bruta":
          utilidadBrutaCumplimiento =
            Number(strategicCompliancePct) >= Number(kpiConfigMeta)
              ? kpiConfigWeight
              : (kpiConfigWeight / 100) * Number(strategicCompliancePct);
          break;
        case "Participación de la exhibición":
          participacionExhibicionCumplimiento =
            Number(exhibitionPct) >= Number(kpiConfigMeta)
              ? kpiConfigWeight
              : kpiConfigWeight *
              (Number(exhibitionPct) / Number(kpiConfigMeta));
          break;
        case "Rotación de Venta":
          const idCommissionConfiguration = kpi.commissionConfiguration_id;
          const salesRotationConfiguration = await this.salesRotationConfigurationsRepository.findByMonthAndCommissionConfigurationId(month, idCommissionConfiguration);
          const meta = salesRotationConfiguration?.goal ?? 0;
          rotacionVentaCumplimiento =
            Number(rotationPct) >= Number(meta)
              ? salesRotationConfiguration?.weight ?? 0
              : (salesRotationConfiguration?.weight ?? 0) * (Number(rotationPct) / Number(meta));
          break;
        default:
          continue; // KPI desconocido
      }
    }
    return (
      Number(utilidadBrutaCumplimiento) +
      Number(participacionExhibicionCumplimiento) +
      Number(rotacionVentaCumplimiento)
    );
  }

  /**
   * Calcula el cálculo consolidado de comisiones de producto estratégico
   * @param employee - Empleado asociado al cálculo
   * @param calculationProductExtrategic - Entidad de cálculo de producto estratégico
   */
  async calculateConsolidatedCommissionCalculation(
    employee: Employee,
    calculationProductExtrategic: CalculationProductExtrategic
  ): Promise<ConsolidatedCommissionCalculation | string> {
    try {
      const productsCompliance =
        await this.productComplianceRepository.findByEmployeeAndMonth(
          employee.id,
          calculationProductExtrategic.calculateDate
        );

      const totalCommissionProductLine = productsCompliance.reduce(
        (sum, product) => sum + Number(product.variableAmount),
        0
      );
      const commissionParameters = await this.commissionParametersRepository.findByCommissionConfigurationName(employee.companyPosition.name);
      if (commissionParameters) {
        for (const commissionParameter of commissionParameters) {
          if (commissionParameter.category.name === 'VARIABLE' && 
            (employee.employeeType === undefined || employee.employeeType?.trim().toUpperCase() === 'FIJO')) {
            this.applyCommission(commissionParameter, employee, calculationProductExtrategic, 3);
          }

          if (commissionParameter.category.name === 'TEMPORAL' && employee.employeeType?.trim().toUpperCase() === 'TEMPORAL') {
            this.applyCommission(commissionParameter, employee, calculationProductExtrategic, 24);
          }
        }
      }
      const consolidatedCommissionCalculation = {
        company: employee.company,
        companyPosition: employee.companyPosition,
        employee,
        totalCommissionProductLine,
        totalCommissionProductEstategic:
          calculationProductExtrategic.valueProductExtrategic,
        totalHoursExtra: 0,
        totalNomina:
          Number(totalCommissionProductLine) +
          Number(calculationProductExtrategic.valueProductExtrategic),
        pctNomina:
          (Number(totalCommissionProductLine) /
            Number(employee.variableSalary)) *
          100,
        observation: "",
        calculateDate: calculationProductExtrategic.calculateDate,
      } as ConsolidatedCommissionCalculation;
      const savedConsolidatedCommissionCalculation = await this.consolidatedCommissionCalculationRepository.create(
        consolidatedCommissionCalculation
      );
      return savedConsolidatedCommissionCalculation;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al calcular el cálculo consolidado de comisiones de producto estratégico";
      return errorMessage;
    }
  }
  
  async applyCommission(
  commissionParameter: CommissionParameter,
  employee: Employee,
  calculationProductExtrategic: any,
  defaultMonthsCondition: number
  ) {
  const nextMonth = getLastDayOfMonth(calculationProductExtrategic.calculateDate.toString());
  if (
    employee.dateInitialContract &&
    nextMonth >= new Date(employee.dateInitialContract) &&
    nextMonth <= new Date(
      new Date(employee.dateInitialContract).getFullYear(),
      new Date(employee.dateInitialContract).getMonth() + (commissionParameter.monthsCondition || defaultMonthsCondition),
      0
    )
  ) {
    const calcDate = new Date(new Date(nextMonth).getFullYear(), new Date(nextMonth).getMonth() + 1, 0);
    const initialContractDate = new Date(employee.dateInitialContract);

    const isFirstMonthOfEmployment =
      initialContractDate.getFullYear() === calcDate.getFullYear() &&
      initialContractDate.getMonth() === calcDate.getMonth();

    if (isFirstMonthOfEmployment) {
      const totalDaysInMonth = new Date(calcDate.getFullYear(), calcDate.getMonth() + 1, 0).getDate();
      const startDayOfMonth = initialContractDate.getDate();
      const daysWorked = totalDaysInMonth - startDayOfMonth + 1;
      const proportionalValue = (Number(commissionParameter.value) / totalDaysInMonth) * daysWorked;
      calculationProductExtrategic.valueProductExtrategic = proportionalValue;
    } else {
      calculationProductExtrategic.valueProductExtrategic = Number(commissionParameter.value);
    }
  }
}

  async getCalculationProductExtrategic(
    search: string,
    calculateDate: Date,
    page: number,
    limit: number
  ): Promise<CalculationProductExtrategicPaginationResponseDto> {
    const dataAll =
      await this.calculationProductExtrategicRepository.findByMountAndSearch(
        calculateDate,
        search,
        page,
        limit
      );
    const data = dataAll.data.map((item) => {
      const employee = plainToInstance(EmployeeResponseDto, item.employee);
      const calculationProductExtrategic = plainToInstance(
        CalculationProductExtrategicResponseDto,
        item
      );
      return {
        ...calculationProductExtrategic,
        employee,
      };
    });
    return { data, total: dataAll.total };
  }

  async getBonusSummaryByMonthYear(
    month: number,
    year: number,
    companyId?: number,
    regional?: string
  ) {
    return this.calculationProductExtrategicRepository.getBonusSummaryByMonthYear(
      month,
      year,
      companyId,
      regional
    );
  }

  async deleteByDateRangeService(startDate: Date, endDate: Date) {
    await this.calculationProductExtrategicRepository.deleteCPEByDateRange(
      startDate,
      endDate
    );
    await this.consolidatedCommissionCalculationRepository.deleteCCByDateRange(
      startDate,
      endDate
    );
  }

  async getSummaryByMonthCompanyRegion(
    month?: number,
    year?: number,
    companyId?: number,
    regional?: string
  ) {
    return this.consolidatedCommissionCalculationRepository.summaryByMonthCompanyRegion(
      month,
      year,
      companyId,
      regional
    );
  }
}
