import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import {
  CommissionConfigurationResponseDto,
  CommissionConfigurationResponseSearchDto,
  CommissionConfigurationSearchDto,
  CreateCommissionConfigurationDto,
  UpdateCommissionConfigurationDto,
} from '../dtos/commission.configurations.dto';
import { CompanyPositionResponseDto } from '../dtos/company.positions.dto';
import { CommissionConfiguration } from '../models/commission.configurations.model';
import { CommissionConfigurationsRepository } from '../repository/commission.configurations.repository';
import { CompaniesRepository } from '../repository/companies.repository';
import { CompanyPositionsRepository } from '../repository/company.positions.repository';

export class CommissionConfigurationsService {
  private commissionConfigurationRepository: CommissionConfigurationsRepository;
  private companiesRepository: CompaniesRepository;
  private companyPositionsRepository: CompanyPositionsRepository;

  constructor(dataSource: DataSource) {
    this.commissionConfigurationRepository = new CommissionConfigurationsRepository(dataSource);
    this.companiesRepository = new CompaniesRepository(dataSource);
    this.companyPositionsRepository = new CompanyPositionsRepository(dataSource);
  }

  async createCommissionConfiguration(
    commissionConfiguration: CreateCommissionConfigurationDto,
  ): Promise<CommissionConfigurationResponseDto> {
    const [company, existingConfiguration, companyPosition] = await Promise.all([
      this.companiesRepository.findById(commissionConfiguration.companyId),
      this.commissionConfigurationRepository.findByName(commissionConfiguration.name),
      this.companyPositionsRepository.findById(commissionConfiguration.companyPositionId),
    ]);
    if (!company) {
      throw new Error('Empresa no encontrada.');
    }
    // if (existingConfiguration) {
    //   throw new Error('La configuración de comisión ya existe.');
    // }
    if (!companyPosition) {
      throw new Error('Cargo no encontrado.');
    }
    const commissionConfigurationEntity = plainToInstance(
      CommissionConfiguration,
      {
        ...commissionConfiguration,
        company,
        companyPosition,
      },
      {
        excludePrefixes: ['companyId', 'companyPositionId'],
      },
    );
    const savedCommissionConfiguration =
      await this.commissionConfigurationRepository.create(commissionConfigurationEntity);
    const commissionConfigurationResponse = plainToInstance(
      CommissionConfigurationResponseDto,
      savedCommissionConfiguration,
      {
        excludeExtraneousValues: true,
      },
    );
    return commissionConfigurationResponse;
  }

  async updateCommissionConfiguration(
    id: number,
    commissionConfiguration: UpdateCommissionConfigurationDto,
  ): Promise<CommissionConfigurationResponseDto> {
    const commissionConfigurationEntity = await this.commissionConfigurationRepository.findById(id);
    if (!commissionConfigurationEntity) {
      throw new Error('Configuración de comisión no encontrada.');
    }
    const company = await this.companiesRepository.findById(Number(commissionConfiguration.companyId));
    if (!company) {
      throw new Error('Empresa no encontrada.');
    }
    const commissionConfigurationSearchReapeat = await this.commissionConfigurationRepository.findByName(
      commissionConfiguration.name,
    );
    // if (commissionConfigurationSearchReapeat) {
    //   throw new Error('La configuración de comisión con el nombre ya existe.');
    // }
    const companyPosition = await this.companyPositionsRepository.findById(
      Number(commissionConfiguration.companyPositionId),
    );
    if (!companyPosition) {
      throw new Error('Cargo no encontrado.');
    }
    const commissionConfigurationSave = new CommissionConfiguration();
    commissionConfigurationSave.company = company ?? commissionConfigurationEntity.company;
    commissionConfigurationSave.companyPosition = companyPosition ?? commissionConfigurationEntity.companyPosition;
    commissionConfigurationSave.name = commissionConfiguration.name ?? commissionConfigurationEntity.name;
    commissionConfigurationSave.description =
      commissionConfiguration.description ?? commissionConfigurationEntity.description;
    commissionConfigurationSave.status = commissionConfiguration.status ?? commissionConfigurationEntity.status;
    commissionConfigurationSave.isRuleCommission =
      commissionConfiguration.isRuleCommission ?? commissionConfigurationEntity.isRuleCommission;
    const savedCommissionConfiguration = await this.commissionConfigurationRepository.update(
      id,
      commissionConfigurationSave,
    );
    return plainToInstance(CommissionConfigurationResponseDto, savedCommissionConfiguration, {
      excludeExtraneousValues: true,
    });
  }

  async deleteCommissionConfiguration(id: number): Promise<void> {
    const commissionConfigurationEntity = await this.commissionConfigurationRepository.findById(id);
    if (!commissionConfigurationEntity) {
      throw new Error('Configuración de comisión no encontrada.');
    }
    await this.commissionConfigurationRepository.delete(id);
  }

  async searchCommissionConfigurationPaginated(
    searchDto: CommissionConfigurationSearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<CommissionConfigurationResponseSearchDto> {
    const commissionConfigurations = await this.commissionConfigurationRepository.findByFilters(searchDto, page, limit);
    const commissionConfigurationsResponse = commissionConfigurations.items.map((commissionConfiguration) => {
      const companyPosition = plainToInstance(CompanyPositionResponseDto, commissionConfiguration.companyPosition, {
        excludeExtraneousValues: true,
      });
      return {
        ...plainToInstance(CommissionConfigurationResponseDto, commissionConfiguration, {
          excludeExtraneousValues: true,
        }),
        companyPosition,
      };
    });
    return plainToInstance(
      CommissionConfigurationResponseSearchDto,
      {
        items: commissionConfigurationsResponse,
        total: commissionConfigurations.total,
      },
      { excludeExtraneousValues: true },
    );
  }
}
