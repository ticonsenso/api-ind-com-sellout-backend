import {DataSource} from 'typeorm';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {plainToClass} from 'class-transformer';
import {decodeToken} from '../middleware/auth.middleware';
import {SelloutConfigurationService} from '../services/sellout.configuration.service';
import {CreateSelloutConfigurationDto, UpdateSelloutConfigurationDto} from '../dtos/sellout.configuration.dto';
import {
    CreateSelloutConfigurationColumnConfigsDto,
    UpdateSelloutConfigurationColumnConfigsDto
} from '../dtos/sellout.configuration.column.configs.dto';
import {CreateExtractedDataSelloutDto, UpdateExtractedDataSelloutDto} from '../dtos/extrated.data.sellout.dto';
import {ExtratedDataSelloutService} from '../services/extrated.data.sell.out.service';

export class SelloutConfigurationController {
    private selloutConfigurationService: SelloutConfigurationService;
    private extratedDataSelloutService: ExtratedDataSelloutService;
    constructor(dataSource: DataSource) {
        // sellout configuration
        this.selloutConfigurationService = new SelloutConfigurationService(dataSource);
        this.extratedDataSelloutService = new ExtratedDataSelloutService(dataSource);
        this.createSelloutConfiguration = this.createSelloutConfiguration.bind(this);
        this.updateSelloutConfiguration = this.updateSelloutConfiguration.bind(this);
        this.deleteSelloutConfiguration = this.deleteSelloutConfiguration.bind(this);
        this.getFilteredSelloutConfigurations = this.getFilteredSelloutConfigurations.bind(this);
        // sellout configuration column configs
        this.createSelloutConfigurationColumnConfigs = this.createSelloutConfigurationColumnConfigs.bind(this);
        this.createSelloutConfigurationColumnConfigsBatch = this.createSelloutConfigurationColumnConfigsBatch.bind(this);
        this.updateSelloutConfigurationColumnConfigs = this.updateSelloutConfigurationColumnConfigs.bind(this);
        this.deleteSelloutConfigurationColumnConfigs = this.deleteSelloutConfigurationColumnConfigs.bind(this);
        this.getFilteredSelloutConfigurationColumnConfigs = this.getFilteredSelloutConfigurationColumnConfigs.bind(this);
        // extracted data sellout
        this.createExtractedDataSellout = this.createExtractedDataSellout.bind(this);
        this.updateExtractedDataSellout = this.updateExtractedDataSellout.bind(this);
        this.deleteExtractedDataSellout = this.deleteExtractedDataSellout.bind(this);
        this.getFilteredExtractedDataSellout = this.getFilteredExtractedDataSellout.bind(this);
        this.deleteDataSelloutDistribuidorAndStoreName = this.deleteDataSelloutDistribuidorAndStoreName.bind(this);
    }

    async createSelloutConfiguration(req: Request, res: Response) {
        try {
            const createSelloutConfigurationDto: CreateSelloutConfigurationDto = plainToClass(CreateSelloutConfigurationDto, req.body);
            const selloutConfiguration = await this.selloutConfigurationService.createSelloutConfiguration(createSelloutConfigurationDto);
            res.status(StatusCodes.CREATED).json({ message: 'Configuración de sellout creada correctamente', selloutConfiguration });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateSelloutConfiguration(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateSelloutConfigurationDto: UpdateSelloutConfigurationDto = plainToClass(UpdateSelloutConfigurationDto, req.body);
            const selloutConfiguration = await this.selloutConfigurationService.updateSelloutConfiguration(Number(id), updateSelloutConfigurationDto);
            res.status(StatusCodes.OK).json({ message: 'Configuración de sellout actualizada correctamente', selloutConfiguration });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteSelloutConfiguration(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.selloutConfigurationService.deleteSelloutConfiguration(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Configuración de sellout eliminada correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getFilteredSelloutConfigurations(req: Request, res: Response) {
        try {
            const page = Number(req.query.page);
            const limit = Number(req.query.limit);
            const search = req.query.search as string;
            const filteredSelloutConfigurations = await this.selloutConfigurationService.getFilteredSelloutConfigurations(page, limit, search);
            res.status(StatusCodes.OK).json(filteredSelloutConfigurations);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }
    async createSelloutConfigurationColumnConfigs(req: Request, res: Response) {
        try {
            const createSelloutConfigurationColumnConfigsDto: CreateSelloutConfigurationColumnConfigsDto = plainToClass(CreateSelloutConfigurationColumnConfigsDto, req.body);
            const selloutConfigurationColumnConfigs = await this.selloutConfigurationService.createSelloutConfigurationColumnConfigs(createSelloutConfigurationColumnConfigsDto);
            res.status(StatusCodes.CREATED).json({ message: 'Configuración de columna creada correctamente', selloutConfigurationColumnConfigs });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async createSelloutConfigurationColumnConfigsBatch(req: Request, res: Response) {
        try {
            const createSelloutConfigurationColumnConfigsDto = plainToClass(
                CreateSelloutConfigurationColumnConfigsDto,
                req.body
            );

            if (!Array.isArray(createSelloutConfigurationColumnConfigsDto) || createSelloutConfigurationColumnConfigsDto.length === 0) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "El cuerpo de la solicitud debe ser un array no vacío." });
                return;
            }

            const configs =
                await this.selloutConfigurationService.createSelloutConfigurationColumnConfigsBatch(
                    createSelloutConfigurationColumnConfigsDto
                );

            res.status(StatusCodes.CREATED).json({
                message: "Configuraciones de columnas creadas correctamente",
                configs,
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    async updateSelloutConfigurationColumnConfigs(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateSelloutConfigurationColumnConfigsDto: UpdateSelloutConfigurationColumnConfigsDto = plainToClass(UpdateSelloutConfigurationColumnConfigsDto, req.body);
            const selloutConfigurationColumnConfigs = await this.selloutConfigurationService.updateSelloutConfigurationColumnConfigs(Number(id), updateSelloutConfigurationColumnConfigsDto);
            res.status(StatusCodes.OK).json({ message: 'Configuración de columna actualizada correctamente', selloutConfigurationColumnConfigs });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteSelloutConfigurationColumnConfigs(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.selloutConfigurationService.deleteSelloutConfigurationColumnConfigs(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Configuración de columna eliminado correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getFilteredSelloutConfigurationColumnConfigs(req: Request, res: Response) {
        try {

            const search = req.query.search as string;
            const selloutConfigurationId = req.query.selloutConfigurationId ? Number(req.query.selloutConfigurationId) : undefined;
            const filteredSelloutConfigurationColumnConfigs = await this.selloutConfigurationService.getFilteredSelloutConfigurationColumnConfigs(search, selloutConfigurationId);
            res.status(StatusCodes.OK).json(filteredSelloutConfigurationColumnConfigs);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async createExtractedDataSellout(req: Request, res: Response) {
        try {
            const createExtractedDataSelloutDto = plainToClass(
                CreateExtractedDataSelloutDto,
                req.body
            );
            const authHeader = req.header("Authorization");
            const token = authHeader && authHeader.split(" ")[1];
            if (!token) {
                throw new Error("Token no proporcionado");
            }
            const userConsenso = decodeToken(token);
            const extractedData = await this.extratedDataSelloutService.createExtractedDataSellout(
                createExtractedDataSelloutDto,
                userConsenso
            );
            res.status(StatusCodes.CREATED).json( extractedData );
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    async updateExtractedDataSellout(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateExtractedDataSelloutDto: UpdateExtractedDataSelloutDto = plainToClass(UpdateExtractedDataSelloutDto, req.body);
            const extractedDataSellout = await this.extratedDataSelloutService.updateExtractedDataSellout(Number(id), updateExtractedDataSelloutDto);
            res.status(StatusCodes.OK).json({ message: 'Datos extraídos actualizados correctamente', extractedDataSellout });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteExtractedDataSellout(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.extratedDataSelloutService.deleteExtractedDataSellout(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Datos extraídos eliminados correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getFilteredExtractedDataSellout(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const filteredExtractedDataSellout = await this.extratedDataSelloutService.getFilteredExtractedDataSellout(page, limit);
            res.status(StatusCodes.OK).json(filteredExtractedDataSellout);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteDataSelloutDistribuidorAndStoreName(req: Request, res: Response) {  
         const {distribuidor,storeName,calculateDate} = req.body;
        try {
            if (!calculateDate) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "calculateDate es requerido" });
                return;
            }
            if (!distribuidor) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Distribuidor es requerido" });
                return;
            }
            if (storeName) {
                await this.extratedDataSelloutService.deleteDataSelloutDistribuidorAndStoreName(distribuidor,storeName,calculateDate);
                return res.status(StatusCodes.OK).json({ message: 'Datos eliminados correctamente para el distribuidor y el nombre de tienda.' });
            }else{
               await this.extratedDataSelloutService.deleteDataSelloutDistribuidor(distribuidor,calculateDate);
                return res.status(StatusCodes.OK).json({ message: 'Datos eliminados correctamente para el distribuidor.' });
            }
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }
}

