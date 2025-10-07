import { DataSource as TypeORMDataSource } from "typeorm";
import { SearchDataSourceColumnConfigDto } from "../dtos/data.source.column.configs.dto";
import { DataSourceColumnConfig } from "../models/data.source.column.configs.model";
import { BaseRepository } from "./base.respository";

export class DataSourceColumnConfigsRepository extends BaseRepository<DataSourceColumnConfig> {
  constructor(dataSource: TypeORMDataSource) {
    super(DataSourceColumnConfig, dataSource);
  }

  async createBatch(configs: DataSourceColumnConfig[]): Promise<DataSourceColumnConfig[]> {
    return this.repository.save(configs);
  }

  async findByFilters(
    searchDto: SearchDataSourceColumnConfigDto,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: DataSourceColumnConfig[]; total: number }> {
    const { dataSourceId, columnName, dataType, isActive } = searchDto;
    const query = this.repository.createQueryBuilder(
      "data_source_column_config"
    );
    const hasFilters = [dataSourceId, columnName, dataType, isActive].some(
      (param) => param !== undefined
    );

    if (hasFilters) {
      if (dataSourceId !== undefined) {
        query.andWhere(
          "data_source_column_config.data_source_id = :dataSourceId",
          { dataSourceId }
        );
      }

      if (columnName !== undefined) {
        query.andWhere(
          "LOWER(data_source_column_config.column_name) LIKE LOWER(:columnName)",
          { columnName: `%${columnName}%` }
        );
      }

      if (dataType !== undefined) {
        query.andWhere(
          "LOWER(data_source_column_config.data_type) LIKE LOWER(:dataType)",
          { dataType: `%${dataType}%` }
        );
      }

      if (isActive !== undefined) {
        query.andWhere("data_source_column_config.is_active = :isActive", {
          isActive,
        });
      }
    } else {
      query.orderBy("data_source_column_config.createdAt", "DESC").take(10);
    }

    if (hasFilters) {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }
}
