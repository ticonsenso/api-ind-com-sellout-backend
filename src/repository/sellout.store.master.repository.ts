import { CreateSelloutStoreMasterDto, SelloutStoreMasterFiltersDto } from '../dtos/sellout.store.master.dto';
import { SelloutStoreMaster } from '../models/sellout.store.master.model';
import { BaseRepository } from './base.respository';
import { Brackets, DataSource, EntityManager, In } from 'typeorm';

export class SelloutStoreMasterRepository extends BaseRepository<SelloutStoreMaster> {
    constructor(dataSource: DataSource) {
        super(SelloutStoreMaster, dataSource);
    }

    async insertAll(configs: CreateSelloutStoreMasterDto[]): Promise<void> {
        await this.repository.insert(configs);
    }

    async findBySearchStore(searchStore: string[]): Promise<SelloutStoreMaster[]> {
        return this.repository.createQueryBuilder('selloutStoreMaster')
            .select(['selloutStoreMaster.id', 'selloutStoreMaster.searchStore'])
            .where('selloutStoreMaster.searchStore IN (:...searchStore)', { searchStore })
            .getMany();
    }

    async createSelloutStoreMastersBatch(configs: CreateSelloutStoreMasterDto[]): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .insert()
            .into(SelloutStoreMaster)
            .values(configs)
            .orUpdate(['distributor', 'store_distributor', 'code_store_sic', 'status'], ['search_store']) // campos a actualizar + columnas únicas
            .execute();
    }

    async findBySearchStoreOnly(searchStore: string): Promise<SelloutStoreMaster | null> {
        return this.repository
            .createQueryBuilder('selloutStoreMaster')
            .where('selloutStoreMaster.searchStore ILIKE :searchStore', { searchStore: `%${searchStore}%` })
            .getOne();
    }

    async findBySearchStoreDistributorOnly(distributor: string): Promise<SelloutStoreMaster | null> {
        return this.repository
            .createQueryBuilder('selloutStoreMaster')
            .where('selloutStoreMaster.distributor ILIKE :distributor', { distributor: `%${distributor}%` })
            .getOne();
    }

    async findBySearchStoreOnlyManager(searchStore: string, manager: EntityManager): Promise<SelloutStoreMaster | null> {
        return manager.findOne(SelloutStoreMaster, {
            where: {
                searchStore: searchStore,
            },
        });
    }

    async findByCodeStoreSic(codeStoreSic: string): Promise<SelloutStoreMaster | null> {
        return this.repository.findOne({
            where: {
                codeStoreSic: codeStoreSic,
            },
        });
    }

    async findByFilters(
        page = 1,
        limit = 10,
        search?: string,
    ): Promise<{ items: SelloutStoreMaster[]; total: number }> {
        const qb = this.repository.createQueryBuilder('s').orderBy('s.id', 'ASC');
        if (search?.trim()) {
            qb.andWhere(new Brackets(qb1 => {
                qb1.where('s.distributor ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.storeDistributor ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.codeStoreSic ILIKE :search', { search: `%${search}%` });
            }));
        }

        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }

    async findByUniqueDistributorAndStoreWithSearch(
        searchDistributor?: string,
        searchStore?: string,
    ): Promise<{
        values: SelloutStoreMaster[];
        total: number;
    }> {
        const qb = this.repository.createQueryBuilder('s').orderBy('s.id', 'ASC');

        if (searchDistributor?.trim()) {
            const likeSearch = `%${searchDistributor.trim()}%`;
            qb.where(new Brackets(qb1 => {
                qb1.where(`s.distributor ILIKE :search`, { search: likeSearch });
            }));
        }

        if (searchStore?.trim()) {
            const likeSearch = `%${searchStore.trim()}%`;
            if (searchDistributor?.trim()) {
                qb.andWhere(new Brackets(qb1 => {
                    qb1.where('s.storeDistributor ILIKE :search', { search: likeSearch });
                }));
            } else {
                qb.where(new Brackets(qb1 => {
                    qb1.where('s.storeDistributor ILIKE :search', { search: likeSearch });
                }));
            }
        }

        const all = await qb.getMany();

        const seen = new Set<string>();
        const values: SelloutStoreMaster[] = [];

        const fieldToCheck = searchDistributor ? 'distributor' : (searchStore ? 'storeDistributor' : 'distributor');

        for (const item of all) {
            const name = (item as any)[fieldToCheck];
            if (name && !seen.has(name)) {
                seen.add(name);
                values.push(item);
            }
            if (seen.size >= 10) break;
        }

        return {
            values,
            total: seen.size,
        };
    }


}
