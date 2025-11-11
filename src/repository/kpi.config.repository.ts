import {DataSource} from "typeorm";
import {SearchKpiConfigDto} from "../dtos/kpi.config.dto";
import {KpiConfig} from "../models/kpi.config.model";
import {BaseRepository} from "./base.respository";

export class KpiConfigRepository extends BaseRepository<KpiConfig> {
  constructor(dataSource: DataSource) {
    super(KpiConfig, dataSource);
  }

  async getKpiConfigByCommissionConfigurationId(commissionConfigurationId: number): Promise<KpiConfig[]> {
    return this.repository.find({
      where: {
        commissionConfiguration: { id: commissionConfigurationId },
      },
    });
  }

  async findByFilters(
    searchDto: SearchKpiConfigDto,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: KpiConfig[]; total: number }> {
    const { companyId, companyPositionId, kpiName, commissionConfigurationId } =
      searchDto || {};

    try {
      const query = this.repository
        .createQueryBuilder("kpiConfig")
        .leftJoinAndSelect("kpiConfig.company", "company")
        .leftJoinAndSelect("kpiConfig.companyPosition", "companyPosition")
        .leftJoinAndSelect(
          "kpiConfig.commissionConfiguration",
          "commissionConfiguration"
        );

      // Check if any filter is provided
      const hasFilters = [
        companyId,
        companyPositionId,
        kpiName,
        commissionConfigurationId,
      ].some((param) => param !== undefined);

      if (hasFilters) {
        if (companyId !== undefined) {
          query.andWhere("company.id = :companyId", { companyId });
        }

        if (companyPositionId !== undefined) {
          query.andWhere("companyPosition.id = :companyPositionId", {
            companyPositionId,
          });
        }

        if (kpiName !== undefined && kpiName.trim() !== "") {
          query.andWhere("LOWER(kpiConfig.kpiName) LIKE LOWER(:kpiName)", {
            kpiName: `%${kpiName}%`,
          });
        }

        if (commissionConfigurationId !== undefined) {
          query.andWhere(
            "commissionConfiguration.id = :commissionConfigurationId",
            { commissionConfigurationId }
          );
        }
      } else {
        query.orderBy("kpiConfig.id", "DESC").take(10);
      }

      if (page && limit) {
        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);
      }

      const [items, total] = await query.getManyAndCount();

      return { items, total };
    } catch (error) {
      console.error("Error in findByFilters:", error);
      throw error;
    }
  }

  async findByPositionAndVersion(companyPositionId: number): Promise<
    {
      kpiName: string;
      weight: number;
      meta: number;
      metaTb: number;
      metaTa: number;
      commissionConfigurationId: number;
      commissionConfiguration: string;
      createdAt: Date;
    }[]
  > {
    try {
      const query = this.repository
        .createQueryBuilder("kpiConfig")
        .select([
          "kpiConfig.kpiName",
          "kpiConfig.weight",
          "kpiConfig.meta",
          "kpiConfig.metaTb",
          "kpiConfig.metaTa",
          "commissionConfiguration.id",
          "commissionConfiguration.name",
          "commissionConfiguration.createdAt",
        ])
        .innerJoin("kpiConfig.commissionConfiguration", "commissionConfiguration")
        .where("kpiConfig.companyPosition.id = :companyPositionId", {
          companyPositionId,
        })
        .take(3);

      return await query.getRawMany();
    } catch (error) {
      console.error("Error in findByPositionAndVersion:", error);
      throw error;
    }
  }
}
