import { DataSource as TypeORMDataSource } from "typeorm";
import { CommissionRuleSearchDto } from "../dtos/commission.rules.dto";
import { CommissionRule } from "../models/commission.rules.model";
import { BaseRepository } from "./base.respository";

export class CommissionRulesRepository extends BaseRepository<CommissionRule> {
  constructor(dataSource: TypeORMDataSource) {
    super(CommissionRule, dataSource);
  }

  async findByCommissionConfigurationId(commissionConfigurationId: number): Promise<CommissionRule | null> {
    return this.repository.findOne({ where: { commissionConfiguration: { id: commissionConfigurationId } } });
  }

  async findByCommissionConfigurationName(commissionConfigurationName: string): Promise<CommissionRule[] | null> {
    return this.repository.find({ where: { commissionConfiguration: { name: commissionConfigurationName } } });
  }

  async findByFilters(
    searchDto: CommissionRuleSearchDto,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: CommissionRule[]; total: number }> {
    const {
      commissionConfigurationId,
      minComplace,
      maxComplace,
      commissionPercentage,
      boneExtra,
      parameterLinesId
    } = searchDto;
    const query = this.repository
      .createQueryBuilder("commissionRule")
      .leftJoinAndSelect(
        "commissionRule.commissionConfiguration",
        "commissionConfiguration"
      )
      .leftJoinAndSelect("commissionRule.parameterLine", "parameterLine")
      .addOrderBy("parameterLine.id", "ASC")
      .addOrderBy("commissionRule.minComplace", "ASC")
    const hasFilters = [
      commissionConfigurationId,
      minComplace,
      maxComplace,
      commissionPercentage,
      boneExtra,
      parameterLinesId
    ].some((param) => param !== undefined);

    if (hasFilters) {
      if (commissionConfigurationId !== undefined) {
        query.andWhere(
          "commissionRule.commissionConfiguration.id = :commissionConfigurationId",
          { commissionConfigurationId }
        );
      }

      if (minComplace !== undefined) {
        query.andWhere("commissionRule.minComplace = :minComplace", {
          minComplace,
        });
      }

      if (maxComplace !== undefined) {
        query.andWhere("commissionRule.maxComplace = :maxComplace", {
          maxComplace,
        });
      }

      if (commissionPercentage !== undefined) {
        query.andWhere(
          "commissionRule.commissionPercentage = :commissionPercentage",
          { commissionPercentage }
        );
      }

      if (boneExtra !== undefined) {
        query.andWhere("commissionRule.boneExtra = :boneExtra", { boneExtra });
      }

      if (parameterLinesId !== undefined) {
        query.andWhere("parameterLine.id = :parameterLinesId", { parameterLinesId });
      }

      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }
    else {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }
}
