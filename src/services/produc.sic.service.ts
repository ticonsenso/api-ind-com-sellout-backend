import { plainToClass, plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';

import { ProductSicRepository } from '../repository/product.sic.repository';
import { ProductSic } from '../models/product_sic.model';
import { CreateProductSicDto, ProductSicPaginatedResponseDto, ProductSicResponseDto, UpdateProductSicDto } from '../dtos/product.sic.dto';
import { chunkArray } from '../utils/utils';

export class ProductSicService {
    private productSicRepository: ProductSicRepository;

    constructor(dataSource: DataSource) {
        this.productSicRepository = new ProductSicRepository(dataSource);
    }

    async createProductSic(productSic: CreateProductSicDto): Promise<ProductSic> {
        const entityProductSic = plainToClass(ProductSic, productSic);
        return this.productSicRepository.create(entityProductSic);
    }

    async createProductSicBatch(configs: CreateProductSicDto[]): Promise<void> {
        const uniqueMap = new Map<string, CreateProductSicDto>();
        for (const config of configs) {
            if (config.idProductSic) {
                uniqueMap.set(config.idProductSic.toString(), config);
            }
        }
        const uniqueConfigs = Array.from(uniqueMap.values());

        const chunkSize = 1000;
        const chunks = chunkArray(uniqueConfigs, chunkSize);

        for (const chunk of chunks) {
            const idProductSicList = chunk.map(c => c.idProductSic!);

            const existingStores = await this.productSicRepository.findByIdProductSic(idProductSicList);

            const existingMap = new Map(existingStores.map(p => [p.idProductSic, p]));

            const toUpdate = [];
            const toInsert = [];

            for (const config of chunk) {
                const existing = existingMap.get(config.idProductSic!);
                if (existing) {
                    Object.assign(existing, config);
                    toUpdate.push(existing);
                } else {
                    toInsert.push(plainToClass(ProductSic, config));
                }
            }

            if (toUpdate.length > 0) await this.productSicRepository.save(toUpdate);
            if (toInsert.length > 0) await this.productSicRepository.insert(toInsert);
        }
    }

    async updateProductSic(id: number, productSic: UpdateProductSicDto): Promise<ProductSic> {
        const existingProductSic = await this.productSicRepository.findById(id);
        if (!existingProductSic) {
            throw new Error(`Producto SIC con ID ${id} no encontrado`);
        }

        const entityProductSic = plainToClass(ProductSic, productSic);
        return this.productSicRepository.update(id, entityProductSic);
    }

    async deleteProductSic(id: number): Promise<void> {
        const existingProductSic = await this.productSicRepository.findById(id);
        if (!existingProductSic) {
            throw new Error(`Producto SIC con ID ${id} no encontrado`);
        }
        await this.productSicRepository.delete(id);
    }

    async getFilteredProductSic(
        page: number,
        limit: number,
        search?: string
    ): Promise<ProductSicPaginatedResponseDto> {
        const { items, total } = await this.productSicRepository.findByFilters(page, limit, search);
        return {
            items: plainToInstance(ProductSicResponseDto, items, {
                excludeExtraneousValues: true,
            }),
            total,
        };
    }

}
