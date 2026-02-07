import { Brackets, DataSource as TypeORMDataSource, In } from "typeorm";
import { StoresSic } from "../models/stores.sic.model";
import { BaseRepository } from "./base.respository";
import { NullFieldFiltersSic } from "../dtos/stores.sic.dto";


export class StoresSicRepository extends BaseRepository<StoresSic> {
    constructor(dataSource: TypeORMDataSource) {
        super(StoresSic, dataSource);
    }

    async getDistribuidorAndStoreNameByStoreSic(storeSic: string): Promise<StoresSic | null> {
        const store = await this.repository.findOne({
            select: {
                codAlmacen: true,
                nombreAlmacen: true,
                distribuidor: true,
            },
            where: {
                codAlmacen: storeSic,
            },
        });
        return store;
    }

    async findByStoreCodeOnly(storeCode: string): Promise<StoresSic | null> {
        return this.repository.findOne({
            where: {
                codAlmacen: storeCode,
            },
        });
    }

    async findByStoreCode(storeCode: string[]): Promise<StoresSic[]> {
        return this.repository.find({
            where: {
                codAlmacen: In(storeCode),
            },
        });
    }

    buildSearchBrackets(search: string): Brackets {
        return new Brackets(qb => {
            qb.where('s.codAlmacen ILIKE :search', { search: `%${search}%` })
                .orWhere('s.nombreAlmacen ILIKE :search')
                .orWhere('s.ciudad ILIKE :search')
                .orWhere('s.region ILIKE :search')
                .orWhere('s.provincia ILIKE :search');
        });
    }

    async findByFilters(
        page = 1,
        limit = 10,
        search?: string,
        nullFields?: NullFieldFiltersSic
    ): Promise<{ items: StoresSic[]; total: number }> {
        const qb = this.repository.createQueryBuilder('s').orderBy('s.id', 'ASC');
        if (search?.trim()) {
            qb.andWhere(this.buildSearchBrackets(search));
        }
        qb.skip((page - 1) * limit).take(limit);

        if (nullFields && Object.keys(nullFields).length > 0) {
            qb.andWhere(new Brackets(qb2 => {
                if (nullFields.zona) {
                    qb2.orWhere('s.zona IS NULL OR s.zona = \'\'');
                }
            }));
        }

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }
}
