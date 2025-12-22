import { DataSource } from 'typeorm';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToClass, plainToInstance } from 'class-transformer';
import { MatriculationService } from '../services/matriculation.service';
import { CreateMatriculationTemplateDto, DeleteMatriculationTemplateDto, UpdateMatriculationTemplateDto } from '../dtos/matriculation.templates.dto';
import { CreateMatriculationLogDto, UpdateMatriculationLogDto } from '../dtos/matriculation.logs.dto';
import { CreateSelloutProductMasterDto } from '../dtos/sellout.product.master.dto';
import { decodeToken } from '../middleware/auth.middleware';

export class MatriculationController {
    private matriculationService: MatriculationService;
    constructor(dataSource: DataSource) {

        this.matriculationService = new MatriculationService(dataSource);

        // matriculation templates

        this.createMatriculationTemplate = this.createMatriculationTemplate.bind(this);
        this.createMatriculationTemplatesBatch = this.createMatriculationTemplatesBatch.bind(this);
        this.updateMatriculationTemplate = this.updateMatriculationTemplate.bind(this);
        this.deleteMatriculationTemplate = this.deleteMatriculationTemplate.bind(this);
        this.getMatriculationTemplates = this.getMatriculationTemplates.bind(this);
        this.getMatriculationTemplatesSimple = this.getMatriculationTemplatesSimple.bind(this);
        this.createMatriculationTemplateBeforeMonth = this.createMatriculationTemplateBeforeMonth.bind(this);

        // matriculation logs

        this.createMatriculationLog = this.createMatriculationLog.bind(this);
        this.updateMatriculationLog = this.updateMatriculationLog.bind(this);
        this.deleteMatriculationLog = this.deleteMatriculationLog.bind(this);
        this.getMatriculationLogs = this.getMatriculationLogs.bind(this);
        this.isAlreadyUploaded = this.isAlreadyUploaded.bind(this);
        this.deleteMatriculationTemplateAll = this.deleteMatriculationTemplateAll.bind(this);
    }

    async createMatriculationTemplate(req: Request, res: Response) {
        try {
            const createMatriculationTemplateDto: CreateMatriculationTemplateDto = plainToClass(CreateMatriculationTemplateDto, req.body);
            const matriculationTemplate = await this.matriculationService.createMatriculationTemplate(createMatriculationTemplateDto);
            res.status(StatusCodes.CREATED).json({ message: 'Matriculación de plantillas creada correctamente', matriculationTemplate });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async createMatriculationTemplatesBatch(req: Request, res: Response) {
        try {
            const createSelloutProductMasterDto = plainToClass(CreateSelloutProductMasterDto, req.body);
            if (!Array.isArray(createSelloutProductMasterDto) || createSelloutProductMasterDto.length === 0) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "El cuerpo de la solicitud debe ser un array no vacío." });
                return;
            }
            await this.matriculationService.createMatriculationTemplatesBatch(createSelloutProductMasterDto);
            res.status(StatusCodes.CREATED).json({ message: 'Matriculación de plantillas creadas correctamente', createSelloutProductMasterDto });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateMatriculationTemplate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateMatriculationTemplateDto: UpdateMatriculationTemplateDto = plainToClass(UpdateMatriculationTemplateDto, req.body);
            const matriculationTemplate = await this.matriculationService.updateMatriculationTemplate(Number(id), updateMatriculationTemplateDto);
            res.status(StatusCodes.OK).json({ message: 'Matriculación de plantillas actualizada correctamente', matriculationTemplate });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async createMatriculationTemplateBeforeMonth(req: Request, res: Response) {
        try {
            const calculateMonth = req.query.calculateMonth as string;
            const copyMonth = req.query.copyMonth as string;
            console.log(calculateMonth, copyMonth);
            const result = await this.matriculationService.createMatriculationTemplateBeforeMonth(calculateMonth, copyMonth);
            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteMatriculationTemplate(req: Request, res: Response) {
        try {
            const deleteMatriculationTemplateDto: DeleteMatriculationTemplateDto = plainToInstance(
                DeleteMatriculationTemplateDto,
                req.body,
                { enableImplicitConversion: true }
            );
            const result = await this.matriculationService.deleteMatriculationTemplate(deleteMatriculationTemplateDto);
            if (result instanceof Array) {
                res.status(StatusCodes.OK).json({ message: result });
            } else {
                res.status(StatusCodes.OK).json({ message: result });
            }
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteMatriculationTemplateAll(req: Request, res: Response) {
        try {
            const deleteMatriculationTemplateDto: DeleteMatriculationTemplateDto = plainToInstance(
                DeleteMatriculationTemplateDto,
                req.body,
                { enableImplicitConversion: true }
            );
            const result = await this.matriculationService.deleteMatriculationTemplateAll(deleteMatriculationTemplateDto);
            res.status(StatusCodes.OK).json({ message: result });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getMatriculationTemplates(req: Request, res: Response) {
        try {

            const calculateDate = req.query.calculateDate as string;
            const distributor = req.query.distributor as string;
            const storeName = req.query.storeName as string;

            const result = await this.matriculationService.getMatriculationTemplatesWithFilters(
                calculateDate,
                distributor,
                storeName
            );

            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    }

    async getMatriculationTemplatesSimple(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;
            const calculateMonth = req.query.calculateMonth as string;
            const result = await this.matriculationService.getMatriculationTemplates(
                page, limit, search, calculateMonth
            );

            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    }

    async createMatriculationLog(req: Request, res: Response) {
        try {
            const createMatriculationLogDto: CreateMatriculationLogDto = plainToClass(CreateMatriculationLogDto, req.body);
            const authHeader = req.header("Authorization");
            const token = authHeader && authHeader.split(" ")[1];
            if (!token) {
                throw new Error("Token no proporcionado");
            }
            const userConsenso = decodeToken(token);
            const matriculationLog = await this.matriculationService.createMatriculationLog(createMatriculationLogDto, userConsenso);
            res.status(StatusCodes.CREATED).json({ message: 'Revisión de matriculación creada correctamente', matriculationLog });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateMatriculationLog(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateMatriculationLogDto: UpdateMatriculationLogDto = plainToClass(UpdateMatriculationLogDto, req.body);
            const matriculationLog = await this.matriculationService.updateMatriculationLog(Number(id), updateMatriculationLogDto);
            res.status(StatusCodes.OK).json({ message: 'Revisión de matriculación actualizada correctamente', matriculationLog });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteMatriculationLog(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.matriculationService.deleteMatriculationLog(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Revisión de matriculación eliminada correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getMatriculationLogs(req: Request, res: Response) {

        try {
            const calculateDate = req.query.calculateDate as string;
            const matriculationLogs = await this.matriculationService.getMatriculationLogs(calculateDate);
            res.status(StatusCodes.OK).json({ message: 'Revisión de matriculación obtenidas correctamente', matriculationLogs });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async isAlreadyUploaded(req: Request, res: Response) {
        try {
            const { distributor, storeName, calculateDate } = req.query;
            const isAlreadyUploaded = await this.matriculationService.hasBeenUploaded(distributor as string, storeName as string, calculateDate as string);
            res.status(StatusCodes.OK).json({ info: isAlreadyUploaded });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }


}
