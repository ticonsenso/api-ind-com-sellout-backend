import {Brackets, DataSource as TypeORMDataSource} from "typeorm";
import {BaseRepository} from "./base.respository";
import {BaseValuesSellout} from "../models/base.values.sellout.model";

export class BaseValuesSelloutRepository extends BaseRepository<BaseValuesSellout> {
    constructor(dataSource: TypeORMDataSource) {
        super(BaseValuesSellout, dataSource);
    }

    async findByFilters(
        page = 1,
        limit = 10,
        search?: string,
    ): Promise<{ items: BaseValuesSellout[]; total: number }> {
        const qb = this.repository.createQueryBuilder('s').orderBy('s.id', 'ASC');
        if (search?.trim()) {
            qb.andWhere(new Brackets(qb1 => {
                qb1.where('s.brand ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.model ILIKE :search', { search: `%${search}%` });
            }));
        }

        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }

}
