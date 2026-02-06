import { DataSource } from "typeorm";
import { ConfigLinesService } from "../services/conf.lines.service";
import { Request, Response } from "express";
import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ConfigLineListDto, CreateConfigLineDto, SearchConfigLineDto, UpdateConfigLineDto } from "../dtos/conf.lines.dto";
import { StatusCodes } from "http-status-codes";

export class ConfigLinesController {
    private configLinesService: ConfigLinesService;
    constructor(dataSourceRepository: DataSource) {
        this.configLinesService = new ConfigLinesService(dataSourceRepository);
        this.createConfigLine = this.createConfigLine.bind(this);
        this.createOrUpdateAllConfigLines = this.createOrUpdateAllConfigLines.bind(this);
        this.updateConfigLine = this.updateConfigLine.bind(this);
        this.deleteConfigLine = this.deleteConfigLine.bind(this);
        this.getConfigLineById = this.getConfigLineById.bind(this);
        this.getConfigLines = this.getConfigLines.bind(this);
        this.getConfigLinesPaginated = this.getConfigLinesPaginated.bind(this);

    }

    async createConfigLine(req: Request, res: Response) {
        try {
            const createConfigLineDto = plainToClass(CreateConfigLineDto, req.body);
            const errors = await validate(createConfigLineDto);
            if (errors.length > 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({ errors });
            }
            const configLine = await this.configLinesService.create(createConfigLineDto);
            return res.status(StatusCodes.OK).json(configLine);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    async createOrUpdateAllConfigLines(req: Request, res: Response) {
        try {
            const createConfigLineDtos = plainToInstance(ConfigLineListDto, req.body);
            console.log(createConfigLineDtos);
            const errorsArrays = await Promise.all(createConfigLineDtos.lines.map(async (dto) => validate(dto)));
            const errors = errorsArrays.flat();
            if (errors.length > 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({ errors });
            }
            const configLine = await this.configLinesService.createOrUpdateAll(createConfigLineDtos);
            return res.status(StatusCodes.OK).json({ mensaje: configLine });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    async updateConfigLine(req: Request, res: Response) {
        try {
            const updateConfigLineDto = plainToClass(UpdateConfigLineDto, req.body);
            const errors = await validate(updateConfigLineDto);
            if (errors.length > 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({ errors });
            }
            const configLine = await this.configLinesService.update(Number(req.params.id), updateConfigLineDto);
            return res.status(StatusCodes.OK).json(configLine);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    async deleteConfigLine(req: Request, res: Response) {
        try {
            const configLine = await this.configLinesService.delete(Number(req.params.id));
            if (configLine) {
                return res.status(StatusCodes.OK).json({ mensaje: "Configuración de línea eliminada correctamente" });
            }
            return res.status(StatusCodes.NOT_FOUND).json({ mensaje: "Configuración de línea no encontrada" });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    async getConfigLineById(req: Request, res: Response) {
        try {
            const configLine = await this.configLinesService.findById(Number(req.params.id));
            return res.status(StatusCodes.OK).json(configLine);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    async getConfigLines(req: Request, res: Response) {
        try {
            const configLines = await this.configLinesService.findAll();
            return res.status(StatusCodes.OK).json(configLines);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    async getConfigLinesPaginated(req: Request, res: Response) {
        try {
            const { page, limit, name, sortBy, sortOrder } = req.query;
            const parsedPage = parseInt(page as string) || 1;
            const parsedLimit = parseInt(limit as string) || 10;
            const searchDto: SearchConfigLineDto = {
                page: parsedPage,
                limit: parsedLimit,
                name: name as string,
                sortBy: (sortBy as string) || 'id',
                sortOrder: (sortOrder as 'ASC' | 'DESC') || 'ASC'
            };
            console.log(searchDto);
            const configLines = await this.configLinesService.findPaginated(searchDto);
            return res.status(StatusCodes.OK).json({
                data: configLines.data,
                total: configLines.total
            });

        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }
}