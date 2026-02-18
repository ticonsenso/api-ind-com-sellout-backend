import { plainToClass, plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';

import { ConsolidatedDataStoresRepository } from '../repository/consolidated.data.stores.repository';
import {
    ConsolidatedDataStoresDto,
    ConsolidatedDataStoresFiltersResponseDto,
    CreateConsolidatedDataStoresDto,
    NullFieldFilters,
    UpdateConsolidatedDataStoresDto,
    UpdateConsolidatedDto
} from '../dtos/consolidated.data.stores.dto';
import { ConsolidatedDataStores } from '../models/consolidated.data.stores.model';
import { SelloutProductMasterRepository } from '../repository/sellout.product.master.repository';
import { SelloutStoreMasterRepository } from '../repository/sellout.store.master.repository';
import { ProductSicRepository } from '../repository/product.sic.repository';
import { StoresSicRepository } from '../repository/stores.repository';
import { chunkArray, cleanString } from '../utils/utils';
import { CreateSelloutProductMasterDto } from '../dtos/sellout.product.master.dto';
import { CreateSelloutStoreMasterDto } from '../dtos/sellout.store.master.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { on } from 'events';

export class ConsolidatedDataStoresService {
    private consolidatedDataStoresRepository: ConsolidatedDataStoresRepository;
    private productStoreRepository: SelloutProductMasterRepository;
    private selloutStoreMasterRepository: SelloutStoreMasterRepository;
    private productSicRepository: ProductSicRepository;
    private storesRepository: StoresSicRepository;

    constructor(dataSource: DataSource) {
        this.consolidatedDataStoresRepository = new ConsolidatedDataStoresRepository(dataSource);
        this.productStoreRepository = new SelloutProductMasterRepository(dataSource);
        this.selloutStoreMasterRepository = new SelloutStoreMasterRepository(dataSource);
        this.productSicRepository = new ProductSicRepository(dataSource);
        this.storesRepository = new StoresSicRepository(dataSource);
    }

    async createConsolidatedDataStores(consolidatedDataStores: CreateConsolidatedDataStoresDto): Promise<ConsolidatedDataStores> {
        const distributor = cleanString(consolidatedDataStores.distributor ?? '');
        const codeProductDistributor = cleanString(consolidatedDataStores.codeProductDistributor ?? '');
        const codeStoreDistributor = cleanString(consolidatedDataStores.codeStoreDistributor ?? '');
        const descriptionDistributor = cleanString(consolidatedDataStores.descriptionDistributor ?? '');

        const searchProductKey = distributor + codeProductDistributor + descriptionDistributor;
        const searchStoreKey = distributor + codeStoreDistributor;

        const [codeProduct, codeStore] = await Promise.all([
            this.productStoreRepository.findBySearchProductStoreOnly(searchProductKey),
            this.selloutStoreMasterRepository.findBySearchStoreOnly(searchStoreKey),
        ]);

        const [storeSic, productSic] = await Promise.all([
            codeStore?.codeStoreSic
                ? this.storesRepository.findByStoreCodeOnly(codeStore.codeStoreSic)
                : Promise.resolve(null),
            codeProduct?.codeProductSic
                ? this.productSicRepository.findByJdeCodeOnly(codeProduct.codeProductSic.toString())
                : Promise.resolve(null),
        ]);

        const commonData = {
            distributor: consolidatedDataStores.distributor,
            codeStoreDistributor: consolidatedDataStores.codeStoreDistributor,
            codeProductDistributor: consolidatedDataStores.codeProductDistributor,
            descriptionDistributor: consolidatedDataStores.descriptionDistributor,
            unitsSoldDistributor: consolidatedDataStores.unitsSoldDistributor,
            saleDate: consolidatedDataStores.saleDate?.split('T')[0],
            codeProduct: codeProduct?.codeProductSic ?? null,
            codeStore: codeStore?.codeStoreSic ?? null,
            authorizedDistributor: storeSic?.distribuidor ?? null,
            storeName: storeSic?.nombreAlmacen ?? null,
            productModel: productSic?.codigoJde ?? null,
            calculateDate: consolidatedDataStores.calculateDate?.split('T')[0],
            observation: consolidatedDataStores.observation,
        };

        return this.consolidatedDataStoresRepository.create(commonData);
    }

    async updateConsolidatedDataStores(id: number, consolidatedDataStores: UpdateConsolidatedDataStoresDto): Promise<ConsolidatedDataStores> {
        const existingConsolidatedDataStores = await this.consolidatedDataStoresRepository.findById(id);
        if (!existingConsolidatedDataStores) {
            throw new Error(`Consolidated data stores con ID ${id} no encontrado`);
        }

        const distributor = cleanString(existingConsolidatedDataStores.distributor ?? '');
        const codeProductDistributor = cleanString(existingConsolidatedDataStores.codeProductDistributor ?? '');
        const codeStoreDistributor = cleanString(existingConsolidatedDataStores.codeStoreDistributor ?? '');
        const descriptionDistributor = cleanString(existingConsolidatedDataStores.descriptionDistributor ?? '');

        const searchProductKey = distributor + codeProductDistributor + descriptionDistributor;
        const searchStoreKey = distributor + codeStoreDistributor;

        const [codeProduct, codeStore] = await Promise.all([
            this.productStoreRepository.findBySearchProductStoreOnly(searchProductKey),
            this.selloutStoreMasterRepository.findBySearchStoreOnly(searchStoreKey),
        ]);

        const [storeSic, productSic] = await Promise.all([
            codeStore?.codeStoreSic
                ? this.storesRepository.findByStoreCodeOnly(codeStore.codeStoreSic)
                : Promise.resolve(null),
            codeProduct?.codeProductSic
                ? this.productSicRepository.findByJdeCodeOnly(codeProduct.codeProductSic.toString())
                : Promise.resolve(null),
        ]);

        const commonData = {
            distributor: consolidatedDataStores.distributor,
            codeStoreDistributor: consolidatedDataStores.codeStoreDistributor,
            codeProductDistributor: consolidatedDataStores.codeProductDistributor,
            descriptionDistributor: consolidatedDataStores.descriptionDistributor,
            unitsSoldDistributor: consolidatedDataStores.unitsSoldDistributor,
            saleDate: consolidatedDataStores.saleDate,
            codeProduct: codeProduct?.codeProductSic ?? null,
            codeStore: codeStore?.codeStoreSic ?? null,
            authorizedDistributor: storeSic?.distribuidor ?? null,
            storeName: storeSic?.nombreAlmacen ?? null,
            productModel: productSic?.codigoJde ?? null,
            calculateDate: consolidatedDataStores.calculateDate,
            status: consolidatedDataStores.status,
            observation: consolidatedDataStores.observation,
        };

        return this.consolidatedDataStoresRepository.update(id, commonData);
    }

    async updateJustStatus(id: number, status: boolean): Promise<ConsolidatedDataStores> {
        const existingConsolidatedDataStores = await this.consolidatedDataStoresRepository.findById(id);
        if (!existingConsolidatedDataStores) {
            throw new Error(`Consolidated data stores con ID ${id} no encontrado`);
        }
        const commonData = {
            status: status,
        };

        return this.consolidatedDataStoresRepository.update(id, commonData);
    }

    async updateDuplicatedConsolidatedDataStores(
        dtoList: UpdateConsolidatedDto[]
    ): Promise<{ message: string; updated: number }> {
        let updatedCount = 0;
        const affectedIds: number[] = [];

        for (const dto of dtoList) {
            const duplicatedRecords = await this.getDuplicatedRecords(dto);
            if (!duplicatedRecords.length) continue;

            await this.ensureMasterEntitiesExist(dto);

            const updatePayload = await this.buildUpdatePayload(dto);

            for (const record of duplicatedRecords) {
                await this.consolidatedDataStoresRepository.update(record.id, updatePayload);
                updatedCount++;
                affectedIds.push(record.id);
            }
        }

        return { message: 'Datos actualizados correctamente', updated: updatedCount };
    }

    private async getDuplicatedRecords(dto: UpdateConsolidatedDto): Promise<ConsolidatedDataStores[]> {
        if (dto.descriptionDistributor && dto.codeProductDistributor) {
            return this.consolidatedDataStoresRepository.findByDistributorProductDuplicated(
                dto.distributor!,
                dto.codeProductDistributor!,
                dto.descriptionDistributor!
            );
        } else if (dto.codeStore) {
            return this.consolidatedDataStoresRepository.findByDistributorStoreDuplicated(
                dto.distributor!,
                dto.codeStoreDistributor!
            );
        }
        return [];
    }

    private async ensureMasterEntitiesExist(dto: UpdateConsolidatedDto): Promise<void> {
        const distributor = cleanString(dto.distributor ?? '');
        const codeProductDistributor = cleanString(dto.codeProductDistributor ?? '');
        const codeStoreDistributor = cleanString(dto.codeStoreDistributor ?? '');
        const descriptionDistributor = cleanString(dto.descriptionDistributor ?? '');

        const searchProductKey = distributor + codeProductDistributor + descriptionDistributor;
        const searchStoreKey = distributor + codeStoreDistributor;
        const [productMaster, storeMaster] = await Promise.all([
            this.productStoreRepository.findBySearchProductStoreOnly(searchProductKey),
            this.selloutStoreMasterRepository.findBySearchStoreOnly(searchStoreKey),
        ]);

        const isValid = (value: any) => value !== null && value !== undefined && value !== '';

        if (productMaster) {
            dto.codeProduct = productMaster.codeProductSic?.toString();
        } else if (isValid(dto.codeProduct)) {
            const productSic = await this.productSicRepository.findByJdeCodeOnly(dto.codeProduct!.toString());

            if (!productSic) {
                throw new Error('El producto no existe en productos SIC.');
            }

            const newProductMaster = plainToClass(CreateSelloutProductMasterDto, {
                distributor: dto.distributor,
                productDistributor: dto.codeProductDistributor,
                productStore: dto.descriptionDistributor,
                codeProductSic: dto.codeProduct!.toString(),
                searchProductStore: searchProductKey,
            });

            try {
                const created = await this.productStoreRepository.create(newProductMaster);
                dto.codeProduct = created.codeProductSic?.toString();
            } catch (error: any) {
                if (error.code === '23505' || error.message?.includes('unique_search_product_store')) {
                    throw new Error('Ya existe un registro con esos datos en maestros productos.');
                }
                throw error;
            }
        }

        if (storeMaster) {
            dto.codeStore = storeMaster.codeStoreSic?.toString();
        } else if (isValid(dto.codeStore)) {
            const storeSic = await this.storesRepository.findByStoreCodeOnly(dto.codeStore!.toString());

            if (!storeSic) {
                throw new Error('La tienda no existe en maestros ni en almacenes SIC.');
            }

            const newStoreMaster = plainToClass(CreateSelloutStoreMasterDto, {
                distributor: dto.distributor,
                storeDistributor: dto.codeStoreDistributor,
                codeStoreSic: dto.codeStore!.toString(),
                searchStore: searchStoreKey,
            });

            try {
                const created = await this.selloutStoreMasterRepository.create(newStoreMaster);
                dto.codeStore = created.codeStoreSic?.toString();
            } catch (error: any) {
                if (error.code === '23505' || error.message?.includes('duplicate_key')) {
                    throw new Error('Ya existe un registro con esos datos en la tabla de tiendas maestras.');
                }
                throw error;
            }
        }

    }



    private async buildUpdatePayload(dto: UpdateConsolidatedDto): Promise<Partial<ConsolidatedDataStores>> {
        const updatePayload: Partial<ConsolidatedDataStores> = {
            distributor: dto.distributor,
            codeStoreDistributor: dto.codeStoreDistributor,
            codeProductDistributor: dto.codeProductDistributor,
            descriptionDistributor: dto.descriptionDistributor,
        };

        const distributor = cleanString(dto.distributor);
        const codeProductDistributor = cleanString(dto.codeProductDistributor);
        const codeStoreDistributor = cleanString(dto.codeStoreDistributor);
        const descriptionDistributor = cleanString(dto.descriptionDistributor);

        const searchProductKey = distributor + codeProductDistributor + descriptionDistributor;
        const searchStoreKey = distributor + codeStoreDistributor;

        const [productMaster, storeMaster] = await Promise.all([
            this.productStoreRepository.findBySearchProductStoreOnly(searchProductKey),
            this.selloutStoreMasterRepository.findBySearchStoreOnly(searchStoreKey),
        ]);

        if (dto.codeProductDistributor && dto.descriptionDistributor) {
            updatePayload.codeProduct = productMaster?.codeProductSic;
        }

        if (dto.distributor && dto.codeStoreDistributor) {
            updatePayload.codeStore = storeMaster?.codeStoreSic;
        }

        if (updatePayload.codeProduct) {
            const productSic = await this.productSicRepository.findByJdeCodeOnly(updatePayload.codeProduct.toString());
            updatePayload.codeProduct = productSic?.codigoJde ?? null;
        }

        if (updatePayload.codeStore) {
            const storeSic = await this.storesRepository.findByStoreCodeOnly(updatePayload.codeStore.toString());
            updatePayload.codeStore = storeSic?.distribuidor ?? null;
        }

        return updatePayload;
    }

    async processConsolidatedDataStores(
        consolidatedDataStores: any,
        matriculationTemplateId: number,
        calculateDate: string,
    ): Promise<{
        startTime: Date;
        endTime: Date;
        status: string;
        recordsExtracted: number;
        recordsProcessed: number;
        recordsFailed: number;
        recordCountSaved: number;
        smsErrors: string[];
        smsErrorsBack?: string[];
        errorMessage?: string;
        executionDetails: {
            smsErrors: string[];
        };
    }> {
        const startTime = new Date();
        let recordCount = 0;
        let recordsFailed = 0;
        const smsErrors: string[] = [];
        const smsErrorsBack: string[] = [];

        try {
            for (const consolidatedDataStore of consolidatedDataStores) {
                try {
                    const commonData = {
                        distributor: consolidatedDataStore.distributor,
                        codeStoreDistributor: consolidatedDataStore.codeStoreDistributor,
                        codeProductDistributor: consolidatedDataStore.codeProductDistributor,
                        descriptionDistributor: consolidatedDataStore.descriptionDistributor,
                        unitsSoldDistributor: consolidatedDataStore.unitsSoldDistributor ?? 1,
                        saleDate: consolidatedDataStore.saleDate,
                        codeProduct: null,
                        codeStore: null,
                        authorizedDistributor: null,
                        storeName: null,
                        productModel: null,
                        calculateDate,
                        observation: null,
                    };

                    const newStoreData = plainToClass(ConsolidatedDataStores, {
                        ...commonData,
                        matriculationTemplate: { id: matriculationTemplateId },
                    });

                    await this.consolidatedDataStoresRepository.create(newStoreData);
                    recordCount++;

                } catch (error) {
                    recordsFailed++;
                    const technicalError = error instanceof Error ? error.message : 'Error desconocido';
                    const code = consolidatedDataStore.codeStoreDistributor;

                    smsErrorsBack.push('Errores back: ', technicalError);

                    const errorMapping: { keyword: string; message: string }[] = [
                        {
                            keyword: 'date/time field value out of range',
                            message: 'Alguna fecha está fuera de rango. Revisa los datos.',
                        },
                        {
                            keyword: 'duplicate key',
                            message: `Ya existe un registro duplicado para el consolidado ${code}.`,
                        },
                        {
                            keyword: 'cannot be null',
                            message: `Faltan datos obligatorios para el consolidado ${code}.`,
                        },
                    ];

                    const matched = errorMapping.find(({ keyword }) =>
                        technicalError.includes(keyword),
                    );

                    smsErrors.push(
                        matched?.message ?? `No se pudo procesar el consolidado ${code}. Revisa los datos.`,
                    );
                }

            }

            const endTime = new Date();
            return {
                startTime,
                endTime,
                status: 'SUCCESS',
                recordsExtracted: consolidatedDataStores.length,
                recordsProcessed: recordCount,
                recordCountSaved: recordCount,
                recordsFailed,
                smsErrors,
                smsErrorsBack,
                executionDetails: {
                    smsErrors,
                },
            };
        } catch (e) {
            const endTime = new Date();
            return {
                startTime,
                endTime,
                status: 'FAILURE',
                recordsExtracted: consolidatedDataStores.length,
                recordsProcessed: recordCount,
                recordCountSaved: recordCount,
                recordsFailed,
                smsErrors,
                smsErrorsBack,
                errorMessage: e instanceof Error ? e.message : 'Error desconocido',
                executionDetails: {
                    smsErrors,
                },
            };
        }
    }

    async syncConsolidatedDataStores(year: number, month: number): Promise<any> {
        const monthDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const syncStores = await this.consolidatedDataStoresRepository.syncDataStores(monthDate);
        const syncProducts = await this.consolidatedDataStoresRepository.syncDataProducts(monthDate);
        return {
            syncStores,
            syncProducts,
        };
    }

    async deleteConsolidatedDataStores(id: number): Promise<void> {
        const existingConsolidatedDataStores = await this.consolidatedDataStoresRepository.findById(id);
        if (!existingConsolidatedDataStores) {
            throw new Error(`Consolidated data stores con ID ${id} no encontrado`);
        }

        await this.consolidatedDataStoresRepository.delete(id);
    }

    async getConsolidatedDataStoresValuesNull(
        page: number,
        limit: number,
        search?: string,
        nullFields?: NullFieldFilters,
        calculateDate?: Date
    ): Promise<ConsolidatedDataStoresFiltersResponseDto> {
        const { items, total } = await this.consolidatedDataStoresRepository.findByFilters(page, limit, search, nullFields, calculateDate);
        return {
            items: plainToInstance(ConsolidatedDataStoresDto, items, {
                excludeExtraneousValues: true,
            }),
            total,
        };
    }

    async getConsolidatedDataStoresValuesNullMod(
        page: number,
        limit: number,
        search?: {
            distributor?: string;
            codeStoreDistributor?: string;
            codeProductDistributor?: string;
            descriptionDistributor?: string;
        },
        calculateDate?: Date
    ): Promise<ConsolidatedDataStoresFiltersResponseDto> {
        const { items, totalAll } = await this.consolidatedDataStoresRepository.findByFiltersMod(page, limit, search, calculateDate);
        return {
            items: items,
            total: totalAll,
        };
    }

    async getFilteredConsolidatedDataStoresProductIndefinido(
        page: number,
        limit: number,
        search?: {
            tipo?: string;
            distributor?: string;
            codeStoreDistributor?: string;
            codeProductDistributor?: string;
            descriptionDistributor?: string;
        },
        calculateDate?: Date
    ): Promise<ConsolidatedDataStoresFiltersResponseDto> {
        const tipo = search?.tipo || 'stores';
        if (tipo === 'stores') {
            const { items, totalAll } = await this.consolidatedDataStoresRepository.findByFiltersModStores(page, limit, search, calculateDate);
            return {
                items: items,
                total: totalAll,
            };
        } else {
            const { items, totalAll } = await this.consolidatedDataStoresRepository.findByFiltersModProduct(page, limit, search, calculateDate);
            return {
                items: items,
                total: totalAll,
            };
        }
    }


    async getConsolidatedDataStoresDetailNullFields(calculateDate?: Date): Promise<any> {
        return this.consolidatedDataStoresRepository.findDetailNullFields(calculateDate);
    }

    async getConsolidatedDataStoresValuesNullUnique(
        nullFields?: NullFieldFilters,
        calculateDate?: Date
    ): Promise<ConsolidatedDataStoresFiltersResponseDto> {
        const { items, total } = await this.consolidatedDataStoresRepository.findConsolidatedNullFieldsUnique(nullFields, calculateDate);
        return {
            items: plainToInstance(ConsolidatedDataStoresDto, items, {
                excludeExtraneousValues: true,
            }),
            total,
        };
    }
}
