import {DataSource as TypeORMDataSource, EntityManager} from 'typeorm';
import {BaseRepository} from './base.respository';
import {SalesRotationConfiguration} from '../models/sales.rotation.configurations.model';
import {SalesRotationConfigurationSearchDto} from '../dtos/sales.rotation.configurations.dto';
import {CommissionConfiguration} from '../models/commission.configurations.model';

export class SalesRotationConfigurationsRepository extends BaseRepository<SalesRotationConfiguration> {
    constructor(dataSource: TypeORMDataSource) {
        super(SalesRotationConfiguration, dataSource);
    }

    async deleteAllByCommissionConfigurationId(commissionConfigurationId: number): Promise<void> {
        await this.repository.delete({ commissionConfiguration: { id: commissionConfigurationId } });
    }

    async findByCommissionConfigurationId(commissionConfigurationId: number): Promise<SalesRotationConfiguration | null> {
        return this.repository.findOne({ where: { commissionConfiguration: { id: commissionConfigurationId } } });
    }

    async findByMonthNameAndCommissionConfigurationId(monthName: string, commissionConfigurationId: number): Promise<SalesRotationConfiguration | null> {
        return this.repository.findOne({
            where: { monthName, commissionConfiguration: { id: commissionConfigurationId } },
            relations: ['commissionConfiguration'],
        });
    }

    async findOneByIdWithManager(id: number, manager: EntityManager): Promise<SalesRotationConfiguration | null> {
        return await manager.findOne(SalesRotationConfiguration, {
            where: { id },
            relations: ['commissionConfiguration'],
        });
    }

    async findCommissionConfigByIdWithManager(id: number, manager: EntityManager): Promise<CommissionConfiguration | null> {
        return await manager.findOne(CommissionConfiguration, { where: { id } });
    }

    async saveWithManager(entity: SalesRotationConfiguration, manager: EntityManager): Promise<SalesRotationConfiguration> {
        return await manager.save(entity);
    }

    async findByMonthAndCommissionConfigurationId(month: number, commissionConfigurationId: number): Promise<SalesRotationConfiguration | null> {
        return this.repository.findOne({
            where: { month, commissionConfiguration: { id: commissionConfigurationId } },
            relations: ['commissionConfiguration'],
        });
    }

    async findByFilters(
        searchDto: SalesRotationConfigurationSearchDto,
        page: number = 1,
        limit: number = 12
    ): Promise<{ items: SalesRotationConfiguration[]; total: number }> {
        const { monthName, description, isHighSeason, commissionConfigurationId } = searchDto;

        const query = this.repository
            .createQueryBuilder("salesRotationConfiguration")
            .leftJoin("salesRotationConfiguration.commissionConfiguration", "commissionConfiguration")
            .orderBy("salesRotationConfiguration.month", "ASC");

        if (monthName) {
            query.andWhere("salesRotationConfiguration.monthName ILIKE :monthName", {
                monthName: `%${monthName}%`,
            });
        }

        if (description) {
            query.andWhere("salesRotationConfiguration.description ILIKE :description", {
                description: `%${description}%`,
            });
        }

        if (isHighSeason !== undefined) {
            query.andWhere("salesRotationConfiguration.isHighSeason = :isHighSeason", {
                isHighSeason,
            });
        }

        if (commissionConfigurationId) {
            query.andWhere("commissionConfiguration.id = :commissionConfigurationId", {
                commissionConfigurationId,
            });
        }

        const skip = (page - 1) * limit;

        query.skip(skip).take(limit);

        const [items, total] = await query.getManyAndCount();
        return { items, total };

    }
}
