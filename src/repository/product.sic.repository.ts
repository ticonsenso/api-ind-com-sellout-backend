import { Brackets, DataSource as TypeORMDataSource, In } from "typeorm";
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
                codigoJde: productSic,

            },
        });
        return modelProductSic ? {
            productSic: modelProductSic.codigoJde!,
            productModel: modelProductSic.nombreSap!,

        } : null;
    }

    async findByIdProductSic(idProductSic: string[]): Promise<ProductSic[]> {
        return this.repository.find({
            where: {
                idProductoSic: In(idProductSic),
            },
        });
    }

    async findByJdeCodeOnly(jdeCode: string): Promise<ProductSic | null> {
        return this.repository.findOne({
            where: {
                codigoJde: jdeCode,
            },
        });
    }

    async findByEquivalentCodeOrId(code: string): Promise<ProductSic | null> {
        return this.repository.findOne({
            where: [
                {
                    proIdEquivalencia: code,
                    descontinuado: false,
                    estado: true,
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
                qb1.where('s.codigoJde ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.nombreSap ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.lineaNegocioSap ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.marDescGrupoArt ILIKE :search', { search: `%${search}%` })

            }));
        }

        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }
}
