import { CreateSelloutProductMasterDto } from '../dtos/sellout.product.master.dto';
import { SelloutProductMaster } from '../models/sellout.product.master.model';
import { BaseRepository } from './base.respository';
import { Brackets, DataSource, Raw } from 'typeorm';

interface ModelProductSic {
    codeProductSic: string;
    productModel: string;
}

export class SelloutProductMasterRepository extends BaseRepository<SelloutProductMaster> {
    constructor(dataSource: DataSource) {
        super(SelloutProductMaster, dataSource);
    }

    async updateAll(configs: SelloutProductMaster[]): Promise<void> {
        await this.repository.save(configs);
    }

    async findBySearchProductStoreOnly(searchProductStore: string): Promise<SelloutProductMaster | null> {
        return this.repository
            .createQueryBuilder('selloutProductMaster')
            .where('selloutProductMaster.searchProductStore = :searchProductStore', { searchProductStore: searchProductStore })
            .getOne();
    }

    async findBySearchProductDistributorOnly(distributor: string): Promise<SelloutProductMaster | null> {
        return this.repository.findOne({
            where: {
                distributor: distributor,
            },
        });
    }

    async findBySearchProductStore(searchProductStore: string[]): Promise<SelloutProductMaster[]> {
        if (!searchProductStore || searchProductStore.length === 0) return [];
        return this.repository.createQueryBuilder('selloutProductMaster')
            .select(['selloutProductMaster.id', 'selloutProductMaster.searchProductStore'])
            .where('selloutProductMaster.searchProductStore IN (:...searchProductStore)', { searchProductStore })
            .getMany();
    }

    async findByCodeProductSic(codeProductSic: string): Promise<SelloutProductMaster | null> {
        return this.repository.findOne({
            where: {
                codeProductSic,
            },
        });
    }

    async upsert(configs: CreateSelloutProductMasterDto[], batch = 2000): Promise<void> {
        for (let i = 0; i < configs.length; i += batch) {
            const chunk = configs.slice(i, i + batch);
            await this.repository.upsert(chunk, {
                conflictPaths: ['searchProductStore'],
                skipUpdateIfNoValuesChanged: true,
            });
        }
    }

    async findBySearchProductStoreAndPeriodo(searchProductStore: string, periodo: Date | string): Promise<SelloutProductMaster | null> {
        return this.repository.findOne({
            where: {
                searchProductStore: Raw(alias => `UPPER(${alias}) = :searchProductStore`, { searchProductStore: searchProductStore.toUpperCase() }),
                periodo: periodo as unknown as Date,
            },
        });
    }

    async findByFilters(
        page = 1,
        limit = 10,
        search?: string,
        periodo?: string,
    ): Promise<{ items: SelloutProductMaster[]; total: number }> {
        const qb = this.repository.createQueryBuilder('p').orderBy('p.id', 'ASC');
        if (search?.trim()) {
            qb.andWhere(new Brackets(qb1 => {
                qb1.where('p.distributor ILIKE :search', { search: `%${search}%` })
                    .orWhere('p.productDistributor ILIKE :search', { search: `%${search}%` })
                    .orWhere('p.productStore ILIKE :search', { search: `%${search}%` })
                    .orWhere('p.codeProductSic ILIKE :search', { search: `%${search}%` });
            }));
        }

        if (periodo) {
            qb.andWhere('p.periodo = :periodo', { periodo });
        }

        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }

    async findByPeriodo(periodo: string): Promise<SelloutProductMaster[]> {
        return this.repository.find({
            where: {
                periodo: periodo as unknown as Date
            }
        });
    }

    async deleteByPeriod(periodo: string, activeKeys: string[]): Promise<void> {
        if (!activeKeys || activeKeys.length === 0) {
            return;
        }
        await this.repository
            .createQueryBuilder()
            .delete()
            .from(SelloutProductMaster)
            .where("periodo = :periodo", { periodo })
            .andWhere("searchProductStore NOT IN (:...keys)", { keys: activeKeys })
            .execute();
    }
}
