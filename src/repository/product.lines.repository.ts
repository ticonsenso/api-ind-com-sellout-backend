import { DataSource as TypeORMDataSource } from "typeorm";
import { ProductLineSearchDto } from "../dtos/product.lines.dto";
import { ProductLine } from "../models/product.lines.model";
import { BaseRepository } from "./base.respository";

export class ProductLinesRepository extends BaseRepository<ProductLine> {
  constructor(dataSource: TypeORMDataSource) {
    super(ProductLine, dataSource);
  }

  async findByName(name: string): Promise<ProductLine | null> {
    return this.repository.findOne({ where: { parameterLine: { name } } });
  }

  async findByCommissionConfigurationId(commissionConfigurationId: number): Promise<ProductLine | null> {
    return this.repository.findOne({ where: { commissionConfiguration: { id: commissionConfigurationId } } });
  }

  async findByFilters(
    searchDto: ProductLineSearchDto,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: ProductLine[]; total: number }> {
    const {
      commissionConfigurationId,
      parameterLineId,
      commissionWeight,
      goalRotation,
      minSaleValue,
      maxSaleValue,
    } = searchDto;
    const query = this.repository
      .createQueryBuilder("productLine")
      .leftJoinAndSelect(
        "productLine.commissionConfiguration",
        "commissionConfiguration"
      )
      .leftJoinAndSelect("productLine.parameterLine", "parameterLine");

    // Check if any filter is defined and not null/undefined
    const hasFilters = [
      commissionConfigurationId,
      parameterLineId,
      commissionWeight,
      goalRotation,
      minSaleValue,
      maxSaleValue,
    ].some((param) => param !== undefined && param !== null);

    if (hasFilters) {
      if (parameterLineId !== undefined && parameterLineId !== null) {
        query.andWhere("parameterLine.id = :parameterLineId", {
          parameterLineId,
        });
      }

      if (
        commissionConfigurationId !== undefined &&
        commissionConfigurationId !== null
      ) {
        query.andWhere(
          "commissionConfiguration.id = :commissionConfigurationId",
          { commissionConfigurationId }
        );
      }

      if (commissionWeight !== undefined && commissionWeight !== null) {
        query.andWhere("productLine.commissionWeight = :commissionWeight", {
          commissionWeight,
        });
      }

      if (goalRotation !== undefined && goalRotation !== null) {
        query.andWhere("productLine.goalRotation = :goalRotation", {
          goalRotation,
        });
      }

      if (minSaleValue !== undefined && minSaleValue !== null) {
        query.andWhere("productLine.minSaleValue = :minSaleValue", {
          minSaleValue,
        });
      }

      if (maxSaleValue !== undefined && maxSaleValue !== null) {
        query.andWhere("productLine.maxSaleValue = :maxSaleValue", {
          maxSaleValue,
        });
      }
    } else {
      query.orderBy("productLine.createdAt", "DESC").take(10);
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();
    return { items, total };
  }
}
