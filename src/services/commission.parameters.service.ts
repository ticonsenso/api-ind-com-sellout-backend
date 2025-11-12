import {plainToInstance} from "class-transformer";
import {DataSource} from "typeorm";
import {CommissionConfigurationResponseDto} from "../dtos/commission.configurations.dto";
import {
    CommissionParameterResponseDto,
    CommissionParameterResponseSearchDto,
    CommissionParameterSearchDto,
    CreateCommissionParameterDto,
    UpdateCommissionParameterDto,
} from "../dtos/commission.parameters.dto";
import {ParameterCategoryResponseDto} from "../dtos/parameter.categories.dto";
import {CommissionParameter} from "../models/commission.parameters.model";
import {CommissionConfigurationsRepository} from "../repository/commission.configurations.repository";
import {CommissionParametersRepository} from "../repository/commission.parameters.repository";
import {ParameterCategoriesRepository} from "../repository/parameter.categories.repository";

export class CommissionParametersService {
  private commissionParametersRepository: CommissionParametersRepository;
  private parameterCategoriesRepository: ParameterCategoriesRepository;
  private commissionConfigurationsRepository: CommissionConfigurationsRepository;
  constructor(dataSource: DataSource) {
    this.commissionParametersRepository = new CommissionParametersRepository(
      dataSource
    );
    this.parameterCategoriesRepository = new ParameterCategoriesRepository(
      dataSource
    );
    this.commissionConfigurationsRepository =
      new CommissionConfigurationsRepository(dataSource);
  }

  async createCommissionParameter(
    commissionParameter: CreateCommissionParameterDto
  ): Promise<CommissionParameterResponseDto> {
    const commissionConfiguration =
      await this.commissionConfigurationsRepository.findById(
        commissionParameter.commissionConfigurationId
      );
    if (!commissionConfiguration) {
      throw new Error("La configuración de comisión no existe.");
    }
    const parameterCategory = await this.parameterCategoriesRepository.findById(
      commissionParameter.categoryId
    );
    if (!parameterCategory) {
      throw new Error("La categoría de parámetro no existe.");
    }
    const commissionParameterEntity = plainToInstance(
      CommissionParameter,
      commissionParameter,
      {
        excludePrefixes: ["commissionConfigurationId", "categoryId"],
      }
    );
    commissionParameterEntity.commissionConfiguration = commissionConfiguration;
    commissionParameterEntity.category = parameterCategory;
    const savedCommissionParameter =
      await this.commissionParametersRepository.create(
        commissionParameterEntity
      );
    return plainToInstance(
      CommissionParameterResponseDto,
      savedCommissionParameter,
      { excludeExtraneousValues: true }
    );
  }

  async updateCommissionParameter(
    id: number,
    commissionParameter: UpdateCommissionParameterDto
  ): Promise<CommissionParameterResponseDto> {
    const commissionParameterEntity =
      await this.commissionParametersRepository.findById(id);
    if (!commissionParameterEntity) {
      throw new Error("El parámetro de comisión no existe.");
    }
    const commissionConfiguration =
      await this.commissionConfigurationsRepository.findById(
        Number(commissionParameter.commissionConfigurationId)
      );
    if (!commissionConfiguration) {
      throw new Error("La configuración de comisión no existe.");
    }
    const parameterCategory = await this.parameterCategoriesRepository.findById(
      Number(commissionParameter.categoryId)
    );
    if (!parameterCategory) {
      throw new Error("La categoría de parámetro no existe.");
    }
    commissionParameterEntity.commissionConfiguration = commissionConfiguration;
    commissionParameterEntity.category = parameterCategory;
    commissionParameterEntity.value =
      commissionParameter.value ?? commissionParameterEntity.value;
    commissionParameterEntity.description =
      commissionParameter.description ?? commissionParameterEntity.description;
    commissionParameterEntity.status =
      commissionParameter.status ?? commissionParameterEntity.status;
    commissionParameterEntity.monthsCondition =
      commissionParameter.monthsCondition ?? commissionParameterEntity.monthsCondition;
    const savedCommissionParameter =
      await this.commissionParametersRepository.update(
        id,
        commissionParameterEntity
      );
    return plainToInstance(
      CommissionParameterResponseDto,
      savedCommissionParameter,
      { excludeExtraneousValues: true }
    );
  }

  async deleteCommissionParameter(id: number): Promise<void> {
    const commissionParameterEntity =
      await this.commissionParametersRepository.findById(id);
    if (!commissionParameterEntity) {
      throw new Error("El parámetro de comisión no existe.");
    }
    await this.commissionParametersRepository.delete(id);
  }

  async searchCommissionParameterPaginated(
    searchDto: CommissionParameterSearchDto,
    page: number = 1,
    limit: number = 10
  ): Promise<CommissionParameterResponseSearchDto> {
    const commissionParameters =
      await this.commissionParametersRepository.findByFilters(
        searchDto,
        page,
        limit
      );
    const commissionParametersResponse = commissionParameters.items.map(
      (commissionParameter) => {
        const commissionParameterResponse = plainToInstance(
          CommissionParameterResponseDto,
          commissionParameter,
          {
            excludeExtraneousValues: true,
          }
        );
        const commissionConfiguration = plainToInstance(
          CommissionConfigurationResponseDto,
          commissionParameter.commissionConfiguration,
          {
            excludeExtraneousValues: true,
          }
        );
        const category = plainToInstance(
          ParameterCategoryResponseDto,
          commissionParameter.category,
          {
            excludeExtraneousValues: true,
          }
        );
        return {
          ...commissionParameterResponse,
          commissionConfiguration,
          category,
        };
      }
    );
    return plainToInstance(
      CommissionParameterResponseSearchDto,
      {
        items: commissionParametersResponse,
        total: commissionParameters.total,
      },
      { excludeExtraneousValues: true }
    );
  }
}
