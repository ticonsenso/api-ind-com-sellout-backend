import {plainToInstance} from "class-transformer";
import {DataSource} from "typeorm";
import {CommissionConfigurationDataDto} from "../dtos/commission.configurations.dto";
import {EmployeeResponseDto} from "../dtos/employees.dto";
import {ParameterLineResponseDto} from "../dtos/parameter.lines.dto";
import {
    CreateProductComplianceDto,
    ProductComplianceResponseDto,
    ProductComplianceResponseDtoPaginated,
    UpdateProductComplianceDto,
} from "../dtos/product.compliance.dto";
import {ProductCompliance} from "../models/product.compliance.model";
import {CalculationProductExtrategicRepository} from "../repository/calculation.product.extrategic.repository";
import {CommissionConfigurationsRepository} from "../repository/commission.configurations.repository";
import {
    ConsolidatedCommissionCalculationRepository
} from "../repository/consolidated.commission.calculation.repository";
import {EmployeesRepository} from "../repository/employees.repository";
import {ParameterLinesRepository} from "../repository/parameter.lines.repository";
import {ProductComplianceRepository} from "../repository/product.compliance.repository";

export class ProductComplianceService {
  private productComplianceRepository: ProductComplianceRepository;
  private employeeRepository: EmployeesRepository;
  private calculationProductExtrategicRepository: CalculationProductExtrategicRepository;
  private consolidatedCommissionCalculationRepository: ConsolidatedCommissionCalculationRepository;
  private parameterLinesRepository: ParameterLinesRepository;
  private commissionConfigurationsRepository: CommissionConfigurationsRepository;
  constructor(dataSource: DataSource) {
    this.productComplianceRepository = new ProductComplianceRepository(
      dataSource
    );
    this.employeeRepository = new EmployeesRepository(dataSource);
    this.parameterLinesRepository = new ParameterLinesRepository(dataSource);
    this.commissionConfigurationsRepository =
      new CommissionConfigurationsRepository(dataSource);
    this.calculationProductExtrategicRepository =
      new CalculationProductExtrategicRepository(dataSource);
    this.consolidatedCommissionCalculationRepository =
      new ConsolidatedCommissionCalculationRepository(dataSource);
  }

  async createProductCompliance(
    productsCompliance: CreateProductComplianceDto[],
    calculateDate: Date
  ): Promise<{ count: number; errorCount: number; smsErrors: string[] }> {
    let count = 0;
    let errorCount = 0;
    let smsErrors: string[] = [];
    let listProductCompliance = [];
    for (const productCompliance of productsCompliance) {
      try {
        const productComplianceEntity = new ProductCompliance();
        const employee = await this.employeeRepository.findByCode(
          productCompliance.employeeCode, String(calculateDate)
        );
        if (!employee) {
          smsErrors.push(
            "Empleado no encontrado en la nómina. " +
            productCompliance.employeeCode
          );
          errorCount++;
          continue;
        }
        if (!employee.companyPosition) {
          smsErrors.push(
            "Cargo no encontrado en la nómina. " +
            productCompliance.employeeCode
          );
          errorCount++;
          continue;
        }
        const commissionConfigurations: CommissionConfigurationDataDto =
          await this.commissionConfigurationsRepository.findByProductLineAndPosition(
            productCompliance.parameterLine,
            employee?.companyPosition?.name || ""
          );
        if (!commissionConfigurations) {
          smsErrors.push(
            "Configuraciones de comisión no encontradas. " +
            productCompliance.employeeCode
          );
          errorCount++;
          continue;
        }
        const {
          commissionweight = 0,
          minsalevalue = 0,
          maxsalevalue = 100
        } = commissionConfigurations ?? {};
        productComplianceEntity.employee = employee!;
        productComplianceEntity.saleValue = productCompliance.saleValue;
        productComplianceEntity.budgetValue = productCompliance.budgetValue;
        const caculatePercentage: number =
          Number(productCompliance.budgetValue) === 0
            ? Number(productCompliance.saleValue) === 0
              ? 0
              : 100
            : (Number(productCompliance.saleValue) /
              Number(productCompliance.budgetValue)) *
            100;
        productComplianceEntity.compliancePercentage = caculatePercentage;
        productComplianceEntity.compliancePercentageMax =
          caculatePercentage < minsalevalue
            ? 0
            : caculatePercentage > maxsalevalue
              ? maxsalevalue
              : caculatePercentage;
        productComplianceEntity.weight = commissionweight;
        productComplianceEntity.valueBaseVariable =
          (commissionweight / 100) * employee?.variableSalary!;
        if (productComplianceEntity.compliancePercentageMax > 0) {
          productComplianceEntity.variableAmount =
            productComplianceEntity.compliancePercentageMax *
            (productComplianceEntity.valueBaseVariable / 100);
        } else {
          productComplianceEntity.variableAmount = 0;
        }
        productComplianceEntity.calculateDate = productCompliance.calculateDate;
        productComplianceEntity.company = employee!.company!;
        const parameterLine = await this.parameterLinesRepository.findByName(
          productCompliance.parameterLine
        );
        productComplianceEntity.parameterLine = parameterLine!;
        listProductCompliance.push(await this.productComplianceRepository.create(productComplianceEntity));
        count++;
      } catch (error) {
        console.log(error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al crear el producto de cumplimiento";
        smsErrors.push(errorMessage + " " + productCompliance.employeeCode);
        errorCount++;
        continue;
      } 
    }
    this.validateProductCompliance(listProductCompliance);
    return { count, errorCount, smsErrors };
  }

  async validateProductCompliance(productComplianceRegister: ProductCompliance[]){   
    const groups = new Map<number, ProductCompliance[]>();
    for (const pc of productComplianceRegister) {
      const key = pc.employee?.id ?? 0;
      if (!groups.has(key)) {
      groups.set(key, []);
      }
      groups.get(key)!.push(pc);
    }
    for (const [employeeId, compliances] of groups) {
      console.log("Empleado:", employeeId, " → items:", compliances.length);
      const findProductLinesByPosition: Array<{
        id: number;
        name: string;
        commissionweight: number;
        minsalevalue: number;
        maxsalevalue: number;
      }> = await this.commissionConfigurationsRepository.findProductLinesByPosition(compliances[0].employee?.companyPosition?.id || 0);
      if(compliances.length!=findProductLinesByPosition.length){
        const existentes = new Set(compliances.map(c => c.parameterLine?.id));
        const faltantes = findProductLinesByPosition.filter(line => !existentes.has(line.id));
        const productComplianceEntity = new ProductCompliance();
        productComplianceEntity.company = compliances[0].employee?.company!;
        productComplianceEntity.employee = compliances[0].employee;
        const parameterLine = await this.parameterLinesRepository.findByName(
          faltantes[0].name
        );
        productComplianceEntity.parameterLine = parameterLine!;
        productComplianceEntity.saleValue = 0;
        productComplianceEntity.budgetValue = 0;
        productComplianceEntity.compliancePercentage = 0;
        productComplianceEntity.compliancePercentageMax = 0;
        productComplianceEntity.weight = faltantes[0].commissionweight;
        productComplianceEntity.valueBaseVariable = (compliances[0].employee?.variableSalary! * (faltantes[0].commissionweight/100));
        productComplianceEntity.variableAmount = (compliances[0].employee?.variableSalary! * (faltantes[0].commissionweight/100));
        productComplianceEntity.calculateDate = compliances[0].calculateDate;
        await this.productComplianceRepository.create(productComplianceEntity);
      }
    }
  }

  async updateProductCompliance(
    id: number,
    productCompliance: UpdateProductComplianceDto
  ): Promise<ProductComplianceResponseDto> {
    const productComplianceEntity =
      await this.productComplianceRepository.findById(id);
    if (!productComplianceEntity) {
      throw new Error("Producto de cumplimiento no encontrado");
    }
    const commissionConfigurations: CommissionConfigurationDataDto =
      await this.commissionConfigurationsRepository.findByProductLineAndPosition(
        productCompliance.parameterLine,
        productComplianceEntity.employee?.companyPosition?.name || ""
      );
    const { commissionweight, goalrotation, minsalevalue, maxsalevalue } =
      commissionConfigurations;
    productComplianceEntity.saleValue = productCompliance.saleValue;
    productComplianceEntity.budgetValue = productCompliance.budgetValue;
    const caculatePercentage: number =
      (productCompliance.saleValue / productCompliance.budgetValue) * 100;
    productComplianceEntity.compliancePercentage = caculatePercentage;
    productComplianceEntity.compliancePercentageMax =
      caculatePercentage > maxsalevalue ? maxsalevalue : caculatePercentage;
    productComplianceEntity.weight = commissionweight;
    const caculeValueBaseVariable =
      (Number(productComplianceEntity.employee?.variableSalary) *
        Number(commissionweight)) /
      100;
    productComplianceEntity.valueBaseVariable = caculeValueBaseVariable;
    productComplianceEntity.variableAmount =
      caculatePercentage * (caculeValueBaseVariable / 100);
    const productComplianceUpdated =
      await this.productComplianceRepository.update(
        id,
        productComplianceEntity
      );
    const productComplianceResponse = plainToInstance(
      ProductComplianceResponseDto,
      productComplianceUpdated,
      {
        excludeExtraneousValues: true,
      }
    );
    const employee = plainToInstance(
      EmployeeResponseDto,
      productComplianceUpdated.employee,
      {
        excludeExtraneousValues: true,
      }
    );
    const parameterLine = plainToInstance(
      ParameterLineResponseDto,
      productComplianceUpdated.parameterLine,
      {
        excludeExtraneousValues: true,
      }
    );
    productComplianceResponse.employee = employee;
    productComplianceResponse.parameterLine = parameterLine;
    return productComplianceResponse;
  }

  async getProductComplianceByEmployeeAndMonth(
    date: Date,
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProductComplianceResponseDtoPaginated> {
    const productCompliance =
      await this.productComplianceRepository.findByMountAndSearch(
        date,
        search,
        page,
        limit
      );
    const productComplianceResponse = productCompliance.data.map((product) => {
      const productComplianceResponse = plainToInstance(
        ProductComplianceResponseDto,
        product,
        {
          excludeExtraneousValues: true,
        }
      );
      const employee = plainToInstance(EmployeeResponseDto, product.employee, {
        excludeExtraneousValues: true,
      });
      const parameterLine = plainToInstance(
        ParameterLineResponseDto,
        product.parameterLine,
        {
          excludeExtraneousValues: true,
        }
      );
      productComplianceResponse.employee = employee;
      productComplianceResponse.parameterLine = parameterLine;
      return productComplianceResponse;
    });
    return {
      data: productComplianceResponse,
      total: productCompliance.total,
    };
  }

  async getMonthlyComplianceByRegionAndCompany(
    year: number,
    regional?: string,
    companyId?: number
  ): Promise<
    {
      month: string;
      total_sale_value: number;
      total_budget_value: number;
      compliance_range: number;
    }[]
  > {
    const result =
      await this.productComplianceRepository.getMonthlyComplianceByRegionAndCompany(
        year,
        regional,
        companyId
      );

    if (!result || result.length === 0) {
      return [];
    }

    const MONTHS_ES: Record<string, string> = {
      January: "Enero",
      February: "Febrero",
      March: "Marzo",
      April: "Abril",
      May: "Mayo",
      June: "Junio",
      July: "Julio",
      August: "Agosto",
      September: "Septiembre",
      October: "Octubre",
      November: "Noviembre",
      December: "Diciembre",
    };

    return result.map((row) => {
      const trimmedMonth = row.month.trim();
      return {
        month: MONTHS_ES[trimmedMonth] || trimmedMonth,
        total_sale_value: Number(row.total_sale_value),
        total_budget_value: Number(row.total_budget_value),
        compliance_range: Number(row.compliance_range),
      };
    });
  }

  async deleteByDateRangeService(
    startDate: Date,
    endDate: Date
  ): Promise<void> {
    await this.productComplianceRepository.deletePCByDateRange(
      startDate,
      endDate
    );
    await this.calculationProductExtrategicRepository.deleteCPEByDateRange(
      startDate,
      endDate
    );
    await this.consolidatedCommissionCalculationRepository.deleteCCByDateRange(
      startDate,
      endDate
    );
  }
}
