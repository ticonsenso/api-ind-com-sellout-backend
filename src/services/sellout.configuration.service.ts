import {plainToClass, plainToInstance} from 'class-transformer';
import {DataSource} from 'typeorm';
import {
    SelloutConfigurationColumnConfigsRepository
} from '../repository/sellout.configuration.column.configs.repository';
import {ExtractionLogsSelloutRepository} from '../repository/extraction.logs.sellout.repositoy';
import {SelloutConfigurationRepository} from '../repository/sellout.configuration.repository';
import {
    CreateSelloutConfigurationDto,
    SelloutConfigurationDto,
    SelloutConfigurationFiltersResponseDto,
    UpdateSelloutConfigurationDto
} from '../dtos/sellout.configuration.dto';
import {SelloutConfiguration} from '../models/sellout.configuration.model';
import {ExtractionLogsSellout} from '../models/extraction.logs.sellout.model';
import {
    CreateExtractionLogsSelloutDto,
    ExtractionLogsSelloutDto,
    ExtractionLogsSelloutFiltersResponseDto,
    UpdateExtractionLogsSelloutDto
} from '../dtos/extraction.logs.sellout.dto';
import {User} from '../models/users.model';
import {SelloutConfigurationColumnConfigs} from '../models/sellout.configuration.column.configs.model';
import {
    CreateSelloutConfigurationColumnConfigsDto,
    SelloutConfigurationColumnConfigsFiltersResponseDto,
    SelloutConfigurationColumnConfigsResponseDto,
    UpdateSelloutConfigurationColumnConfigsDto
} from '../dtos/sellout.configuration.column.configs.dto';
import {UserRepository} from '../repository/users.repository';
import {CompaniesRepository} from '../repository/companies.repository';

export class SelloutConfigurationService {
    private selloutConfigurationRepository: SelloutConfigurationRepository;
    private selloutConfigurationColumnConfigsRepository: SelloutConfigurationColumnConfigsRepository;
    private extractionLogsSelloutRepository: ExtractionLogsSelloutRepository;
    private userRepository: UserRepository;
    private companyRepository: CompaniesRepository;

    constructor(dataSource: DataSource) {
        this.selloutConfigurationRepository = new SelloutConfigurationRepository(dataSource);
        this.selloutConfigurationColumnConfigsRepository = new SelloutConfigurationColumnConfigsRepository(dataSource);
        this.extractionLogsSelloutRepository = new ExtractionLogsSelloutRepository(dataSource);
        this.userRepository = new UserRepository(dataSource);
        this.companyRepository = new CompaniesRepository(dataSource);
    }

    async createSelloutConfiguration(selloutConfiguration: CreateSelloutConfigurationDto): Promise<SelloutConfiguration> {
        const entitySelloutConfiguration = plainToClass(SelloutConfiguration, selloutConfiguration);
        const company = await this.companyRepository.findById(Number(selloutConfiguration.companyId!));
        if (!company) {
            throw new Error(`Compañía con ID ${selloutConfiguration.companyId} no encontrado`);
        }
        entitySelloutConfiguration.companyId = company.id;
        return this.selloutConfigurationRepository.create(entitySelloutConfiguration);
    }

    async updateSelloutConfiguration(id: number, selloutConfiguration: UpdateSelloutConfigurationDto): Promise<SelloutConfiguration> {
        const existingSelloutConfiguration = await this.selloutConfigurationRepository.findById(id);
        if (!existingSelloutConfiguration) {
            throw new Error(`Configuración de sellout con ID ${id} no encontrado`);
        }

        const entitySelloutConfiguration = plainToClass(SelloutConfiguration, selloutConfiguration);
        return this.selloutConfigurationRepository.update(id, entitySelloutConfiguration);
    }

    async deleteSelloutConfiguration(id: number): Promise<void> {
        const existingSelloutConfiguration = await this.selloutConfigurationRepository.findById(id);
        if (!existingSelloutConfiguration) {
            throw new Error(`Configuración de sellout con ID ${id} no encontrado`);
        }

        await this.selloutConfigurationRepository.delete(id);
    }

    async getFilteredSelloutConfigurations(
        page: number,
        limit: number,
        search?: string
    ): Promise<SelloutConfigurationFiltersResponseDto> {
        const { items, total } = await this.selloutConfigurationRepository.findByFilters(page, limit, search);
        return {
            items: plainToInstance(SelloutConfigurationDto, items, {
            }),
            total,
        };
    }

    async createExtractionLogsSellout(selloutConfigurationColumnConfigs: CreateExtractionLogsSelloutDto): Promise<ExtractionLogsSelloutDto> {
        const data = new ExtractionLogsSellout();
        data.selloutConfiguration = { id: selloutConfigurationColumnConfigs.selloutConfigurationId } as SelloutConfiguration;
        data.startTime = selloutConfigurationColumnConfigs.startTime;
        data.endTime = selloutConfigurationColumnConfigs.endTime;
        data.status = selloutConfigurationColumnConfigs.status;
        data.recordsExtracted = selloutConfigurationColumnConfigs.recordsExtracted;
        data.recordsProcessed = selloutConfigurationColumnConfigs.recordsProcessed;
        data.recordsFailed = selloutConfigurationColumnConfigs.recordsFailed;
        data.errorMessage = selloutConfigurationColumnConfigs.errorMessage;
        data.executionDetails = selloutConfigurationColumnConfigs.executionDetails;

        const saved = await this.extractionLogsSelloutRepository.create(data);

        return plainToInstance(ExtractionLogsSelloutDto, saved, {
            excludeExtraneousValues: true,
        });
    }

    async updateExtractionLogsSellout(id: number, selloutConfiguration: UpdateExtractionLogsSelloutDto): Promise<ExtractionLogsSellout> {
        const existingExtractionLogsSellout = await this.extractionLogsSelloutRepository.findById(id);
        if (!existingExtractionLogsSellout) {
            throw new Error(`Extraction logs sellout con ID ${id} no encontrado`);
        }

        existingExtractionLogsSellout.selloutConfiguration = { id: selloutConfiguration.selloutConfigurationId } as SelloutConfiguration;
        existingExtractionLogsSellout.startTime = selloutConfiguration.startTime;
        existingExtractionLogsSellout.endTime = selloutConfiguration.endTime;
        existingExtractionLogsSellout.status = selloutConfiguration.status;
        existingExtractionLogsSellout.recordsExtracted = selloutConfiguration.recordsExtracted;
        existingExtractionLogsSellout.recordsProcessed = selloutConfiguration.recordsProcessed;
        existingExtractionLogsSellout.recordsFailed = selloutConfiguration.recordsFailed;
        existingExtractionLogsSellout.errorMessage = selloutConfiguration.errorMessage;
        existingExtractionLogsSellout.executionDetails = selloutConfiguration.executionDetails;

        return this.extractionLogsSelloutRepository.update(id, existingExtractionLogsSellout);
    }

    async deleteExtractionLogsSellout(id: number): Promise<void> {
        const existingExtractionLogsSellout = await this.extractionLogsSelloutRepository.findById(id);
        if (!existingExtractionLogsSellout) {
            throw new Error(`Extraction logs sellout con ID ${id} no encontrado`);
        }
        await this.extractionLogsSelloutRepository.delete(id);
    }

    async getFilteredExtractionLogsSellout(
        page: number,
        limit: number,
    ): Promise<ExtractionLogsSelloutFiltersResponseDto> {
        const { items, total } = await this.extractionLogsSelloutRepository.findPaginated(page, limit);
        return {
            items: plainToInstance(ExtractionLogsSelloutDto, items, {
                excludeExtraneousValues: true,
            }),
            total,
        };
    }

    async createSelloutConfigurationColumnConfigs(selloutConfigurationColumnConfigs: CreateSelloutConfigurationColumnConfigsDto): Promise<SelloutConfigurationColumnConfigsResponseDto> {
        const entitySelloutConfigurationColumnConfigs = plainToClass(SelloutConfigurationColumnConfigs, selloutConfigurationColumnConfigs);
        const selloutConfiguration = await this.selloutConfigurationRepository.findById(selloutConfigurationColumnConfigs.selloutConfigurationId!);
        if (!selloutConfiguration) {
            throw new Error(`Configuración de sellout con ID ${selloutConfigurationColumnConfigs.selloutConfigurationId} no encontrado`);
        }
        const data = plainToClass(SelloutConfigurationColumnConfigs, entitySelloutConfigurationColumnConfigs);
        data.selloutConfiguration = selloutConfiguration;
        const saved = await this.selloutConfigurationColumnConfigsRepository.create(data);
        const selloutConfigurationColumnConfigsDto = plainToClass(SelloutConfigurationColumnConfigsResponseDto, saved, {
            excludeExtraneousValues: true,
        });
        selloutConfigurationColumnConfigsDto.selloutConfigurationId = selloutConfiguration.id;
        return selloutConfigurationColumnConfigsDto;
    }

    async createSelloutConfigurationColumnConfigsBatch(
        configDtos: CreateSelloutConfigurationColumnConfigsDto[]
    ): Promise<SelloutConfigurationColumnConfigsResponseDto[]> {
        if (configDtos.length === 0) {
            return [];
        }

        const selloutConfigurationId = configDtos[0].selloutConfigurationId;
        const updatedBy = configDtos[0].updatedBy;

        const selloutConfiguration = await this.selloutConfigurationRepository.findById(selloutConfigurationId!);
        if (!selloutConfiguration) {
            throw new Error(
                `La configuración de sellout con el id ${selloutConfigurationId} no existe.`
            );
        }

        const updater = await this.userRepository.findById(updatedBy!);
        if (!updater) {
            throw new Error(`El actualizador con el id ${updatedBy} no existe.`);
        }

        const entities = configDtos.map((dto) => {
            const entity = plainToClass(SelloutConfigurationColumnConfigs, dto, {
                excludePrefixes: ["dataSourceId", "createdBy", "updatedBy"],
            });
            entity.selloutConfiguration = selloutConfiguration;
            return entity;
        });

        const saved = await this.selloutConfigurationColumnConfigsRepository.createBatch(entities);

        return saved.map((config) =>
            plainToClass(SelloutConfigurationColumnConfigsResponseDto, config, {
                excludeExtraneousValues: true,
            })
        );
    }

    async updateSelloutConfigurationColumnConfigs(id: number, selloutConfiguration: UpdateSelloutConfigurationColumnConfigsDto): Promise<SelloutConfigurationColumnConfigsResponseDto> {
        const existingSelloutConfigurationColumnConfigs = await this.selloutConfigurationColumnConfigsRepository.findById(id);

        if (!existingSelloutConfigurationColumnConfigs) {
            throw new Error(`Configuración de columna con ID ${id} no encontrado`);
        }

        existingSelloutConfigurationColumnConfigs.selloutConfiguration = { id: selloutConfiguration.selloutConfigurationId } as SelloutConfiguration;
        existingSelloutConfigurationColumnConfigs.columnName = selloutConfiguration.columnName;
        existingSelloutConfigurationColumnConfigs.columnIndex = selloutConfiguration.columnIndex;
        existingSelloutConfigurationColumnConfigs.columnLetter = selloutConfiguration.columnLetter;
        existingSelloutConfigurationColumnConfigs.dataType = selloutConfiguration.dataType;
        existingSelloutConfigurationColumnConfigs.isRequired = selloutConfiguration.isRequired;
        existingSelloutConfigurationColumnConfigs.mappingToField = selloutConfiguration.mappingToField;
        existingSelloutConfigurationColumnConfigs.headerRow = selloutConfiguration.headerRow;
        existingSelloutConfigurationColumnConfigs.startRow = selloutConfiguration.startRow;
        existingSelloutConfigurationColumnConfigs.isActive = selloutConfiguration.isActive;
        existingSelloutConfigurationColumnConfigs.hasNegativeValue = selloutConfiguration.hasNegativeValue;
        existingSelloutConfigurationColumnConfigs.updatedBy = { id: selloutConfiguration.updatedBy } as User;

        const saved = await this.selloutConfigurationColumnConfigsRepository.update(id, existingSelloutConfigurationColumnConfigs);
        const selloutConfigurationColumnConfigsDto = plainToClass(SelloutConfigurationColumnConfigsResponseDto, saved, {
            excludeExtraneousValues: true,
        });
        selloutConfigurationColumnConfigsDto.selloutConfigurationId = existingSelloutConfigurationColumnConfigs.selloutConfiguration.id;
        return selloutConfigurationColumnConfigsDto;
    }

    async deleteSelloutConfigurationColumnConfigs(id: number): Promise<void> {
        const existingSelloutConfigurationColumnConfigs = await this.selloutConfigurationColumnConfigsRepository.findById(id);
        if (!existingSelloutConfigurationColumnConfigs) {
            throw new Error(`Configuración de columna con ID ${id} no encontrado`);
        }
        await this.selloutConfigurationColumnConfigsRepository.delete(id);
    }

    async getFilteredSelloutConfigurationColumnConfigs(
        search?: string,
        selloutConfigurationId?: number,
    ): Promise<SelloutConfigurationColumnConfigsFiltersResponseDto> {
        const { items, total } = await this.selloutConfigurationColumnConfigsRepository.findAllColumnConfigs(search, selloutConfigurationId);
        return {
            items: plainToInstance(SelloutConfigurationColumnConfigsResponseDto, items, {
                excludeExtraneousValues: true,
            }),
            total,
        };
    }

}
