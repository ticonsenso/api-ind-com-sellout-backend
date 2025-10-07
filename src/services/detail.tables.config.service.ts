import { plainToInstance } from "class-transformer";
import { DataSource } from "typeorm";
import {
  CreateDetailTablesConfigDto,
  DetailTablesConfigResponseDto,
  DetailTablesConfigSearchParamsDto,
  DetailTablesConfigWithTotalResponseDto,
  UpdateDetailTablesConfigDto,
} from "../dtos/detail.tables.config.dto";
import { DetailTablesConfig } from "../models/detail.tables.config.model";

import { CompanyResponseDto } from "../dtos/companies.dto";
import { CompaniesRepository } from "../repository/companies.repository";
import { DetailTablesConfigRepository } from "../repository/detail.tables.config.repository";

export class DetailTablesConfigService {
  private detailTablesConfigRepository: DetailTablesConfigRepository;
  private companyRepository: CompaniesRepository;

  constructor(dataSource: DataSource) {
    this.detailTablesConfigRepository = new DetailTablesConfigRepository(
      dataSource
    );
    this.companyRepository = new CompaniesRepository(dataSource);
  }

  async createDetailTablesConfig(
    detailTablesConfig: CreateDetailTablesConfigDto
  ): Promise<DetailTablesConfigResponseDto> {
    const company = await this.companyRepository.findById(
      detailTablesConfig.companyId
    );
    if (!company) {
      throw new Error("La empresa no existe");
    }
    const detailTablesConfigEntity = plainToInstance(
      DetailTablesConfig,
      detailTablesConfig,
      { excludePrefixes: ["companyId"] }
    );
    detailTablesConfigEntity.company = company;
    const savedDetailTablesConfig =
      await this.detailTablesConfigRepository.create(detailTablesConfigEntity);
    return plainToInstance(
      DetailTablesConfigResponseDto,
      savedDetailTablesConfig,
      { excludeExtraneousValues: true }
    );
  }

  async updateDetailTablesConfig(
    id: number,
    detailTablesConfig: UpdateDetailTablesConfigDto
  ): Promise<DetailTablesConfigResponseDto> {
    const detailTablesConfigEntity =
      await this.detailTablesConfigRepository.findById(id);
    if (!detailTablesConfigEntity) {
      throw new Error("La configuración de tablas de detalle no existe");
    }

    if (detailTablesConfig.companyId !== undefined) {
      const company = await this.companyRepository.findById(
        detailTablesConfig.companyId
      );
      if (!company) {
        throw new Error("La empresa no existe");
      }
      detailTablesConfigEntity.company = company;
    }

    if (detailTablesConfig.name !== undefined) {
      detailTablesConfigEntity.name = detailTablesConfig.name;
    }

    if (detailTablesConfig.description !== undefined) {
      detailTablesConfigEntity.description = detailTablesConfig.description;
    }

    const updatedDetailTablesConfig =
      await this.detailTablesConfigRepository.update(
        id,
        detailTablesConfigEntity
      );
    return plainToInstance(
      DetailTablesConfigResponseDto,
      updatedDetailTablesConfig,
      { excludeExtraneousValues: true }
    );
  }

  async deleteDetailTablesConfig(id: number): Promise<void> {
    const detailTablesConfigEntity =
      await this.detailTablesConfigRepository.findById(id);
    if (!detailTablesConfigEntity) {
      throw new Error("La configuración de tablas de detalle no existe");
    }
    await this.detailTablesConfigRepository.delete(id);
  }

  async searchDetailTablesConfigPaginated(
    searchDto: DetailTablesConfigSearchParamsDto,
    page: number = 1,
    limit: number = 10
  ): Promise<DetailTablesConfigWithTotalResponseDto> {
    const detailTablesConfigs =
      await this.detailTablesConfigRepository.findByFilters(
        searchDto,
        page,
        limit
      );
    const detailTablesConfigsResponse = detailTablesConfigs.items.map(
      (detailTablesConfig) => {
        const company = plainToInstance(
          CompanyResponseDto,
          detailTablesConfig.company,
          {
            excludeExtraneousValues: true,
          }
        );
        const detailTablesConfigResponse = plainToInstance(
          DetailTablesConfigResponseDto,
          detailTablesConfig,
          {
            excludeExtraneousValues: true,
          }
        );
        detailTablesConfigResponse.company = company;
        return detailTablesConfigResponse;
      }
    );
    return plainToInstance(DetailTablesConfigWithTotalResponseDto, {
      items: detailTablesConfigsResponse,
      total: detailTablesConfigs.total,
    });
  }
}
