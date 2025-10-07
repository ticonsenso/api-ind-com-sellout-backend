import { Brackets, In, DataSource as TypeORMDataSource } from "typeorm";
import { Stores } from "../models/stores.model";
import { BaseRepository } from "./base.respository";
import { NullFieldFiltersSic } from "../dtos/stores.dto";


export class StoresSicRepository extends BaseRepository<Stores> {
    constructor(dataSource: TypeORMDataSource) {
        super(Stores, dataSource);
    }

    async getDistribuidorAndStoreNameByStoreSic(storeSic: number): Promise<Stores | null> {
        const store = await this.repository.findOne({
            select: {
                storeCode: true,
                storeName: true,
                distributor2: true,
            },
            where: {
                storeCode: storeSic,
            },
        });
        return store;
    }

    async findByStoreCodeOnly(storeCode: number): Promise<Stores | null> {
        return this.repository.findOne({
            where: {
                storeCode: storeCode,
            },
        });
    }

    async findByStoreCode(storeCode: number[]): Promise<Stores[]> {
        return this.repository.find({
            where: {
                storeCode: In(storeCode),
            },
        });
    }

    buildSearchBrackets(search: string): Brackets {
        return new Brackets(qb => {
            qb.where('CAST(s.storeCode AS TEXT) ILIKE :search', { search: `%${search}%` })
              .orWhere('s.storeName ILIKE :search')
              .orWhere('s.city ILIKE :search')
              .orWhere('s.region ILIKE :search')
              .orWhere('s.province ILIKE :search');
        });
    }

    async findByFilters(
        page = 1,
        limit = 10,
        search?: string,
        nullFields?: NullFieldFiltersSic
    ): Promise<{ items: Stores[]; total: number }> {
        const qb = this.repository.createQueryBuilder('s').orderBy('s.id', 'ASC');
        if (search?.trim()) {
            qb.andWhere(this.buildSearchBrackets(search));
        }
        qb.skip((page - 1) * limit).take(limit);

        if (nullFields && Object.keys(nullFields).length > 0) {
            qb.andWhere(new Brackets(qb2 => {
                if (nullFields.zone) {
                    qb2.orWhere('s.zone IS NULL OR s.zone = \'\'');
                }
            }));
        }

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }
}
