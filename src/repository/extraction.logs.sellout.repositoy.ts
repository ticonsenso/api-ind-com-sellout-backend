import {ExtractionLogsSellout} from '../models/extraction.logs.sellout.model';
import {BaseRepository} from './base.respository';
import {DataSource as TypeORMDataSource} from 'typeorm';

export class ExtractionLogsSelloutRepository extends BaseRepository<ExtractionLogsSellout> {
    constructor(dataSource: TypeORMDataSource) {
        super(ExtractionLogsSellout, dataSource);
    }

    async findPaginated(
        page = 1,
        limit = 10,
    ): Promise<{ items: ExtractionLogsSellout[]; total: number }> {
        const [items, total] = await this.repository.findAndCount({
            order: { id: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { items, total };
    }
}
