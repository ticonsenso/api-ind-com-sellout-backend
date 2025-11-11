import {DataSource} from "typeorm";
import {ClosingConfigurationRepository} from "../repository/closing.configuration.repository";
import {parseLocalDate} from "../utils/utils";
import {
    ClosingConfigurationResponseDto,
    CreateClosingConfigurationDto,
    UpdateClosingConfigurationDto
} from "../dtos/closing.cofiguration.dto";

// Primer día del mes de cierreimport { plainToInstance } from "class-transformer";
import {ClosingConfiguration} from "../models/closing.configuration.model";
import {plainToInstance} from "class-transformer";

export class ClosingConfigurationService {
    private closingConfigurationRepository: ClosingConfigurationRepository;
    constructor(dataSource: DataSource) {
        this.closingConfigurationRepository = new ClosingConfigurationRepository(dataSource);
    }

    async createClosingConfiguration(
        closingConfiguration: CreateClosingConfigurationDto
    ): Promise<ClosingConfigurationResponseDto> {
        const closingDate = new Date(closingConfiguration.closingDate!);

        const existingClosingConfiguration = await this.closingConfigurationRepository.findByMonthYear(closingDate.getFullYear(), closingDate.getMonth());

        if (existingClosingConfiguration) {
            throw new Error("Ya existe una configuración de cierre para este mes de cálculo");
        }

        const closingConfigurationEntity = plainToInstance(ClosingConfiguration, closingConfiguration, {});
        const closingConfigurationSaved = await this.closingConfigurationRepository.create(closingConfigurationEntity);

        return plainToInstance(ClosingConfigurationResponseDto, closingConfigurationSaved, {
            excludeExtraneousValues: true,
        });
    }

    async updateClosingConfiguration(
        id: number,
        closingConfiguration: UpdateClosingConfigurationDto
    ): Promise<ClosingConfigurationResponseDto> {
        const existingClosingConfiguration = await this.closingConfigurationRepository.findById(id);

        if (!existingClosingConfiguration) {
            throw new Error("Configuración de cierre no encontrada");
        }

        const closingConfigurationEntity = plainToInstance(ClosingConfiguration, closingConfiguration, {
        });

        closingConfigurationEntity.id = existingClosingConfiguration.id;
        closingConfigurationEntity.startDate = closingConfiguration.startDate ? parseLocalDate(closingConfiguration.startDate) : existingClosingConfiguration.startDate;
        closingConfigurationEntity.closingDate = closingConfiguration.closingDate ? parseLocalDate(closingConfiguration.closingDate) : existingClosingConfiguration.closingDate;
        closingConfigurationEntity.month = closingConfiguration.month ? parseLocalDate(closingConfiguration.month) : existingClosingConfiguration.month;
        closingConfigurationEntity.description = closingConfiguration.description;
        closingConfigurationEntity.updatedAt = new Date();

        const closingConfigurationUpdated = await this.closingConfigurationRepository.saveOne(closingConfigurationEntity);

        return plainToInstance(ClosingConfigurationResponseDto, closingConfigurationUpdated, {
            excludeExtraneousValues: true,
        });
    }

    async deleteClosingConfiguration(id: number): Promise<void> {
        const existingClosingConfiguration = await this.closingConfigurationRepository.findById(id);
        if (!existingClosingConfiguration) {
            throw new Error("Configuración de cierre no encontrada");
        }
        await this.closingConfigurationRepository.delete(id);
    }

    async getClosingConfigurations(
        page: number,
        limit: number,
        search?: string,
        calculateMonth?: string
    ): Promise<{ items: ClosingConfigurationResponseDto[]; total: number }> {
        const { items, total } = await this.closingConfigurationRepository.findByFilters(page, limit, search, calculateMonth);
        return {
            items: items.map(item => plainToInstance(ClosingConfigurationResponseDto, item, {
                excludeExtraneousValues: true,
            })), total
        };
    }


}