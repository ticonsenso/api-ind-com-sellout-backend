import { Brackets, DataSource as TypeORMDataSource } from "typeorm";
import { BaseRepository } from "./base.respository";
import { RotationBase } from "../models/rotation.base.model";

export class RotationBaseRepository extends BaseRepository<RotationBase> {
    constructor(dataSource: TypeORMDataSource) {
        super(RotationBase, dataSource);
    }

    async findByFilters(
        page = 1,
        limit = 10,
        search?: string,
    ): Promise<{ items: RotationBase[]; total: number }> {
        const qb = this.repository.createQueryBuilder('s').orderBy('s.id', 'ASC');
        if (search?.trim()) {
            qb.andWhere(new Brackets((qb1: any) => {
                qb1.where('s.visitCode ILIKE :search', { search: `%${search}%` })
                    .orWhere('CAST(s.visitYear AS TEXT) ILIKE :search', { search: `%${search}%` })
                    .orWhere('CAST(s.visitMonth AS TEXT) ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.storeCode ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.productCode ILIKE :search', { search: `%${search}%` })
            }));
        }

        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }
}
