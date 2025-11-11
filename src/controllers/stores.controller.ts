import {DataSource} from 'typeorm';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {plainToClass} from 'class-transformer';
import {SelloutZoneService} from '../services/sellout.zone.service';
import {CreateSelloutZoneDto, UpdateSelloutZoneDto} from '../dtos/selleout.zone.dto';
import {CreateStoreSicDto, NullFieldFiltersSic, UpdateStoreSicDto} from '../dtos/stores.sic.dto';
import {StoresSicService} from '../services/stores_sic.service';
import {CreateProductSicDto, UpdateProductSicDto} from '../dtos/product.sic.dto';
import {ProductSicService} from '../services/produc.sic.service';

export class StoresController {
    private selloutZoneService: SelloutZoneService;
    private storeService: StoresSicService;
    private productSicService: ProductSicService;
    constructor(dataSource: DataSource) {
        this.selloutZoneService = new SelloutZoneService(dataSource);
        this.storeService = new StoresSicService(dataSource);
        this.productSicService = new ProductSicService(dataSource);
        // Sellout Zone
        this.createSelloutZone = this.createSelloutZone.bind(this);
        this.updateSelloutZone = this.updateSelloutZone.bind(this);
        this.deleteSelloutZone = this.deleteSelloutZone.bind(this);
        this.getSelloutZone = this.getSelloutZone.bind(this);

        // Store Configuration
        this.createStores = this.createStores.bind(this);
        this.updateStores = this.updateStores.bind(this);
        this.createStoresBatch = this.createStoresBatch.bind(this);
        this.deleteStores = this.deleteStores.bind(this);
        this.getStores = this.getStores.bind(this);

        // Product SIC
        this.createProductSic = this.createProductSic.bind(this);
        this.createProductsSic = this.createProductsSic.bind(this);
        this.updateProductSic = this.updateProductSic.bind(this);
        this.deleteProductSic = this.deleteProductSic.bind(this);
        this.getProductSic = this.getProductSic.bind(this);
    }


    // Sellout Zone
    async createSelloutZone(req: Request, res: Response) {
        try {
            const createSelloutZoneDto: CreateSelloutZoneDto = plainToClass(CreateSelloutZoneDto, req.body);
            const selloutZone = await this.selloutZoneService.createSelloutZone(createSelloutZoneDto);
            res.status(StatusCodes.CREATED).json({ message: 'Zona de venta creada correctamente', selloutZone });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateSelloutZone(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateSelloutZoneDto: UpdateSelloutZoneDto = plainToClass(UpdateSelloutZoneDto, req.body);
            const selloutZone = await this.selloutZoneService.updateSelloutZone(Number(id), updateSelloutZoneDto);
            res.status(StatusCodes.OK).json({ message: 'Zona de venta actualizada correctamente', selloutZone });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteSelloutZone(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.selloutZoneService.deleteSelloutZone(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Zona de venta eliminada correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getSelloutZone(req: Request, res: Response) {
        try {
            const { page, limit, search } = req.query;
            const selloutZones = await this.selloutZoneService.getFilteredSelloutZone(Number(page), Number(limit), search as string);
            res.status(StatusCodes.OK).json(selloutZones);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    // Stores
    async createStores(req: Request, res: Response) {
        try {
            const createStoreDto: CreateStoreSicDto = plainToClass(CreateStoreSicDto, req.body);
            const store = await this.storeService.createStoresSic(createStoreDto);
            res.status(StatusCodes.CREATED).json({ message: 'Almacen creada correctamente', store });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async createStoresBatch(req: Request, res: Response) {
        try {
            const createStoreDto = plainToClass(CreateStoreSicDto, req.body);
            if (!Array.isArray(createStoreDto) || createStoreDto.length === 0) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "El cuerpo de la solicitud debe ser un array no vacío." });
                return;
            }
            await this.storeService.createStoresSicBatch(createStoreDto);
            res.status(StatusCodes.CREATED).json({ message: 'Almacenes creados correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateStores(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateStoreDto: UpdateStoreSicDto = plainToClass(UpdateStoreSicDto, req.body);
            const store = await this.storeService.updateStoresSic(Number(id), updateStoreDto);
            res.status(StatusCodes.OK).json({ message: 'Almacen actualizado correctamente', store });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteStores(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.storeService.deleteStoresSic(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Almacen eliminado correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getStores(req: Request, res: Response) {
        try {
            const { page, limit, search } = req.query;
            const nullFields = plainToClass(NullFieldFiltersSic, req.body);
            const stores = await this.storeService.getFilteredStoresSic(Number(page), Number(limit), search as string, nullFields);
            res.status(StatusCodes.OK).json(stores);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    // Product SIC

    async createProductSic(req: Request, res: Response) {
        try {
            const createProductSicDto: CreateProductSicDto = plainToClass(CreateProductSicDto, req.body);
            const productSic = await this.productSicService.createProductSic(createProductSicDto);
            res.status(StatusCodes.CREATED).json({ message: 'Producto SIC creado correctamente', productSic });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async createProductsSic(req: Request, res: Response) {
        try {
            const createProductSicDto = plainToClass(CreateProductSicDto, req.body);
            if (!Array.isArray(createProductSicDto) || createProductSicDto.length === 0) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "El cuerpo de la solicitud debe ser un array no vacío." });
                return;
            }
            await this.productSicService.createProductSicBatch(createProductSicDto);
            res.status(StatusCodes.CREATED).json({ message: 'Productos SIC creados correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateProductSic(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateProductSicDto: UpdateProductSicDto = plainToClass(UpdateProductSicDto, req.body);
            const productSic = await this.productSicService.updateProductSic(Number(id), updateProductSicDto);
            res.status(StatusCodes.OK).json({ message: 'Producto SIC actualizado correctamente', productSic });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteProductSic(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.productSicService.deleteProductSic(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Producto SIC eliminado correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getProductSic(req: Request, res: Response) {
        try {
            const { page, limit, search } = req.query;
            const productSic = await this.productSicService.getFilteredProductSic(Number(page), Number(limit), search as string);
            res.status(StatusCodes.OK).json(productSic);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }
}
