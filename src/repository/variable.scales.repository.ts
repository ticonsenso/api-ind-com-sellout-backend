import { DataSource } from "typeorm";
import { VariableScaleSearchDto } from "../dtos/variable.scales.dto";
import { VariableScale } from "../models/variable.scales.model";
import { BaseRepository } from "./base.respository";

export class VariableScalesRepository extends BaseRepository<VariableScale> {
  constructor(dataSource: DataSource) {
    super(VariableScale, dataSource);
  }

  async findByCommissionConfigurationId(commissionConfigurationId: number): Promise<VariableScale | null> {
    return this.repository.findOne({ where: { commissionConfiguration: { id: commissionConfigurationId } } });
  }

  async findByFilters(
    searchDto: VariableScaleSearchDto,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: VariableScale[]; total: number }> {
    const { companyId, companyPositionId, commissionConfigurationId } = searchDto;

    const whereClause: any = {};
    
    if (companyId) {
      whereClause.company = { id: companyId };
    }
    
    if (companyPositionId) {
      whereClause.companyPosition = { id: companyPositionId };
    }
    
    if (commissionConfigurationId) {
      whereClause.commissionConfiguration = { id: commissionConfigurationId };
    }

    const [items, total] = await this.repository.findAndCount({
      where: whereClause,
      relations: ['company', 'companyPosition', 'commissionConfiguration'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: "DESC",
      },
    });

    return { items, total };
  }

  async findByFiltersWithoutVersion(
    searchDto: any,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: VariableScale[]; total: number }> {
    const { companyId, companyPositionId } = searchDto;
    const query = this.repository
      .createQueryBuilder("variableScale")
      .leftJoinAndSelect("variableScale.company", "company")
      .leftJoinAndSelect("variableScale.companyPosition", "companyPosition");

    // Check if any filter is defined and not null/undefined
    const hasFilters = [companyId, companyPositionId].some(
      (param) => param !== undefined && param !== null
    );

    if (hasFilters) {
      if (companyId !== undefined && companyId !== null) {
        query.andWhere("company.id = :companyId", { companyId });
      }

      if (companyPositionId !== undefined && companyPositionId !== null) {
        query.andWhere("companyPosition.id = :companyPositionId", {
          companyPositionId,
        });
      }
    } else {
      query.orderBy("variableScale.createdAt", "DESC").take(10);
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();
    return { items, total };
  }
}
