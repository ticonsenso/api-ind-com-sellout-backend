import {plainToClass} from "class-transformer";
import {DataSource as TypeORMDataSource} from "typeorm";
import {DataSourceResponseDto} from "../dtos/data.sources.dto";
import {
    CreateExtractionLogDto,
    ExtractionLogListResponseDto,
    ExtractionLogLocalDto,
    ExtractionLogResponseDto,
    SearchExtractionLogDto,
    UpdateExtractionLogDto,
} from "../dtos/extraction.logs.dto";
import {UserResponseDto} from "../dtos/users.dto";
import {UserConsenso} from "../interfaces/user.consenso";
import {ExtractionLog} from "../models/extraction.logs.model";
import {DataSourceRepository} from "../repository/data.sources.repository";
import {ExtractionLogsRepository} from "../repository/extraction.logs.repository";
import {UserRepository} from "../repository/users.repository";

export class ExtractionLogsService {
  private extractionLogsRepository: ExtractionLogsRepository;
  private userRepository: UserRepository;
  private dataSourceRepository: DataSourceRepository;

  constructor(dataSource: TypeORMDataSource) {
    this.extractionLogsRepository = new ExtractionLogsRepository(dataSource);
    this.userRepository = new UserRepository(dataSource);
    this.dataSourceRepository = new DataSourceRepository(dataSource);
  }

  async createExtractionLogLocal(
    extractionLogLocalDto: ExtractionLogLocalDto
  ): Promise<void> {
    const {
      typeAction,
      status,
      dataSourceId,
      recordsExtracted,
      recordsProcessed,
      recordsFailed,
      errorMessage,
      executionDetails,
      userConsenso,
    } = extractionLogLocalDto;
    const dataSource = await this.dataSourceRepository.findById(
      extractionLogLocalDto.dataSourceId
    );
    if (dataSource) {
      const extractionLogDto = new CreateExtractionLogDto();
      extractionLogDto.startTime = new Date();
      extractionLogDto.status = status;
      extractionLogDto.recordsExtracted = recordsExtracted;
      extractionLogDto.recordsProcessed = recordsProcessed;
      extractionLogDto.recordsFailed = recordsFailed;
      extractionLogDto.errorMessage = errorMessage;
      extractionLogDto.executionDetails = executionDetails;
      extractionLogDto.dataSourceId = dataSourceId;
      extractionLogDto.executorId = Number(userConsenso.id);
      if (typeAction === "CREATE") {
        await this.createExtractionLog(extractionLogDto, userConsenso);
      } else {
        await this.updateExtractionLog(
          dataSourceId,
          extractionLogDto,
          userConsenso
        );
      }
    }
  }

  async createExtractionLog(
    logDto: CreateExtractionLogDto,
    userConsenso: UserConsenso
  ): Promise<ExtractionLogResponseDto> {
    const executor = await this.userRepository.findById(
      Number(userConsenso.id)
    );
    if (!executor) {
      throw new Error(
        "El ejecutor con el id " + userConsenso.id + " no existe."
      );
    }
    const dataSource = await this.dataSourceRepository.findById(
      Number(logDto.dataSourceId)
    );
    if (!dataSource) {
      throw new Error(
        "La fuente de datos con el id " + logDto.dataSourceId + " no existe."
      );
    }
    const logEntity = plainToClass(ExtractionLog, logDto, {
      excludeExtraneousValues: true,
    });
    logEntity.executor = executor;
    logEntity.dataSource = dataSource;
    const savedLog = await this.extractionLogsRepository.create(logEntity);
    return plainToClass(ExtractionLogResponseDto, savedLog, {
      excludeExtraneousValues: true,
    });
  }

  async updateExtractionLog(
    id: number,
    logDto: UpdateExtractionLogDto,
    userConsenso: UserConsenso
  ): Promise<ExtractionLogResponseDto> {
    const log = await this.extractionLogsRepository.findById(id);
    if (!log) {
      throw new Error(
        "El registro de extracción con el id " + id + " no existe."
      );
    }
    const executor = await this.userRepository.findById(
      Number(userConsenso.id)
    );
    if (!executor) {
      throw new Error(
        "El ejecutor con el id " + userConsenso.id + " no existe."
      );
    }
    const dataSource = await this.dataSourceRepository.findById(
      Number(logDto.dataSourceId)
    );
    if (!dataSource) {
      throw new Error(
        "La fuente de datos con el id " + logDto.dataSourceId + " no existe."
      );
    }
    log.executor = executor;
    log.dataSource = dataSource;
    Object.keys(logDto).forEach((key) => {
      const typedKey = key as keyof UpdateExtractionLogDto;
      if (logDto[typedKey] !== undefined && typedKey in log) {
        (log as any)[typedKey] = logDto[typedKey];
      }
    });
    const updatedLog = await this.extractionLogsRepository.update(id, log);
    return plainToClass(ExtractionLogResponseDto, updatedLog, {
      excludeExtraneousValues: true,
    });
  }

  async deleteExtractionLog(id: number): Promise<void> {
    const log = await this.extractionLogsRepository.findById(id);
    if (!log) {
      throw new Error(
        "El registro de extracción con el id " + id + " no existe."
      );
    }
    await this.extractionLogsRepository.delete(id);
  }

  async searchExtractionLogPaginated(
    searchDto: SearchExtractionLogDto,
    page: number = 1,
    limit: number = 10
  ): Promise<ExtractionLogListResponseDto> {
    const result = await this.extractionLogsRepository.findByFilters(
      searchDto,
      page,
      limit
    );
    const logDtos = result.items.map((log) => {
      const logDto = plainToClass(ExtractionLogResponseDto, log, {
        excludeExtraneousValues: true,
      });
      const executor = plainToClass(UserResponseDto, log.executor, {
        excludeExtraneousValues: true,
      });
      const dataSource = plainToClass(DataSourceResponseDto, log.dataSource, {
        excludeExtraneousValues: true,
      });
      logDto.executor = executor;
      logDto.dataSource = dataSource;
      return logDto;
    });
    return plainToClass(ExtractionLogListResponseDto, {
      items: logDtos,
      total: result.total,
    });
  }
}
