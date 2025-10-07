import { plainToInstance } from "class-transformer";
import { DataSource } from "typeorm";
import {

    AdvisorCommissionListResponseSearchDto,
    AdvisorCommissionResponseDto,
    CreateAdvisorCommissionDto,
} from "../dtos/advisor.commission.dto";
import { EmployeesRepository } from "../repository/employees.repository";
import { AdvisorCommissionRepository } from "../repository/advisor.commission.repository";
import { CompaniesRepository } from "../repository/companies.repository";
import { CompanyPositionsRepository } from "../repository/company.positions.repository";

import { AdvisorCommission } from "../models/advisor.commission.model";
import { StoreSizeRepository } from "../repository/store.size.repository";
export class AdvisorCommissionService {
    private advisorCommissionRepository: AdvisorCommissionRepository;
    private employeeRepository: EmployeesRepository;
    private companyRepository: CompaniesRepository;
    private companyPositionRepository: CompanyPositionsRepository;
    private storeSizeRepository: StoreSizeRepository;
    constructor(dataSource: DataSource) {
        this.advisorCommissionRepository =
            new AdvisorCommissionRepository(dataSource);
        this.employeeRepository = new EmployeesRepository(dataSource);
        this.companyRepository = new CompaniesRepository(dataSource);
        this.companyPositionRepository = new CompanyPositionsRepository(dataSource);
        this.storeSizeRepository = new StoreSizeRepository(dataSource);
    }

    async createAdvisorCommission(
        createAdvisorCommissionsDto: CreateAdvisorCommissionDto[]
    ): Promise<{ count: number; errorCount: number; smsErrors: string[] }> {
        let count = 0;
        let errorCount = 0;
        let smsErrors: string[] = [];
        for (const dto of createAdvisorCommissionsDto) {
            try {

                const companyPosition = await this.companyPositionRepository.findByName(dto.companyPositionName);
                if (!companyPosition) {
                    smsErrors.push("Cargo no encontrado. " + dto.companyPositionName);
                    errorCount++;
                    continue;
                }
                const employee = await this.employeeRepository.findByEmployeeNameCompanyAndCompanyPosition(dto.employeeName, dto.companyId, companyPosition.id);
                if (!employee) {
                    smsErrors.push("Empleado no encontrado. " + dto.employeeName);
                    errorCount++;
                    continue;
                }
                const storeSize = await this.storeSizeRepository.findStoreByName(dto.storeSizeName);
                if (!storeSize) {
                    smsErrors.push("Tamaño de tienda no encontrado. " + dto.storeSizeName);
                    errorCount++;
                    continue;
                }
                const advisorCommissionEntity = plainToInstance(AdvisorCommission, {
                    company: dto.companyId,
                    companyPosition: companyPosition,
                    employee: employee,
                    calculateDate: dto.calculateDate as any,
                    taxSale: dto.taxSale,
                    budgetSale: dto.budgetSale,
                    complianceSale: dto.complianceSale,
                    rangeApplyBonus: dto.rangeApplyBonus,
                    saleIntangible: dto.saleIntangible,
                    cashSale: dto.cashSale,
                    creditSale: dto.creditSale,
                    commissionIntangible: dto.commissionIntangible,
                    commissionCash: dto.commissionCash,
                    commissionCredit: dto.commissionCredit,
                    commissionTotal: dto.commissionTotal,
                    observation: dto.observation,
                    storeSize: storeSize,
                });
                await this.advisorCommissionRepository.create(advisorCommissionEntity);
                count++;
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Error al crear el producto estratégico";
                smsErrors.push(errorMessage + " " + dto.employeeName);
                errorCount++;
                continue;
            }
        }
        return { count, errorCount, smsErrors };
    }


    async searchAdvisorCommissionPaginated(
        filters: string = "",
        page?: number,
        limit?: number,
        calculateDate?: Date,
    ): Promise<AdvisorCommissionListResponseSearchDto> {
    
        const { items, total } =
            await this.advisorCommissionRepository.findByFilters(
                filters,
                page,
                limit,
                calculateDate,
            );

        const itemsDto = items.map((ac) =>
            plainToInstance(AdvisorCommissionResponseDto, ac, {
                excludeExtraneousValues: true,
            }),
        );

        return plainToInstance(
            AdvisorCommissionListResponseSearchDto,
            { items: itemsDto, total },
            { excludeExtraneousValues: true },
        );
    }


}