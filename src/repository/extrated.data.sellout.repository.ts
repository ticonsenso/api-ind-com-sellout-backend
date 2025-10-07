import { ExtractedDataSellout } from '../models/extracted.data.sellout.model';
import { ExtractionLogsSellout } from '../models/extraction.logs.sellout.model';
import { BaseRepository } from './base.respository';
import { Raw, DataSource as TypeORMDataSource } from 'typeorm';

export class ExtractedDataSelloutRepository extends BaseRepository<ExtractedDataSellout> {
    constructor(dataSource: TypeORMDataSource) {
        super(ExtractedDataSellout, dataSource);
    }

    async existsByCalcDate(
        calculateDate: Date,
    ): Promise<boolean> {
        if (!calculateDate) {
            throw new Error('Fecha de calculo es requerida');
        }

        const yyyyMmDd = calculateDate?.toISOString().slice(0, 10);

        return await this.repository.exists({
            where: {
                calculateDate: Raw(alias => `${alias} = :cDate`, { cDate: yyyyMmDd }),
            },
        });
    }

    async findPaginated(
        page = 1,
        limit = 10,
    ): Promise<{ items: ExtractedDataSellout[]; total: number }> {
        const [items, total] = await this.repository.findAndCount({
            order: { id: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { items, total };
    }
}
