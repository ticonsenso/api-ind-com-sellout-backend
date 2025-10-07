import { plainToClass } from "class-transformer";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DataSource } from "typeorm";
import {
  CreateDataSourceColumnConfigDto,
  SearchDataSourceColumnConfigDto,
  UpdateDataSourceColumnConfigDto,
} from "../dtos/data.source.column.configs.dto";
import {
  CreateDataSourceDto,
  SearchDataSourceDto,
  UpdateDataSourceDto,
} from "../dtos/data.sources.dto";
import {
  CreateDetailTablesConfigDto,
  DetailTablesConfigSearchParamsDto,
  UpdateDetailTablesConfigDto,
} from "../dtos/detail.tables.config.dto";
import {
  CreateExtractedDataDto,
  SearchExtractedDataDto,
  UpdateExtractedDataDto,
} from "../dtos/extracted.data.dto";
import {
  CreateExtractionLogDto,
  SearchExtractionLogDto,
  UpdateExtractionLogDto,
} from "../dtos/extraction.logs.dto";
import { decodeToken } from "../middleware/auth.middleware";
import { DataSourceColumnConfigsService } from "../services/data.source.column.configs.service";
import { DataSourcesService } from "../services/data.sources.service";
import { DetailTablesConfigService } from "../services/detail.tables.config.service";
import { ExtractedDataService } from "../services/extracted.data.service";
import { ExtractionLogsService } from "../services/extraction.logs.service";

export class ConfigureEtlController {
  public dataSourcesService: DataSourcesService;
  public dataSourceColumnConfigsService: DataSourceColumnConfigsService;
  public extractionLogsService: ExtractionLogsService;
  public extractedDataService: ExtractedDataService;
  public detailTablesConfigService: DetailTablesConfigService;
  constructor(dataSourceRepository: DataSource) {
    this.dataSourcesService = new DataSourcesService(dataSourceRepository);
    this.dataSourceColumnConfigsService = new DataSourceColumnConfigsService(
      dataSourceRepository
    );
    this.extractionLogsService = new ExtractionLogsService(
      dataSourceRepository
    );
    this.extractedDataService = new ExtractedDataService(dataSourceRepository);
    this.detailTablesConfigService = new DetailTablesConfigService(
      dataSourceRepository
    );
    this.createDataSource = this.createDataSource.bind(this);
    this.updateDataSource = this.updateDataSource.bind(this);
    this.deleteDataSource = this.deleteDataSource.bind(this);
    this.searchDataSourcePaginated = this.searchDataSourcePaginated.bind(this);
    this.createDataSourceColumnConfig =
      this.createDataSourceColumnConfig.bind(this);

    this.updateDataSourceColumnConfig =
      this.updateDataSourceColumnConfig.bind(this);
    this.deleteDataSourceColumnConfig =
      this.deleteDataSourceColumnConfig.bind(this);
    this.searchDataSourceColumnConfigPaginated =
      this.searchDataSourceColumnConfigPaginated.bind(this);
    this.createExtractionLog = this.createExtractionLog.bind(this);
    this.updateExtractionLog = this.updateExtractionLog.bind(this);
    this.deleteExtractionLog = this.deleteExtractionLog.bind(this);
    this.searchExtractionLogPaginated =
      this.searchExtractionLogPaginated.bind(this);
    this.createExtractedData = this.createExtractedData.bind(this);
    this.updateExtractedData = this.updateExtractedData.bind(this);
    this.deleteExtractedData = this.deleteExtractedData.bind(this);
    this.searchExtractedDataPaginated =
      this.searchExtractedDataPaginated.bind(this);
    this.createDetailTablesConfig = this.createDetailTablesConfig.bind(this);
    this.updateDetailTablesConfig = this.updateDetailTablesConfig.bind(this);
    this.deleteDetailTablesConfig = this.deleteDetailTablesConfig.bind(this);
    this.searchDetailTablesConfigPaginated =
      this.searchDetailTablesConfigPaginated.bind(this);
  }

  async createDataSource(req: Request, res: Response) {
    try {
      const authHeader = req.header("Authorization");
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        throw new Error("Token no proporcionado");
      }
      const userConsenso = decodeToken(token);
      const createDataSourceDto = plainToClass(CreateDataSourceDto, req.body);
      const dataSource = await this.dataSourcesService.createDataSource(
        createDataSourceDto,
        userConsenso
      );
      res
        .status(StatusCodes.OK)
        .json({ message: "Fuente de datos creada correctamente", dataSource });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateDataSource(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateDataSourceDto = plainToClass(UpdateDataSourceDto, req.body);
      const authHeader = req.header("Authorization");
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        throw new Error("Token no proporcionado");
      }
      const userConsenso = decodeToken(token);
      const dataSource = await this.dataSourcesService.updateDataSource(
        Number(id),
        updateDataSourceDto,
        userConsenso
      );
      res.status(StatusCodes.OK).json({
        message: "Fuente de datos actualizada correctamente",
        dataSource,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteDataSource(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.dataSourcesService.deleteDataSource(Number(id));
      res
        .status(StatusCodes.OK)
        .json({ message: "Fuente de datos eliminada correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchDataSourcePaginated(req: Request, res: Response) {
    try {
      const searchDto = plainToClass(SearchDataSourceDto, req.body);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const dataSources =
        await this.dataSourcesService.searchDataSourcePaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(dataSources);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Data Source Column Configs

  async createDataSourceColumnConfig(req: Request, res: Response) {
    try {
      const createConfigDto = plainToClass(
        CreateDataSourceColumnConfigDto,
        req.body
      );
      const config =
        await this.dataSourceColumnConfigsService.createDataSourceColumnConfig(
          createConfigDto
        );
      res.status(StatusCodes.CREATED).json({
        message: "Configuración de columna creada correctamente",
        config,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateDataSourceColumnConfig(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateConfigDto = plainToClass(
        UpdateDataSourceColumnConfigDto,
        req.body
      );
      const config =
        await this.dataSourceColumnConfigsService.updateDataSourceColumnConfig(
          Number(id),
          updateConfigDto
        );
      res.status(StatusCodes.OK).json({
        message: "Configuración de columna actualizada correctamente",
        config,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteDataSourceColumnConfig(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.dataSourceColumnConfigsService.deleteDataSourceColumnConfig(
        Number(id)
      );
      res
        .status(StatusCodes.OK)
        .json({ message: "Configuración de columna eliminada correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchDataSourceColumnConfigPaginated(req: Request, res: Response) {
    try {
      const searchDto = plainToClass(SearchDataSourceColumnConfigDto, req.body);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const configs =
        await this.dataSourceColumnConfigsService.searchDataSourceColumnConfigPaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(configs);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Extraction Logs
  async createExtractionLog(req: Request, res: Response) {
    try {
      const createLogDto = plainToClass(CreateExtractionLogDto, req.body);
      const authHeader = req.header("Authorization");
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        throw new Error("Token no proporcionado");
      }
      const userConsenso = decodeToken(token);
      const log = await this.extractionLogsService.createExtractionLog(
        createLogDto,
        userConsenso
      );
      res.status(StatusCodes.CREATED).json({
        message: "Registro de extracción creado correctamente",
        log,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateExtractionLog(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateLogDto = plainToClass(UpdateExtractionLogDto, req.body);
      const authHeader = req.header("Authorization");
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        throw new Error("Token no proporcionado");
      }
      const userConsenso = decodeToken(token);
      const log = await this.extractionLogsService.updateExtractionLog(
        Number(id),
        updateLogDto,
        userConsenso
      );
      res.status(StatusCodes.OK).json({
        message: "Registro de extracción actualizado correctamente",
        log,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteExtractionLog(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.extractionLogsService.deleteExtractionLog(Number(id));
      res
        .status(StatusCodes.OK)
        .json({ message: "Registro de extracción eliminado correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchExtractionLogPaginated(req: Request, res: Response) {
    try {
      const searchDto = plainToClass(SearchExtractionLogDto, req.body);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const logs =
        await this.extractionLogsService.searchExtractionLogPaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(logs);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Extracted Data
  async createExtractedData(req: Request, res: Response) {
    try {
      const createExtractedDataDto = plainToClass(
        CreateExtractedDataDto,
        req.body
      );
      const authHeader = req.header("Authorization");
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        throw new Error("Token no proporcionado");
      }
      const userConsenso = decodeToken(token);
      const extractedData = await this.extractedDataService.createExtractedData(
        createExtractedDataDto,
        userConsenso
      );
      res.status(StatusCodes.CREATED).json({
        message: "Datos extraídos creados correctamente",
        extractedData,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateExtractedData(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateExtractedDataDto = plainToClass(
        UpdateExtractedDataDto,
        req.body
      );
      const authHeader = req.header("Authorization");
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        throw new Error("Token no proporcionado");
      }
      const userConsenso = decodeToken(token);
      const extractedData = await this.extractedDataService.updateExtractedData(
        Number(id),
        updateExtractedDataDto,
        userConsenso
      );
      res.status(StatusCodes.OK).json({
        message: "Datos extraídos actualizados correctamente",
        extractedData,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteExtractedData(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.extractedDataService.deleteExtractedData(Number(id));
      res
        .status(StatusCodes.OK)
        .json({ message: "Datos extraídos eliminados correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchExtractedDataPaginated(req: Request, res: Response) {
    try {
      const searchDto = plainToClass(SearchExtractedDataDto, req.body);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const extractedData =
        await this.extractedDataService.searchExtractedDataPaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(extractedData);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Detail Tables Config
  async createDetailTablesConfig(req: Request, res: Response) {
    try {
      const createDetailTablesConfigDto = plainToClass(
        CreateDetailTablesConfigDto,
        req.body
      );
      const detailTablesConfig =
        await this.detailTablesConfigService.createDetailTablesConfig(
          createDetailTablesConfigDto
        );
      res.status(StatusCodes.CREATED).json({
        message: "Configuración de tablas de detalle creada correctamente",
        detailTablesConfig,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateDetailTablesConfig(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateDetailTablesConfigDto = plainToClass(
        UpdateDetailTablesConfigDto,
        req.body
      );
      const detailTablesConfig =
        await this.detailTablesConfigService.updateDetailTablesConfig(
          Number(id),
          updateDetailTablesConfigDto
        );
      res.status(StatusCodes.OK).json({
        message: "Configuración de tablas de detalle actualizada correctamente",
        detailTablesConfig,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteDetailTablesConfig(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.detailTablesConfigService.deleteDetailTablesConfig(Number(id));
      res.status(StatusCodes.OK).json({
        message: "Configuración de tablas de detalle eliminada correctamente",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchDetailTablesConfigPaginated(req: Request, res: Response) {
    try {
      const searchDto = plainToClass(
        DetailTablesConfigSearchParamsDto,
        req.body
      );
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const detailTablesConfig =
        await this.detailTablesConfigService.searchDetailTablesConfigPaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(detailTablesConfig);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
