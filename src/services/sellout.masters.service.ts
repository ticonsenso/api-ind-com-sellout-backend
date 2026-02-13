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

    async createSelloutStoreMaster(createSelloutStoreMasterDto: CreateSelloutStoreMasterDto): Promise<SelloutStoreMaster> {
        const { searchStore, periodo } = createSelloutStoreMasterDto;

        let existingStore: SelloutStoreMaster | null = null;
        if (searchStore && periodo) {
            existingStore = await this.selloutStoreMasterRepository.findBySearchStoreAndPeriodo(searchStore, periodo);
        } else if (searchStore) {
            existingStore = await this.selloutStoreMasterRepository.findBySearchStoreOnly(searchStore);
        }

        if (existingStore) {
            existingStore.codeStoreSic = createSelloutStoreMasterDto.codeStoreSic!;
            existingStore.distributor = createSelloutStoreMasterDto.distributor;
            existingStore.storeDistributor = createSelloutStoreMasterDto.storeDistributor;
            existingStore.status = createSelloutStoreMasterDto.status;

            await this.selloutStoreMasterRepository.save([existingStore]);
            await this.syncConsolidatedDataStoresOnUpdateStores([existingStore]);
            return existingStore;
        }

        const newStore = plainToInstance(SelloutStoreMaster, createSelloutStoreMasterDto);
        if (!newStore.searchStore) {
            const distributor = cleanString(newStore.distributor ?? '');
            const storeDistributor = cleanString(newStore.storeDistributor ?? '');
            newStore.searchStore = distributor + storeDistributor;
        }

        await this.selloutStoreMasterRepository.save([newStore]);
        await this.syncConsolidatedDataStoresOnUpdateStores([newStore]);
        return newStore;
    }

    async createSelloutProductMaster(createSelloutProductMasterDto: CreateSelloutProductMasterDto): Promise<SelloutProductMaster> {
        const { searchProductStore, periodo } = createSelloutProductMasterDto;

        let existingProduct: SelloutProductMaster | null = null;
        if (searchProductStore && periodo) {
            existingProduct = await this.selloutProductMasterRepository.findBySearchProductStoreAndPeriodo(searchProductStore, periodo);
        } else if (searchProductStore) {
            existingProduct = await this.selloutProductMasterRepository.findBySearchProductStoreOnly(searchProductStore);
        }

        if (existingProduct) {
            existingProduct.codeProductSic = createSelloutProductMasterDto.codeProductSic!;
            existingProduct.distributor = createSelloutProductMasterDto.distributor;
            existingProduct.productDistributor = createSelloutProductMasterDto.productDistributor;
            existingProduct.productStore = createSelloutProductMasterDto.productStore;
            existingProduct.status = createSelloutProductMasterDto.status;

            await this.selloutProductMasterRepository.save([existingProduct]);
            await this.syncConsolidatedDataStoresOnUpdateProduct([existingProduct]);
            return existingProduct;
        }

        const newProduct = plainToInstance(SelloutProductMaster, createSelloutProductMasterDto);
        if (!newProduct.searchProductStore) {
            newProduct.searchProductStore = cleanString(newProduct.distributor ?? '') + cleanString(newProduct.productDistributor ?? '') + cleanString(newProduct.productStore ?? '');
        }
        await this.selloutProductMasterRepository.save([newProduct]);
        await this.syncConsolidatedDataStoresOnUpdateProduct([newProduct]);
        return newProduct;
    }

    async updateSelloutProductMaster(id: number, updateSelloutProductMasterDto: UpdateSelloutProductMasterDto): Promise<SelloutProductMaster> {
        const product = await this.selloutProductMasterRepository.findById(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        if (updateSelloutProductMasterDto.distributor || updateSelloutProductMasterDto.productDistributor || updateSelloutProductMasterDto.productStore) {
            const distributor = cleanString(updateSelloutProductMasterDto.distributor ?? product.distributor ?? '');
            const productDistributor = cleanString(updateSelloutProductMasterDto.productDistributor ?? product.productDistributor ?? '');
            const productStore = cleanString(updateSelloutProductMasterDto.productStore ?? product.productStore ?? '');
            updateSelloutProductMasterDto.searchProductStore = distributor + productStore + productDistributor;
        }

        const updatedProduct = plainToInstance(SelloutProductMaster, { ...product, ...updateSelloutProductMasterDto });
        await this.selloutProductMasterRepository.save([updatedProduct]);
        await this.syncConsolidatedDataStoresOnUpdateProduct([updatedProduct]);
        return updatedProduct;
    }

    async createSelloutProductMastersBatch(createSelloutProductMastersDto: CreateSelloutProductMasterDto[]): Promise<{ insert: number; update: number; errors: string }> {
        const productsToUpdate: SelloutProductMaster[] = [];
        const productsToCreate: CreateSelloutProductMasterDto[] = [];
        let insert = 0;
        let update = 0;
        let errors = '';
        const periodoActivo = createSelloutProductMastersDto[0].periodo;
        for (const dto of createSelloutProductMastersDto) {
            try {
                let existing: SelloutProductMaster | null = null;

                if (!dto.searchProductStore) {
                    const distributor = cleanString(dto.distributor ?? '');
                    const productDistributor = cleanString(dto.productDistributor ?? '');
                    const productStore = cleanString(dto.productStore ?? '');
                    dto.searchProductStore = (distributor + productStore + productDistributor).replace(/\s/g, '').toUpperCase();
                }

                if (dto.searchProductStore && dto.periodo) {
                    existing = await this.selloutProductMasterRepository.findBySearchProductStoreAndPeriodo(dto.searchProductStore, dto.periodo);
                } else if (dto.searchProductStore) {
                    existing = await this.selloutProductMasterRepository.findBySearchProductStoreOnly(dto.searchProductStore);
                }

                if (existing) {
                    existing.codeProductSic = dto.codeProductSic!;
                    existing.distributor = dto.distributor;
                    existing.productDistributor = dto.productDistributor;
                    existing.productStore = dto.productStore;
                    existing.status = dto.status;
                    productsToUpdate.push(existing);
                    update++;
                } else {
                    productsToCreate.push(dto);
                    insert++;
                }
            } catch (error) {
                errors += `Error processing ${dto.searchProductStore}: ${error}\n`;
            }
        }
        console.log('productsToUpdate', productsToUpdate.length);
        console.log('productsToCreate', productsToCreate.length);
        if (productsToUpdate.length > 0) {
            await this.selloutProductMasterRepository.save(productsToUpdate);
        }
        if (productsToCreate.length > 0) {
            await this.selloutProductMasterRepository.save(productsToCreate);
        }
        await this.syncAndCleanupByPeriodProduct(createSelloutProductMastersDto, periodoActivo!);
        return { insert, update, errors };
    }

    async syncAndCleanupByPeriodProduct(
        currentActiveStores: CreateSelloutProductMasterDto[],
        periodoActivo: string
    ): Promise<void> {
        const activeKeys = currentActiveStores.map(store => {
            const distributor = cleanString(store.distributor ?? '');
            const productDistributor = cleanString(store.productDistributor ?? '');
            const productStore = cleanString(store.productStore ?? '');
            return (distributor + productStore + productDistributor).replace(/\s/g, '').toUpperCase();
        });
        console.log('activeKeys', activeKeys);
        if (activeKeys.length > 0) {
            await this.selloutProductMasterRepository.deleteByPeriod(periodoActivo, activeKeys);
        }
    }

    async updateSelloutStoreMaster(id: number, updateSelloutStoreMasterDto: UpdateSelloutStoreMasterDto): Promise<SelloutStoreMaster> {
        const store = await this.selloutStoreMasterRepository.findById(id);
        if (!store) {
            throw new Error('Almacen no encontrado');
        }
        const updatedStore = plainToInstance(SelloutStoreMaster, { ...store, ...updateSelloutStoreMasterDto });
        await this.selloutStoreMasterRepository.save([updatedStore]);
        return updatedStore;
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
        const periodoActivo = configs[0].periodo;
        await this.syncAndCleanupByPeriodStore(configs, periodoActivo!);
        return { insert, update, errors };
    }


    async syncAndCleanupByPeriodStore(
        currentActiveStores: CreateSelloutStoreMasterDto[],
        periodoActivo: string
    ): Promise<void> {
        const activeKeys = currentActiveStores.map(store => {
            return store.searchStore || (cleanString(store.distributor ?? '') + cleanString(store.storeDistributor ?? ''));
        });
        if (activeKeys.length > 0) {
            await this.selloutStoreMasterRepository.deleteByPeriod(periodoActivo, activeKeys);
        } else {
            await this.selloutStoreMasterRepository.deleteByPeriod(periodoActivo, []);
        }
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
                    const storeSic = await this.storesRepository.findByStoreCodeOnly(storeMaster.codeStoreSic);

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
                            console.log('❌ No se encontraron registros que coincidan con el searchStore', searchStore);
                        }

                        const storeSic = await this.selloutStoreRepository.getDistribuidorAndStoreNameByStoreSic(codeStoreSic);
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

    async getDistribuidorAndStoreNameByStoreSic(storeSic: string): Promise<StoresSic | null> {
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
        search?: string,
        periodo?: string
    ): Promise<SelloutStoreMasterFiltersResponseDto> {
        const { items, total } = await this.selloutStoreMasterRepository.findByFilters(page, limit, search, periodo);
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





    async createSelloutStoreMasterExcel(selloutStoreMaster: CreateSelloutStoreMasterDto): Promise<SelloutStoreMaster | undefined> {
        try {
            if (!selloutStoreMaster.searchStore) {
                const distributor = cleanString(selloutStoreMaster.distributor ?? '');
                const storeDistributor = cleanString(selloutStoreMaster.storeDistributor ?? '');
                selloutStoreMaster.searchStore = distributor + storeDistributor;
            }

            let existing: SelloutStoreMaster | null = null;
            if (selloutStoreMaster.periodo) {
                existing = await this.selloutStoreMasterRepository.findBySearchStoreAndPeriodo(selloutStoreMaster.searchStore, selloutStoreMaster.periodo);
            } else {
                existing = await this.selloutStoreMasterRepository.findBySearchStoreOnly(selloutStoreMaster.searchStore);
            }

            if (existing) {
                // Si existe, actualizamos usando la lógica de "upsert" que ya tenemos, o simplemente update
                // Para Excel, la lógica anterior era actualizar si existe.
                const updated = plainToInstance(SelloutStoreMaster, { ...existing, ...selloutStoreMaster });
                // Aseguramos que el ID se mantenga
                updated.id = existing.id;
                return await this.selloutStoreMasterRepository.save([updated]).then(res => res[0]);
            } else {
                return await this.selloutStoreMasterRepository.create(selloutStoreMaster);
            }
        } catch (error: any) {
            return undefined;
        }
    }

    async createSelloutProductMasterExcel(selloutProductMaster: CreateSelloutProductMasterDto): Promise<SelloutProductMaster | undefined> {
        try {
            if (!selloutProductMaster.searchProductStore) {
                const distributor = cleanString(selloutProductMaster.distributor ?? '');
                const productDistributor = cleanString(selloutProductMaster.productDistributor ?? '');
                const productStore = cleanString(selloutProductMaster.productStore ?? '');
                selloutProductMaster.searchProductStore = distributor + productStore + productDistributor;
            }

            let existing: SelloutProductMaster | null = null;
            if (selloutProductMaster.periodo) {
                existing = await this.selloutProductMasterRepository.findBySearchProductStoreAndPeriodo(selloutProductMaster.searchProductStore, selloutProductMaster.periodo);
            } else {
                existing = await this.selloutProductMasterRepository.findBySearchProductStoreOnly(selloutProductMaster.searchProductStore);
            }

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
        search?: string,
        periodo?: string
    ): Promise<SelloutProductMasterFiltersResponseDto> {
        const { items, total } = await this.selloutProductMasterRepository.findByFilters(page, limit, search, periodo);

        return {
            items: plainToInstance(SelloutProductMasterDto, items, {
                excludeExtraneousValues: true,
            }),
            total,
        };
    }

}
