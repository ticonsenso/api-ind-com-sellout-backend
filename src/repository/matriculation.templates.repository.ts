import { Brackets, DataSource, In } from 'typeorm';
import { MatriculationTemplate } from '../models/matriculation.templates.model';
import { BaseRepository } from './base.respository';
import { getMonthRange } from '../utils/utils';

export class MatriculationTemplatesRepository extends BaseRepository<MatriculationTemplate> {
    constructor(dataSource: DataSource) {
        super(MatriculationTemplate, dataSource);
    }

    async findByDistributorAndStoreName(distributor: string, storeName: string, calculateMonth?: Date): Promise<MatriculationTemplate | null> {
        return this.repository.findOne({ where: { distributor, storeName, calculateMonth } });
    }

    async findByDistributorAndStoreNameArray(distributor: string[], storeName: string[], calculateMonth?: Date): Promise<MatriculationTemplate[]> {
        return this.repository.find({ where: { distributor: In(distributor), storeName: In(storeName), calculateMonth } });
    }

    async findByCalculateMonth(calculateMonth: Date): Promise<MatriculationTemplate[]> {
        return this.repository.find({ where: { calculateMonth } });
    }

    async findByFilters(
        page?: number,
        limit?: number,
        search?: string,
        calculateMonth?: string
    ): Promise<{ items: MatriculationTemplate[]; total: number }> {
        if (!calculateMonth?.trim()) {
            return { items: [], total: 0 };
        }

        const qb = this.repository
            .createQueryBuilder('s')
            .orderBy('s.createdAt', 'DESC');

        const [monthYear, monthMonth] = calculateMonth.slice(0, 7).split('-');
        const { start: monthStart, end: monthEnd } = getMonthRange(monthYear, monthMonth);
        qb.andWhere('s.calculateMonth >= :monthStart AND s.calculateMonth < :monthEnd', {
            monthStart,
            monthEnd,
        });

        if (search?.trim()) {
            qb.andWhere(
                new Brackets((qb1) => {
                    qb1.where('s.distributor ILIKE :search', {
                        search: `%${search}%`,
                    });
                    qb1.orWhere('s.storeName ILIKE :search', {
                        search: `%${search}%`,
                    });
                })
            );
        }

        if (page && limit) {
            qb.skip((page - 1) * limit).take(limit);
        }

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }

    async findAllWithLogs(calculateMonth?: string, distributor?: string, storeName?: string): Promise<MatriculationTemplate[]> {
        const qb = this.repository
            .createQueryBuilder('template')
            .leftJoinAndSelect('template.logs', 'log')
            .where('template.status = :status', { status: 'true' });

        if (calculateMonth) {

            const date = calculateMonth?.toString().split('T')[0];
            const [year, month] = date.split('-');
            const { start, end } = getMonthRange(year, month);

            qb.andWhere('template.calculateMonth >= :start AND template.calculateMonth < :end', { start, end });
        }

        if (distributor) {
            qb.andWhere('template.distributor ILIKE :distributor', { distributor: `%${distributor}%` });
        }

        if (storeName) {
            qb.andWhere('template.storeName ILIKE :storeName', { storeName: `%${storeName}%` });
        }

        return qb
            .orderBy('log.createdAt', 'DESC')
            .getMany();
    }

    async deleteMany(ids: number[]): Promise<number> {
        const result = await this.repository
            .createQueryBuilder()
            .delete()
            .from(MatriculationTemplate)
            .whereInIds(ids)
            .execute();

        return result.affected || 0;
    }

}
