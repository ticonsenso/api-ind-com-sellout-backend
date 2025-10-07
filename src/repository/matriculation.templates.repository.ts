import { Brackets, DataSource, In } from 'typeorm';
import { MatriculationTemplate } from '../models/matriculation.templates.model';
import { BaseRepository } from './base.respository';

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

        qb.andWhere(`TO_CHAR(s.calculateMonth, 'YYYY-MM') = :month`, {
            month: calculateMonth.slice(0, 7),
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

    async findAllWithLogs(calculateMonth?: string): Promise<MatriculationTemplate[]> {
        const qb = this.repository
            .createQueryBuilder('template')
            .leftJoinAndSelect('template.logs', 'log')
            .where('template.status = :status', { status: 'true' });

        if (calculateMonth) {

            const date = calculateMonth?.toString().split('T')[0];
            const year = date.split('-')[0];
            const month = date.split('-')[1];

            qb.andWhere('EXTRACT(YEAR FROM template.calculateMonth) = :year', { year });
            qb.andWhere('EXTRACT(MONTH FROM template.calculateMonth) = :month', { month });
        }

        return qb
            .orderBy('log.createdAt', 'DESC')
            .getMany();
    }

}
