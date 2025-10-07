import { BaseRepository } from './base.respository';
import { Brackets, DataSource } from 'typeorm';
import { StorePptoMarcimex } from '../models/store.ppto.marcimex.model';
import { StoreConfiguration } from '../models/store.configuration.model';

export class StorePptoMarcimexRepository extends BaseRepository<StorePptoMarcimex> {

    constructor(dataSource: DataSource) {
        super(StorePptoMarcimex, dataSource);
    }

    async findByCeco(ceco: string,): Promise<StorePptoMarcimex | null> {
        return this.repository.findOne({
            where: { ceco }
        });
    }

    async findByCecoAndDate(ceco: string, calculateDate: Date): Promise<StorePptoMarcimex | null> {
        const month = calculateDate.toISOString().split('T')[0].split('-')[1];
        const year = calculateDate.toISOString().split('T')[0].split('-')[0];
        console.log(month, year);
        return this.repository.findOne({
            where: { ceco, mount: Number(month), year: Number(year) }
        });
    }

    async findByStoreConfigurationId(id: number): Promise<StoreConfiguration | null> {
        const result = await this.repository.findOne({
            where: { storeConfiguration: { id } },
            relations: ['storeConfiguration', 'storeConfiguration.storeSize', 'storeConfiguration.company'],
        });
        return result?.storeConfiguration ?? null;
    }

    async findByFilters(
        search: string = "",
        page?: number,
        limit?: number,
        calculateDate?: string
    ): Promise<{ items: StorePptoMarcimex[]; total: number }> {
        const queryBuilder = this.repository
            .createQueryBuilder("stm")
            .leftJoinAndSelect("stm.storeConfiguration", "storeConfiguration")
            .leftJoinAndSelect("storeConfiguration.storeSize", "storeSize")
            .orderBy("storeConfiguration.id", "ASC")
            .addOrderBy("storeConfiguration.createdAt", "DESC");

        if (search) {
            queryBuilder.andWhere(
                new Brackets(qb => {
                    qb.where("storeConfiguration.storeName ILIKE :search", { search: `%${search}%` })
                        .orWhere("storeConfiguration.code ILIKE :search", { search: `%${search}%` })
                        .orWhere("storeConfiguration.ceco ILIKE :search", { search: `%${search}%` })
                        .orWhere("storeSize.name ILIKE :search", { search: `%${search}%` });
                })
            );
        }

        if (calculateDate) {
            console.log(calculateDate);
            const [year, month] = calculateDate.split('T')[0].split('-');
            queryBuilder.andWhere("stm.year = :year", { year });
            queryBuilder.andWhere("stm.mount = :month", { month });
        }

        if (page && limit) {
            const skip = (page - 1) * limit;
            queryBuilder.skip(skip).take(limit);
        }

        const [items, total] = await queryBuilder.getManyAndCount();
        return { items, total };
    }

}
