import {DataSource} from "typeorm";
import {parseLocalDate} from "../utils/utils";
import {plainToInstance} from "class-transformer";
import {RotationBaseRepository} from "../repository/rotation.base.repository";
import {CreateRotationBaseDto, RotationBaseResponseDto, UpdateRotationBaseDto} from "../dtos/rotation.base.dto";
import {RotationBase} from "../models/rotation.base.model";

export class RotationBaseService {
    private rotationBaseRepository: RotationBaseRepository;
    constructor(dataSource: DataSource) {
        this.rotationBaseRepository = new RotationBaseRepository(dataSource);
    }

    async createRotationBase(
        rotationBase: CreateRotationBaseDto
    ): Promise<RotationBaseResponseDto> {
        const rotationBaseEntity = plainToInstance(RotationBase, rotationBase, {});
        const rotationBaseSaved =
            await this.rotationBaseRepository.create(rotationBaseEntity);
        return plainToInstance(RotationBaseResponseDto, rotationBaseSaved, {
            excludeExtraneousValues: true,
        });
    }

    async updateRotationBase(
        id: number,
        rotationBase: UpdateRotationBaseDto
    ): Promise<RotationBaseResponseDto> {
        const existingRotationBase = await this.rotationBaseRepository.findById(id);
        if (!existingRotationBase) {
            throw new Error("Rotación base no encontrada");
        }

        const rotationBaseEntity = plainToInstance(RotationBase, rotationBase, {
            excludeExtraneousValues: true,
        });

        rotationBaseEntity.visitDate = parseLocalDate(rotationBase.visitDate);

        const rotationBaseUpdated =
            await this.rotationBaseRepository.update(id, rotationBaseEntity);

        return plainToInstance(RotationBaseResponseDto, rotationBaseUpdated, {
            excludeExtraneousValues: true,
        });
    }

    async deleteRotationBase(id: number): Promise<void> {
        const existingRotationBase = await this.rotationBaseRepository.findById(id);
        if (!existingRotationBase) {
            throw new Error("Rotación base no encontrada");
        }
        await this.rotationBaseRepository.delete(id);
    }

    async getRotationBases(
        page: number,
        limit: number,
        search?: string,
    ): Promise<{ items: RotationBaseResponseDto[]; total: number }> {
        const { items, total } = await this.rotationBaseRepository.findByFilters(page, limit, search);
        return {
            items: items.map(item => plainToInstance(RotationBaseResponseDto, item, {
                excludeExtraneousValues: true,
            })), total
        };
    }


}