import { Brackets, createQueryBuilder, DataSource as TypeORMDataSource } from "typeorm";
import { BaseRepository } from "./base.respository";
import { BasePptoSellout } from "../models/base.ppto.sellout.model";

export class BasePptoSelloutRepository extends BaseRepository<BasePptoSellout> {
    constructor(dataSource: TypeORMDataSource) {
        super(BasePptoSellout, dataSource);
    }

    async findByFilters(
        page = 1,
        limit = 10,
        search?: string,
    ): Promise<{ items: BasePptoSellout[]; total: number }> {
        const qb = this.repository.createQueryBuilder('s')
            .orderBy('s.id', 'ASC')
            .leftJoinAndSelect('s.employeeSupervisor', 'supervisor')
            .leftJoinAndSelect('s.employeeCodeZone', 'zone')
            .leftJoinAndSelect('s.store', 'store')
            .leftJoinAndSelect('s.employeePromotor', 'promotor')
            .leftJoinAndSelect('s.employeePromotorPi', 'promotorPi')
            .leftJoinAndSelect('s.employeePromotorTv', 'promotorTv')
            .leftJoinAndSelect('s.productSic', 'productSic');

        if (search?.trim()) {
            qb.andWhere(new Brackets(qb1 => {
                qb1.where('s.codeSupervisor ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.codeZone ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.storeCode ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.promotorCode ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.codePromotorPi ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.codePromotorTv ILIKE :search', { search: `%${search}%` });
            }));
        }

        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }

}
