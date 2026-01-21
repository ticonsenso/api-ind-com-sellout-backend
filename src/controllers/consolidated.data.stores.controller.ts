import { DataSource } from 'typeorm';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ConsolidatedDataStoresService } from '../services/consolidated.data.stores.service';
import {
    CreateConsolidatedDataStoresDto,
    NullFieldFilters,
    UpdateConsolidatedDataStoresDto,
    UpdateConsolidatedDto
} from '../dtos/consolidated.data.stores.dto';

export class ConsolidatedDataStoresController {
    private consolidatedDataStoresService: ConsolidatedDataStoresService;

    constructor(dataSource: DataSource) {
        // consolidated data stores
        this.consolidatedDataStoresService = new ConsolidatedDataStoresService(dataSource);
        this.createConsolidatedDataStores = this.createConsolidatedDataStores.bind(this);
        this.updateConsolidatedDataStores = this.updateConsolidatedDataStores.bind(this);
        this.deleteConsolidatedDataStores = this.deleteConsolidatedDataStores.bind(this);
        this.getFilteredConsolidatedDataStores = this.getFilteredConsolidatedDataStores.bind(this);
        this.syncConsolidatedDataStores = this.syncConsolidatedDataStores.bind(this);
        this.getConsolidatedDataStoresDetailNullFields = this.getConsolidatedDataStoresDetailNullFields.bind(this);
        this.getConsolidatedDataStoresValuesNullUnique = this.getConsolidatedDataStoresValuesNullUnique.bind(this);
        this.updateManyConsolidatedDataStores = this.updateManyConsolidatedDataStores.bind(this);
        this.updateJustStatus = this.updateJustStatus.bind(this);
        this.getFilteredConsolidatedDataStoresMod = this.getFilteredConsolidatedDataStoresMod.bind(this);
    }

    async createConsolidatedDataStores(req: Request, res: Response) {
        try {
            const createConsolidatedDataStoresDto: CreateConsolidatedDataStoresDto = plainToClass(CreateConsolidatedDataStoresDto, req.body);
            const consolidatedDataStores = await this.consolidatedDataStoresService.createConsolidatedDataStores(createConsolidatedDataStoresDto);
            res.status(StatusCodes.CREATED).json({ message: 'Almacenes consolidados creados correctamente', consolidatedDataStores });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async syncConsolidatedDataStores(req: Request, res: Response) {
        try {
            const { year, month } = req.params;
            const syncConsolidatedDataStores = await this.consolidatedDataStoresService.syncConsolidatedDataStores(Number(year), Number(month));
            res.status(StatusCodes.CREATED).json({ message: 'Sincronización completada. Se actualizaron ' + syncConsolidatedDataStores.syncStores + ' almacenes y ' + syncConsolidatedDataStores.syncProducts + ' productos.' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateConsolidatedDataStores(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateConsolidatedDataStoresDto: UpdateConsolidatedDataStoresDto = plainToClass(UpdateConsolidatedDataStoresDto, req.body);
            const consolidatedDataStores = await this.consolidatedDataStoresService.updateConsolidatedDataStores(Number(id), updateConsolidatedDataStoresDto);
            res.status(StatusCodes.OK).json({ message: 'Almacenes consolidados actualizados correctamente', consolidatedDataStores });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateJustStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const status = req.body.status;
            await this.consolidatedDataStoresService.updateJustStatus(Number(id), status);
            res.status(StatusCodes.OK).json({ message: 'Consolidado actualizado correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateManyConsolidatedDataStores(req: Request, res: Response) {
        try {
            if (!Array.isArray(req.body)) {
                throw new Error('Se esperaba un array de objetos para actualizar');
            }
            const updateDtos = plainToInstance(UpdateConsolidatedDto, req.body);
            const result = await this.consolidatedDataStoresService.updateDuplicatedConsolidatedDataStores(updateDtos);
            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteConsolidatedDataStores(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.consolidatedDataStoresService.deleteConsolidatedDataStores(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Almacenes consolidados eliminados correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getFilteredConsolidatedDataStores(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string;
            const nullFields = plainToClass(NullFieldFilters, req.body);
            const calculateDate = req.query.calculateDate ? new Date(req.query.calculateDate as string) : undefined;

            const filteredConsolidatedDataStores = await this.consolidatedDataStoresService.getConsolidatedDataStoresValuesNull(page!, limit!, search, nullFields, calculateDate);
            res.status(StatusCodes.OK).json(filteredConsolidatedDataStores);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getFilteredConsolidatedDataStoresMod(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = plainToClass(Object, req.body);
            const calculateDate = req.query.calculateDate ? new Date(req.query.calculateDate as string) : undefined;

            const filteredConsolidatedDataStores = await this.consolidatedDataStoresService.getConsolidatedDataStoresValuesNullMod(page!, limit!, search, calculateDate);
            res.status(StatusCodes.OK).json(filteredConsolidatedDataStores);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getConsolidatedDataStoresDetailNullFields(req: Request, res: Response) {
        try {
            const calculateDate = req.query.calculateDate ? new Date(req.query.calculateDate as string) : undefined;
            const detailNullFields = await this.consolidatedDataStoresService.getConsolidatedDataStoresDetailNullFields(calculateDate);
            res.status(StatusCodes.OK).json(detailNullFields);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getConsolidatedDataStoresValuesNullUnique(req: Request, res: Response) {
        try {
            const nullFields = plainToClass(NullFieldFilters, req.body);
            const calculateDate = req.query.calculateDate ? new Date(req.query.calculateDate as string) : undefined;
            const filteredConsolidatedDataStores = await this.consolidatedDataStoresService.getConsolidatedDataStoresValuesNullUnique(nullFields, calculateDate);
            res.status(StatusCodes.OK).json(filteredConsolidatedDataStores);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

}
