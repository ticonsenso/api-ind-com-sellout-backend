import { plainToClass, plainToInstance } from 'class-transformer';
import { Brackets, DataSource } from 'typeorm';
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
import { chunkArray, cleanString, generateSearchProductKey, generateSearchStoreKey } from '../utils/utils';
import { ProductSicRepository } from '../repository/product.sic.repository';
import { StoresSicRepository } from '../repository/stores.repository';
import { StoresSic } from '../models/stores.sic.model';
import { ConsolidatedDataStoresRepository } from '../repository/consolidated.data.stores.repository';
import { ConsolidatedDataStoresService } from './consolidated.data.stores.service';
import { ConsolidatedDataStores } from '../models/consolidated.data.stores.model';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SelectQueryBuilder } from 'typeorm';

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

    private normalizePeriodo(periodo: any): string {
        if (!periodo) {
            throw new Error("El campo 'periodo' es obligatorio y no puede estar vacío.");
        }
        const d = new Date(periodo);
        if (isNaN(d.getTime())) {
            throw new Error(`El valor proporcionado no es una fecha válida para el campo 'periodo'.`);
        }
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async createSelloutStoreMaster(createSelloutStoreMasterDtos: CreateSelloutStoreMasterDto[]): Promise<{ insert: number; update: number; errors: string; duplicates: any[] }> {
        let insert = 0;
        let update = 0;
        let errors = '';
        const duplicates: any[] = [];

        if (!createSelloutStoreMasterDtos || createSelloutStoreMasterDtos.length === 0) {
            return { insert, update, errors: 'No se enviaron datos para procesar\n', duplicates: [] };
        }

        // Normalizar periodos en los DTOs para evitar desfases de zona horaria o formato
        for (const dto of createSelloutStoreMasterDtos) {
            dto.periodo = this.normalizePeriodo(dto.periodo) as any;
        }

        const uniquePeriods = [...new Set(createSelloutStoreMasterDtos.map(d => d.periodo?.toString()).filter(Boolean))];

        return this.selloutStoreMasterRepository.dataSource.transaction(async (manager) => {
            // "Al insertar elimine": Borramos TODOS los registros de los periodos seleccionados antes de insertar
            for (const p of uniquePeriods) {
                await manager.createQueryBuilder()
                    .delete()
                    .from(SelloutStoreMaster)
                    .where('periodo = :periodo', { periodo: p })
                    .execute();
            }

            const storesToInsert: any[] = [];
            const processedKeysInBatch = new Set<string>();

            for (const dto of createSelloutStoreMasterDtos) {
                const searchStoreKey = generateSearchStoreKey(
                    dto.distributor ?? '',
                    dto.storeDistributor ?? ''
                );
                dto.searchStore = searchStoreKey;

                const periodoKey = dto.periodo ? dto.periodo.toString() : 'no-p';
                const batchKey = `${searchStoreKey}-${periodoKey}`;

                if (processedKeysInBatch.has(batchKey)) {
                    duplicates.push({ ...dto, reason: 'Duplicate search key for this period in payload' });
                    continue;
                }
                processedKeysInBatch.add(batchKey);

                storesToInsert.push({
                    distributor: dto.distributor,
                    storeDistributor: dto.storeDistributor,
                    searchStore: dto.searchStore,
                    codeStoreSic: dto.codeStoreSic,
                    status: dto.status ?? true,
                    periodo: dto.periodo
                });
                insert++;
            }

            if (storesToInsert.length > 0) {
                const chunks = chunkArray(storesToInsert, 500);
                for (const chunk of chunks) {
                    await manager.createQueryBuilder()
                        .insert()
                        .into(SelloutStoreMaster)
                        .values(chunk)
                        .execute();
                }
            }

            return { insert, update, errors, duplicates };
        });
    }

    async createSelloutProductMaster(createSelloutProductMasterDtos: CreateSelloutProductMasterDto[]): Promise<{ insert: number; update: number; errors: string; duplicates: any[] }> {
        let insert = 0;
        let update = 0;
        let errors = '';
        const duplicates: any[] = [];

        if (!createSelloutProductMasterDtos || createSelloutProductMasterDtos.length === 0) {
            return { insert, update, errors: 'No se enviaron datos para procesar\n', duplicates: [] };
        }

        // Normalizar periodos en los DTOs
        for (const dto of createSelloutProductMasterDtos) {
            dto.periodo = this.normalizePeriodo(dto.periodo) as any;
        }

        const uniquePeriods = [...new Set(createSelloutProductMasterDtos.map(d => d.periodo?.toString()).filter(Boolean))];

        return this.selloutProductMasterRepository.dataSource.transaction(async (manager) => {
            // "Al insertar elimine": Borramos TODO por periodo antes de insertar
            for (const p of uniquePeriods) {
                await manager.createQueryBuilder()
                    .delete()
                    .from(SelloutProductMaster)
                    .where('periodo = :periodo', { periodo: p })
                    .execute();
            }

            const productsToInsert: any[] = [];
            const processedKeysInBatch = new Set<string>();

            for (const dto of createSelloutProductMasterDtos) {
                const searchProductKey = generateSearchProductKey(
                    dto.distributor ?? '',
                    dto.productStore ?? '',
                    dto.productDistributor ?? ''
                );
                dto.searchProductStore = searchProductKey;

                const periodoKey = dto.periodo ? dto.periodo.toString() : 'no-p';
                const batchKey = `${searchProductKey}-${periodoKey}`;

                if (processedKeysInBatch.has(batchKey)) {
                    duplicates.push({ ...dto, reason: 'Duplicate search key for this period in payload' });
                    continue;
                }
                processedKeysInBatch.add(batchKey);

                productsToInsert.push({
                    distributor: dto.distributor,
                    productDistributor: dto.productDistributor,
                    productStore: dto.productStore,
                    searchProductStore: dto.searchProductStore,
                    codeProductSic: dto.codeProductSic,
                    status: dto.status ?? true,
                    periodo: dto.periodo
                });
                insert++;
            }

            if (productsToInsert.length > 0) {
                const chunks = chunkArray(productsToInsert, 500);
                for (const chunk of chunks) {
                    await manager.createQueryBuilder()
                        .insert()
                        .into(SelloutProductMaster)
                        .values(chunk)
                        .execute();
                }
            }

            return { insert, update, errors, duplicates };
        });
    }

    async updateSelloutProductMaster(id: number, updateSelloutProductMasterDto: UpdateSelloutProductMasterDto): Promise<SelloutProductMaster> {
        const product = await this.selloutProductMasterRepository.findById(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        if (updateSelloutProductMasterDto.distributor || updateSelloutProductMasterDto.productDistributor || updateSelloutProductMasterDto.productStore) {
            updateSelloutProductMasterDto.searchProductStore = generateSearchProductKey(
                updateSelloutProductMasterDto.distributor ?? product.distributor ?? '',
                updateSelloutProductMasterDto.productStore ?? product.productStore ?? '',
                updateSelloutProductMasterDto.productDistributor ?? product.productDistributor ?? ''
            );
        }

        const updatedProduct = plainToInstance(SelloutProductMaster, { ...product, ...updateSelloutProductMasterDto });
        await this.selloutProductMasterRepository.save([updatedProduct]);
        await this.syncConsolidatedDataStoresOnUpdateProduct([updatedProduct]);
        return updatedProduct;
    }

    async createSelloutProductMastersBatch(createSelloutProductMastersDto: CreateSelloutProductMasterDto[]): Promise<{ insert: number; update: number; errors: string; duplicates: any[] }> {
        let insert = 0;
        let update = 0;
        let errors = '';
        const duplicates: any[] = [];

        if (!createSelloutProductMastersDto || createSelloutProductMastersDto.length === 0) {
            return { insert, update, errors: 'No llegaron registros para procesar\n', duplicates: [] };
        }

        // Normalizar periodos en los DTOs
        for (const dto of createSelloutProductMastersDto) {
            dto.periodo = this.normalizePeriodo(dto.periodo) as any;
        }

        const uniquePeriods = [...new Set(createSelloutProductMastersDto.map(d => d.periodo?.toString()).filter(Boolean))];

        return this.selloutProductMasterRepository.dataSource.transaction(async (manager) => {
            // "Al insertar elimine": Borramos TODO antes de insertar
            for (const p of uniquePeriods) {
                await manager.createQueryBuilder()
                    .delete()
                    .from(SelloutProductMaster)
                    .where('periodo = :periodo', { periodo: p })
                    .execute();
            }

            const productsToInsert: any[] = [];
            const processedKeysInBatch = new Set<string>();

            for (const dto of createSelloutProductMastersDto) {
                const searchProductKey = generateSearchProductKey(
                    dto.distributor ?? '',
                    dto.productStore ?? '',
                    dto.productDistributor ?? ''
                );
                dto.searchProductStore = searchProductKey;

                const periodoKey = dto.periodo ? dto.periodo.toString() : 'no-p';
                const batchKey = `${searchProductKey}-${periodoKey}`;

                if (processedKeysInBatch.has(batchKey)) {
                    duplicates.push({ ...dto, reason: 'Duplicate search key for this period in payload' });
                    continue;
                }
                processedKeysInBatch.add(batchKey);

                productsToInsert.push({
                    distributor: dto.distributor,
                    productDistributor: dto.productDistributor,
                    productStore: dto.productStore,
                    searchProductStore: dto.searchProductStore,
                    codeProductSic: dto.codeProductSic,
                    status: dto.status ?? true,
                    ...(dto.periodo ? { periodo: dto.periodo } : {})
                });
                insert++;
            }

            if (productsToInsert.length > 0) {
                const chunks = chunkArray(productsToInsert, 500);
                for (const chunk of chunks) {
                    await manager.createQueryBuilder()
                        .insert()
                        .into(SelloutProductMaster)
                        .values(chunk)
                        .execute();
                }
            }

            return { insert, update, errors, duplicates };
        });
    }


    async syncAndCleanupByPeriodProduct(
        currentActiveStores: CreateSelloutProductMasterDto[],
        periodoActivo: string
    ): Promise<void> {
        const activeKeys = currentActiveStores.map(store => {
            return store.searchProductStore || generateSearchProductKey(
                store.distributor ?? '',
                store.productStore ?? '',
                store.productDistributor ?? ''
            );
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



    async createSelloutStoreMastersBatch(configs: CreateSelloutStoreMasterDto[]): Promise<{ insert: number; update: number; errors: string; duplicates: any[] }> {
        let insert = 0;
        let update = 0;
        let errors = '';
        const duplicates: any[] = [];

        if (!configs || configs.length === 0) {
            return { insert, update, errors: 'No llegaron registros para procesar\n', duplicates: [] };
        }

        // Normalizar periodos en los DTOs
        for (const dto of configs) {
            dto.periodo = this.normalizePeriodo(dto.periodo) as any;
        }

        const uniquePeriods = [...new Set(configs.map(d => d.periodo?.toString()).filter(Boolean))];

        return this.selloutStoreMasterRepository.dataSource.transaction(async (manager) => {
            // "Al insertar elimine": Borramos TODO antes de insertar
            for (const p of uniquePeriods) {
                await manager.createQueryBuilder()
                    .delete()
                    .from(SelloutStoreMaster)
                    .where('periodo = :periodo', { periodo: p })
                    .execute();
            }

            const processedKeysInBatch = new Set<string>();
            const storesToInsert: any[] = [];

            for (const config of configs) {
                const searchStoreKey = generateSearchStoreKey(
                    config.distributor ?? '',
                    config.storeDistributor ?? ''
                );
                config.searchStore = searchStoreKey;

                const periodoKey = config.periodo ? config.periodo.toString() : 'no-p';
                const batchKey = `${searchStoreKey}-${periodoKey}`;

                if (processedKeysInBatch.has(batchKey)) {
                    duplicates.push({ ...config, reason: 'Duplicate search key for this period in payload' });
                    continue;
                }
                processedKeysInBatch.add(batchKey);

                storesToInsert.push({
                    distributor: config.distributor,
                    storeDistributor: config.storeDistributor,
                    searchStore: config.searchStore,
                    codeStoreSic: config.codeStoreSic,
                    status: config.status ?? true,
                    periodo: config.periodo
                });
                insert++;
            }

            if (storesToInsert.length > 0) {
                const chunks = chunkArray(storesToInsert, 500);
                for (const chunk of chunks) {
                    await manager.createQueryBuilder()
                        .insert()
                        .into(SelloutStoreMaster)
                        .values(chunk)
                        .execute();
                }
            }

            return { insert, update, errors, duplicates };
        });
    }



    async syncAndCleanupByPeriodStore(
        currentActiveStores: CreateSelloutStoreMasterDto[],
        periodoActivo: string
    ): Promise<void> {
        const activeKeys = currentActiveStores.map(store => {
            return store.searchStore || generateSearchStoreKey(
                store.distributor ?? '',
                store.storeDistributor ?? ''
            );
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
                const searchKey = generateSearchStoreKey(
                    store.distributor ?? '',
                    store.code_store_distributor ?? ''
                );
                const storeMaster = await this.selloutStoreMasterRepository.findBySearchStoreOnly(searchKey);

                if (storeMaster?.codeStoreSic) {
                    const storeSic = await this.storesRepository.findByStoreCodeOnly(storeMaster.codeStoreSic.toString());

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
                const searchKey = generateSearchProductKey(
                    product.distributor ?? '',
                    product.description_distributor ?? '',
                    product.code_product_distributor ?? ''
                );
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
                const searchStoreKey = generateSearchStoreKey(
                    dto.distributor ?? '',
                    dto.storeDistributor ?? ''
                );
                dto.searchStore = searchStoreKey;

                const entity = await this.selloutStoreMasterRepository.findBySearchStoreOnlyManager(dto.searchStore, manager);
                if (!entity) throw new Error(`No existe tienda con busqueda ${dto.searchStore}`);

                if (dto.searchStore !== undefined) entity.searchStore = dto.searchStore;
                if (dto.distributor !== undefined) entity.distributor = dto.distributor;
                if (dto.storeDistributor !== undefined) entity.storeDistributor = dto.storeDistributor;
                if (dto.codeStoreSic !== undefined) entity.codeStoreSic = dto.codeStoreSic;

                const saved = await manager.save(SelloutStoreMaster, entity);
                await this.syncConsolidatedDataStoresOnUpdateStores([saved]);

                responses.push(
                    plainToClass(SelloutStoreMasterDto, saved, { excludeExtraneousValues: true })
                );
            }

            return responses;
        });
    }

    async syncConsolidatedDataStoresOnUpdateStores(data: SelloutStoreMaster[]): Promise<void> {
        if (!data || data.length === 0) return;

        // Agrupamos por codeStoreSic para hacer menos queries a la base de datos
        const grouped = data.reduce((acc, curr) => {
            const code = curr.codeStoreSic?.toString();
            if (code && curr.searchStore) {
                if (!acc[code]) acc[code] = [];
                acc[code].push(curr.searchStore);
            }
            return acc;
        }, {} as Record<string, string[]>);

        for (const [code, keys] of Object.entries(grouped)) {
            // Actualización masiva de todos los registros que coincidan con estas llaves
            await this.consolidatedDataStoresRepository.repository.createQueryBuilder()
                .update(ConsolidatedDataStores)
                .set({
                    codeStore: code,
                    updatedAt: new Date()
                })
                .where(`
                    REPLACE(distributor, ' ', '') || 
                    REPLACE(code_store_distributor, ' ', '') IN (:...keys)
                `, { keys })
                .andWhere(new Brackets((qb: any) => {
                    qb.where("code_store IS NULL OR code_store = ''")
                        .orWhere("store_name IS NULL OR store_name = ''");
                }))
                .execute();
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
                selloutStoreMaster.searchStore = generateSearchStoreKey(
                    selloutStoreMaster.distributor ?? '',
                    selloutStoreMaster.storeDistributor ?? ''
                );
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
                selloutProductMaster.searchProductStore = generateSearchProductKey(
                    selloutProductMaster.distributor ?? '',
                    selloutProductMaster.productStore ?? '',
                    selloutProductMaster.productDistributor ?? ''
                );
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
                const searchProductKey = generateSearchProductKey(
                    dto.distributor ?? '',
                    dto.productStore ?? '',
                    dto.productDistributor ?? ''
                );
                dto.searchProductStore = searchProductKey;

                const entity = await this.selloutProductMasterRepository.findBySearchProductStoreOnlyManager(dto.searchProductStore, manager);
                if (!entity) throw new Error(`No existe producto con id ${dto.searchProductStore}`);

                if (dto.searchProductStore !== undefined) entity.searchProductStore = dto.searchProductStore;
                if (dto.distributor !== undefined) entity.distributor = dto.distributor;
                if (dto.productDistributor !== undefined) entity.productDistributor = dto.productDistributor;
                if (dto.productStore !== undefined) entity.productStore = dto.productStore;
                if (dto.codeProductSic !== undefined) entity.codeProductSic = dto.codeProductSic;

                const saved = await manager.save(SelloutProductMaster, entity);
                await this.syncConsolidatedDataStoresOnUpdateProduct([saved]);

                responses.push(
                    plainToClass(SelloutProductMaster, saved, { excludeExtraneousValues: true })
                );
            }

            return responses;
        });
    }

    async syncConsolidatedDataStoresOnUpdateProduct(data: SelloutProductMaster[]): Promise<void> {
        if (!data || data.length === 0) return;

        // Agrupamos por codeProductSic para optimizar el proceso en la base de datos
        const grouped = data.reduce((acc, curr) => {
            const code = curr.codeProductSic?.toString();
            if (code && curr.searchProductStore) {
                if (!acc[code]) acc[code] = [];
                acc[code].push(curr.searchProductStore);
            }
            return acc;
        }, {} as Record<string, string[]>);

        for (const [code, keys] of Object.entries(grouped)) {
            // Actualización masiva por cada código SIC único
            await this.consolidatedDataStoresRepository.repository.createQueryBuilder()
                .update(ConsolidatedDataStores)
                .set({
                    codeProduct: code,
                    updatedAt: new Date()
                })
                .where(`
                    REPLACE(distributor, ' ', '') || 
                    REPLACE(code_product_distributor, ' ', '') || 
                    REPLACE(description_distributor, ' ', '') IN (:...keys)
                `, { keys })
                .andWhere(new Brackets((qb: any) => {
                    qb.where("code_product IS NULL OR code_product = ''")
                        .orWhere("product_model IS NULL OR product_model = ''");
                }))
                .execute();
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
