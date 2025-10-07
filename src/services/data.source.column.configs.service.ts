import { plainToClass } from "class-transformer";
import { DataSource as TypeORMDataSource } from "typeorm";
import {
  CreateDataSourceColumnConfigDto,
  DataSourceColumnConfigResponseDto,
  ResponseDataSourceColumnConfigDto,
  SearchDataSourceColumnConfigDto,
  UpdateDataSourceColumnConfigDto,
} from "../dtos/data.source.column.configs.dto";
import { UserResponseDto } from "../dtos/users.dto";
import { DataSourceColumnConfig } from "../models/data.source.column.configs.model";
import { DataSourceColumnConfigsRepository } from "../repository/data.source.column.configs.repository";
import { DataSourceRepository } from "../repository/data.sources.repository";
import { UserRepository } from "../repository/users.repository";
export class DataSourceColumnConfigsService {
  private dataSourceColumnConfigsRepository: DataSourceColumnConfigsRepository;
  private dataSourceRepository: DataSourceRepository;
  private userRepository: UserRepository;
  constructor(dataSource: TypeORMDataSource) {
    this.dataSourceColumnConfigsRepository =
      new DataSourceColumnConfigsRepository(dataSource);
    this.dataSourceRepository = new DataSourceRepository(dataSource);
    this.userRepository = new UserRepository(dataSource);
  }

  async createDataSourceColumnConfig(
    configDto: CreateDataSourceColumnConfigDto
  ): Promise<DataSourceColumnConfigResponseDto> {
    const dataSource = await this.dataSourceRepository.findById(
      configDto.dataSourceId
    );
    if (!dataSource) {
      throw new Error(
        "La fuente de datos con el id " + configDto.dataSourceId + " no existe."
      );
    }
    const creator = await this.userRepository.findById(configDto.createdBy);
    if (!creator) {
      throw new Error(
        "El creador con el id " + configDto.createdBy + " no existe."
      );
    }
    const configEntity = plainToClass(DataSourceColumnConfig, configDto, {
      excludePrefixes: ["dataSourceId", "createdBy", "updatedBy"],
    });
    configEntity.dataSource = dataSource;
    configEntity.creator = creator;
    const savedConfig =
      await this.dataSourceColumnConfigsRepository.create(configEntity);
    return plainToClass(DataSourceColumnConfigResponseDto, savedConfig, {
      excludeExtraneousValues: true,
    });
  }


  async updateDataSourceColumnConfig(
    id: number,
    configDto: UpdateDataSourceColumnConfigDto
  ): Promise<DataSourceColumnConfigResponseDto> {
    const config = await this.dataSourceColumnConfigsRepository.findById(id);
    if (!config) {
      throw new Error(
        "La configuración de columna con el id " + id + " no existe."
      );
    }
    const updater = await this.userRepository.findById(
      Number(configDto.updatedBy)
    );
    if (!updater) {
      throw new Error(
        "El actualizador con el id " + configDto.updatedBy + " no existe."
      );
    }
    if (configDto.dataSourceId) {
      const dataSource = await this.dataSourceRepository.findById(
        configDto.dataSourceId
      );
      if (!dataSource) {
        throw new Error(
          "La fuente de datos con el id " +
          configDto.dataSourceId +
          " no existe."
        );
      }
      config.dataSource = dataSource;
    }
    config.updater = updater;
    Object.keys(configDto).forEach((key) => {
      const typedKey = key as keyof UpdateDataSourceColumnConfigDto;
      if (configDto[typedKey] !== undefined && typedKey in config) {
        (config as any)[typedKey] = configDto[typedKey];
      }
    });
    const updatedConfig = await this.dataSourceColumnConfigsRepository.update(
      id,
      config
    );
    return plainToClass(DataSourceColumnConfigResponseDto, updatedConfig, {
      excludeExtraneousValues: true,
    });
  }

  async deleteDataSourceColumnConfig(id: number): Promise<void> {
    const config = await this.dataSourceColumnConfigsRepository.findById(id);
    if (!config) {
      throw new Error(
        "La configuración de columna con el id " + id + " no existe."
      );
    }
    await this.dataSourceColumnConfigsRepository.delete(id);
  }

  async searchDataSourceColumnConfigPaginated(
    searchDto: SearchDataSourceColumnConfigDto,
    page: number = 1,
    limit: number = 10
  ): Promise<ResponseDataSourceColumnConfigDto> {
    const result = await this.dataSourceColumnConfigsRepository.findByFilters(
      searchDto,
      page,
      limit
    );
    const configDtos = result.items.map((config) => {
      const creator = plainToClass(UserResponseDto, config.creator, {
        excludeExtraneousValues: true,
      });
      const updater = plainToClass(UserResponseDto, config.updater, {
        excludeExtraneousValues: true,
      });
      return plainToClass(
        DataSourceColumnConfigResponseDto,
        {
          ...config,
          creator: creator,
          updater: updater,
        },
        {
          excludeExtraneousValues: true,
        }
      );
    });
    return plainToClass(
      ResponseDataSourceColumnConfigDto,
      {
        items: configDtos,
        total: result.total,
      },
      { excludeExtraneousValues: true }
    );
  }
}
