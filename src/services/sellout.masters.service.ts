import { plainToClass, plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { SelloutStoreMasterRepository } from '../repository/sellout.store.master.repository';
import { SelloutProductMasterRepository } from '../repository/sellout.product.master.repository';
import { SelloutStoreMaster } from '../models/sellout.store.master.model';
import {
    CreateSelloutProductMasterDto,
    SelloutProductMasterDto,
    SelloutProductMasterFiltersResponseDto,
    UpdateSelloutProductMasterDto
} from '../dtos/sellout.product.master.dto';
import {
    CreateSelloutStoreMasterDto,
    SelloutStoreMasterDto,
    SelloutStoreMasterFiltersResponseDto,
    UpdateSelloutStoreMasterDto
} from '../dtos/sellout.store.master.dto';
import { SelloutProductMaster } from '../models/sellout.product.master.model';
import { chunkArray, cleanString } from '../utils/utils';
import { ProductSicRepository } from '../repository/product.sic.repository';
import { StoresSicRepository } from '../repository/stores.repository';
import { StoresSic } from '../models/stores.sic.model';
import { ConsolidatedDataStoresRepository } from '../repository/consolidated.data.stores.repository';
import { ConsolidatedDataStoresService } from './consolidated.data.stores.service';
import { ConsolidatedDataStores } from '../models/consolidated.data.stores.model';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

interface ModelProductSic {
    productSic: string;
    productModel: string;
}

export class SelloutMastersService {
    private selloutStoreMasterRepository: SelloutStoreMasterRepository;
    private selloutProductMasterRepository: SelloutProductMasterRepository;
    private consolidatedDataStoresRepository: ConsolidatedDataStoresRepository;
    private consolidatedDataStoresService: ConsolidatedDataStoresService;
    private selloutProductSicRepository: ProductSicRepository;
    private selloutStoreRepository: StoresSicRepository;
    private productStoreRepository: SelloutProductMasterRepository;
    private storesRepository: StoresSicRepository;
    private productSicRepository: ProductSicRepository;

    constructor(dataSource: DataSource) {
        this.selloutStoreMasterRepository = new SelloutStoreMasterRepository(dataSource);
        this.selloutProductMasterRepository = new SelloutProductMasterRepository(dataSource);
        this.selloutProductSicRepository = new ProductSicRepository(dataSource);
        this.selloutStoreRepository = new StoresSicRepository(dataSource);
        this.consolidatedDataStoresRepository = new ConsolidatedDataStoresRepository(dataSource);
        this.consolidatedDataStoresService = new ConsolidatedDataStoresService(dataSource);
        this.productStoreRepository = new SelloutProductMasterRepository(dataSource);
        this.storesRepository = new StoresSicRepository(dataSource);
        this.productSicRepository = new ProductSicRepository(dataSource);
    }

    async createSelloutStoreMaster(selloutStoreMaster: CreateSelloutStoreMasterDto): Promise<SelloutStoreMaster> {
        try {
            const saved = await this.selloutStoreMasterRepository.create(selloutStoreMaster);

            saved.searchStore = cleanString(saved.distributor ?? '') + cleanString(saved.storeDistributor ?? '');
            await this.syncConsolidatedDataStoresOnUpdateStores([saved]);

            return saved;
        } catch (error: any) {
            if (
                error.code === '23505' ||
                error.message?.includes('unique_search_product_store')

            ) {
                throw new Error('Ya existe un registro con esos datos en la tabla de tiendas maestras.');
            }

            throw error;
        }

    }

    async updateSelloutStoreMaster(id: number, selloutStoreMaster: UpdateSelloutStoreMasterDto): Promise<SelloutStoreMaster> {
        const existingSelloutStoreMaster = await this.selloutStoreMasterRepository.findById(id);
        if (!existingSelloutStoreMaster) {
            throw new Error(`Maestros de almacenes con ID ${id} no encontrado`);
        }

        const saved = await this.selloutStoreMasterRepository.update(id, selloutStoreMaster);
        await this.syncConsolidatedDataStoresOnUpdateStores([saved]);
        return saved;
    }

    async createSelloutStoreMasterExcel(selloutStoreMaster: CreateSelloutStoreMasterDto): Promise<SelloutStoreMaster | undefined> {
        try {
            if (!selloutStoreMaster.searchStore) {
                selloutStoreMaster.searchStore = cleanString(selloutStoreMaster.distributor ?? '') + cleanString(selloutStoreMaster.storeDistributor ?? '');
            }
            const existing = await this.selloutStoreMasterRepository.findByCodeStoreSic(selloutStoreMaster.searchStore);
            if (existing) {
                const updated = await this.updateSelloutStoreMaster(existing.id, selloutStoreMaster);
                return updated;
            } else {
                const saved = await this.selloutStoreMasterRepository.create(selloutStoreMaster);
                return saved;
            }
        } catch (error: any) {
            console.log(error);
            return undefined;
        }
    }

    async createSelloutStoreMastersBatch(configs: CreateSelloutStoreMasterDto[]): Promise<{ insert: number; update: number; errors: string }> {
        let insert = 0;
        let update = 0;
        let errors = '';
        for (const config of configs) {
            const distributor = cleanString(config.distributor ?? '');
            const storeDistributor = cleanString(config.storeDistributor ?? '');
            const searchStoreKey = `${distributor}${storeDistributor}`.replace(/\s/g, '');
            config.searchStore = searchStoreKey.toUpperCase();
            try {
                const existing = await this.selloutStoreMasterRepository.findBySearchStoreOnly(searchStoreKey.toUpperCase());
                if (existing) {
                    update++;
                    await this.selloutStoreMasterRepository.update(existing.id, config);
                } else {
                    insert++;
                    await this.selloutStoreMasterRepository.create(config);
                }
            } catch (error) {
                errors += error + '\n';
            }
        }
        return { insert, update, errors };
    }

    async syncMasterStores(): Promise<void> {
        const storeCandidates = await this.consolidatedDataStoresRepository.findMonthlyStoresFieldsWithOutDate();
        const batchSize = 100;
        let updatedStores = 0;
        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
        const chunkedStores = chunkArray(storeCandidates, batchSize);

        for (const chunk of chunkedStores) {
            const results = await Promise.allSettled(chunk.map(async (store) => {
                const searchKey = cleanString(store.distributor + store.code_store_distributor);
                const storeMaster = await this.selloutStoreMasterRepository.findBySearchStoreOnly(searchKey);

                if (storeMaster?.codeStoreSic) {
                    const storeSic = await this.storesRepository.findByStoreCodeOnly(Number(storeMaster.codeStoreSic));

                    const updateData: QueryDeepPartialEntity<ConsolidatedDataStores> = {
                        codeStore: storeMaster.codeStoreSic,
                        updatedAt: new Date(),
                    };

                    await this.consolidatedDataStoresRepository.updateFieldsByDistributorAndCode(
                        store.distributor,
                        store.code_store_distributor,
                        updateData
                    );

                    return true;
                }

                return false;
            }));

            updatedStores += results.filter(r => r.status === 'fulfilled' && r.value === true).length;
            await delay(100);
        }
        console.log('Stores actualizados:', updatedStores);
    }

    async syncMasterProducts(): Promise<void> {
        const productCandidates = await this.consolidatedDataStoresRepository.findMonthlyProductsFieldsWithOutDate();
        const batchSize = 100;
        let updatedProducts = 0;

        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

        const chunkedProducts = chunkArray(productCandidates, batchSize);

        for (const chunk of chunkedProducts) {
            const results = await Promise.allSettled(chunk.map(async (product) => {
                const searchKey = cleanString(product.distributor + product.code_product_distributor + product.description_distributor);
                const productStore = await this.productStoreRepository.findBySearchProductStoreOnly(searchKey);

                if (productStore?.codeProductSic) {

                    const productSic = await this.productSicRepository.findByJdeCodeOnly(productStore.codeProductSic.toString());

                    const updateData: QueryDeepPartialEntity<ConsolidatedDataStores> = {
                        codeProduct: productStore.codeProductSic,
                        updatedAt: new Date(),
                    };

                    const data = await this.consolidatedDataStoresRepository.updateFieldsByProductAndModel(
                        product.distributor,
                        product.code_product_distributor,
                        product.description_distributor,
                        updateData
                    );

                    if (data.affected && data.affected > 0) {
                        console.log('✔ Registro actualizado');
                    } else {
                        console.log('❌ Nada fue actualizado');
                    }

                    return true;
                }

                return false;
            }));

            updatedProducts += results.filter(r => r.status === 'fulfilled' && r.value === true).length;
            await delay(100);
        }
    }

    async updateSelloutStoreMastersBatch(
        updates: UpdateSelloutStoreMasterDto[]
    ): Promise<SelloutStoreMasterDto[]> {
        return this.selloutStoreMasterRepository.dataSource.transaction(async (manager) => {
            const responses: SelloutStoreMasterDto[] = [];
            for (const dto of updates) {
                const distributor = cleanString(dto.distributor ?? '');
                const storeDistributor = cleanString(dto.storeDistributor ?? '');
                const searchStoreKey = distributor + storeDistributor;
                dto.searchStore = searchStoreKey;

                const entity = await this.selloutStoreMasterRepository.findBySearchStoreOnlyManager(dto.searchStore, manager);
                if (!entity) throw new Error(`No existe tienda con busqueda ${dto.searchStore}`);

                if (dto.searchStore !== undefined) entity.searchStore = dto.searchStore;
                if (dto.distributor !== undefined) entity.distributor = dto.distributor;
                if (dto.storeDistributor !== undefined) entity.storeDistributor = dto.storeDistributor;
                if (dto.codeStoreSic !== undefined) entity.codeStoreSic = dto.codeStoreSic;

                const saved = await this.selloutStoreMasterRepository.update(entity.id, entity);
                await this.syncConsolidatedDataStoresOnUpdateStores([saved]);

                responses.push(
                    plainToClass(SelloutStoreMasterDto, saved, { excludeExtraneousValues: true })
                );
            }

            return responses;
        });

    }

    async syncConsolidatedDataStoresOnUpdateStores(data: SelloutStoreMaster[]): Promise<void> {
        const batchSize = 50;

        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);

            await Promise.allSettled(
                batch.map(async (storeMaster) => {
                    try {
                        const { searchStore, codeStoreSic } = storeMaster;

                        if (!searchStore || !codeStoreSic) {
                            throw new Error('Datos incompletos para storeMaster');
                        }

                        const consolidatedRecords = await this.consolidatedDataStoresRepository.findBySearchStore(searchStore);

                        if (consolidatedRecords.length === 0) {
                            throw new Error('No se encontraron registros que coincidan con el searchStore');
                        }

                        const storeSic = await this.selloutStoreRepository.getDistribuidorAndStoreNameByStoreSic(Number(codeStoreSic));
                        for (const record of consolidatedRecords) {
                            record.codeStore = codeStoreSic;
                        }

                        await this.consolidatedDataStoresRepository.save(consolidatedRecords);

                    } catch (error) {
                        console.error(error);
                    }
                })
            );
        }
    }

    async getDistribuidorAndStoreNameByStoreSic(storeSic: number): Promise<StoresSic | null> {
        return await this.selloutStoreRepository.getDistribuidorAndStoreNameByStoreSic(storeSic);
    }

    async deleteSelloutStoreMaster(id: number): Promise<void> {
        const existingSelloutStoreMaster = await this.selloutStoreMasterRepository.findById(id);
        if (!existingSelloutStoreMaster) {
            throw new Error(`Maestros de almacenes con ID ${id} no encontrado`);
        }

        await this.selloutStoreMasterRepository.delete(id);
    }

    async getFilteredStoresMaster(
        page: number,
        limit: number,
        search?: string
    ): Promise<SelloutStoreMasterFiltersResponseDto> {
        const { items, total } = await this.selloutStoreMasterRepository.findByFilters(page, limit, search);
        return {
            items: plainToInstance(SelloutStoreMasterDto, items, {
                excludeExtraneousValues: true,
            }),
            total,
        };
    }

    async getUniqueStoresMaster(searchDistributor?: string, searchStore?: string): Promise<{
        values: SelloutStoreMaster[];
        total: number;
    }> {
        const { values, total } = await this.selloutStoreMasterRepository.findByUniqueDistributorAndStoreWithSearch(searchDistributor, searchStore);
        return {
            values,
            total,
        };
    }

    async createSelloutProductMaster(selloutProductMaster: CreateSelloutProductMasterDto): Promise<SelloutProductMaster> {
        const saved = await this.selloutProductMasterRepository.create(selloutProductMaster);
        saved.searchProductStore = cleanString(saved.distributor ?? '') + cleanString(saved.productDistributor ?? '') + cleanString(saved.productStore ?? '');
        await this.syncConsolidatedDataStoresOnUpdateProduct([saved]);
        return saved;
    }

    async createSelloutProductMastersBatch(configs: CreateSelloutProductMasterDto[]): Promise<{ insert: number; update: number; errors: string }> {
        let insert = 0;
        let update = 0;
        let errors = '';
        for (const config of configs) {
            try {
                const distributor = cleanString(config.distributor ?? '');
                const productDistributor = cleanString(config.productDistributor ?? '');
                const productStore = cleanString(config.productStore ?? '');
                const searchProductKey = `${distributor}${productStore}${productDistributor}`.replace(/\s/g, '');
                const existing = await this.selloutProductMasterRepository.findBySearchProductStoreOnly(searchProductKey.toUpperCase());
                config.searchProductStore = searchProductKey.toUpperCase();
                if (existing) {
                    update++;
                    await this.selloutProductMasterRepository.update(existing.id, config);
                } else {
                    insert++;
                    await this.selloutProductMasterRepository.create(config);
                }
            } catch (error) {
                errors += error + '\n';
            }
        }
        return { insert, update, errors };
    }

    async createSelloutProductMasterExcel(selloutProductMaster: CreateSelloutProductMasterDto): Promise<SelloutProductMaster | undefined> {
        try {
            if (!selloutProductMaster.searchProductStore) {
                selloutProductMaster.searchProductStore = cleanString(selloutProductMaster.distributor ?? '') + cleanString(selloutProductMaster.productDistributor ?? '') + cleanString(selloutProductMaster.productStore ?? '');
            }
            const existing = await this.selloutProductMasterRepository.findBySearchProductStoreOnly(selloutProductMaster.searchProductStore);
            if (existing) {
                return await this.updateSelloutProductMasterSinc(existing.id, selloutProductMaster);
            } else {
                return await this.selloutProductMasterRepository.create(selloutProductMaster);
            }
        } catch (error: any) {
            return undefined;
        }
    }

    async updateSelloutProductMasterSinc(id: number, selloutProductMaster: UpdateSelloutProductMasterDto): Promise<SelloutProductMaster> {
        const existingSelloutProductMaster = await this.selloutProductMasterRepository.findById(id);
        if (!existingSelloutProductMaster) {
            throw new Error(`Maestros de productos con ID ${id} no encontrado`);
        }
        const saved = await this.selloutProductMasterRepository.update(id, selloutProductMaster);
        return saved;
    }

    async updateSelloutProductMaster(id: number, selloutProductMaster: UpdateSelloutProductMasterDto): Promise<SelloutProductMaster> {
        const existingSelloutProductMaster = await this.selloutProductMasterRepository.findById(id);
        if (!existingSelloutProductMaster) {
            throw new Error(`Maestros de productos con ID ${id} no encontrado`);
        }

        const distributor = cleanString(selloutProductMaster.distributor ?? '');
        const productDistributor = cleanString(selloutProductMaster.productDistributor ?? '');
        const productStore = cleanString(selloutProductMaster.productStore ?? '');
        const searchProductKey = distributor + productStore + productDistributor;
        selloutProductMaster.searchProductStore = searchProductKey;

        const saved = await this.selloutProductMasterRepository.update(id, selloutProductMaster);
        return saved;
    }

    async updateSelloutProductMastersBatch(
        updates: UpdateSelloutProductMasterDto[]
    ): Promise<SelloutProductMaster[]> {

        return this.selloutProductMasterRepository.dataSource.transaction(async (manager) => {
            const responses: SelloutProductMaster[] = [];

            for (const dto of updates) {
                const distributor = cleanString(dto.distributor ?? '');
                const productDistributor = cleanString(dto.productDistributor ?? '');
                const productStore = cleanString(dto.productStore ?? '');
                const searchProductKey = distributor + productStore + productDistributor;
                dto.searchProductStore = searchProductKey;

                const entity = await this.selloutProductMasterRepository.findBySearchProductStoreOnly(dto.searchProductStore);
                if (!entity) throw new Error(`No existe producto con id ${dto.searchProductStore}`);

                if (dto.searchProductStore !== undefined) entity.searchProductStore = dto.searchProductStore;
                if (dto.distributor !== undefined) entity.distributor = dto.distributor;
                if (dto.productDistributor !== undefined) entity.productDistributor = dto.productDistributor;
                if (dto.productStore !== undefined) entity.productStore = dto.productStore;
                if (dto.codeProductSic !== undefined) entity.codeProductSic = dto.codeProductSic;

                const saved = await this.selloutProductMasterRepository.update(entity.id, entity);
                await this.syncConsolidatedDataStoresOnUpdateProduct([saved]);

                responses.push(
                    plainToClass(SelloutProductMaster, saved, { excludeExtraneousValues: true })
                );
            }

            return responses;
        });

    }

    async syncConsolidatedDataStoresOnUpdateProduct(data: SelloutProductMaster[]): Promise<void> {
        const batchSize = 50;

        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);

            await Promise.allSettled(
                batch.map(async (storeMaster) => {
                    try {
                        const { searchProductStore, codeProductSic } = storeMaster;

                        if (!searchProductStore || !codeProductSic) {
                            throw new Error('Datos incompletos para storeMaster');
                        }

                        const consolidatedRecords = await this.consolidatedDataStoresRepository.findBySearchProduct(searchProductStore);

                        if (consolidatedRecords.length === 0) {
                            throw new Error('No se encontraron registros que coincidan con el searchStore');
                        }
                        for (const record of consolidatedRecords) {
                            record.codeProduct = codeProductSic;
                        }

                        await this.consolidatedDataStoresRepository.save(consolidatedRecords);

                    } catch (error) {
                        console.error(error);
                    }
                })
            );
        }
    }

    async getModelProductSicByProductSic(productSic: string): Promise<ModelProductSic | null> {
        return await this.selloutProductSicRepository.getModelProductSicByProductSic(productSic);
    }

    async deleteSelloutProductMaster(id: number): Promise<void> {
        const existingSelloutProductMaster = await this.selloutProductMasterRepository.findById(id);
        if (!existingSelloutProductMaster) {
            throw new Error(`Maestros de productos con ID ${id} no encontrado`);
        }

        await this.selloutProductMasterRepository.delete(id);
    }

    async getFilteredProductsMaster(
        page: number,
        limit: number,
        search?: string
    ): Promise<SelloutProductMasterFiltersResponseDto> {
        const { items, total } = await this.selloutProductMasterRepository.findByFilters(page, limit, search);

        return {
            items: plainToInstance(SelloutProductMasterDto, items, {
                excludeExtraneousValues: true,
            }),
            total,
        };
    }

}
