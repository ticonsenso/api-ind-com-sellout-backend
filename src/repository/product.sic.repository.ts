import { Brackets, In, DataSource as TypeORMDataSource } from "typeorm";
import { BaseRepository } from "./base.respository";
import { ProductSic } from "../models/product_sic.model";

interface ModelProductSic {
    productSic: string;
    productModel: string;
}

export class ProductSicRepository extends BaseRepository<ProductSic> {
    constructor(dataSource: TypeORMDataSource) {
        super(ProductSic, dataSource);
    }

    async getModelProductSicByProductSic(productSic: string): Promise<ModelProductSic | null> {
        const modelProductSic = await this.repository.findOne({
            where: {
                jdeCode: productSic,

            },
        });
        return modelProductSic ? {
            productSic: modelProductSic.jdeCode!,
            productModel: modelProductSic.jdeName!,

        } : null;
    }

    async findByIdProductSic(idProductSic: number[]): Promise<ProductSic[]> {
        return this.repository.find({
            where: {
                idProductSic: In(idProductSic),
            },
        });
    }

    async findByJdeCodeOnly(jdeCode: string): Promise<ProductSic | null> {
        return this.repository.findOne({
            where: {
                jdeCode: jdeCode,
            },
        });
    }

    async findByEquivalentCodeOrId(code: string): Promise<ProductSic | null> {
        return this.repository.findOne({
            where: [
                {
                    equivalentProId: code,
                    discontinued: false,
                    status: true,
                },

            ],
        });
    }

    async findByFilters(
        page = 1,
        limit = 10,
        search?: string,
    ): Promise<{ items: ProductSic[]; total: number }> {
        const qb = this.repository.createQueryBuilder('s').orderBy('s.id', 'ASC');
        if (search?.trim()) {
            qb.andWhere(new Brackets((qb1: any) => {
                qb1.where('s.jdeCode ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.jdeName ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.companyLine ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.category ILIKE :search', { search: `%${search}%` })

            }));
        }

        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }
}
