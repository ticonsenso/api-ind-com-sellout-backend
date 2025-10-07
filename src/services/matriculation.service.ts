import { plainToInstance } from "class-transformer";
import { DataSource } from "typeorm";

import { MatriculationTemplatesRepository } from "../repository/matriculation.templates.repository";
import { MatriculationLogsRepository } from "../repository/matriculation.logs.repostitory";
import { CreateMatriculationTemplateDto, MatriculationTemplateResponseDto, MatriculationTemplateResponseWithLogsDto, UpdateMatriculationTemplateDto } from "../dtos/matriculation.templates.dto";
import { MatriculationTemplate } from "../models/matriculation.templates.model";
import { CreateMatriculationLogDto, MatriculationLogResponseDto, MatriculationLogResponseDtoLog, UpdateMatriculationLogDto } from "../dtos/matriculation.logs.dto";
import { MatriculationLog } from "../models/matriculation.logs.model";
import { chunkArray, formatDateToYYYYMMDD } from "../utils/utils";
import { parseLocalDate } from "../utils/utils";
import { ClosingConfigurationRepository } from "../repository/closing.configuration.repository";
import { ConsolidatedDataStoresRepository } from "../repository/consolidated.data.stores.repository";
import { formatDate } from "date-fns";

export class MatriculationService {
    private matriculationLogsRepository: MatriculationLogsRepository;
    private matriculationTemplateRepository: MatriculationTemplatesRepository;
    private closingConfigurationRepository: ClosingConfigurationRepository;
    private matriculationLogRepository: MatriculationLogsRepository;
    private consolidatedDataStoresRepository: ConsolidatedDataStoresRepository;
    constructor(dataSource: DataSource) {
        this.matriculationLogsRepository = new MatriculationLogsRepository(dataSource);
        this.matriculationTemplateRepository = new MatriculationTemplatesRepository(dataSource);
        this.closingConfigurationRepository = new ClosingConfigurationRepository(dataSource);
        this.matriculationLogRepository = new MatriculationLogsRepository(dataSource);
        this.consolidatedDataStoresRepository = new ConsolidatedDataStoresRepository(dataSource);
    }

    async createMatriculationTemplate(
        matriculationTemplate: CreateMatriculationTemplateDto
    ): Promise<MatriculationTemplateResponseDto> {

        const existingTemplate = await this.matriculationTemplateRepository.findByDistributorAndStoreName(matriculationTemplate.distributor!, matriculationTemplate.storeName!, parseLocalDate(matriculationTemplate.calculateMonth!));
        if (existingTemplate) {
            throw new Error("Nombre de plantilla ya existe para este mes de cálculo");
        }

        const matriculationTemplateEntity = plainToInstance(MatriculationTemplate, matriculationTemplate, {});
        const matriculationTemplateSaved =
            await this.matriculationTemplateRepository.create(matriculationTemplateEntity);
        return plainToInstance(MatriculationTemplateResponseDto, matriculationTemplateSaved, {
            excludeExtraneousValues: true,
        });
    }

    async createMatriculationTemplatesBatch(configs: CreateMatriculationTemplateDto[]): Promise<void> {
        const uniqueMap = new Map<string, CreateMatriculationTemplateDto>();

        for (const config of configs) {
            const distributor = config.distributor?.toString().replace(/ /g, '') ?? '';
            const storeName = config.storeName?.toString().replace(/ /g, '') ?? '';
            const calculateMonth = config.calculateMonth?.toString().replace(/ /g, '') ?? '';
            uniqueMap.set(distributor + storeName + calculateMonth, config);
        }

        const uniqueConfigs = Array.from(uniqueMap.values());

        const chunkSize = 2000;
        const chunks = chunkArray(uniqueConfigs, chunkSize);

        for (const chunk of chunks) {
            const distributorList = chunk.map(c => c.distributor!);
            const storeNameList = chunk.map(c => c.storeName!);

            const existingStores = await this.matriculationTemplateRepository.findByDistributorAndStoreNameArray(distributorList, storeNameList, parseLocalDate(chunk[0].calculateMonth!));

            const existingMap = new Map(existingStores.map((p: MatriculationTemplate) => [p.distributor + p.storeName, p]));

            const toUpdate = [];
            const toInsert = [];

            for (const config of chunk) {
                const existing = existingMap.get(config.distributor! + config.storeName!);
                if (existing) {
                    Object.assign(existing, {
                        ...config,
                        updatedAt: new Date(),
                    });
                    toUpdate.push(existing);
                } else {
                    toInsert.push(config);
                }
            }

            if (toUpdate.length > 0) {
                await this.matriculationTemplateRepository.save(toUpdate);
            }
            if (toInsert.length > 0) {
                await this.matriculationTemplateRepository.insert(toInsert);
            }
        }
    }

    async createMatriculationTemplateBeforeMonth(calculateMonth: string, copyMonth: string): Promise<{ message: string }> {
        const matriculationTemplates = await this.matriculationTemplateRepository.findByCalculateMonth(parseLocalDate(copyMonth));
        let existingTemplates = 0;
        let createdTemplates = 0;
        for (const template of matriculationTemplates) {
            const existingTemplate = await this.matriculationTemplateRepository.findByDistributorAndStoreName(template.distributor, template.storeName!, parseLocalDate(calculateMonth));
            if (existingTemplate) {
                existingTemplates++;
                continue;   
            }
            const newTemplate = {
                calculateMonth: parseLocalDate(calculateMonth),
                distributor: template.distributor ?? undefined,
                storeName: template.storeName ?? undefined,
                status: true,
            }
            try {
                await this.matriculationTemplateRepository.create(newTemplate);
                createdTemplates++;
            } catch (error) {
                console.log(error);
            }
        }
        return { message: `Se han creado ${createdTemplates} plantillas y se han encontrado ${existingTemplates} plantillas existentes para el mes ${calculateMonth}` };
    }

    async updateMatriculationTemplate(
        id: number,
        matriculationTemplate: UpdateMatriculationTemplateDto
    ): Promise<MatriculationTemplateResponseDto> {
        const existingTemplate = await this.matriculationTemplateRepository.findById(id);
        if (!existingTemplate) {
            throw new Error("Matriculación de plantilla no encontrada");
        }
        const matriculationTemplateEntity = plainToInstance(MatriculationTemplate, matriculationTemplate, {
            excludeExtraneousValues: true,
        });
        matriculationTemplateEntity.status = matriculationTemplate.status;
        matriculationTemplateEntity.distributor = matriculationTemplate.distributor!;
        matriculationTemplateEntity.calculateMonth = matriculationTemplate.calculateMonth ? parseLocalDate(matriculationTemplate.calculateMonth) : undefined;
        matriculationTemplateEntity.storeName = matriculationTemplate.storeName!;
        matriculationTemplateEntity.updatedAt = new Date();
        const matriculationTemplateUpdated =
            await this.matriculationTemplateRepository.update(id, matriculationTemplateEntity);
        return plainToInstance(MatriculationTemplateResponseDto, matriculationTemplateUpdated, {
            excludeExtraneousValues: true,
        });
    }

    async deleteMatriculationTemplate(id: number): Promise<void> {
        const existingTemplate = await this.matriculationTemplateRepository.findById(id);
        if (!existingTemplate) {
            throw new Error("Matriculación de plantilla no encontrada");
        }
        await this.matriculationTemplateRepository.delete(id);
    }

    async getMatriculationTemplatesWithFilters(calculateDate?: string): Promise<MatriculationTemplateResponseWithLogsDto[]> {
        const templatesWithLogs = await this.matriculationTemplateRepository.findAllWithLogs(calculateDate);

        const filteredTemplates = templatesWithLogs.map(template => {
            const logs = template.logs || [];

            const filteredLogs = calculateDate
                ? logs.filter(log =>
                    log.calculateDate &&
                    new Date(log.calculateDate).toISOString().split('T')[0] === calculateDate
                )
                : logs;

            const isUploaded = filteredLogs.some(log => (log.uploadCount ?? 0) > 0);
            const rowCountTotal = filteredLogs.reduce((acc, log) => acc + (log.rowsCount ?? 0), 0);
            const productCountTotal = filteredLogs.reduce((acc, log) => acc + (log.productCount ?? 0), 0);

            return {
                ...template,
                calculateDate: isUploaded ? calculateDate : null,
                isUploaded,
                rowCountTotal,
                productCountTotal,
                logs: filteredLogs.map(log =>
                    plainToInstance(MatriculationLogResponseDto, log, {
                        excludeExtraneousValues: true,
                    })
                ),
            };
        });

        const sortedTemplates = filteredTemplates.sort((a, b) => {
            return (b.isUploaded ? 1 : 0) - (a.isUploaded ? 1 : 0);
        });

        return plainToInstance(MatriculationTemplateResponseWithLogsDto, sortedTemplates, {
            excludeExtraneousValues: true,
        });
    }

    async getMatriculationTemplates(
        page?: number,
        limit?: number,
        search?: string,
        calculateMonth?: string,
    ): Promise<{ items: MatriculationTemplateResponseDto[]; total: number }> {
        const { items, total } = await this.matriculationTemplateRepository.findByFilters(page, limit, search, calculateMonth?.toString().slice(0, 7));
        return {
            items: items.map(item => plainToInstance(MatriculationTemplateResponseDto, item, {
                excludeExtraneousValues: true,
            })), total
        };
    }

    async createMatriculationLog(
        matriculationLog: CreateMatriculationLogDto
    ): Promise<MatriculationLogResponseDto> {
        const existingTemplate = await this.matriculationTemplateRepository.findById(matriculationLog.matriculationId!);
        if (!existingTemplate) {
            throw new Error("Matriculación de plantilla no encontrada");
        }

        const existingLog = await this.matriculationLogsRepository.findByMatriculationIdAndCalculateDate(
            existingTemplate.id!,
            matriculationLog.calculateDate!,
            matriculationLog.distributor ?? '',
            matriculationLog.storeName ?? ''
        );
        if (existingLog) {
            throw new Error("Ya existe un registro con ese excel y fecha de cálculo");
        }

        const matriculationLogEntity = plainToInstance(MatriculationLog, matriculationLog, {});
        matriculationLogEntity.matriculation = existingTemplate;

        const matriculationLogSaved =
            await this.matriculationLogsRepository.create(matriculationLogEntity);
        return plainToInstance(MatriculationLogResponseDto, matriculationLogSaved, {
            excludeExtraneousValues: true,
        });
    }

    async updateMatriculationLog(
        id: number,
        matriculationLog: UpdateMatriculationLogDto
    ): Promise<MatriculationLogResponseDto> {
        const existingLog = await this.matriculationLogsRepository.findById(id);

        if (!existingLog) {
            throw new Error("Matriculación de log no encontrada");
        }

        const existingTemplate = await this.matriculationTemplateRepository.findById(matriculationLog.matriculationId!);
        if (!existingTemplate) {
            throw new Error("Matriculación de plantilla no encontrada");
        }

        const matriculationLogEntity = plainToInstance(MatriculationLog, matriculationLog, { excludeExtraneousValues: true });
        matriculationLogEntity.matriculation = existingTemplate;
        matriculationLogEntity.distributor = matriculationLog.distributor;
        matriculationLogEntity.storeName = matriculationLog.storeName;
        matriculationLogEntity.rowsCount = matriculationLog.rowsCount;
        matriculationLogEntity.productCount = matriculationLog.productCount;
        matriculationLogEntity.uploadTotal = matriculationLog.uploadTotal ?? 0;
        matriculationLogEntity.uploadCount = matriculationLog.uploadCount ?? 0;
        matriculationLogEntity.updatedAt = new Date();
        const matriculationLogSaved =
            await this.matriculationLogsRepository.update(id, matriculationLogEntity);
        return plainToInstance(MatriculationLogResponseDto, matriculationLogSaved, {
            excludeExtraneousValues: true,
        });
    }

    async deleteMatriculationLog(id: number): Promise<void> {
        const existingLog = await this.matriculationLogsRepository.findById(id);
        if (!existingLog) {
            throw new Error("Revisión de matriculación no encontrada");
        }
        await this.consolidatedDataStoresRepository.deleteAllByMatriculationId(id, existingLog.calculateDate);
        await this.matriculationLogsRepository.delete(id);
    }

    async getMatriculationLogs(calculateDate: string): Promise<MatriculationLogResponseDto[]> {

        const matriculationLogs = await this.matriculationLogsRepository.findByCalculateDate(calculateDate);
        return plainToInstance(MatriculationLogResponseDto, matriculationLogs, {
            excludeExtraneousValues: true,
        });
    }
    async hasBeenUploaded(
        distributor: string,
        storeName: string,
        calculateDate: string
    ): Promise<{ message: string; status: boolean }> {
        const template = await this.matriculationTemplateRepository.findByDistributorAndStoreName(distributor, storeName, parseLocalDate(calculateDate));

        const date = calculateDate.toString().split('T')[0];
        const year = date.split('-')[0];
        const month = date.split('-')[1];

        const closingConfig = await this.closingConfigurationRepository.findByMonthYear(Number(year), Number(month));
        if (!closingConfig) {
            return { message: "", status: true };
        }

        function normalizeToStartOfDay(date: Date) {
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        }

        function createUTCDateOnly(year: number, month: number, day: number): Date {
            return new Date(Date.UTC(year, month, day));
        }

        const dateClosingISO = new Date(closingConfig.closingDate).toISOString().split('T')[0];
        const dateClosingYear = dateClosingISO.split('-')[0];
        const dateClosingMonth = dateClosingISO.split('-')[1];
        const dateClosingDay = dateClosingISO.split('-')[2];

        const startDateISO = new Date(closingConfig.startDate!).toISOString().split('T')[0];
        const startDateNumber = startDateISO.split('-')[1];

        const closingDate = normalizeToStartOfDay(new Date(Number(dateClosingYear), Number(dateClosingMonth) - 1, Number(dateClosingDay)));
        const closingMonth = createUTCDateOnly(closingDate.getFullYear(), Number(startDateNumber) - 1, 1);
        const today = normalizeToStartOfDay(new Date());

        const isInRange = today >= closingMonth && today <= closingDate;

        if (!template && isInRange) {
            return { message: "", status: true };
        }

        if (template && !template?.status) {
            return {
                message: "La plantilla no está habilitada para esta fecha de cálculo, por favor habilítela.",
                status: false
            };
        }
        // Obtenemos el log de ese mes y nombre
        const log = await this.matriculationLogRepository.findByMatriculationNameAndCalculateDate(
            template?.distributor!,
            template?.storeName!
        );

        if (isInRange) {
            if (!log) {
                // Dentro del rango y aún no ha subido
                return { message: "", status: true };
            } else {
                // Dentro del rango, pero ya subió
                return {
                    message: "Ya se han cargado datos previamente con esta plantilla. Si continúas, la información actual será reemplazada.",
                    status: true
                };
            }
        }

        return {
            message: "La acción no puede completarse porque la fecha actual está fuera del rango permitido para el cierre.",
            status: false
        };
    }


}
