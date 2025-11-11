import {plainToInstance} from "class-transformer";
import {DataSource} from "typeorm";
import {
    CreateStoreSizeDto,
    StoreSizePaginatedResponseDto,
    StoreSizeResponseDto,
    StoreSizeSearchDto,
    UpdateStoreSizeDto,
} from "../dtos/store.size.dto";
import {StoreSize} from "../models/store.size.model";
import {CompaniesRepository} from "../repository/companies.repository";
import {StoreSizeRepository} from "../repository/store.size.repository";

export class StoreSizeService {
  private storeSizeRepository: StoreSizeRepository;
  private companyRepository: CompaniesRepository;

  constructor(dataSource: DataSource) {
    this.storeSizeRepository = new StoreSizeRepository(dataSource);
    this.companyRepository = new CompaniesRepository(dataSource);
  }

  async createStoreSize(
    storeSize: CreateStoreSizeDto
  ): Promise<StoreSizeResponseDto> {
    const company = await this.companyRepository.findById(storeSize.companyId);
    if (!company) {
      throw new Error("La empresa no existe.");
    }
    const storeSizeEntity = plainToInstance(StoreSize, storeSize, {
      excludePrefixes: ["companyId"],
    });
    storeSizeEntity.company = company;
    const storeSizeSaved =
      await this.storeSizeRepository.create(storeSizeEntity);
    return plainToInstance(StoreSizeResponseDto, storeSizeSaved, {
      excludeExtraneousValues: true,
    });
  }

  async updateStoreSize(
    id: number,
    storeSize: UpdateStoreSizeDto
  ): Promise<StoreSizeResponseDto> {
    const storeSizeSaved = await this.storeSizeRepository.findById(id);
    if (!storeSizeSaved) {
      throw new Error("El tamaño de la tienda no existe.");
    }
    const company = await this.companyRepository.findById(
      Number(storeSize.companyId)
    );
    if (!company) {
      throw new Error("La empresa no existe.");
    }
    storeSizeSaved.company = company;
    storeSizeSaved.name = storeSize.name ?? storeSizeSaved.name;
    storeSizeSaved.bonus =
      storeSize.bonus ?? storeSizeSaved.bonus;
    storeSizeSaved.time =
      storeSize.time ?? storeSizeSaved.time;
    const storeSizeSavede = await this.storeSizeRepository.update(
      id,
      storeSizeSaved
    );
    return plainToInstance(StoreSizeResponseDto, storeSizeSavede, {
      excludeExtraneousValues: true,
    });
  }

  async deleteStoreSize(id: number): Promise<void> {
    const storeSizeSaved = await this.storeSizeRepository.findById(id);
    if (!storeSizeSaved) {
      throw new Error("El tamaño de la tienda no existe.");
    }
    await this.storeSizeRepository.delete(id);
  }

  async searchStoreSizePaginated(
    searchDto: StoreSizeSearchDto,
    page: number = 1,
    limit: number = 10
  ): Promise<StoreSizePaginatedResponseDto> {
    const storeSizePaginated = await this.storeSizeRepository.findByFilters(
      searchDto,
      page,
      limit
    );

    const storeSizeResponse = storeSizePaginated.items.map((storeSize) =>
      plainToInstance(StoreSizeResponseDto, storeSize, {
        excludeExtraneousValues: true,
      })
    );

    return plainToInstance(
      StoreSizePaginatedResponseDto,
      {
        items: storeSizeResponse,
        total: storeSizePaginated.total,
      },
      { excludeExtraneousValues: true }
    );
  }
}
