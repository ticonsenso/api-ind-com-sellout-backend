import { StoreConfigurationSearchDto } from '../dtos/store.configuration.dto';
import { StoreConfiguration } from '../models/store.configuration.model';
import { BaseRepository } from './base.respository';
import { Brackets, DataSource } from 'typeorm';
import { AdvisorConfigurationRepository } from './advisor.configuration.repository';

export class StoreConfigurationRepository extends BaseRepository<StoreConfiguration> {
    private advisorConfigurationRepository: AdvisorConfigurationRepository;

    constructor(dataSource: DataSource) {
        super(StoreConfiguration, dataSource);
        this.advisorConfigurationRepository = new AdvisorConfigurationRepository(dataSource);
    }

    async findDataById(id: number): Promise<StoreConfiguration | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['storeSize', 'company', 'advisorConfiguration'],
        });
    }

    async findByCeco(ceco: string): Promise<StoreConfiguration | null> {
        return this.repository.findOne({
            where: { ceco },
            relations: ['storeSize', 'company'],
        });
    }

    async findByCode(code: string): Promise<StoreConfiguration | null> {
        return this.repository.findOne({
            where: { code },
            relations: ['storeSize'],
        });
    }

    async findByFilters(
        search: string = "",
        companyId?: number,
        page?: number,
        limit?: number
    ): Promise<{ items: StoreConfiguration[]; total: number }> {
        const queryBuilder = this.repository
            .createQueryBuilder("storeConfiguration")
            .leftJoinAndSelect("storeConfiguration.storeSize", "storeSize")
            .leftJoinAndSelect("storeConfiguration.company", "company")
            .orderBy("storeConfiguration.createdAt", "DESC");

        if (search) {
            queryBuilder.andWhere(
                new Brackets(qb => {
                    qb.where("storeConfiguration.storeName ILIKE :search", { search: `%${search}%` })
                        .orWhere("storeConfiguration.code ILIKE :search", { search: `%${search}%` })
                        .orWhere("storeConfiguration.ceco ILIKE :search", { search: `%${search}%` })
                        .orWhere("storeConfiguration.regional ILIKE :search", { search: `%${search}%` })
                        .orWhere("storeSize.name ILIKE :search", { search: `%${search}%` });
                })
            );
        }

        if (companyId) {
            queryBuilder.andWhere("company.id = :companyId", { companyId });
        }


        if (page && limit) {
            const skip = (page - 1) * limit;
            queryBuilder.skip(skip).take(limit);
        }


        const [items, total] = await queryBuilder.getManyAndCount();

        for (const config of items) {
            config.advisorConfiguration = await this.advisorConfigurationRepository.findByStoreConfigurationId(config.id);
        }

        return { items, total };
    }

}
