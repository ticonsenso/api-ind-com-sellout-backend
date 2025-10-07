import { plainToClass, plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { StoresSicRepository } from '../repository/stores.repository';
import { SelloutZoneRepository } from '../repository/sellout.zone.repository';
import { SelloutZone } from '../models/sellout.zone.model';
import { CreateSelloutZoneDto, SelloutZonePaginatedResponseDto, SelloutZoneResponseDto, UpdateSelloutZoneDto } from '../dtos/selleout.zone.dto';

export class SelloutZoneService {
    private selloutZoneRepository: SelloutZoneRepository;
    private storesRepository: StoresSicRepository;

    constructor(dataSource: DataSource) {
        this.selloutZoneRepository = new SelloutZoneRepository(dataSource);
        this.storesRepository = new StoresSicRepository(dataSource);
    }


    async createSelloutZone(selloutZone: CreateSelloutZoneDto): Promise<SelloutZoneResponseDto> {
        const entitySelloutZone = plainToClass(SelloutZone, selloutZone);
        const stores = await this.storesRepository.findById(selloutZone.storesId);
        if (!stores) {
            throw new Error(`Tienda con ID ${selloutZone.storesId} no encontrado`);
        }
        entitySelloutZone.stores = stores;
        const selloutZoneDto = plainToClass(SelloutZoneResponseDto, entitySelloutZone, {
            excludeExtraneousValues: true,
        });
        await this.selloutZoneRepository.create(entitySelloutZone);
        return selloutZoneDto;
    }

    async updateSelloutZone(id: number, selloutZone: UpdateSelloutZoneDto): Promise<SelloutZoneResponseDto> {
        const existingSelloutZone = await this.selloutZoneRepository.findById(id);
        if (!existingSelloutZone) {
            throw new Error(`Zona de venta con ID ${id} no encontrado`);
        }
        const stores = await this.storesRepository.findById(selloutZone.storesId);
        if (!stores) {
            throw new Error(`Tienda con ID ${selloutZone.storesId} no encontrado`);
        }
        existingSelloutZone.stores = stores!;
        existingSelloutZone.name = selloutZone.name;
        existingSelloutZone.groupName = selloutZone.groupName;
        existingSelloutZone.status = selloutZone.status;
        const selloutZoneDto = plainToClass(SelloutZoneResponseDto, existingSelloutZone, {
            excludeExtraneousValues: true,
        });
        await this.selloutZoneRepository.update(id, existingSelloutZone);
        return selloutZoneDto;
    }

    async deleteSelloutZone(id: number): Promise<void> {
        const existingSelloutZone = await this.selloutZoneRepository.findById(id);
        if (!existingSelloutZone) {
            throw new Error(`Zona de venta con ID ${id} no encontrado`);
        }
        await this.selloutZoneRepository.delete(id);
    }

    async getFilteredSelloutZone(
        page: number,
        limit: number,
        search?: string
    ): Promise<SelloutZonePaginatedResponseDto> {
        const { items, total } = await this.selloutZoneRepository.findByFilters(page, limit, search);
        return {
            items: plainToInstance(SelloutZoneResponseDto, items, {
                excludeExtraneousValues: true,
            }),
            total,
        };
    }

}
