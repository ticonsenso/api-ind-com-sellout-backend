import {DataSource as TypeORMDataSource} from "typeorm";
import {CommissionParameterSearchDto} from "../dtos/commission.parameters.dto";
import {CommissionParameter} from "../models/commission.parameters.model";
import {BaseRepository} from "./base.respository";

export class CommissionParametersRepository extends BaseRepository<CommissionParameter> {
  constructor(dataSource: TypeORMDataSource) {
    super(CommissionParameter, dataSource);
  }

  async findByFilters(
    searchDto: CommissionParameterSearchDto,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: CommissionParameter[]; total: number }> {
    const {
      commissionConfigurationId,
      categoryId,
      value,
      description,
      status,
    } = searchDto;
    const query = this.repository
      .createQueryBuilder("commissionParameter")
      .leftJoinAndSelect(
        "commissionParameter.commissionConfiguration",
        "commissionConfiguration"
      )
      .leftJoinAndSelect("commissionParameter.category", "category");

    const hasFilters = [
      commissionConfigurationId,
      categoryId,
      value,
      description,
      status,
    ].some((param) => param !== undefined);

    if (hasFilters) {
      if (commissionConfigurationId !== undefined) {
        query.andWhere(
          "commissionParameter.commissionConfiguration.id = :commissionConfigurationId",
          { commissionConfigurationId }
        );
      }

      if (categoryId !== undefined) {
        query.andWhere("commissionParameter.category.id = :categoryId", {
          categoryId,
        });
      }

      if (value !== undefined) {
        query.andWhere("LOWER(commissionParameter.value) LIKE LOWER(:value)", {
          value: `%${value}%`,
        });
      }

      if (description !== undefined) {
        query.andWhere(
          "LOWER(commissionParameter.description) LIKE LOWER(:description)",
          {
            description: `%${description}%`,
          }
        );
      }

      if (status !== undefined) {
        query.andWhere("commissionParameter.status = :status", { status });
      }
    } else {
      query.orderBy("commissionParameter.createdAt", "DESC").take(10);
    }

    if (hasFilters) {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }

  async findByCommissionConfigurationName(configName: string): Promise<CommissionParameter[] | null> {
    return this.repository
      .createQueryBuilder("commissionParameter")
      .leftJoinAndSelect(
        "commissionParameter.commissionConfiguration",
        "commissionConfiguration"
      )
      .leftJoinAndSelect(
        "commissionParameter.category",
        "category"
      )
      .where("commissionConfiguration.name = :configName", { configName })
      .getMany();
  }
}
