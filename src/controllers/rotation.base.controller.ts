
import { DataSource } from 'typeorm';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToClass } from 'class-transformer';
import { RotationBaseService } from '../services/rotation.base.service';
import { CreateRotationBaseDto, UpdateRotationBaseDto } from '../dtos/rotation.base.dto';

export class RotationBaseController {
    private rotationBaseService: RotationBaseService;
    constructor(dataSource: DataSource) {

        this.rotationBaseService = new RotationBaseService(dataSource);

        // rotation base

        this.createRotationBase = this.createRotationBase.bind(this);
        this.updateRotationBase = this.updateRotationBase.bind(this);
        this.deleteRotationBase = this.deleteRotationBase.bind(this);
        this.getRotationBases = this.getRotationBases.bind(this);
    }

    async createRotationBase(req: Request, res: Response) {
        try {
            const createRotationBaseDto: CreateRotationBaseDto = plainToClass(CreateRotationBaseDto, req.body);
            const rotationBase = await this.rotationBaseService.createRotationBase(createRotationBaseDto);
            res.status(StatusCodes.CREATED).json({ message: 'Rotación base creada correctamente', rotationBase });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateRotationBase(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateRotationBaseDto: UpdateRotationBaseDto = plainToClass(UpdateRotationBaseDto, req.body);
            const rotationBase = await this.rotationBaseService.updateRotationBase(Number(id), updateRotationBaseDto);
            res.status(StatusCodes.OK).json({ message: 'Rotación base actualizada correctamente', rotationBase });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteRotationBase(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.rotationBaseService.deleteRotationBase(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Rotación base eliminada correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getRotationBases(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string);
            const limit = parseInt(req.query.limit as string);
            const search = req.query.search as string;

            const result = await this.rotationBaseService.getRotationBases(
                page, limit, search
            );

            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    }




}
