import {DataSource as TypeORMDataSource} from "typeorm";
import {CompanyPositionSearchDto} from "../dtos/company.positions.dto";
import {CompanyPosition} from "../models/company.positions.model";
import {BaseRepository} from "./base.respository";

export class CompanyPositionsRepository extends BaseRepository<CompanyPosition> {
  constructor(dataSource: TypeORMDataSource) {
    super(CompanyPosition, dataSource);
  }

  async findByName(name: string): Promise<CompanyPosition | null> {
    return this.repository
      .createQueryBuilder("companyPosition")
      .where("LOWER(companyPosition.name) = LOWER(:name)", { name })
      .getOne();
  }
  async findByNameAndCompanyId(
    name: string,
    companyId: number
  ): Promise<CompanyPosition | null> {
    return this.repository
      .createQueryBuilder("companyPosition")
      .where("LOWER(companyPosition.name) = LOWER(:name)", { name })
      .andWhere("companyPosition.company_id = :companyId", { companyId })
      .getOne();
  }

  async findByFilters(
    searchDto: CompanyPositionSearchDto,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: CompanyPosition[]; total: number }> {
    const { companyId, name, description } = searchDto;
    const query = this.repository.createQueryBuilder("company_position");
    const hasFilters = [companyId, name, description].some(
      (param) => param !== undefined
    );

    if (hasFilters) {
      if (companyId !== undefined) {
        query.andWhere("company_position.company_id = :companyId", {
          companyId,
        });
      }

      if (name !== undefined) {
        query.andWhere("LOWER(company_position.name) LIKE LOWER(:name)", {
          name: `%${name}%`,
        });
      }

      if (description !== undefined) {
        query.andWhere(
          "LOWER(company_position.description) LIKE LOWER(:description)",
          {
            description: `%${description}%`,
          }
        );
      }
    } else {
      query.orderBy("company_position.createdAt", "DESC").take(10);
    }

    if (hasFilters) {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }
}
