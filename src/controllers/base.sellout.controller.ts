import {DataSource} from 'typeorm';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {plainToClass, plainToInstance} from 'class-transformer';
import {BasePptoSelloutService} from '../services/base.ppto.sellout.service';
import {BaseValuesSelloutService} from '../services/base.values.sellout.service';
import {CreateBasePptoSelloutDto, UpdateBasePptoSelloutDto} from '../dtos/base.ppto.sellout.dto';
import {CreateBaseValuesSelloutDto, UpdateBaseValuesSelloutDto} from '../dtos/base.values.sellout.dto';

export class BaseSelloutController {
    private basePptoSelloutService: BasePptoSelloutService;
    private baseValuesSelloutService: BaseValuesSelloutService;

    constructor(dataSource: DataSource) {
        this.basePptoSelloutService = new BasePptoSelloutService(dataSource);
        this.baseValuesSelloutService = new BaseValuesSelloutService(dataSource);
        // base ppto sellout
        this.createBasePptoSellout = this.createBasePptoSellout.bind(this);
        this.updateBasePptoSellout = this.updateBasePptoSellout.bind(this);
        this.deleteBasePptoSellout = this.deleteBasePptoSellout.bind(this);
        this.getBasePptoSellout = this.getBasePptoSellout.bind(this);
        this.createBasePptoSelloutBatch = this.createBasePptoSelloutBatch.bind(this);
        // base values sellout
        this.createBaseValuesSellout = this.createBaseValuesSellout.bind(this);
        this.updateBaseValuesSellout = this.updateBaseValuesSellout.bind(this);
        this.deleteBaseValuesSellout = this.deleteBaseValuesSellout.bind(this);
        this.getBaseValuesSellout = this.getBaseValuesSellout.bind(this);
        this.createBaseValuesSelloutBatch = this.createBaseValuesSelloutBatch.bind(this);
    }

    async createBasePptoSellout(req: Request, res: Response) {
        try {
            const createBasePptoSelloutDto: CreateBasePptoSelloutDto = plainToClass(CreateBasePptoSelloutDto, req.body);
            const basePptoSellout = await this.basePptoSelloutService.createBasePptoSellout(createBasePptoSelloutDto);
            res.status(StatusCodes.CREATED).json({ message: 'Base de ppto de sellout creado correctamente', basePptoSellout });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateBasePptoSellout(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateBasePptoSelloutDto: UpdateBasePptoSelloutDto = plainToClass(UpdateBasePptoSelloutDto, req.body);
            const basePptoSellout = await this.basePptoSelloutService.updateBasePptoSellout(Number(id), updateBasePptoSelloutDto);
            res.status(StatusCodes.OK).json({ message: 'Base de ppto de sellout actualizado correctamente', basePptoSellout });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async createBasePptoSelloutBatch(req: Request, res: Response): Promise<void> {
        try {
            if (!Array.isArray(req.body)) {
                throw new Error('Se esperaba un array de objetos para crear');
            }

            const createDtos = plainToInstance(CreateBasePptoSelloutDto, req.body);

            const results = await this.basePptoSelloutService.createBasePptoSelloutBatch(createDtos);

            res.status(StatusCodes.OK).json({ message: 'Base de ppto de sellout creada correctamente', results });
        } catch (error: any) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
    }

    async deleteBasePptoSellout(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.basePptoSelloutService.deleteBasePptoSellout(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Base de ppto de sellout eliminado correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getBasePptoSellout(req: Request, res: Response) {
        try {
            const { page, limit, search } = req.query;
            const basePptoSellout = await this.basePptoSelloutService.getFilteredStoresMaster(Number(page), Number(limit), search as string);
            res.status(StatusCodes.OK).json(basePptoSellout);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    // base values sellout
    async createBaseValuesSellout(req: Request, res: Response) {
        try {
            const createBaseValuesSelloutDto: CreateBaseValuesSelloutDto = plainToClass(CreateBaseValuesSelloutDto, req.body);
            const baseValuesSellout = await this.baseValuesSelloutService.createBaseValuesSellout(createBaseValuesSelloutDto);
            res.status(StatusCodes.CREATED).json({ message: 'Base de valores de sellout creado correctamente', baseValuesSellout });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateBaseValuesSellout(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateBaseValuesSelloutDto: UpdateBaseValuesSelloutDto = plainToClass(UpdateBaseValuesSelloutDto, req.body);
            const baseValuesSellout = await this.baseValuesSelloutService.updateBaseValuesSellout(Number(id), updateBaseValuesSelloutDto);
            res.status(StatusCodes.OK).json({ message: 'Base de valores de sellout actualizado correctamente', baseValuesSellout });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async createBaseValuesSelloutBatch(req: Request, res: Response): Promise<void> {
        try {
            if (!Array.isArray(req.body)) {
                throw new Error('Se esperaba un array de objetos para crear');
            }

            const createDtos = plainToInstance(CreateBaseValuesSelloutDto, req.body);

            const results = await this.baseValuesSelloutService.createBaseValuesSelloutBatch(createDtos);

            res.status(StatusCodes.OK).json(results);
        } catch (error: any) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
    }

    async getBaseValuesSellout(req: Request, res: Response) {
        try {
            const { page, limit, search } = req.query;
            const baseValuesSellout = await this.baseValuesSelloutService.getFilteredStoresMaster(Number(page), Number(limit), search as string);
            res.status(StatusCodes.OK).json(baseValuesSellout);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteBaseValuesSellout(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.baseValuesSelloutService.deleteBaseValuesSellout(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Base de valores de sellout eliminado correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }



}
