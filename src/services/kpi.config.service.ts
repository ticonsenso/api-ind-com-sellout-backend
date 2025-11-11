import {plainToInstance} from "class-transformer";
import {DataSource} from "typeorm";
import {
    CreateKpiConfigDto,
    KpiConfigResponseDto,
    ResponseKpiConfigDto,
    SearchKpiConfigDto,
    UpdateKpiConfigDto,
} from "../dtos/kpi.config.dto";
import {KpiConfig} from "../models/kpi.config.model";
import {CommissionConfigurationsRepository} from "../repository/commission.configurations.repository";
import {CompaniesRepository} from "../repository/companies.repository";
import {CompanyPositionsRepository} from "../repository/company.positions.repository";
import {KpiConfigRepository} from "../repository/kpi.config.repository";

export class KpiConfigService {
  private kpiConfigRepository: KpiConfigRepository;
  private companiesRepository: CompaniesRepository;
  private companyPositionsRepository: CompanyPositionsRepository;
  private commissionConfigurationsRepository: CommissionConfigurationsRepository;
  constructor(dataSource: DataSource) {
    this.kpiConfigRepository = new KpiConfigRepository(dataSource);
    this.companiesRepository = new CompaniesRepository(dataSource);
    this.companyPositionsRepository = new CompanyPositionsRepository(
      dataSource
    );
    this.commissionConfigurationsRepository =
      new CommissionConfigurationsRepository(dataSource);
  }

  async createKpiConfig(
    kpiConfig: CreateKpiConfigDto
  ): Promise<KpiConfigResponseDto> {
    const company = await this.companiesRepository.findById(
      kpiConfig.companyId
    );
    if (!company) {
      throw new Error("La empresa no existe");
    }
    const companyPosition = await this.companyPositionsRepository.findById(
      kpiConfig.companyPositionId
    );
    if (!companyPosition) {
      throw new Error("La posición no existe");
    }
    const kpiConfigEntity = plainToInstance(KpiConfig, kpiConfig, {
      excludePrefixes: ["companyId", "companyPositionId"],
    });
    const commissionConfiguration =
      await this.commissionConfigurationsRepository.findById(
        kpiConfig.commissionConfigurationId
      );
    if (!commissionConfiguration) {
      throw new Error("La versión no existe");
    }
    kpiConfigEntity.company = company;
    kpiConfigEntity.companyPosition = companyPosition;
    kpiConfigEntity.commissionConfiguration = commissionConfiguration;
    const createdKpiConfig =
      await this.kpiConfigRepository.create(kpiConfigEntity);
    const response = plainToInstance(KpiConfigResponseDto, createdKpiConfig, {
      excludeExtraneousValues: true,
    });
    response.companyId = company.id;
    response.companyPositionId = companyPosition.id;
    return response;
  }

  async updateKpiConfig(
    id: number,
    kpiConfig: UpdateKpiConfigDto
  ): Promise<KpiConfigResponseDto> {
    const kpiConfigEntity = await this.kpiConfigRepository.findById(id);
    if (!kpiConfigEntity) {
      throw new Error("El KPI no existe");
    }
    const company = await this.companiesRepository.findById(
      Number(kpiConfig.companyId)
    );
    if (!company) {
      throw new Error("La empresa no existe");
    }
    const companyPosition = await this.companyPositionsRepository.findById(
      Number(kpiConfig.companyPositionId)
    );
    if (!companyPosition) {
      throw new Error("La posición no existe");
    }
    const commissionConfiguration =
      await this.commissionConfigurationsRepository.findById(
        Number(kpiConfig.commissionConfigurationId)
      );
    if (!commissionConfiguration) {
      throw new Error("La versión no existe");
    }
    kpiConfigEntity.company = company;
    kpiConfigEntity.companyPosition = companyPosition;
    kpiConfigEntity.kpiName = kpiConfig.kpiName ?? kpiConfigEntity.kpiName;
    kpiConfigEntity.weight = kpiConfig.weight ?? kpiConfigEntity.weight;
    kpiConfigEntity.meta = kpiConfig.meta ?? kpiConfigEntity.meta;
    kpiConfigEntity.metaTb = kpiConfig.metaTb ?? kpiConfigEntity.metaTb;
    kpiConfigEntity.metaTa = kpiConfig.metaTa ?? kpiConfigEntity.metaTa;
    kpiConfigEntity.commissionConfiguration =
      commissionConfiguration ?? kpiConfigEntity.commissionConfiguration;
    const updatedKpiConfig = await this.kpiConfigRepository.update(
      id,
      kpiConfigEntity
    );
    const response = plainToInstance(KpiConfigResponseDto, updatedKpiConfig, {
      excludeExtraneousValues: true,
    });
    response.companyId = company.id;
    response.companyPositionId = companyPosition.id;
    return response;
  }

  async deleteKpiConfig(id: number): Promise<void> {
    const kpiConfigEntity = await this.kpiConfigRepository.findById(id);
    if (!kpiConfigEntity) {
      throw new Error("El KPI no existe");
    }
    await this.kpiConfigRepository.delete(id);
  }

  async searchKpiConfigPaginated(
    searchDto: SearchKpiConfigDto,
    page: number,
    limit: number
  ): Promise<ResponseKpiConfigDto> {
    const { items, total } = await this.kpiConfigRepository.findByFilters(
      searchDto,
      page,
      limit
    );

    const data = items.map((item) =>
      plainToInstance(KpiConfigResponseDto, item, {
        excludeExtraneousValues: true,
      })
    );
    data.forEach((item) => {
      item.companyId = item.companyId;
      item.companyPositionId = item.companyPositionId;
    });
    return plainToInstance(ResponseKpiConfigDto, {
      total,
      data,
    });
  }
}
