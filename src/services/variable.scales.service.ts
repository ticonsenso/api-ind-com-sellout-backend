import {plainToInstance} from "class-transformer";
import {DataSource} from "typeorm";
import {CommissionConfigurationResponseDto} from "../dtos/commission.configurations.dto";
import {CompanyPositionResponseDto} from "../dtos/company.positions.dto";
import {
    CreateVariableScaleDto,
    UpdateVariableScaleDto,
    VariableScaleResponseDto,
    VariableScaleResponseSearchDto,
    VariableScaleSearchDto,
} from "../dtos/variable.scales.dto";
import {VariableScale} from "../models/variable.scales.model";
import {CommissionConfigurationsRepository} from "../repository/commission.configurations.repository";
import {CompaniesRepository} from "../repository/companies.repository";
import {CompanyPositionsRepository} from "../repository/company.positions.repository";
import {VariableScalesRepository} from "../repository/variable.scales.repository";

export class VariableScalesService {
  private variableScalesRepository: VariableScalesRepository;
  private companyPositionsRepository: CompanyPositionsRepository;
  private commissionConfigurationsRepository: CommissionConfigurationsRepository;
  private companiesRepository: CompaniesRepository;

  constructor(dataSource: DataSource) {
    this.variableScalesRepository = new VariableScalesRepository(dataSource);
    this.companyPositionsRepository = new CompanyPositionsRepository(
      dataSource
    );
    this.commissionConfigurationsRepository =
      new CommissionConfigurationsRepository(dataSource);
    this.companiesRepository = new CompaniesRepository(dataSource);
  }

  async createVariableScale(
    variableScale: CreateVariableScaleDto
  ): Promise<VariableScaleResponseDto> {
    const companyPosition = await this.companyPositionsRepository.findById(
      variableScale.companyPositionId
    );
    if (!companyPosition) {
      throw new Error("El cargo no existe");
    }
    const commissionConfiguration =
      await this.commissionConfigurationsRepository.findById(
        variableScale.commissionConfigurationId
      );
    if (!commissionConfiguration) {
      throw new Error("La versión no existe");
    }

    const company = await this.companiesRepository.findById(
      variableScale.companyId
    );
    if (!company) {
      throw new Error("La empresa no existe");
    }
    const variableScaleEntity = plainToInstance(VariableScale, variableScale);
    variableScaleEntity.company = company;
    variableScaleEntity.companyPosition = companyPosition;
    variableScaleEntity.commissionConfiguration = commissionConfiguration;
    const createdVariableScale =
      await this.variableScalesRepository.create(variableScaleEntity);
    return plainToInstance(VariableScaleResponseDto, createdVariableScale, {
      excludeExtraneousValues: true,
    });
  }

  async updateVariableScale(
    id: number,
    variableScale: UpdateVariableScaleDto
  ): Promise<VariableScaleResponseDto> {
    const variableScaleEntity =
      await this.variableScalesRepository.findById(id);
    if (!variableScaleEntity) {
      throw new Error("La escala no existe");
    }

    // Actualizar relaciones solo si se proporcionan los IDs correspondientes
    if (variableScale.companyPositionId) {
      const companyPosition = await this.companyPositionsRepository.findById(
        variableScale.companyPositionId
      );
      if (!companyPosition) {
        throw new Error("El cargo no existe");
      }
      variableScaleEntity.companyPosition = companyPosition;
    }

    if (variableScale.commissionConfigurationId) {
      const commissionConfiguration =
        await this.commissionConfigurationsRepository.findById(
          variableScale.commissionConfigurationId
        );
      if (!commissionConfiguration) {
        throw new Error("La versión no existe");
      }
      variableScaleEntity.commissionConfiguration = commissionConfiguration;
    }

    if (variableScale.companyId) {
      const company = await this.companiesRepository.findById(
        variableScale.companyId
      );
      if (!company) {
        throw new Error("La empresa no existe");
      }
      variableScaleEntity.company = company;
    }

    // Actualizar propiedades numéricas utilizando el operador de coalescencia nula
    Object.assign(variableScaleEntity, {
      minScore: variableScale.minScore ?? variableScaleEntity.minScore,
      maxScore: variableScale.maxScore ?? variableScaleEntity.maxScore,
      variableAmount:
        variableScale.variableAmount ?? variableScaleEntity.variableAmount,
    });

    const updatedVariableScale = await this.variableScalesRepository.update(
      id,
      variableScaleEntity
    );

    return plainToInstance(VariableScaleResponseDto, updatedVariableScale, {
      excludeExtraneousValues: true,
    });
  }

  async deleteVariableScale(id: number): Promise<void> {
    const variableScaleEntity =
      await this.variableScalesRepository.findById(id);
    if (!variableScaleEntity) {
      throw new Error("La escala no existe");
    }
    await this.variableScalesRepository.delete(id);
  }

  async searchVariableScalePaginated(
    searchDto: VariableScaleSearchDto,
    page: number = 1,
    limit: number = 10
  ): Promise<VariableScaleResponseSearchDto> {
    const variableScales = await this.variableScalesRepository.findByFilters(
      searchDto,
      page,
      limit
    );
    const variableScalesResponse = variableScales.items.map((variableScale) => {
      const companyPosition = plainToInstance(
        CompanyPositionResponseDto,
        variableScale.companyPosition,
        {
          excludeExtraneousValues: true,
        }
      );
      const commissionConfiguration = plainToInstance(
        CommissionConfigurationResponseDto,
        variableScale.commissionConfiguration,
        {
          excludeExtraneousValues: true,
        }
      );
      const variableScaleResponse = plainToInstance(
        VariableScaleResponseDto,
        variableScale,
        {
          excludeExtraneousValues: true,
        }
      );
      return {
        ...variableScaleResponse,
        companyPosition,
        commissionConfiguration,
      };
    });
    return plainToInstance(
      VariableScaleResponseSearchDto,
      {
        items: variableScalesResponse,
        total: variableScales.total,
      },
      {
        excludeExtraneousValues: true,
      }
    );
  }
}
