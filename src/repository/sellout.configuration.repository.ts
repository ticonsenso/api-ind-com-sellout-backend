import { SelloutConfiguration } from '../models/sellout.configuration.model';
import { BaseRepository } from './base.respository';
import { Brackets, DataSource as TypeORMDataSource } from 'typeorm';

export class SelloutConfigurationRepository extends BaseRepository<SelloutConfiguration> {
    constructor(dataSource: TypeORMDataSource) {
        super(SelloutConfiguration, dataSource);
    }
    async findByFilters(
        page?: number,
        limit?: number,
        search?: string,
    ): Promise<{ items: SelloutConfiguration[]; total: number }> {
        const qb = this.repository
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.matriculation', 'm');

        const isPaginated =
            typeof page === 'number' &&
            typeof limit === 'number' &&
            page > 0 &&
            limit > 0;

        // Creamos un campo calculado "priority"
        qb.addSelect(`
            CASE 
                WHEN s.name = 'CONFIGURACION ESTANDAR' THEN 0
                ELSE 1
            END
        `, 'priority');

        qb.orderBy('priority', 'ASC')
            .addOrderBy('s.id', 'ASC');

        if (search?.trim()) {
            qb.andWhere(new Brackets(qb1 => {
                qb1.where('s.name ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.description ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.distributorCompanyName ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.codeStoreDistributor ILIKE :search', { search: `%${search}%` });
            }));
        }

        if (isPaginated) {
            qb.andWhere(new Brackets(qb1 => {
                qb1.where('s.name != :excludedName', { excludedName: 'CONFIGURACION ESTANDAR' })
                    .orWhere('s.name IS NULL');
            }));
        }

        if (isPaginated) {
            qb.skip((page - 1) * limit).take(limit);
        }

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }


}
