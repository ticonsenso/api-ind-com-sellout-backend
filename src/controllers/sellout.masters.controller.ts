import {DataSource} from 'typeorm';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {plainToClass, plainToInstance} from 'class-transformer';
import {SelloutMastersService} from '../services/sellout.masters.service';
import {CreateSelloutStoreMasterDto, UpdateSelloutStoreMasterDto} from '../dtos/sellout.store.master.dto';
import {CreateSelloutProductMasterDto, UpdateSelloutProductMasterDto} from '../dtos/sellout.product.master.dto';

export class SelloutMastersController {
    private selloutMastersService: SelloutMastersService;

    constructor(dataSource: DataSource) {
        // sellout store master
        this.selloutMastersService = new SelloutMastersService(dataSource);
        this.createSelloutStoreMaster = this.createSelloutStoreMaster.bind(this);
        this.updateSelloutStoreMaster = this.updateSelloutStoreMaster.bind(this);
        this.deleteSelloutStoreMaster = this.deleteSelloutStoreMaster.bind(this);
        this.getFilteredStoresMaster = this.getFilteredStoresMaster.bind(this);
        this.getDistribuidorAndStoreNameByStoreSic = this.getDistribuidorAndStoreNameByStoreSic.bind(this);
        this.createSelloutStoreMastersBatch = this.createSelloutStoreMastersBatch.bind(this);
        this.updateSelloutStoreMastersBatch = this.updateSelloutStoreMastersBatch.bind(this);
        this.getUniqueStoresMaster = this.getUniqueStoresMaster.bind(this);
        // sellout product master
        this.createSelloutProductMaster = this.createSelloutProductMaster.bind(this);
        this.updateSelloutProductMaster = this.updateSelloutProductMaster.bind(this);
        this.deleteSelloutProductMaster = this.deleteSelloutProductMaster.bind(this);
        this.getFilteredProductsMaster = this.getFilteredProductsMaster.bind(this);
        this.createSelloutProductMastersBatch = this.createSelloutProductMastersBatch.bind(this);
        this.getModelProductSicByProductSic = this.getModelProductSicByProductSic.bind(this);
        this.updateSelloutProductMastersBatch = this.updateSelloutProductMastersBatch.bind(this);
    }

    async createSelloutStoreMaster(req: Request, res: Response) {
        try {
            const createSelloutStoreMasterDto: CreateSelloutStoreMasterDto = plainToClass(CreateSelloutStoreMasterDto, req.body);
            const selloutStoreMaster = await this.selloutMastersService.createSelloutStoreMaster(createSelloutStoreMasterDto);
            res.status(StatusCodes.CREATED).json({ message: 'Maestro almacen creado correctamente', selloutStoreMaster });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateSelloutStoreMaster(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateSelloutStoreMasterDto: UpdateSelloutStoreMasterDto = plainToClass(UpdateSelloutStoreMasterDto, req.body);
            const selloutStoreMaster = await this.selloutMastersService.updateSelloutStoreMaster(Number(id), updateSelloutStoreMasterDto);
            res.status(StatusCodes.OK).json({ message: 'Maestro almacen actualizado correctamente', selloutStoreMaster });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateSelloutStoreMastersBatch(req: Request, res: Response): Promise<void> {
        try {
            if (!Array.isArray(req.body)) {
                throw new Error('Se esperaba un array de objetos para actualizar');
            }

            const updateDtos = plainToInstance(UpdateSelloutStoreMasterDto, req.body);

            const results = await this.selloutMastersService.updateSelloutStoreMastersBatch(updateDtos);

            res.status(StatusCodes.OK).json(results);
        } catch (error: any) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
    }

    async getDistribuidorAndStoreNameByStoreSic(req: Request, res: Response) {
        try {
            const { storeSic } = req.params;
            const distribuidorAndStoreName = await this.selloutMastersService.getDistribuidorAndStoreNameByStoreSic(Number(storeSic));
            if (!distribuidorAndStoreName) {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Almacen SIC no encontrado' });
                return;
            }
            res.status(StatusCodes.OK).json(distribuidorAndStoreName);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteSelloutStoreMaster(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.selloutMastersService.deleteSelloutStoreMaster(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Maestro almacen eliminado correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getFilteredStoresMaster(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string;
            const filteredStores = await this.selloutMastersService.getFilteredStoresMaster(page, limit, search);
            res.status(StatusCodes.OK).json(filteredStores);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getUniqueStoresMaster(req: Request, res: Response) {
        try {
            const searchDistributor = req.query.searchDistributor as string;
            const searchStore = req.query.searchStore as string;
            const { values, total } = await this.selloutMastersService.getUniqueStoresMaster(searchDistributor, searchStore);
            res.status(StatusCodes.OK).json({ values, total });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async createSelloutProductMaster(req: Request, res: Response) {
        try {
            const createSelloutProductMasterDto: CreateSelloutProductMasterDto = plainToClass(CreateSelloutProductMasterDto, req.body);
            const selloutProductMaster = await this.selloutMastersService.createSelloutProductMaster(createSelloutProductMasterDto);
            res.status(StatusCodes.CREATED).json({ message: 'Maestro producto creado correctamente', selloutProductMaster });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateSelloutProductMaster(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateSelloutProductMasterDto: UpdateSelloutProductMasterDto = plainToClass(UpdateSelloutProductMasterDto, req.body);
            const selloutProductMaster = await this.selloutMastersService.updateSelloutProductMaster(Number(id), updateSelloutProductMasterDto);
            res.status(StatusCodes.OK).json({ message: 'Maestro producto actualizado correctamente', selloutProductMaster });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateSelloutProductMastersBatch(req: Request, res: Response): Promise<void> {
        try {
            if (!Array.isArray(req.body)) {
                throw new Error('Se esperaba un array de objetos para actualizar');
            }

            const updateDtos = plainToInstance(UpdateSelloutProductMasterDto, req.body);

            const results = await this.selloutMastersService.updateSelloutProductMastersBatch(updateDtos);

            res.status(StatusCodes.OK).json(results);
        } catch (error: any) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
    }

    async getModelProductSicByProductSic(req: Request, res: Response) {
        try {
            const { productSic } = req.params;
            const modelProductSic = await this.selloutMastersService.getModelProductSicByProductSic(productSic);
            if (!modelProductSic) {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Modelo de producto no encontrado' });
                return;
            }
            res.status(StatusCodes.OK).json(modelProductSic);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteSelloutProductMaster(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.selloutMastersService.deleteSelloutProductMaster(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Maestro producto eliminado correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getFilteredProductsMaster(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string;
            const filteredProducts = await this.selloutMastersService.getFilteredProductsMaster(page, limit, search);
            res.status(StatusCodes.OK).json(filteredProducts);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async createSelloutStoreMastersBatch(req: Request, res: Response) {
        try {
            const createSelloutStoreMasterDto = plainToClass(CreateSelloutStoreMasterDto, req.body);
            if (!Array.isArray(createSelloutStoreMasterDto) || createSelloutStoreMasterDto.length === 0) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "El cuerpo de la solicitud debe ser un array no vacío." });
                return;
            }
            await this.selloutMastersService.createSelloutStoreMastersBatch(createSelloutStoreMasterDto);
            res.status(StatusCodes.CREATED).json({ message: 'Maestros almacenes creados correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async createSelloutProductMastersBatch(req: Request, res: Response) {
        try {
            const createSelloutProductMasterDto = plainToClass(CreateSelloutProductMasterDto, req.body);
            if (!Array.isArray(createSelloutProductMasterDto) || createSelloutProductMasterDto.length === 0) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "El cuerpo de la solicitud debe ser un array no vacío." });
                return;
            }
            await this.selloutMastersService.createSelloutProductMastersBatch(createSelloutProductMasterDto);
            res.status(StatusCodes.CREATED).json({ message: 'Maestros productos creados correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }
}
