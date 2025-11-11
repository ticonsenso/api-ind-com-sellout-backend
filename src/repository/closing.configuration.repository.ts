import {Between, Brackets, DataSource as TypeORMDataSource} from "typeorm";
import {BaseRepository} from "./base.respository";
import {ClosingConfiguration} from "../models/closing.configuration.model";

export class ClosingConfigurationRepository extends BaseRepository<ClosingConfiguration> {
    constructor(dataSource: TypeORMDataSource) {
        super(ClosingConfiguration, dataSource);
    }

    async findByMonthYear(year: number, month: number): Promise<ClosingConfiguration | null> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const config = await this.repository.findOne({
            where: {
                month: Between(startDate, endDate),
            },
        });

        return config;
    }

    async findByFilters(
        page: number,
        limit: number,
        search?: string,
        calculateMonth?: string
    ): Promise<{ items: ClosingConfiguration[]; total: number }> {
        const qb = this.repository.createQueryBuilder('s').orderBy('s.month', 'DESC');

        if (search?.trim()) {
            qb.andWhere(new Brackets(qb1 => {
                qb1.where('CAST(s.month AS TEXT) ILIKE :search', { search: `%${search}%` })
                    .orWhere('s.description ILIKE :search', { search: `%${search}%` });
            }));
        }

        if (calculateMonth) {

            const date = calculateMonth?.toString().split('T')[0];
            const year = date.split('-')[0];
            const month = date.split('-')[1];

            qb.andWhere('EXTRACT(YEAR FROM s.month) = :year', { year });
            qb.andWhere('EXTRACT(MONTH FROM s.month) = :month', { month });
        }

        if (page && limit) {
            qb.skip((page - 1) * limit).take(limit);
        }

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }

}
