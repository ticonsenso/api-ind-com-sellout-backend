import {plainToInstance} from 'class-transformer';
import {DataSource} from 'typeorm';

import {StoreConfigurationRepository} from '../repository/store.configuration.repository';
import {
    CreateStoreConfigurationDtoIds,
    CreateStoreConfigurationWithEmployeesDto,
    StoreConfigurationListResponseSearchDto,
    StoreConfigurationResponseDto,
    UpdateStoreConfigurationDto
} from '../dtos/store.configuration.dto';
import {StoreConfiguration} from '../models/store.configuration.model';
import {AdvisorConfigurationRepository} from '../repository/advisor.configuration.repository';
import {EmployForMonth} from '../models/advisor.configuration.model';
import {
    CreateEmployForMonthDto,
    EmployForMonthResponseDto,
    EmployForMonthResponseDtoList,
    UpdateEmployForMonthDto
} from '../dtos/advisor.configuration.dto';
import {StoreSizeRepository} from '../repository/store.size.repository';
import {StoreSize} from '../models/store.size.model';
import {CompaniesRepository} from '../repository/companies.repository';
import {StoreSizeResponseDto} from '../dtos/store.size.dto';
import {CompanyResponseDto} from '../dtos/companies.dto';
import {Company} from '../models/companies.model';
import {StorePptoMarcimexPaginatedResponseDto, StorePptoMarcimexResponseDto} from '../dtos/store.ppto.marcimex.dto';
import {StorePptoMarcimexRepository} from '../repository/store.ppto.marcimex.repository';
import {CreateGroupedByStoreDto, GroupedByStoreResponseDto} from '../dtos/grouped.by.store.dto';
import {GroupedByStore} from '../models/grouped.by.store.model';
import {GroupedByStoreRepository} from '../repository/grouped.by.store.repository';
import {GroupedByAdvisorRepository} from '../repository/grouped.by.advisor.repositoyr';
import {CreateGroupedByAdvisorDto, GroupedByAdvisorResponseDto} from '../dtos/grouped.by.advisor.dto';
import {GroupedByAdvisor} from '../models/grouped.by.advisor.model';

export class StoreConfigurationService {
    private storeConfigurationRepository: StoreConfigurationRepository;
    private advisorConfigurationRepository: AdvisorConfigurationRepository;
    private storeSizeRepository: StoreSizeRepository;
    private companyRepository: CompaniesRepository;
    private storePptoMarcimexRepository: StorePptoMarcimexRepository;
    private groupedByStoreRepository: GroupedByStoreRepository;
    private groupedByAdvisorRepository: GroupedByAdvisorRepository;
    constructor(dataSource: DataSource) {
        this.storeConfigurationRepository = new StoreConfigurationRepository(dataSource);
        this.groupedByStoreRepository = new GroupedByStoreRepository(dataSource);
        this.groupedByAdvisorRepository = new GroupedByAdvisorRepository(dataSource);
        this.advisorConfigurationRepository = new AdvisorConfigurationRepository(dataSource);
        this.storeSizeRepository = new StoreSizeRepository(dataSource);
        this.companyRepository = new CompaniesRepository(dataSource);
        this.storePptoMarcimexRepository = new StorePptoMarcimexRepository(dataSource);

    }

    async createStoreConfiguration(
        dto: CreateStoreConfigurationDtoIds,
    ): Promise<StoreConfigurationResponseDto> {

        const storeConfig = new StoreConfiguration();

        storeConfig.regional = dto.regional;
        storeConfig.storeName = dto.store_name;
        storeConfig.ceco = dto.ceco;
        storeConfig.code = dto.code;
        storeConfig.notes = dto.notes;
        storeConfig.registerDate = dto.registerDate as any;
        storeConfig.storeSize = { id: dto.storeSizeId } as StoreSize;
        storeConfig.company = { id: dto.companyId } as Company;

        const createdStoreConfig = await this.storeConfigurationRepository.create(storeConfig);

        return plainToInstance(StoreConfigurationResponseDto, createdStoreConfig, {
            excludeExtraneousValues: true,
        });
    }

    async updateStoreConfiguration(id: number, storeConfiguration: UpdateStoreConfigurationDto): Promise<StoreConfigurationResponseDto> {
        const existingStoreConfiguration = await this.storeConfigurationRepository.findById(id);
        if (!existingStoreConfiguration) {
            throw new Error('Configuración de tienda no encontrada');
        }
        const storeSize = await this.storeSizeRepository.findStoreById(storeConfiguration.storeSizeId ?? 0);
        if (!storeSize) {
            throw new Error(`Tamaño de tienda no encontrado: ${storeConfiguration.storeSizeId}`);
        }

        if (storeConfiguration.companyId) {
            const company = await this.companyRepository.findById(parseInt(storeConfiguration.companyId));
            if (!company) {
                throw new Error(`Empresa no encontrada: ${storeConfiguration.companyId}`);
            }
            existingStoreConfiguration.company = company;
        }

        existingStoreConfiguration.regional = storeConfiguration.regional ?? existingStoreConfiguration.regional;
        existingStoreConfiguration.storeName = storeConfiguration.store_name ?? existingStoreConfiguration.storeName;
        existingStoreConfiguration.ceco = storeConfiguration.ceco ?? existingStoreConfiguration.ceco;
        existingStoreConfiguration.code = storeConfiguration.code ?? existingStoreConfiguration.code;
        existingStoreConfiguration.notes = storeConfiguration.notes ?? existingStoreConfiguration.notes;
        existingStoreConfiguration.registerDate = storeConfiguration.registerDate as any ?? existingStoreConfiguration.registerDate;
        existingStoreConfiguration.storeSize = storeSize;
        const updatedStoreConfiguration = await this.storeConfigurationRepository.update(id, existingStoreConfiguration);
        return plainToInstance(StoreConfigurationResponseDto, updatedStoreConfiguration, { excludeExtraneousValues: true });
    }

    async deleteStoreConfiguration(id: number): Promise<void> {
        const existingStoreConfiguration = await this.storeConfigurationRepository.findById(id);
        if (!existingStoreConfiguration) {
            throw new Error('Configuración de tienda no encontrada');
        }
        await this.storeConfigurationRepository.delete(id);
    }

    async createEmployForMonthConfiguration(advisorConfiguration: CreateEmployForMonthDto): Promise<EmployForMonthResponseDto> {
        const advisorConfigurationEntity = new EmployForMonth();
        advisorConfigurationEntity.mountName = advisorConfiguration.mountName;
        advisorConfigurationEntity.numberEmployees = advisorConfiguration.numberEmployees;
        advisorConfigurationEntity.month = advisorConfiguration.month;
        advisorConfigurationEntity.storeConfiguration = { id: advisorConfiguration.storeConfigurationId } as StoreConfiguration;
        const createdAdvisorConfiguration = await this.advisorConfigurationRepository.create(advisorConfigurationEntity);
        return plainToInstance(EmployForMonthResponseDto, createdAdvisorConfiguration, { excludeExtraneousValues: true });
    }

    async createEmployForMonthConfigurations(
        dtoList: CreateEmployForMonthDto[]
    ): Promise<EmployForMonthResponseDto[]> {
        const createdList: EmployForMonthResponseDto[] = [];

        for (const dto of dtoList) {
            const config = await this.storeConfigurationRepository.findById(dto.storeConfigurationId);
            if (!config) {
                throw new Error(`Config ID ${dto.storeConfigurationId} not found`);
            }

            const entity = new EmployForMonth();
            entity.mountName = dto.mountName;
            entity.numberEmployees = dto.numberEmployees;
            entity.month = dto.month;
            entity.storeConfiguration = config;

            const saved = await this.advisorConfigurationRepository.create(entity);
            createdList.push(plainToInstance(EmployForMonthResponseDto, saved, { excludeExtraneousValues: true }));
        }

        return createdList;
    }


    async updateEmployForMonthConfiguration(id: number, advisorConfiguration: UpdateEmployForMonthDto): Promise<EmployForMonthResponseDto> {
        const existingAdvisorConfiguration = await this.advisorConfigurationRepository.findById(id);
        if (!existingAdvisorConfiguration) {
            throw new Error('Configuración de asesor no encontrada');
        }
        existingAdvisorConfiguration.mountName = advisorConfiguration.mountName ?? existingAdvisorConfiguration.mountName;
        existingAdvisorConfiguration.numberEmployees = advisorConfiguration.numberEmployees ?? existingAdvisorConfiguration.numberEmployees;
        existingAdvisorConfiguration.month = advisorConfiguration.month ?? existingAdvisorConfiguration.month;
        const updatedAdvisorConfiguration = await this.advisorConfigurationRepository.update(id, existingAdvisorConfiguration);
        return plainToInstance(EmployForMonthResponseDto, updatedAdvisorConfiguration, { excludeExtraneousValues: true });
    }

    async deleteAdvisorConfiguration(id: number): Promise<void> {
        const existingAdvisorConfiguration = await this.advisorConfigurationRepository.findById(id);
        if (!existingAdvisorConfiguration) {
            throw new Error('Configuración de asesor no encontrada');
        }
        await this.advisorConfigurationRepository.delete(id);
    }
    async getAdvisorConfigurationByStoreConfigurationId(storeConfigurationId: number): Promise<EmployForMonthResponseDto[]> {
        const advisorConfigurations = await this.advisorConfigurationRepository.findByStoreConfigurationId(storeConfigurationId);
        return plainToInstance(EmployForMonthResponseDto, advisorConfigurations, { excludeExtraneousValues: true });
    }

    async createStoreConfigurations(
        storeConfigurations: CreateStoreConfigurationWithEmployeesDto[],
    ): Promise<{
        count: number;
        errorCount: number;
        smsErrors: string[];
    }> {

        let count = 0;
        let errorCount = 0;
        const advisorErrors: string[] = [];

        for (const dto of storeConfigurations) {
            try {
                const existingStore = await this.storeConfigurationRepository.findByCeco(dto.ceco!);
                const storeSize = await this.storeSizeRepository.findStoreByName(dto.storeSizeId!);

                if (!storeSize) {
                    advisorErrors.push(`Tamaño de tienda no encontrado: ${dto.storeSizeName}`);
                    errorCount++;
                    continue;
                }

                let storeEntity: StoreConfiguration;

                if (existingStore) {
                    existingStore.regional = dto.regional;
                    existingStore.storeName = dto.storeName;
                    existingStore.code = dto.code;
                    existingStore.notes = dto.notes;
                    existingStore.registerDate = dto.registerDate!;
                    existingStore.storeSize = storeSize;
                    existingStore.company = dto.companyId
                        ? await this.companyRepository.findById(parseInt(dto.companyId))
                        : null;

                    storeEntity = await this.storeConfigurationRepository.update(existingStore.id, existingStore);
                } else {
                    storeEntity = plainToInstance(StoreConfiguration, {
                        regional: dto.regional,
                        storeName: dto.storeName,
                        ceco: dto.ceco,
                        code: dto.code,
                        notes: dto.notes,
                        registerDate: dto.registerDate,
                        storeSize: storeSize,
                        company: dto.companyId
                            ? await this.companyRepository.findById(parseInt(dto.companyId))
                            : null,
                    });

                    storeEntity = await this.storeConfigurationRepository.create(storeEntity);
                }

                if (!storeEntity) {
                    advisorErrors.push(`Error al guardar la tienda ${dto.storeName}`);
                    errorCount++;
                    continue;
                }
                const existingAdvisors = await this.advisorConfigurationRepository.findAllByStoreId(storeEntity.id);
                const advisorsByMonth = new Map<number, EmployForMonth>();
                existingAdvisors.forEach((advisor) => {
                    advisorsByMonth.set(advisor.month, advisor);
                });
                for (const advisor of dto.advisorConfiguration) {
                    try {
                        const existingAdvisor = advisorsByMonth.get(advisor.month);

                        if (existingAdvisor) {
                            existingAdvisor.mountName = advisor.mountName;
                            existingAdvisor.numberEmployees = advisor.numberEmployees;
                            await this.advisorConfigurationRepository.update(existingAdvisor.id, existingAdvisor);
                        } else {
                            const advisorEntity = plainToInstance(EmployForMonth, {
                                mountName: advisor.mountName,
                                numberEmployees: advisor.numberEmployees,
                                month: advisor.month,
                                storeConfiguration: storeEntity,
                            });

                            await this.advisorConfigurationRepository.create(advisorEntity);
                        }
                    } catch (advisorError) {
                        const errorMessage =
                            advisorError instanceof Error ? advisorError.message : 'Error desconocido';
                        advisorErrors.push(`Error en tienda ${dto.storeName} (mes ${advisor.month}): ${errorMessage}`);
                        errorCount++;
                    }
                }

                count++;
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : 'Error desconocido al crear la tienda';
                advisorErrors.push(`Error al crear la tienda ${dto.storeName}: ${errorMessage}`);
                errorCount++;
            }

        }

        return { count, errorCount, smsErrors: advisorErrors };
    }


    async createStoreConfigurationWithEmployees(
        storeConfigurations: CreateStoreConfigurationWithEmployeesDto[],
        calculateDate: Date
    ): Promise<{
        count: number;
        errorCount: number;
        smsErrors: string[];
    }> {
        let count = 0;
        let errorCount = 0;
        const advisorErrors: string[] = [];

        for (const dto of storeConfigurations) {
            try {

                const storeSize = await this.storeSizeRepository.findStoreByName(dto.storeSizeId!);

                if (!storeSize) {
                    advisorErrors.push(`Tamaño de tienda no encontrado: ${dto.storeSizeName}`);
                    errorCount++;
                    continue;
                }

                const storeEntity = plainToInstance(StoreConfiguration, {
                    regional: dto.regional,
                    storeName: dto.storeName,
                    ceco: dto.ceco,
                    code: dto.code,
                    notes: dto.notes,
                    registerDate: calculateDate,
                    storeSize: storeSize,
                    company: dto.companyId ? await this.companyRepository.findById(parseInt(dto.companyId)) : null,
                });

                const savedStore = await this.storeConfigurationRepository.create(storeEntity);

                if (!savedStore) {
                    advisorErrors.push(`Error al crear la tienda ${dto.storeName}`);
                    errorCount++;
                    continue;
                }

                for (const advisor of dto.advisorConfiguration) {
                    try {
                        const advisorEntity = plainToInstance(EmployForMonth, {
                            mountName: advisor.mountName,
                            numberEmployees: advisor.numberEmployees,
                            month: advisor.month,
                            storeConfiguration: savedStore,
                        });

                        await this.advisorConfigurationRepository.create(advisorEntity);
                    } catch (advisorError) {
                        const errorMessage =
                            advisorError instanceof Error ? advisorError.message : 'Error desconocido';
                        advisorErrors.push(
                            `Error en tienda ${dto.storeName} (mes ${advisor.month}): ${errorMessage}`
                        );
                        errorCount++;
                    }
                }

                count++;
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : 'Error desconocido al crear la tienda';
                advisorErrors.push(`Error al crear la tienda ${dto.storeName}: ${errorMessage}`);
                errorCount++;
            }
        }

        return { count, errorCount, smsErrors: advisorErrors };
    }

    async searchStoreConfigurationPaginated(
        search: string = "",
        companyId?: number,
        page?: number,
        limit?: number,
    ): Promise<StoreConfigurationListResponseSearchDto> {
        const productLines = await this.storeConfigurationRepository.findByFilters(
            search,
            companyId,
            page,
            limit
        );
        const productLinesResponse = await Promise.all(productLines.items.map(async (productLine) => {
            const ppto = await this.storePptoMarcimexRepository.findByCeco(productLine.ceco!);
            const productLineResponse = plainToInstance(
                StoreConfigurationResponseDto,
                { ...productLine, budget: ppto?.storePpto || 0 },

            );
            const storeSize = plainToInstance(
                StoreSizeResponseDto,
                productLine.storeSize,
                {
                    excludeExtraneousValues: true,
                }
            );
            const company = plainToInstance(
                CompanyResponseDto,
                productLine.company,
                {
                    excludeExtraneousValues: true,
                }
            );
            const advisorConfiguration = plainToInstance(
                EmployForMonthResponseDtoList,
                productLine.advisorConfiguration,
                {
                    excludeExtraneousValues: true,
                }
            );
            return {
                ...productLineResponse,
                storeSize,
                company,
                advisorConfiguration,
            };
        }));
        return plainToInstance(
            StoreConfigurationListResponseSearchDto,
            {
                items: productLinesResponse,
                total: productLines.total,
            },
            { excludeExtraneousValues: true }
        );
    }

    async getStorePptoMarcimexData(
        page?: number,
        limit?: number,
        search?: string,
        calculateDate?: string,
    ): Promise<StorePptoMarcimexPaginatedResponseDto> {

        const { items, total } = await this.storePptoMarcimexRepository.findByFilters(search, page, limit, calculateDate);

        const enrichedItems = [];

        let storePptoGroup = '';
        let cecoGrouped = '';

        for (const item of items) {
            const pptoRecord = await this.getGroupedByStoreConfiguration(item.storeConfiguration?.id!, new Date(calculateDate!));

            let hasGroupedByStore = false;

            if (pptoRecord && item.storeConfiguration?.id) {
                const principalBudget = pptoRecord.storePrincipal?.budget ?? 0;

                const secondariesBudget = pptoRecord.storeSecondaries.reduce((acc, curr) => {
                    return acc + (curr.budget ?? 0);
                }, 0);

                const totalBudget = principalBudget + secondariesBudget;

                if (totalBudget > 0 && pptoRecord) {
                    storePptoGroup = totalBudget.toFixed(2);
                    hasGroupedByStore = true;
                    cecoGrouped = pptoRecord.storeSecondaries?.map(s => s.ceco).join(', ') ?? '';
                } else {
                    cecoGrouped = '';
                    storePptoGroup = item.storePpto;
                }
            } else {
                storePptoGroup = item.storePpto;
            }

            enrichedItems.push({
                ...item,
                hasGroupedByStore,
                storePptoGroup,
                cecoGrouped
            });
        }

        return {
            items: plainToInstance(StorePptoMarcimexResponseDto, enrichedItems, {
            }),
            total,
        };
    }

    async createGroupedByStoreConfiguration(
        dto: CreateGroupedByStoreDto,
    ): Promise<GroupedByStoreResponseDto[]> {
        const storePrincipal = await this.storeConfigurationRepository.findById(dto.storePrincipal!);

        if (!storePrincipal) {
            throw new Error(`No se encontró un presupuesto para la tienda principal`);
        }

        const incomingSecondaryIds = dto.storeSecondaryIds || [];

        const existingGroups = await this.groupedByStoreRepository.findByStoreCeco(storePrincipal.ceco!);

        let createdGroups: GroupedByStore[] = [];

        if (existingGroups.length > 0) {
            const existingSecondaryIds = existingGroups.map(g => g.storeSecondary?.id);

            const toDelete = existingGroups.filter(
                g => !incomingSecondaryIds.includes(g.storeSecondary?.id!)
            );
            for (const group of toDelete) {
                await this.groupedByStoreRepository.delete(group.id);
            }

            const preservedGroups = existingGroups.filter(g =>
                incomingSecondaryIds.includes(g.storeSecondary?.id!)
            );
            createdGroups.push(...preservedGroups);

            const toAddIds = incomingSecondaryIds.filter(id => !existingSecondaryIds.includes(id));
            for (const secondaryId of toAddIds) {
                const storeSecondary = await this.storeConfigurationRepository.findById(secondaryId);
                if (!storeSecondary) {
                    throw new Error(`No se encontró un presupuesto para la tienda secundaria`);
                }

                const newGroup = new GroupedByStore();
                newGroup.storePrincipal = storePrincipal;
                newGroup.storeSecondary = storeSecondary;

                const created = await this.groupedByStoreRepository.create(newGroup);
                createdGroups.push(created);
            }
        } else {
            for (const secondaryId of incomingSecondaryIds) {
                const storeSecondary = await this.storeConfigurationRepository.findById(secondaryId);
                if (!storeSecondary) {
                    throw new Error(`No se encontró un presupuesto para la tienda secundaria`);
                }

                const newGroup = new GroupedByStore();
                newGroup.storePrincipal = storePrincipal;
                newGroup.storeSecondary = storeSecondary;

                const created = await this.groupedByStoreRepository.create(newGroup);
                createdGroups.push(created);
            }
        }

        return plainToInstance(GroupedByStoreResponseDto, createdGroups, {
            excludeExtraneousValues: true,
        });
    }

    async getGroupedByStoreConfiguration(storeId: number, calculateDate?: Date): Promise<{
        storePrincipal: StoreConfigurationResponseDto | null,
        storeSecondaries: StoreConfigurationResponseDto[],
    }> {
        console.log(calculateDate);
        const groupedByStores = await this.groupedByStoreRepository.findByStoreId(storeId);

        if (groupedByStores.length === 0) {
            return {
                storePrincipal: null,
                storeSecondaries: [],
            };
        }

        const storePrincipalEntity = groupedByStores[0].storePrincipal!;
        const pptoRecordPrincipal = await this.storePptoMarcimexRepository.findByCecoAndDate(storePrincipalEntity.ceco!, new Date(calculateDate!));
        const budgetPrincipal = pptoRecordPrincipal ? Number(pptoRecordPrincipal.storePpto) || 0 : 0;

        const storePrincipal = plainToInstance(
            StoreConfigurationResponseDto,
            { ...storePrincipalEntity, budget: budgetPrincipal },
        );

        let totalPpto = 0;

        const storeSecondaries = await Promise.all(
            groupedByStores.map(async (grouped) => {
                const secondaryEntity = grouped.storeSecondary!;
                const pptoRecord = await this.storePptoMarcimexRepository.findByCecoAndDate(secondaryEntity.ceco!, new Date(calculateDate!));
                const budget = pptoRecord ? Number(pptoRecord.storePpto) || 0 : 0;
                totalPpto += budget;

                const storeSecondaryDto = plainToInstance(StoreConfigurationResponseDto, secondaryEntity, {
                    excludeExtraneousValues: true,
                });

                return { ...storeSecondaryDto, budget, idGroupedByStore: grouped.id };
            })
        );

        return {
            storePrincipal,
            storeSecondaries,
        };
    }

    async deleteGroupedByStoreConfiguration(id: number): Promise<void> {
        const existingGroupedByStore = await this.groupedByStoreRepository.findById(id);
        if (!existingGroupedByStore) {
            throw new Error('Configuración de tienda agrupada no encontrada');
        }
        await this.groupedByStoreRepository.delete(id);
    }

    async createGroupedByAdvisorConfiguration(
        dto: CreateGroupedByAdvisorDto,
    ): Promise<GroupedByAdvisorResponseDto[]> {
        const storePrincipal = await this.storeConfigurationRepository.findById(dto.storePrincipal!);

        if (!storePrincipal) {
            throw new Error(`No se encontró la tienda principal`);
        }

        const incomingSecondaryIds = dto.storeSecondaryIds || [];

        const existingGroups = await this.groupedByAdvisorRepository.findByStoreId(dto.storePrincipal!);

        let createdGroups: GroupedByAdvisor[] = [];

        if (existingGroups.length > 0) {
            const existingSecondaryIds = existingGroups.map(g => g.storeSecondary?.id);

            const toDelete = existingGroups.filter(
                g => !incomingSecondaryIds.includes(g.storeSecondary?.id!)
            );
            for (const group of toDelete) {
                await this.groupedByAdvisorRepository.delete(group.id);
            }

            const preservedGroups = existingGroups.filter(g =>
                incomingSecondaryIds.includes(g.storeSecondary?.id!)
            );
            createdGroups.push(...preservedGroups);

            const toAddIds = incomingSecondaryIds.filter(id => !existingSecondaryIds.includes(id));
            for (const secondaryId of toAddIds) {
                const storeSecondary = await this.storeConfigurationRepository.findById(secondaryId);
                if (!storeSecondary) {
                    throw new Error(`No se encontró la tienda secundaria`);
                }

                const newGroup = new GroupedByAdvisor();
                newGroup.storePrincipal = storePrincipal;
                newGroup.storeSecondary = storeSecondary;

                const created = await this.groupedByAdvisorRepository.create(newGroup);
                createdGroups.push(created);
            }
        } else {
            for (const secondaryId of incomingSecondaryIds) {
                const storeSecondary = await this.storeConfigurationRepository.findById(secondaryId);
                if (!storeSecondary) {
                    throw new Error(`No se encontró la tienda secundaria`);
                }

                const newGroup = new GroupedByAdvisor();
                newGroup.storePrincipal = storePrincipal;
                newGroup.storeSecondary = storeSecondary;

                const created = await this.groupedByAdvisorRepository.create(newGroup);
                createdGroups.push(created);
            }
        }

        return plainToInstance(GroupedByAdvisorResponseDto, createdGroups, {
            excludeExtraneousValues: true,
        });
    }

    async deleteGroupedByAdvisorConfiguration(id: number): Promise<void> {
        const existingGroupedByAdvisor = await this.groupedByAdvisorRepository.findById(id);
        if (!existingGroupedByAdvisor) {
            throw new Error('Configuración de asesor agrupada no encontrada');
        }
        await this.groupedByAdvisorRepository.delete(id);
    }

    async getGroupedByAdvisorConfiguration(storeId: number): Promise<{
        storePrincipal: StoreConfigurationResponseDto | null,
        storeSecondaries: GroupedByAdvisorResponseDto[],
    }> {
        const groupedByStores = await this.groupedByAdvisorRepository.findByStoreId(storeId);

        if (groupedByStores.length === 0) {
            return {
                storePrincipal: null,
                storeSecondaries: [],
            };
        }

        const storePrincipalEntity = groupedByStores[0].storePrincipal!;
        const principalAdvisors = await this.advisorConfigurationRepository.findByStoreConfigurationId(storePrincipalEntity.id);

        const cleanedPrincipalAdvisors = principalAdvisors.map(({ id, createdAt, updatedAt, ...rest }) => rest);

        const storePrincipal = plainToInstance(StoreConfigurationResponseDto, {
            ...storePrincipalEntity,
            advisor: cleanedPrincipalAdvisors,
        });

        let secondaryTotalEmployees = 0;

        const storeSecondaries = await Promise.all(
            groupedByStores.map(async (grouped) => {
                const secondaryStoreId = grouped.storeSecondary?.id!;
                const advisors = await this.advisorConfigurationRepository.findByStoreConfigurationId(secondaryStoreId);

                const cleanedAdvisors = advisors.map(({ id, createdAt, updatedAt, ...rest }) => rest);

                const secondaryTotal = advisors.reduce((sum, a) => sum + (a.numberEmployees || 0), 0);
                secondaryTotalEmployees += secondaryTotal;

                const dto = {
                    ...plainToInstance(GroupedByAdvisorResponseDto, grouped),
                    ...plainToInstance(StoreConfigurationResponseDto, {
                        ...grouped.storeSecondary,
                        advisor: cleanedAdvisors,
                    }),
                };

                delete (dto as any).storePrincipal;
                delete (dto as any).storeSecondary;

                return {
                    ...dto,
                    idGroupedByAdvisor: grouped.id,
                };
            })
        );

        return {
            storePrincipal,
            storeSecondaries,
        };
    }




}