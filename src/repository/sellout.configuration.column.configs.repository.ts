import {SelloutConfigurationColumnConfigs} from '../models/sellout.configuration.column.configs.model';
import {BaseRepository} from './base.respository';
import {DataSource as TypeORMDataSource, ILike} from 'typeorm';

export class SelloutConfigurationColumnConfigsRepository extends BaseRepository<SelloutConfigurationColumnConfigs> {
    constructor(dataSource: TypeORMDataSource) {
        super(SelloutConfigurationColumnConfigs, dataSource);
    }

    async createBatch(configs: SelloutConfigurationColumnConfigs[]): Promise<SelloutConfigurationColumnConfigs[]> {
        return this.repository.save(configs);
    }

    async findAllColumnConfigs(
        search?: string,
        selloutConfigurationId?: number,
    ): Promise<{ items: SelloutConfigurationColumnConfigs[]; total: number }> {
        const where: any = {};

        if (search || selloutConfigurationId) {
            where.selloutConfiguration = {};
        }

        if (search) {
            where.columnName = ILike(`%${search}%`);
        }

        if (selloutConfigurationId) {
            where.selloutConfiguration.id = selloutConfigurationId;
        }

        const [items, total] = await this.repository.findAndCount({
            where,
            order: { id: 'ASC' },
        });

        return { items, total };
    }
}
