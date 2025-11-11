import {plainToClass} from "class-transformer";
import {DataSource as TypeORMDataSource} from "typeorm";
import {DataSourceResponseDto} from "../dtos/data.sources.dto";
import {
    CreateExtractedDataDto,
    ExtractedDataListResponseDto,
    ExtractedDataResponseDto,
    SearchExtractedDataDto,
    UpdateExtractedDataDto,
} from "../dtos/extracted.data.dto";
import {ExtractionLogResponseDto} from "../dtos/extraction.logs.dto";
import {UserResponseDto} from "../dtos/users.dto";
import {UserConsenso} from "../interfaces/user.consenso";
import {ExtractedData} from "../models/extracted.data.model";
import {DataSourceRepository} from "../repository/data.sources.repository";
import {ExtractedDataRepository} from "../repository/extracted.data.repository";
import {ExtractionLogsRepository} from "../repository/extraction.logs.repository";
import {UserRepository} from "../repository/users.repository";
import {CalculationProductExtrategicService} from "./calculation.product.extrategic.service";
import {EmployeesService} from "./employees.service";
import {ProductComplianceService} from "./product.compliance.service";
import {StoreConfigurationService} from "./store.configuration.service";
import {UserService} from "./users.service";
import {AdvisorCommissionService} from "./advisor.commision.service";
import {StoreManagerCalculationCommissionService} from "./store.manager.calculation.commission.service";

export class ExtractedDataService {
  private extractedDataRepository: ExtractedDataRepository;
  private dataSourceRepository: DataSourceRepository;
  private userRepository: UserRepository;
  private extractionLogsRepository: ExtractionLogsRepository;
  private productComplianceService: ProductComplianceService;
  private calculationProductExtrategicService: CalculationProductExtrategicService;
  private usersService: UserService;
  private employeesService: EmployeesService;
  private storeConfigurationService: StoreConfigurationService;
  private advisorCommissionService: AdvisorCommissionService;
  private storeManagerCalculationCommissionService: StoreManagerCalculationCommissionService;

  constructor(dataSource: TypeORMDataSource) {
    this.extractedDataRepository = new ExtractedDataRepository(dataSource);
    this.dataSourceRepository = new DataSourceRepository(dataSource);
    this.userRepository = new UserRepository(dataSource);
    this.extractionLogsRepository = new ExtractionLogsRepository(dataSource);
    this.productComplianceService = new ProductComplianceService(dataSource);
    this.calculationProductExtrategicService =
      new CalculationProductExtrategicService(dataSource);
    this.usersService = new UserService(dataSource);
    this.employeesService = new EmployeesService(dataSource);
    this.storeConfigurationService = new StoreConfigurationService(dataSource);
    this.advisorCommissionService = new AdvisorCommissionService(dataSource);
    this.storeManagerCalculationCommissionService = new StoreManagerCalculationCommissionService(dataSource);
  }

  async createExtractedData(
    extractedDataDto: CreateExtractedDataDto,
    userConsenso: UserConsenso
  ): Promise<ExtractedDataResponseDto | String> {
    const start = new Date();
    const entityExtractedData = plainToClass(ExtractedData, extractedDataDto);
    const user = await this.userRepository.findByDni(userConsenso.cedula);
    if (user) {
      entityExtractedData.processor = user;
      entityExtractedData.creator = user;
    }
    const data: any = JSON.parse(JSON.stringify(extractedDataDto.dataContent));

    let dataBlockName = '';
    if (data.calculation_product_extrategic) dataBlockName = 'calculation_product_extrategic';
    else if (data.employees) dataBlockName = 'employees';
    else if (data.product_compliance) dataBlockName = 'product_compliance';
    else if (data.active_directory) dataBlockName = 'active_directory';
    else if (data.store_configuration) dataBlockName = 'store_configuration';
    else if (data.advisor_commission) dataBlockName = 'advisor_commission';
    else if (data.store_manager_calculation_commission) dataBlockName = 'store_manager_calculation_commission';

    entityExtractedData.dataName = dataBlockName;

    const records = data[dataBlockName];

    if (!Array.isArray(records) || records.length === 0) {
      throw new Error(`El bloque '${dataBlockName}' no contiene registros`);
    }

    switch (true) {
      case !!data.employees:
        const { recordCount, smsErrors } =
          await this.employeesService.processEmployeeData(data.employees);
        return this.processExtractedData(
          data.employees,
          entityExtractedData,
          recordCount,
          start,
          smsErrors
        );
      case !!data.product_compliance:
        const saveProductCompliance =
          await this.productComplianceService.createProductCompliance(
            data.product_compliance,
            entityExtractedData.calculateDate as Date
          );
        return this.processExtractedData(
          data.product_compliance,
          entityExtractedData,
          saveProductCompliance.count,
          start,
          saveProductCompliance.smsErrors
        );
      case !!data.calculation_product_extrategic:
        const saveCalculationProductExtrategic =
          await this.calculationProductExtrategicService.createCalculationProductExtrategic(
            data.calculation_product_extrategic
          );
        return this.processExtractedData(
          data.calculation_product_extrategic,
          entityExtractedData,
          saveCalculationProductExtrategic.count,
          start,
          saveCalculationProductExtrategic.smsErrors
        );
      case !!data.active_directory:
        const createUserLoginActiveDirectory =
          await this.usersService.createUserLoginActiveDirectory(
            data.active_directory
          );
        return this.processExtractedData(
          data.active_directory,
          entityExtractedData,
          createUserLoginActiveDirectory.count,
          start
        );
      case !!data.store_configuration:
        const saveStoreConfiguration =
          await this.storeConfigurationService.createStoreConfigurationWithEmployees(
            data.store_configuration,
            entityExtractedData.calculateDate as Date
          );
        return this.processExtractedData(
          data.store_configuration,
          entityExtractedData,
          saveStoreConfiguration.count,
          start,
          saveStoreConfiguration.smsErrors

        );
      case !!data.advisor_commission:
        const saveAdvisorCommission =
          await this.advisorCommissionService.createAdvisorCommission(
            data.advisor_commission
          );
        return this.processExtractedData(
          data.advisor_commission,
          entityExtractedData,
          saveAdvisorCommission.count,
          start,
          saveAdvisorCommission.smsErrors
        );
      case !!data.store_manager_calculation_commission:
        const saveStoreManagerCalculationCommission =
          await this.storeManagerCalculationCommissionService.createStoreManagerCalculationCommission(
            data.store_manager_calculation_commission,
            entityExtractedData.calculateDate as Date
          );
        return this.processExtractedData(
          data.store_manager_calculation_commission,
          entityExtractedData,
          saveStoreManagerCalculationCommission.recordCount,
          start,
          saveStoreManagerCalculationCommission.smsErrors
        );
      default:
        await this.extractedDataRepository.create(entityExtractedData);
        return "Los datos extraidos se han guardado correctamente, en la table general ya que aun no cuanta con una configuracion de tablas detalle.";
    }
  }

  //Se procesan los datos generales de la extraccion
  private async processExtractedData(
    data: any,
    entityExtractedData: ExtractedData,
    recordCount: number,
    start: Date,
    smsErrors: string[] = []
  ): Promise<ExtractedDataResponseDto> {
    const groupedSmsErrors = Object.entries(
      smsErrors.reduce((acc, error) => {
        acc[error] = (acc[error] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([error, count]) => count > 1 ? `${error} (x${count})` : error);
    entityExtractedData.recordCount = recordCount;
    entityExtractedData.isProcessed = true;
    entityExtractedData.processedDate = new Date();
    entityExtractedData.processingDetails = {
      duration: new Date().getTime() - start.getTime(),
      error: data.length - recordCount,
      smsErrors: groupedSmsErrors,
    };
    const extractedData =
      await this.extractedDataRepository.create(entityExtractedData);
    return plainToClass(ExtractedDataResponseDto, extractedData, {
      excludeExtraneousValues: true,
    });
  }

  async updateExtractedData(
    id: number,
    extractedDataDto: UpdateExtractedDataDto,
    userConsenso: UserConsenso
  ): Promise<ExtractedDataResponseDto> {
    const extractedData = await this.extractedDataRepository.findById(id);
    if (!extractedData) {
      throw new Error("Los datos extraídos con el id " + id + " no existen.");
    }

    if (extractedDataDto.dataSourceId) {
      const dataSource = await this.dataSourceRepository.findById(
        Number(extractedDataDto.dataSourceId)
      );
      if (!dataSource) {
        throw new Error(
          "La fuente de datos con el id " +
          extractedDataDto.dataSourceId +
          " no existe."
        );
      }
      extractedData.dataSource = dataSource;
    }

    if (extractedDataDto.extractionLogId) {
      const extractionLog = await this.extractionLogsRepository.findById(
        Number(extractedDataDto.extractionLogId)
      );
      if (!extractionLog) {
        throw new Error(
          "El registro de extracción con el id " +
          extractedDataDto.extractionLogId +
          " no existe."
        );
      }
      extractedData.extractionLog = extractionLog;
    }

    if (userConsenso.id) {
      const processor = await this.userRepository.findById(
        Number(userConsenso.id)
      );
      if (!processor) {
        throw new Error(
          "El procesador con el id " + userConsenso.id + " no existe."
        );
      }
      extractedData.processor = processor;
    }

    if (userConsenso.id) {
      const creator = await this.userRepository.findById(
        Number(userConsenso.id)
      );
      if (!creator) {
        throw new Error(
          "El creador con el id " + userConsenso.id + " no existe."
        );
      }
      extractedData.creator = creator;
    }

    Object.keys(extractedDataDto).forEach((key) => {
      const typedKey = key as keyof UpdateExtractedDataDto;
      if (
        extractedDataDto[typedKey] !== undefined &&
        typedKey !== "dataSourceId" &&
        typedKey !== "extractionLogId" &&
        typedKey in extractedData
      ) {
        (extractedData as any)[typedKey] = extractedDataDto[typedKey];
      }
    });
    const user = await this.userRepository.findById(Number(userConsenso.id));
    if (!user) {
      throw new Error(
        "El usuario con el id " + userConsenso.id + " no existe."
      );
    }
    extractedData.processor = user;
    extractedData.creator = user;
    const updatedExtractedData = await this.extractedDataRepository.update(
      id,
      extractedData
    );
    return plainToClass(ExtractedDataResponseDto, updatedExtractedData, {
      excludeExtraneousValues: true,
    });
  }

  async deleteExtractedData(id: number): Promise<void> {
    const extractedData = await this.extractedDataRepository.findById(id);
    if (!extractedData) {
      throw new Error("Los datos extraídos con el id " + id + " no existen.");
    }
    await this.extractedDataRepository.delete(id);
  }

  async searchExtractedDataPaginated(
    searchDto: SearchExtractedDataDto,
    page: number = 1,
    limit: number = 10
  ): Promise<ExtractedDataListResponseDto> {
    const result = await this.extractedDataRepository.findByFilters(
      searchDto,
      page,
      limit
    );
    const extractedDataDtos = result.items.map((extractedData) => {
      const dataSource = plainToClass(
        DataSourceResponseDto,
        extractedData.dataSource,
        {
          excludeExtraneousValues: true,
        }
      );
      const extractionLog = plainToClass(
        ExtractionLogResponseDto,
        extractedData.extractionLog,
        {
          excludeExtraneousValues: true,
        }
      );
      const processor = plainToClass(UserResponseDto, extractedData.processor, {
        excludeExtraneousValues: true,
      });
      const creator = plainToClass(UserResponseDto, extractedData.creator, {
        excludeExtraneousValues: true,
      });

      return plainToClass(
        ExtractedDataResponseDto,
        {
          ...extractedData,
          dataSource,
          extractionLog,
          processor,
          creator,
        },
        {
          excludeExtraneousValues: true,
        }
      );
    });

    return plainToClass(
      ExtractedDataListResponseDto,
      {
        items: extractedDataDtos,
        total: result.total,
      },
      { excludeExtraneousValues: true }
    );
  }
}
