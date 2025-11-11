import {plainToClass, plainToInstance} from 'class-transformer';
import {DataSource} from 'typeorm';
import {SalesRotationConfigurationsRepository} from '../repository/sales.rotation.configurations.repository';
import {
    CreateSalesRotationConfigurationDto,
    SalesRotationConfigurationListResponseSearchDto,
    SalesRotationConfigurationResponseDto,
    SalesRotationConfigurationSearchDto,
    UpdateSalesRotationConfigurationDto
} from '../dtos/sales.rotation.configurations.dto';
import {SalesRotationConfiguration} from '../models/sales.rotation.configurations.model';
import {CommissionConfigurationsRepository} from '../repository/commission.configurations.repository';

export class SalesRotationConfigurationsService {
    private salesRotationConfigurationsRepository: SalesRotationConfigurationsRepository;
    private commissionConfigurationsRepository: CommissionConfigurationsRepository;

    constructor(dataSource: DataSource) {
        this.salesRotationConfigurationsRepository = new SalesRotationConfigurationsRepository(dataSource);
        this.commissionConfigurationsRepository = new CommissionConfigurationsRepository(dataSource);
    }

    async createSalesRotationConfiguration(
        createSalesRotationConfigurationDto: CreateSalesRotationConfigurationDto
    ): Promise<SalesRotationConfigurationResponseDto> {

        const { month, commissionConfigurationId } = createSalesRotationConfigurationDto;

        const existing = await this.salesRotationConfigurationsRepository.findByMonthAndCommissionConfigurationId(month, commissionConfigurationId);

        if (existing) {
            throw new Error(`Sales rotation configuration with month ${month} already exists`);
        }

        const commissionConfig = await this.commissionConfigurationsRepository.repository.findOne({
            where: { id: commissionConfigurationId },
        });

        if (!commissionConfig) {
            throw new Error(`CommissionConfiguration with id ${commissionConfigurationId} not found`);
        }

        const entity = plainToClass(SalesRotationConfiguration, createSalesRotationConfigurationDto);
        entity.commissionConfiguration = commissionConfig;

        const saved = await this.salesRotationConfigurationsRepository.create(entity);

        return plainToClass(SalesRotationConfigurationResponseDto, saved, { excludeExtraneousValues: true });
    }

    async createSalesRotationConfigurations(
        configs: CreateSalesRotationConfigurationDto[]
    ): Promise<SalesRotationConfigurationResponseDto[]> {
        const results: SalesRotationConfigurationResponseDto[] = [];

        for (const config of configs) {
            const { month, commissionConfigurationId } = config;

            const existing = await this.salesRotationConfigurationsRepository.findByMonthAndCommissionConfigurationId(
                month,
                commissionConfigurationId
            );

            if (existing) {
                throw new Error(`Sales rotation configuration with month ${month} already exists`);
            }

            const commissionConfig = await this.commissionConfigurationsRepository.repository.findOne({
                where: { id: commissionConfigurationId },
            });

            if (!commissionConfig) {
                throw new Error(`CommissionConfig with id ${commissionConfigurationId} not found. Skipping.`);
            }

            const entity = plainToClass(SalesRotationConfiguration, config);
            entity.commissionConfiguration = commissionConfig;

            const saved = await this.salesRotationConfigurationsRepository.create(entity);

            const response = plainToClass(SalesRotationConfigurationResponseDto, saved, {
                excludeExtraneousValues: true,
            });

            results.push(response);
        }

        return results;
    }

    async updateSalesRotationConfigurations(
        updates: UpdateSalesRotationConfigurationDto[]
    ): Promise<SalesRotationConfigurationResponseDto[]> {

        return this.salesRotationConfigurationsRepository.dataSource.transaction(async (manager) => {
            const responses: SalesRotationConfigurationResponseDto[] = [];

            for (const dto of updates) {
                if (!dto.id) throw new Error('El campo "id" es obligatorio para actualizar.');

                const entity = await this.salesRotationConfigurationsRepository.findOneByIdWithManager(dto.id, manager);
                if (!entity) throw new Error(`No existe configuración con id ${dto.id}`);

                const newMonth = dto.month ?? entity.month;
                const newCommId = dto.commissionConfigurationId ?? entity.commissionConfiguration.id;

                const dup = await this.salesRotationConfigurationsRepository.findByMonthAndCommissionConfigurationId(newMonth, newCommId);
                if (dup && dup.id !== entity.id) {
                    throw new Error(`Ya existe otra configuración para mes ${newMonth} y comisión ${newCommId}`);
                }

                if (dto.month !== undefined) entity.month = dto.month;
                if (dto.monthName !== undefined) entity.monthName = dto.monthName;
                if (dto.weight !== undefined) entity.weight = dto.weight;
                if (dto.goal !== undefined) entity.goal = dto.goal;
                if (dto.description !== undefined) entity.description = dto.description;
                if (dto.isHighSeason !== undefined) entity.isHighSeason = dto.isHighSeason;

                if (dto.commissionConfigurationId !== undefined) {
                    const newComm = await this.salesRotationConfigurationsRepository.findCommissionConfigByIdWithManager(dto.commissionConfigurationId, manager);
                    if (!newComm) throw new Error(`CommissionConfig ${dto.commissionConfigurationId} no encontrada`);
                    entity.commissionConfiguration = newComm;
                }

                const saved = await this.salesRotationConfigurationsRepository.update(entity.id, entity);

                responses.push(
                    plainToClass(SalesRotationConfigurationResponseDto, saved, { excludeExtraneousValues: true })
                );
            }

            return responses;
        });

    }


    async updateSalesRotationConfiguration(id: number, updateSalesRotationConfigurationDto: UpdateSalesRotationConfigurationDto): Promise<SalesRotationConfigurationResponseDto> {
        const existingSalesRotationConfiguration = await this.salesRotationConfigurationsRepository.findById(id);
        if (!existingSalesRotationConfiguration) {
            throw new Error('Sales rotation configuration not found');
        }
        const commissionConfig = await this.commissionConfigurationsRepository.repository.findOne({
            where: { id: updateSalesRotationConfigurationDto.commissionConfigurationId },
        });
        if (!commissionConfig) {
            throw new Error(`CommissionConfiguration with id ${updateSalesRotationConfigurationDto.commissionConfigurationId} not found`);
        }
        existingSalesRotationConfiguration.monthName = updateSalesRotationConfigurationDto.monthName ?? existingSalesRotationConfiguration.monthName;
        existingSalesRotationConfiguration.weight = updateSalesRotationConfigurationDto.weight ?? existingSalesRotationConfiguration.weight;
        existingSalesRotationConfiguration.goal = updateSalesRotationConfigurationDto.goal ?? existingSalesRotationConfiguration.goal;
        existingSalesRotationConfiguration.isHighSeason = updateSalesRotationConfigurationDto.isHighSeason ?? existingSalesRotationConfiguration.isHighSeason;
        existingSalesRotationConfiguration.commissionConfiguration = commissionConfig;
        const updatedSalesRotationConfiguration = await this.salesRotationConfigurationsRepository.update(id, existingSalesRotationConfiguration);
        return plainToInstance(SalesRotationConfigurationResponseDto, updatedSalesRotationConfiguration, { excludeExtraneousValues: true });
    }

    async deleteSalesRotationConfiguration(id: number): Promise<void> {
        const existingSalesRotationConfiguration = await this.salesRotationConfigurationsRepository.findById(id);

        if (!existingSalesRotationConfiguration) {
            throw new Error(`Sales rotation configuration with ID ${id} not found`);
        }

        await this.salesRotationConfigurationsRepository.delete(id);
    }

    async deleteAllSalesRotationConfigurations(commissionConfigurationId: number): Promise<void> {
        await this.salesRotationConfigurationsRepository.deleteAllByCommissionConfigurationId(commissionConfigurationId);
    }

    async searchSalesRotationConfigurationPaginated(
        searchDto: SalesRotationConfigurationSearchDto,
        page: number = 1,
        limit: number = 12
    ): Promise<SalesRotationConfigurationListResponseSearchDto> {
        const salesRotationConfigurations = await this.salesRotationConfigurationsRepository.findByFilters(
            searchDto,
            page,
            limit
        );
        const salesRotationConfigurationsResponse = salesRotationConfigurations.items.map((salesRotationConfiguration) => {
            const salesRotationConfigurationResponse = plainToInstance(
                SalesRotationConfigurationResponseDto,
                salesRotationConfiguration,
                {
                    excludeExtraneousValues: true,
                }
            );
            return {
                ...salesRotationConfigurationResponse,
            };
        });
        return plainToInstance(
            SalesRotationConfigurationListResponseSearchDto,
            {
                items: salesRotationConfigurationsResponse,
                total: salesRotationConfigurations.total,
            },
            { excludeExtraneousValues: true }
        );
    }


}
