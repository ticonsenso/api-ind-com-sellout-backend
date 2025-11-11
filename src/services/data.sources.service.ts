import {plainToClass} from "class-transformer";
import {DataSource as TypeORMDataSource} from "typeorm";
import {
    CreateDataSourceDto,
    DataSourceResponseDto,
    DataSourceResponseSearchDto,
    SearchDataSourceDto,
    UpdateDataSourceDto,
} from "../dtos/data.sources.dto";
import {UserConsenso} from "../interfaces/user.consenso";
import {DataSource} from "../models/data.sources.model";
import {DataSourceRepository} from "../repository/data.sources.repository";
import {UserRepository} from "../repository/users.repository";

export class DataSourcesService {
  private dataSourceRepository: DataSourceRepository;
  private userRepository: UserRepository;
  constructor(dataSource: TypeORMDataSource) {
    this.dataSourceRepository = new DataSourceRepository(dataSource);
    this.userRepository = new UserRepository(dataSource);
  }

  async createDataSource(
    dataSourceDto: CreateDataSourceDto,
    userConsenso: UserConsenso
  ): Promise<DataSourceResponseDto> {
    const user = await this.userRepository.findByDni(userConsenso.cedula);
    if (!user) {
      throw new Error("Usuario no autorizado.");
    }
    const dataSourceEntity = plainToClass(DataSource, dataSourceDto);
    dataSourceEntity.createdBy = user.id;
    const savedDataSource =
      await this.dataSourceRepository.create(dataSourceEntity);
    return plainToClass(DataSourceResponseDto, savedDataSource, {
      excludeExtraneousValues: true,
    });
  }

  async updateDataSource(
    id: number,
    dataSourceDto: UpdateDataSourceDto,
    userConsenso: UserConsenso
  ): Promise<DataSourceResponseDto> {
    const dataSource = await this.dataSourceRepository.findById(id);
    if (!dataSource) {
      throw new Error("La fuente de datos con el id " + id + " no existe.");
    }
    const user = await this.userRepository.findByDni(userConsenso.cedula);
    if (!user) {
      throw new Error("Usuario no autorizado.");
    }
    Object.keys(dataSourceDto).forEach((key) => {
      const typedKey = key as keyof UpdateDataSourceDto;
      if (dataSourceDto[typedKey] !== undefined && typedKey in dataSource) {
        (dataSource as any)[typedKey] = dataSourceDto[typedKey];
      }
    });
    dataSource.updatedBy = user.id;
    const updatedDataSource = await this.dataSourceRepository.update(
      id,
      dataSource
    );
    return plainToClass(DataSourceResponseDto, updatedDataSource, {
      excludeExtraneousValues: true,
    });
  }

  async deleteDataSource(id: number): Promise<void> {
    const dataSource = await this.dataSourceRepository.findById(id);
    if (!dataSource) {
      throw new Error("La fuente de datos con el id " + id + " no existe.");
    }
    await this.dataSourceRepository.delete(id);
  }

  async searchDataSourcePaginated(
    searchDto: SearchDataSourceDto,
    page: number = 1,
    limit: number = 10
  ): Promise<DataSourceResponseSearchDto> {
    const dataSource = await this.dataSourceRepository.findByFilters(
      searchDto,
      page,
      limit
    );
    const dataSourceDto = dataSource.items.map((dataSource) =>
      plainToClass(DataSourceResponseDto, dataSource, {
        excludeExtraneousValues: true,
      })
    );
    return plainToClass(
      DataSourceResponseSearchDto,
      {
        dataSources: dataSourceDto,
        total: dataSource.total,
      },
      { excludeExtraneousValues: true }
    );
  }
}
