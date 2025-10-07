import { DataSource } from 'typeorm';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToClass } from 'class-transformer';
import { CreateStoreConfigurationDtoIds, CreateStoreConfigurationWithEmployeesDto, CreateStoreConfigurationWithEmployeesDtoIds, StoreConfigurationSearchDto, UpdateStoreConfigurationDto } from '../dtos/store.configuration.dto';
import { StoreConfigurationService } from '../services/store.configuration.service';
import { CreateEmployForMonthDto, UpdateEmployForMonthDto } from '../dtos/advisor.configuration.dto';
import { CreateGroupedByStoreDto } from '../dtos/grouped.by.store.dto';
import { CreateGroupedByAdvisorDto } from '../dtos/grouped.by.advisor.dto';

export class StoreConfigurationController {
    private storeConfigurationService: StoreConfigurationService;
    constructor(dataSource: DataSource) {
        this.storeConfigurationService = new StoreConfigurationService(dataSource);

        // Store Configuration
        this.createStoreConfiguration = this.createStoreConfiguration.bind(this);
        this.updateStoreConfiguration = this.updateStoreConfiguration.bind(this);
        this.deleteStoreConfiguration = this.deleteStoreConfiguration.bind(this);
        this.searchStoreConfiguration = this.searchStoreConfiguration.bind(this);

        // Advisor Configuration
        this.createAdvisorConfiguration = this.createAdvisorConfiguration.bind(this);
        this.updateAdvisorConfiguration = this.updateAdvisorConfiguration.bind(this);
        this.deleteAdvisorConfiguration = this.deleteAdvisorConfiguration.bind(this);
        this.createEmployForMonthConfigurations = this.createEmployForMonthConfigurations.bind(this);
        this.getAdvisorConfigurationByStoreConfigurationId = this.getAdvisorConfigurationByStoreConfigurationId.bind(this);
        this.createStoreConfigurationBatch = this.createStoreConfigurationBatch.bind(this);

        // Store Ppto Marcimex
        this.getFilteredStorePptpMarcimex = this.getFilteredStorePptpMarcimex.bind(this);
        // Grouped By Store Configuration
        this.createGroupedByStore = this.createGroupedByStore.bind(this);
        this.getGroupedByStore = this.getGroupedByStore.bind(this);
        this.deleteGroupedByStore = this.deleteGroupedByStore.bind(this);

        // Grouped By Advisor Configuration
        this.createGroupedByAdvisor = this.createGroupedByAdvisor.bind(this);
        this.getGroupedByAdvisor = this.getGroupedByAdvisor.bind(this);
        this.deleteGroupedByAdvisor = this.deleteGroupedByAdvisor.bind(this);

    }

    async createStoreConfiguration(req: Request, res: Response) {
        try {
            const createStoreConfigurationDto: CreateStoreConfigurationDtoIds = plainToClass(CreateStoreConfigurationDtoIds, req.body);
            const storeConfiguration = await this.storeConfigurationService.createStoreConfiguration(createStoreConfigurationDto);
            res.status(StatusCodes.CREATED).json(storeConfiguration);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async updateStoreConfiguration(req: Request, res: Response) {
        try {
            const { id } = req.query;
            const updateStoreConfigurationDto: UpdateStoreConfigurationDto = plainToClass(UpdateStoreConfigurationDto, req.body);
            const storeConfiguration = await this.storeConfigurationService.updateStoreConfiguration(Number(id), updateStoreConfigurationDto);
            res.status(StatusCodes.OK).json({ message: 'Configuración de tienda actualizada correctamente', storeConfiguration });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteStoreConfiguration(req: Request, res: Response) {
        try {
            const { id } = req.query;
            await this.storeConfigurationService.deleteStoreConfiguration(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Configuración de tienda eliminada correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async searchStoreConfiguration(req: Request, res: Response) {
        try {
            const search = req.query.search as string;
            const companyId = Number(req.query.companyId);
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const storeConfiguration =
                await this.storeConfigurationService.searchStoreConfigurationPaginated(
                    search,
                    companyId,
                    page,
                    limit
                );
            res.status(StatusCodes.OK).json(storeConfiguration);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    // Store Ppto Marcimex

    async getFilteredStorePptpMarcimex(req: Request, res: Response) {
        try {
            const page = Number(req.query.page);
            const limit = Number(req.query.limit);
            const search = req.query.search as string;
            const calculateDate = req.query.calculateDate as string;

            const filteredConsolidatedDataStores = await this.storeConfigurationService.getStorePptoMarcimexData(page!, limit!, search, calculateDate);
            res.status(StatusCodes.OK).json(filteredConsolidatedDataStores);

        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    // Grouped By Store Configuration
    async createGroupedByStore(req: Request, res: Response) {
        try {
            const createGroupedByStoreDto: CreateGroupedByStoreDto = plainToClass(CreateGroupedByStoreDto, req.body);
            const groupedByStore = await this.storeConfigurationService.createGroupedByStoreConfiguration(createGroupedByStoreDto);
            res.status(StatusCodes.CREATED).json({ message: 'Agrupación por tienda creada correctamente', groupedByStore });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getGroupedByStore(req: Request, res: Response) {
        try {
            const { storeId } = req.query;
            const calculateDate = req.query.calculateDate as string;
            const groupedByStore = await this.storeConfigurationService.getGroupedByStoreConfiguration(Number(storeId), new Date(calculateDate));
            res.status(StatusCodes.OK).json(groupedByStore);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteGroupedByStore(req: Request, res: Response) {
        try {
            const { id } = req.query;
            await this.storeConfigurationService.deleteGroupedByStoreConfiguration(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Agrupación por tienda eliminada correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    // Grouped By Advisor Configuration
    async createGroupedByAdvisor(req: Request, res: Response) {
        try {
            const createGroupedByAdvisorDto: CreateGroupedByAdvisorDto = plainToClass(CreateGroupedByAdvisorDto, req.body);
            const groupedByAdvisor = await this.storeConfigurationService.createGroupedByAdvisorConfiguration(createGroupedByAdvisorDto);
            res.status(StatusCodes.CREATED).json({ message: 'Agrupación de asesores por tienda creada correctamente', groupedByAdvisor });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getGroupedByAdvisor(req: Request, res: Response) {
        try {
            const { storeId } = req.query;
            const groupedByAdvisor = await this.storeConfigurationService.getGroupedByAdvisorConfiguration(Number(storeId));
            res.status(StatusCodes.OK).json(groupedByAdvisor);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteGroupedByAdvisor(req: Request, res: Response) {
        try {
            const { id } = req.query;
            await this.storeConfigurationService.deleteGroupedByAdvisorConfiguration(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Agrupación por asesor eliminada correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    // Advisor Configuration
    async createAdvisorConfiguration(req: Request, res: Response) {
        try {
            const createAdvisorConfigurationDto: CreateEmployForMonthDto = plainToClass(CreateEmployForMonthDto, req.body);
            const advisorConfiguration = await this.storeConfigurationService.createEmployForMonthConfiguration(createAdvisorConfigurationDto);
            res.status(StatusCodes.CREATED).json({ message: 'Configuración de advisor creada correctamente', advisorConfiguration });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async createEmployForMonthConfigurations(req: Request, res: Response): Promise<void> {
        try {
            const createEmployForMonthConfigurationsDto = plainToClass(
                CreateEmployForMonthDto,
                req.body
            );

            if (!Array.isArray(createEmployForMonthConfigurationsDto) || createEmployForMonthConfigurationsDto.length === 0) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "El cuerpo de la solicitud debe ser un array no vacío." });
                return;
            }

            const results = await Promise.all(
                createEmployForMonthConfigurationsDto.map(dto => this.storeConfigurationService.createEmployForMonthConfiguration(dto))
            );

            res.status(StatusCodes.CREATED).json(results);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    }

    async updateAdvisorConfiguration(req: Request, res: Response) {
        try {
            const { id } = req.query;
            const updateAdvisorConfigurationDto: UpdateEmployForMonthDto = plainToClass(UpdateEmployForMonthDto, req.body);
            const advisorConfiguration = await this.storeConfigurationService.updateEmployForMonthConfiguration(Number(id), updateAdvisorConfigurationDto);
            res.status(StatusCodes.OK).json({ message: 'Configuración de advisor actualizada correctamente', advisorConfiguration });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async deleteAdvisorConfiguration(req: Request, res: Response) {
        try {
            const { id } = req.query;
            await this.storeConfigurationService.deleteAdvisorConfiguration(Number(id));
            res.status(StatusCodes.OK).json({ message: 'Configuración de advisor eliminada correctamente' });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async getAdvisorConfigurationByStoreConfigurationId(req: Request, res: Response) {
        try {
            const { id } = req.query;
            const advisorConfigurations = await this.storeConfigurationService.getAdvisorConfigurationByStoreConfigurationId(Number(id));
            res.status(StatusCodes.OK).json(advisorConfigurations);
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    async createStoreConfigurationBatch(req: Request, res: Response) {
        try {
            const dtoList = plainToClass(CreateStoreConfigurationWithEmployeesDto, req.body);

            if (!Array.isArray(dtoList) || dtoList.length === 0) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "El cuerpo debe ser un array no vacío de configuraciones de tienda." });
            }

            const result = await this.storeConfigurationService.createStoreConfigurations(dtoList);

            return res.status(StatusCodes.CREATED).json({
                message: 'Configuraciones de tiendas procesadas correctamente.',
                ...result,
            });
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

}
