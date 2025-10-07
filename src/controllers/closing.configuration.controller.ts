import { DataSource } from 'typeorm';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToClass } from 'class-transformer';
import { ClosingConfigurationService } from '../services/closing.configuration.service';
import { CreateClosingConfigurationDto, UpdateClosingConfigurationDto } from '../dtos/closing.cofiguration.dto';

export class ClosingConfigurationController {
    private closingConfigurationService: ClosingConfigurationService;
    constructor(dataSource: DataSource) {

        this.closingConfigurationService = new ClosingConfigurationService(dataSource);

        // closing configuration

        this.createClosingConfiguration = this.createClosingConfiguration.bind(this);
        this.updateClosingConfiguration = this.updateClosingConfiguration.bind(this);
        this.deleteClosingConfiguration = this.deleteClosingConfiguration.bind(this);
        this.getClosingConfigurations = this.getClosingConfigurations.bind(this);
    }

    async createClosingConfiguration(req: Request, res: Response) {
        try {
            const createClosingConfigurationDto: CreateClosingConfigurationDto = plainToClass(CreateClosingConfigurationDto, req.body);
            const closingConfiguration = await this.closingConfigurationService.createClosingConfiguration(createClosingConfigurationDto);
            res.status(StatusCodes.CREATED).json({ message: 'Configuración de cierre creada correctamente', closingConfiguration });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateClosingConfiguration(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateClosingConfigurationDto: UpdateClosingConfigurationDto = plainToClass(UpdateClosingConfigurationDto, req.body);
            const closingConfiguration = await this.closingConfigurationService.updateClosingConfiguration(Number(id), updateClosingConfigurationDto);
            res.status(StatusCodes.OK).json({ message: 'Configuración de cierre actualizada correctamente', closingConfiguration });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteClosingConfiguration(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.closingConfigurationService.deleteClosingConfiguration(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Configuración de cierre eliminada correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getClosingConfigurations(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string);
            const limit = parseInt(req.query.limit as string);
            const search = req.query.search as string;
            const calculateMonth = req.query.calculateMonth as string;

            const result = await this.closingConfigurationService.getClosingConfigurations(
                page, limit, search, calculateMonth
            );

            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    }




}
