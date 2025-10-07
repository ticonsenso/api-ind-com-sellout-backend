import { DataSource as TypeORMDataSource } from "typeorm";
import {
  CommissionConfigurationDataDto,
  CommissionConfigurationSearchDto,
} from "../dtos/commission.configurations.dto";
import { CommissionConfiguration } from "../models/commission.configurations.model";
import { BaseRepository } from "./base.respository";

export class CommissionConfigurationsRepository extends BaseRepository<CommissionConfiguration> {
  constructor(dataSource: TypeORMDataSource) {
    super(CommissionConfiguration, dataSource);
  }

  async findByCompanyAndPosition(companyId: number, companyPositionId: number): Promise<CommissionConfiguration | null> {
    return this.repository.findOne({ where: { company: { id: companyId }, companyPosition: { id: companyPositionId } } });
  }

  async findByName(name: string): Promise<CommissionConfiguration | null> {
    return this.repository.findOne({ where: { name } });
  }

  async findByCommissionConfigurationId(commissionConfigurationId: number): Promise<CommissionConfiguration | null> {
    return this.repository.findOne({ where: { id: commissionConfigurationId } });
  }

  async findByFilters(
    searchDto: CommissionConfigurationSearchDto,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: CommissionConfiguration[]; total: number }> {
    const { id, name, status, companyId, companyPositionId } = searchDto;
    const query = this.repository
      .createQueryBuilder("commission_configuration")
      .leftJoinAndSelect("commission_configuration.company", "company")
      .leftJoinAndSelect(
        "commission_configuration.companyPosition",
        "companyPosition"
      );

    const hasFilters = [id, name, status, companyId, companyPositionId].some(
      (param) => param !== undefined
    );

    if (hasFilters) {
      if (id !== undefined) {
        query.andWhere("commission_configuration.id = :id", { id });
      }

      if (name !== undefined) {
        query.andWhere(
          "LOWER(commission_configuration.name) LIKE LOWER(:name)",
          { name: `%${name}%` }
        );
      }

      if (status !== undefined) {
        query.andWhere("commission_configuration.status = :status", { status });
      }

      if (companyId !== undefined) {
        query.andWhere("company.id = :companyId", { companyId });
      }

      if (companyPositionId !== undefined) {
        query.andWhere("companyPosition.id = :companyPositionId", {
          companyPositionId,
        });
      }
    } else {
      query.orderBy("commission_configuration.createdAt", "DESC").take(10);
    }

    if (hasFilters) {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }

  async findByProductLineAndPosition(
    productLineName: string,
    positionName: string
  ): Promise<CommissionConfigurationDataDto> {
    const query = this.repository
      .createQueryBuilder("cc")
      .innerJoin("company_positions", "cp", "cp.id = cc.company_position_id")
      .innerJoin(
        "product_lines",
        "pl",
        "pl.commission_configurations_id = cc.id"
      )
      .innerJoin("parameter_lines", "prl", "prl.id = pl.parameter_line_id")
      .select([
        "pl.commission_weight as commissionWeight",
        "pl.goal_rotation as goalRotation",
        "pl.min_sale_value as minSaleValue",
        "pl.max_sale_value as maxSaleValue",
      ])
      .where("prl.name ILIKE :productLineName", {
        productLineName: `%${productLineName}%`,
      })
      .andWhere("cp.name ILIKE :positionName", {
        positionName: `%${positionName}%`,
      });

    const result = await query.getRawOne();
    return result;
  }

  async findProductLinesByPosition(companyPositionId: number): Promise<
    Array<{
      id: number;
      name: string;
      commissionweight: number;
      minsalevalue: number;
      maxsalevalue: number;
    }>
  > {
    const query = this.repository
      .createQueryBuilder("cc")
      .innerJoin("product_lines", "pl", "pl.commission_configurations_id = cc.id")
      .innerJoin("parameter_lines", "pli", "pli.id = pl.parameter_line_id")
      .select([
        "pli.id as id",
        "pli.name as name",
        "pl.commission_weight as commissionWeight",
        "pl.min_sale_value as minSaleValue",
        "pl.max_sale_value as maxSaleValue",
      ])
      .where("cc.company_position_id = :companyPositionId", { companyPositionId });

    return await query.getRawMany();
  }
}
