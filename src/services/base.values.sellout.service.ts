import { DataSource } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { chunkArray } from '../utils/utils';
import { format } from 'date-fns';
import { BaseValuesSelloutRepository } from '../repository/base.values.sellout.repository';
import { BaseValuesSelloutFiltersResponseDto, BaseValuesSelloutResponseDto, CreateBaseValuesSelloutDto, UpdateBaseValuesSelloutDto } from '../dtos/base.values.sellout.dto';
import { BaseValuesSellout } from '../models/base.values.sellout.model';
export class BaseValuesSelloutService {
    private baseValuesSelloutRepository: BaseValuesSelloutRepository;

    constructor(dataSource: DataSource) {
        this.baseValuesSelloutRepository = new BaseValuesSelloutRepository(dataSource);
    }

    async createBaseValuesSellout(baseValuesSellout: CreateBaseValuesSelloutDto): Promise<BaseValuesSelloutResponseDto> {
        const baseValuesSelloutSave = plainToClass(BaseValuesSellout, baseValuesSellout);
        const savedBaseValuesSellout = await this.baseValuesSelloutRepository.create(baseValuesSelloutSave);
        return plainToClass(BaseValuesSelloutResponseDto, savedBaseValuesSellout, { excludeExtraneousValues: true });
    }

    async createBaseValuesSelloutBatch(configs: CreateBaseValuesSelloutDto[]): Promise<void> {
        const chunkSize = 2000;
        const chunks = chunkArray(configs, chunkSize);

        for (const chunk of chunks) {
            await this.baseValuesSelloutRepository.insertBatch(chunk);
        }
    }

    async updateBaseValuesSellout(id: number, baseValuesSellout: UpdateBaseValuesSelloutDto): Promise<BaseValuesSelloutResponseDto> {
        const baseValuesSelloutSave = plainToClass(BaseValuesSellout, baseValuesSellout);
        const existingBaseValuesSellout = await this.baseValuesSelloutRepository.findById(id);
        if (!existingBaseValuesSellout) {
            throw new Error(`Base de ppto de sellout con ID ${id} no encontrado`);
        }
        const updatedBaseValuesSellout = await this.baseValuesSelloutRepository.update(id, baseValuesSelloutSave);
        return plainToClass(BaseValuesSelloutResponseDto, updatedBaseValuesSellout, { excludeExtraneousValues: true });
    }

    async deleteBaseValuesSellout(id: number): Promise<void> {
        const baseValuesSellout = await this.baseValuesSelloutRepository.findById(id);
        if (!baseValuesSellout) {
            throw new Error('La base de valores de sellout no existe.');
        }
        await this.baseValuesSelloutRepository.delete(id);
    }

    async getFilteredStoresMaster(
        page: number,
        limit: number,
        search?: string
    ): Promise<BaseValuesSelloutFiltersResponseDto> {
        const { items, total } = await this.baseValuesSelloutRepository.findByFilters(page, limit, search);
        return {
            items: plainToInstance(BaseValuesSelloutResponseDto, items, {
                excludeExtraneousValues: true,
            }),
            total,
        };
    }
}
