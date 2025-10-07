import { Brackets, DataSource } from "typeorm";
import { BaseRepository } from "./base.respository";
import { SelloutZone } from "../models/sellout.zone.model";

export class SelloutZoneRepository extends BaseRepository<SelloutZone> {
    constructor(dataSource: DataSource) {
        super(SelloutZone, dataSource);
    }

    async findByFilters(
        page = 1,
        limit = 10,
        search?: string,
    ): Promise<{ items: SelloutZone[]; total: number }> {
        const qb = this.repository.createQueryBuilder('s').orderBy('s.id', 'ASC');
        if (search?.trim()) {
            qb.andWhere(new Brackets((qb1: any) => {
                qb1.where('s.name ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.groupName ILIKE :search', { search: `%${search}%` });
            }));
        }

        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }
}
