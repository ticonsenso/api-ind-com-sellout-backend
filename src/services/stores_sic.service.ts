import {plainToClass, plainToInstance} from 'class-transformer';
import {DataSource} from 'typeorm';

import {StoresSicRepository} from '../repository/stores.repository';
import {
    CreateStoreSicDto,
    NullFieldFiltersSic,
    StorePaginatedResponseDto,
    StoreSicResponseDto,
    UpdateStoreSicDto
} from '../dtos/stores.sic.dto';
import {StoresSic} from '../models/stores.sic.model';
import {chunkArray} from '../utils/utils';

const normalize = (str: string) => str.replace(/\s+/g, '').trim().toUpperCase();

export class StoresSicService {
    private storesRepository: StoresSicRepository;

    constructor(dataSource: DataSource) {
        this.storesRepository = new StoresSicRepository(dataSource);
    }

    async createStoresSic(stores: CreateStoreSicDto): Promise<StoresSic> {
        const entityStore = plainToClass(StoresSic, stores);
        const store = await this.storesRepository.create(entityStore);
        return store;
    }

    async createStoresSicBatch(configs: CreateStoreSicDto[]): Promise<void> {
        const normalize = (str: string) => str.replace(/\s+/g, '').trim();

        const uniqueMap = new Map<string, CreateStoreSicDto>();
        for (const config of configs) {
            if (config.storeCode) {
                const cleanCode = normalize(config.storeCode.toString());
                config.storeCode = parseInt(cleanCode);
                uniqueMap.set(cleanCode, config);
            }
        }

        const uniqueConfigs = Array.from(uniqueMap.values());
        const chunkSize = 2000;
        const chunks = chunkArray(uniqueConfigs, chunkSize);

        for (const chunk of chunks) {
            const seen = new Set();
            const deduplicated = chunk.filter(c => {
                const key = c.storeCode!.toString();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });

            await this.storesRepository.upsertBatch(deduplicated, ['storeCode']);
        }
    }

    async deleteStoresSic(id: number): Promise<void> {
        const existingStores = await this.storesRepository.findById(id);
        if (!existingStores) {
            throw new Error(`Almacen con ID ${id} no encontrado`);
        }
        await this.storesRepository.delete(id);
    }

    async updateStoresSic(id: number, stores: UpdateStoreSicDto): Promise<StoresSic> {
        const existingStores = await this.storesRepository.findById(id);
        if (!existingStores) {
            throw new Error(`Almacen con ID ${id} no encontrado`);
        }

        const entityStore = plainToClass(StoresSic, stores);
        return this.storesRepository.update(id, entityStore);
    }

    async getFilteredStoresSic(
        page: number,
        limit: number,
        search?: string,
        nullFields?: NullFieldFiltersSic
    ): Promise<StorePaginatedResponseDto> {
        const { items, total } = await this.storesRepository.findByFilters(page, limit, search, nullFields);
        return {
            items: plainToInstance(StoreSicResponseDto, items, {
                excludeExtraneousValues: true,
            }),
            total,
        };
    }

}
