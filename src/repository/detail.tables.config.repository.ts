import { DataSource } from "typeorm";
import { DetailTablesConfigSearchParamsDto } from "../dtos/detail.tables.config.dto";
import { DetailTablesConfig } from "../models/detail.tables.config.model";
import { BaseRepository } from "./base.respository";

export class DetailTablesConfigRepository extends BaseRepository<DetailTablesConfig> {
  constructor(dataSource: DataSource) {
    super(DetailTablesConfig, dataSource);
  }

  async findByFilters(
    searchDto: DetailTablesConfigSearchParamsDto,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: DetailTablesConfig[]; total: number }> {
    const { id, companyId, name } = searchDto;
    const query = this.repository
      .createQueryBuilder("detail_tables_config")
      .leftJoinAndSelect("detail_tables_config.company", "company");

    const hasFilters = [id, companyId, name].some(
      (param) => param !== undefined
    );

    if (hasFilters) {
      if (id !== undefined) {
        query.andWhere("detail_tables_config.id = :id", { id });
      }

      if (name !== undefined) {
        query.andWhere("LOWER(detail_tables_config.name) LIKE LOWER(:name)", {
          name: `%${name}%`,
        });
      }

      if (companyId !== undefined) {
        query.andWhere("company.id = :companyId", { companyId });
      }
    } else {
      query.orderBy("detail_tables_config.createdAt", "DESC").take(10);
    }

    // Apply pagination in all cases
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    // Always apply ordering for consistent results
    if (hasFilters) {
      query.orderBy("detail_tables_config.createdAt", "DESC");
    }

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }
}
