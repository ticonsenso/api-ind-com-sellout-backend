import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DataSource } from "typeorm";
import {
  CommissionConfigurationSearchDto,
  CreateCommissionConfigurationDto,
  UpdateCommissionConfigurationDto,
} from "../dtos/commission.configurations.dto";
import {
  CommissionParameterSearchDto,
  CreateCommissionParameterDto,
  UpdateCommissionParameterDto,
} from "../dtos/commission.parameters.dto";
import { CommissionRuleSearchDto, CreateCommissionRuleDto, UpdateCommissionRuleDto, } from "../dtos/commission.rules.dto";
import { CompanySearchDto, CreateCompanyDto, UpdateCompanyDto } from "../dtos/companies.dto";
import {
  CompanyPositionSearchDto,
  CreateCompanyPositionDto,
  UpdateCompanyPositionDto,
} from "../dtos/company.positions.dto";
import { CreateEmployeeDto, EmployeeSearchDto, UpdateEmployeeDto, } from "../dtos/employees.dto";
import { CreateKpiConfigDto, SearchKpiConfigDto, UpdateKpiConfigDto, } from "../dtos/kpi.config.dto";
import { CreateMonthlyGoalDto, MonthlyGoalSearchDto, UpdateMonthlyGoalDto, } from "../dtos/monthly.goals.dto";
import { CreateMonthlyResultDto, MonthlyResultSearchDto, UpdateMonthlyResultDto, } from "../dtos/monthly.results.dto";
import {
  CreateParameterCategoryDto,
  ParameterCategorySearchDto,
  UpdateParameterCategoryDto,
} from "../dtos/parameter.categories.dto";
import {
  CreateParameterLineDto,
  CreateParameterLineSearchDto,
  UpdateParameterLineDto,
} from "../dtos/parameter.lines.dto";
import { CreateProductLineDto, ProductLineSearchDto, UpdateProductLineDto, } from "../dtos/product.lines.dto";
import { CreateSeasonDto, SearchSeasonDto, UpdateSeasonDto, } from "../dtos/season.dto";
import {
  CreateSettlementPeriodDto,
  SettlementPeriodSearchDto,
  UpdateSettlementPeriodDto,
} from "../dtos/settlement.periods.dto";
import { CreateStoreSizeDto, StoreSizeSearchDto, UpdateStoreSizeDto, } from "../dtos/store.size.dto";
import { CreateVariableScaleDto, UpdateVariableScaleDto, VariableScaleSearchDto, } from "../dtos/variable.scales.dto";
import { CommissionConfigurationsService } from "../services/commission.configurations.service";
import { CommissionParametersService } from "../services/commission.parameters.service";
import { CommissionRulesService } from "../services/commission.rules.service";
import { CompaniesService } from "../services/companies.service";
import { CompanyPositionsService } from "../services/company.positions.service";
import { EmployeesService } from "../services/employees.service";
import { KpiConfigService } from "../services/kpi.config.service";
import { MonthlyGoalsService } from "../services/monthly.goals.service";
import { MonthlyResultsService } from "../services/monthly.results.service";
import { ParameterCategoriesService } from "../services/parameter.categories.service";
import { ParameterLinesService } from "../services/parameter.lines.service";
import { ProductLinesService } from "../services/product.lines.service";
import { SeasonsService } from "../services/seasons.service";
import { SettlementPeriodsService } from "../services/settlement.periods.service";
import { StoreSizeService } from "../services/store.size.service";
import { VariableScalesService } from "../services/variable.scales.service";
import {
  CreateSalesRotationConfigurationDto,
  SalesRotationConfigurationSearchDto,
  UpdateSalesRotationConfigurationDto
} from "../dtos/sales.rotation.configurations.dto";
import { SalesRotationConfigurationsService } from "../services/sales.rotation.configurations.service";
import { AdvisorCommissionService } from "../services/advisor.commision.service";

export class ComissionsConfigController {
  private companiesService: CompaniesService;
  private companyPositionsService: CompanyPositionsService;
  private employeesService: EmployeesService;
  private commissionConfigurationsService: CommissionConfigurationsService;
  private parameterCategoriesService: ParameterCategoriesService;
  private commissionParametersService: CommissionParametersService;
  private commissionRulesService: CommissionRulesService;
  private productLinesService: ProductLinesService;
  private monthlyGoalsService: MonthlyGoalsService;
  private monthlyResultsService: MonthlyResultsService;
  private settlementPeriodsService: SettlementPeriodsService;
  private parameterLinesService: ParameterLinesService;
  private seasonsService: SeasonsService;
  private kpiConfigService: KpiConfigService;
  private variableScalesService: VariableScalesService;
  private storeSizeService: StoreSizeService;
  private salesRotationConfigurationsService: SalesRotationConfigurationsService;
  private advisorCommissionService: AdvisorCommissionService;
  constructor(dataSource: DataSource) {
    this.companiesService = new CompaniesService(dataSource);
    this.companyPositionsService = new CompanyPositionsService(dataSource);
    this.employeesService = new EmployeesService(dataSource);
    this.commissionConfigurationsService = new CommissionConfigurationsService(
      dataSource
    );
    this.salesRotationConfigurationsService = new SalesRotationConfigurationsService(dataSource);
    this.parameterCategoriesService = new ParameterCategoriesService(
      dataSource
    );
    this.commissionParametersService = new CommissionParametersService(
      dataSource
    );
    this.advisorCommissionService = new AdvisorCommissionService(dataSource);
    this.commissionRulesService = new CommissionRulesService(dataSource);
    this.productLinesService = new ProductLinesService(dataSource);
    this.monthlyGoalsService = new MonthlyGoalsService(dataSource);
    this.monthlyResultsService = new MonthlyResultsService(dataSource);
    this.settlementPeriodsService = new SettlementPeriodsService(dataSource);
    this.parameterLinesService = new ParameterLinesService(dataSource);
    this.seasonsService = new SeasonsService(dataSource);
    this.kpiConfigService = new KpiConfigService(dataSource);
    this.variableScalesService = new VariableScalesService(dataSource);
    this.storeSizeService = new StoreSizeService(dataSource);
    this.createCompany = this.createCompany.bind(this);
    this.updateCompany = this.updateCompany.bind(this);
    this.deleteCompany = this.deleteCompany.bind(this);
    this.searchCompany = this.searchCompany.bind(this);
    //Company Positions
    this.createCompanyPosition = this.createCompanyPosition.bind(this);
    this.updateCompanyPosition = this.updateCompanyPosition.bind(this);
    this.deleteCompanyPosition = this.deleteCompanyPosition.bind(this);
    this.searchCompanyPosition = this.searchCompanyPosition.bind(this);
    // Employees
    this.createEmployee = this.createEmployee.bind(this);
    this.updateEmployee = this.updateEmployee.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
    this.deleteEmployeesByCompanyId = this.deleteEmployeesByCompanyId.bind(this);
    this.searchEmployee = this.searchEmployee.bind(this);
    this.findDistinctByIndex = this.findDistinctByIndex.bind(this);
    this.findEmployeeFilters = this.findEmployeeFilters.bind(this);
    // Commissions Configurations
    this.createCommissionConfiguration =
      this.createCommissionConfiguration.bind(this);
    this.updateCommissionConfiguration =
      this.updateCommissionConfiguration.bind(this);
    this.deleteCommissionConfiguration =
      this.deleteCommissionConfiguration.bind(this);
    this.searchCommissionConfiguration =
      this.searchCommissionConfiguration.bind(this);
    // Categoria de parametro
    this.createParameterCategory = this.createParameterCategory.bind(this);
    this.updateParameterCategory = this.updateParameterCategory.bind(this);
    this.deleteParameterCategory = this.deleteParameterCategory.bind(this);
    this.searchParameterCategory = this.searchParameterCategory.bind(this);
    // Parametros de comision
    this.createCommissionParameter = this.createCommissionParameter.bind(this);
    this.updateCommissionParameter = this.updateCommissionParameter.bind(this);
    this.deleteCommissionParameter = this.deleteCommissionParameter.bind(this);
    this.searchCommissionParameter = this.searchCommissionParameter.bind(this);
    // Reglas de comision
    this.createCommissionRule = this.createCommissionRule.bind(this);
    this.updateCommissionRule = this.updateCommissionRule.bind(this);
    this.deleteCommissionRule = this.deleteCommissionRule.bind(this);
    this.searchCommissionRule = this.searchCommissionRule.bind(this);
    this.createCommissionRulesBatch = this.createCommissionRulesBatch.bind(this);
    this.updateCommissionRulesBatch = this.updateCommissionRulesBatch.bind(this);

    // Lineas de producto
    this.createProductLine = this.createProductLine.bind(this);
    this.updateProductLine = this.updateProductLine.bind(this);
    this.deleteProductLine = this.deleteProductLine.bind(this);
    this.searchProductLine = this.searchProductLine.bind(this);
    // Metas Mensuales
    this.createMonthlyGoal = this.createMonthlyGoal.bind(this);
    this.updateMonthlyGoal = this.updateMonthlyGoal.bind(this);
    this.deleteMonthlyGoal = this.deleteMonthlyGoal.bind(this);
    this.searchMonthlyGoal = this.searchMonthlyGoal.bind(this);

    // Resultados Mensuales
    this.createMonthlyResult = this.createMonthlyResult.bind(this);
    this.updateMonthlyResult = this.updateMonthlyResult.bind(this);
    this.deleteMonthlyResult = this.deleteMonthlyResult.bind(this);
    this.searchMonthlyResults = this.searchMonthlyResults.bind(this);
    // Periodos de liquidacion
    this.createSettlementPeriod = this.createSettlementPeriod.bind(this);
    this.updateSettlementPeriod = this.updateSettlementPeriod.bind(this);
    this.deleteSettlementPeriod = this.deleteSettlementPeriod.bind(this);
    this.searchSettlementPeriod = this.searchSettlementPeriod.bind(this);
    // Lineas de parametro
    this.createParameterLine = this.createParameterLine.bind(this);
    this.updateParameterLine = this.updateParameterLine.bind(this);
    this.deleteParameterLine = this.deleteParameterLine.bind(this);
    this.searchParameterLine = this.searchParameterLine.bind(this);
    // Temporadas
    this.createSeason = this.createSeason.bind(this);
    this.updateSeason = this.updateSeason.bind(this);
    this.deleteSeason = this.deleteSeason.bind(this);
    this.searchSeason = this.searchSeason.bind(this);

    // KPI Config
    this.createKpiConfig = this.createKpiConfig.bind(this);
    this.updateKpiConfig = this.updateKpiConfig.bind(this);
    this.deleteKpiConfig = this.deleteKpiConfig.bind(this);
    this.searchKpiConfig = this.searchKpiConfig.bind(this);

    // Variable Scale
    this.createVariableScale = this.createVariableScale.bind(this);
    this.updateVariableScale = this.updateVariableScale.bind(this);
    this.deleteVariableScale = this.deleteVariableScale.bind(this);
    this.searchVariableScalePaginated =
      this.searchVariableScalePaginated.bind(this);

    // Store Size
    this.createStoreSize = this.createStoreSize.bind(this);
    this.updateStoreSize = this.updateStoreSize.bind(this);
    this.deleteStoreSize = this.deleteStoreSize.bind(this);
    this.searchStoreSizePaginated = this.searchStoreSizePaginated.bind(this);

    // Sales Rotation Configuration 
    this.createSalesRotationConfiguration = this.createSalesRotationConfiguration.bind(this);
    this.updateSalesRotationConfiguration = this.updateSalesRotationConfiguration.bind(this);
    this.deleteSalesRotationConfiguration = this.deleteSalesRotationConfiguration.bind(this);
    this.searchSalesRotationConfiguration = this.searchSalesRotationConfiguration.bind(this);
    this.createSalesRotationConfigurations = this.createSalesRotationConfigurations.bind(this);
    this.updateSalesRotationConfigurations = this.updateSalesRotationConfigurations.bind(this);
    this.deleteAllSalesRotationConfigurations = this.deleteAllSalesRotationConfigurations.bind(this);

  }

  async createCompany(req: Request, res: Response) {
    try {
      const createCompanyComissionsConfigDto: CreateCompanyDto = plainToClass(
        CreateCompanyDto,
        req.body
      );
      const companyComissionsConfig = await this.companiesService.createCompany(
        createCompanyComissionsConfigDto
      );
      res.status(StatusCodes.OK).json({
        message: "Empresa creada correctamente",
        companyComissionsConfig,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateCompany(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateCompanyDto: UpdateCompanyDto = plainToClass(
        UpdateCompanyDto,
        req.body
      );
      const companyComissionsConfig = await this.companiesService.updateCompany(
        Number(id),
        updateCompanyDto
      );
      res.status(StatusCodes.OK).json({
        message: "Empresa actualizada correctamente",
        companyComissionsConfig,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteCompany(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.companiesService.deleteCompany(Number(id));
      res
        .status(StatusCodes.OK)
        .json({ message: "Empresa eliminada correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchCompany(req: Request, res: Response) {
    try {
      const searchDto: CompanySearchDto = plainToClass(
        CompanySearchDto,
        req.body
      );
      console.log('searchDto', searchDto);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const companyComissionsConfig =
        await this.companiesService.searchCompanyPaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(companyComissionsConfig);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  //Company Positions
  async createCompanyPosition(req: Request, res: Response) {
    try {
      const createCompanyPositionDto: CreateCompanyPositionDto = plainToClass(
        CreateCompanyPositionDto,
        req.body
      );
      const companyPosition =
        await this.companyPositionsService.createCompanyPosition(
          createCompanyPositionDto
        );
      res
        .status(StatusCodes.OK)
        .json({ message: "Cargo creado correctamente", companyPosition });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateCompanyPosition(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateCompanyPositionDto: UpdateCompanyPositionDto = plainToClass(
        UpdateCompanyPositionDto,
        req.body
      );
      const companyPosition =
        await this.companyPositionsService.updateCompanyPosition(
          Number(id),
          updateCompanyPositionDto
        );
      res
        .status(StatusCodes.OK)
        .json({ message: "Cargo actualizado correctamente", companyPosition });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteCompanyPosition(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.companyPositionsService.deleteCompanyPosition(Number(id));
      res
        .status(StatusCodes.OK)
        .json({ message: "Cargo eliminado correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchCompanyPosition(req: Request, res: Response) {
    try {
      const searchDto: CompanyPositionSearchDto = plainToClass(
        CompanyPositionSearchDto,
        req.body
      );
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const companyPosition =
        await this.companyPositionsService.searchCompanyPositionPaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(companyPosition);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Empleados
  async createEmployee(req: Request, res: Response) {
    try {
      const createEmployeeDto: CreateEmployeeDto = plainToClass(
        CreateEmployeeDto,
        req.body
      );
      const employee =
        await this.employeesService.createEmployee(createEmployeeDto);
      res
        .status(StatusCodes.OK)
        .json({ message: "Empleado creado correctamente", employee });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateEmployee(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateEmployeeDto: UpdateEmployeeDto = plainToClass(
        UpdateEmployeeDto,
        req.body
      );
      const employee = await this.employeesService.updateEmployee(
        Number(id),
        updateEmployeeDto
      );
      res
        .status(StatusCodes.OK)
        .json({ message: "Empleado actualizado correctamente", employee });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteEmployee(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.employeesService.deleteEmployee(Number(id));
      res
        .status(StatusCodes.OK)
        .json({ message: "Empleado eliminado correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteEmployeesByCompanyId(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.employeesService.deleteEmployeesByCompanyId(Number(id));
      res
        .status(StatusCodes.OK)
        .json({ message: "Empleados eliminados correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async findDistinctByIndex(req: Request, res: Response) {
    try {
      const companyId = Number(req.query.companyId);
      const distinctValues = await this.employeesService.findDistinctAll(companyId);
      res.status(StatusCodes.OK).json(distinctValues);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchEmployee(req: Request, res: Response) {
    try {
      const searchDto: EmployeeSearchDto = plainToClass(
        EmployeeSearchDto,
        req.body
      );
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const calculateDate = req.query.calculateDate as string | undefined;
      const employee = await this.employeesService.searchEmployeePaginated(
        searchDto,
        page,
        limit,
        calculateDate
      );
      res.status(StatusCodes.OK).json(employee);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }


  async findEmployeeFilters(req: Request, res: Response) {
    try {
      const companyId = Number(req.query.companyId);
      const companyPositionId = Number(req.query.companyPositionId);

      if (isNaN(companyId)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "companyId es requerido y debe ser un número." });
        return;
      }

      const filters = await this.employeesService.findFilter(companyId, companyPositionId);
      res.status(StatusCodes.OK).json(filters);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Commissions Configurations
  async createCommissionConfiguration(req: Request, res: Response) {
    try {
      const createCommissionConfigurationDto: CreateCommissionConfigurationDto =
        plainToClass(CreateCommissionConfigurationDto, req.body);
      const commissionConfiguration =
        await this.commissionConfigurationsService.createCommissionConfiguration(
          createCommissionConfigurationDto
        );
      res.status(StatusCodes.OK).json({
        message: "Configuración de comisión creada correctamente",
        commissionConfiguration,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateCommissionConfiguration(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateCommissionConfigurationDto: UpdateCommissionConfigurationDto =
        plainToClass(UpdateCommissionConfigurationDto, req.body);
      const commissionConfiguration =
        await this.commissionConfigurationsService.updateCommissionConfiguration(
          Number(id),
          updateCommissionConfigurationDto
        );
      res.status(StatusCodes.OK).json({
        message: "Configuración de comisión actualizada correctamente",
        commissionConfiguration,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteCommissionConfiguration(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.commissionConfigurationsService.deleteCommissionConfiguration(
        Number(id)
      );
      res
        .status(StatusCodes.OK)
        .json({ message: "Configuración de comisión eliminada correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchCommissionConfiguration(req: Request, res: Response) {
    try {
      const searchDto: CommissionConfigurationSearchDto = plainToClass(
        CommissionConfigurationSearchDto,
        req.body
      );
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const commissionConfiguration =
        await this.commissionConfigurationsService.searchCommissionConfigurationPaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(commissionConfiguration);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  //Categoria de parametro
  async createParameterCategory(req: Request, res: Response) {
    try {
      const createParameterCategoryDto: CreateParameterCategoryDto =
        plainToClass(CreateParameterCategoryDto, req.body);
      const parameterCategory =
        await this.parameterCategoriesService.createParameterCategory(
          createParameterCategoryDto
        );
      res.status(StatusCodes.OK).json({
        message: "Categoria de parametro creada correctamente",
        parameterCategory,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateParameterCategory(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateParameterCategoryDto: UpdateParameterCategoryDto =
        plainToClass(UpdateParameterCategoryDto, req.body);
      const parameterCategory =
        await this.parameterCategoriesService.updateParameterCategory(
          Number(id),
          updateParameterCategoryDto
        );
      res.status(StatusCodes.OK).json({
        message: "Categoria de parametro actualizada correctamente",
        parameterCategory,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteParameterCategory(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.parameterCategoriesService.deleteParameterCategory(Number(id));
      res
        .status(StatusCodes.OK)
        .json({ message: "Categoria de parametro eliminada correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchParameterCategory(req: Request, res: Response) {
    try {
      const searchDto: ParameterCategorySearchDto = plainToClass(
        ParameterCategorySearchDto,
        req.body
      );
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const parameterCategory =
        await this.parameterCategoriesService.searchParameterCategoriesPaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(parameterCategory);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Parametros de comision
  async createCommissionParameter(req: Request, res: Response) {
    try {
      const createCommissionParameterDto: CreateCommissionParameterDto =
        plainToClass(CreateCommissionParameterDto, req.body);
      const commissionParameter =
        await this.commissionParametersService.createCommissionParameter(
          createCommissionParameterDto
        );
      res.status(StatusCodes.OK).json({
        message: "Parametro de comision creado correctamente",
        commissionParameter,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateCommissionParameter(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateCommissionParameterDto: UpdateCommissionParameterDto =
        plainToClass(UpdateCommissionParameterDto, req.body);
      const commissionParameter =
        await this.commissionParametersService.updateCommissionParameter(
          Number(id),
          updateCommissionParameterDto
        );
      res.status(StatusCodes.OK).json({
        message: "Parametro de comision actualizado correctamente",
        commissionParameter,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteCommissionParameter(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.commissionParametersService.deleteCommissionParameter(
        Number(id)
      );
      res
        .status(StatusCodes.OK)
        .json({ message: "Parametro de comision eliminado correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchCommissionParameter(req: Request, res: Response) {
    try {
      const searchDto: CommissionParameterSearchDto = plainToClass(
        CommissionParameterSearchDto,
        req.body
      );
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const commissionParameter =
        await this.commissionParametersService.searchCommissionParameterPaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(commissionParameter);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Reglas de comision
  async createCommissionRule(req: Request, res: Response) {
    try {
      const createCommissionRuleDto: CreateCommissionRuleDto = plainToClass(
        CreateCommissionRuleDto,
        req.body
      );
      const commissionRule =
        await this.commissionRulesService.createCommissionRule(
          createCommissionRuleDto
        );
      res.status(StatusCodes.OK).json({
        message: "Regla de comisión creada correctamente",
        commissionRule,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async createCommissionRulesBatch(req: Request, res: Response) {
    try {
      const createCommissionRulesDto = plainToClass(CreateCommissionRuleDto, req.body);
      if (!Array.isArray(createCommissionRulesDto) || createCommissionRulesDto.length === 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "El cuerpo de la solicitud debe ser un array no vacío." });
        return;
      }
      const commissionRules =
        await this.commissionRulesService.createCommissionRulesBatch(
          createCommissionRulesDto
        );
      res.status(StatusCodes.OK).json({
        message: "Reglas de comisión creadas correctamente",
        commissionRules,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateCommissionRulesBatch(req: Request, res: Response): Promise<void> {
    try {
      if (!Array.isArray(req.body)) {
        throw new Error('Se esperaba un array de objetos para actualizar');
      }

      const updateDtos = plainToInstance(UpdateCommissionRuleDto, req.body);

      const results = await this.commissionRulesService.updateCommissionRulesBatch(updateDtos);

      res.status(StatusCodes.OK).json({
        message: "Reglas de comisión actualizadas correctamente",
        results,
      });

    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateCommissionRule(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateCommissionRuleDto: UpdateCommissionRuleDto = plainToClass(
        UpdateCommissionRuleDto,
        req.body
      );
      const commissionRule =
        await this.commissionRulesService.updateCommissionRule(
          Number(id),
          updateCommissionRuleDto
        );
      res.status(StatusCodes.OK).json({
        message: "Regla de comisión actualizada correctamente",
        commissionRule,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteCommissionRule(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.commissionRulesService.deleteCommissionRule(Number(id));
      res
        .status(StatusCodes.OK)
        .json({ message: "Regla de comisión eliminada correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchCommissionRule(req: Request, res: Response) {
    try {
      const searchDto: CommissionRuleSearchDto = plainToClass(
        CommissionRuleSearchDto,
        req.body
      );
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const commissionRule =
        await this.commissionRulesService.searchCommissionRulePaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(commissionRule);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Lineas de producto

  async createProductLine(req: Request, res: Response) {
    try {
      const createProductLineDto: CreateProductLineDto = plainToClass(
        CreateProductLineDto,
        req.body
      );
      const productLine =
        await this.productLinesService.createProductLine(createProductLineDto);
      res.status(StatusCodes.OK).json({
        message: "Línea de producto creada correctamente",
        productLine,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateProductLine(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateProductLineDto: UpdateProductLineDto = plainToClass(
        UpdateProductLineDto,
        req.body
      );
      const productLine = await this.productLinesService.updateProductLine(
        Number(id),
        updateProductLineDto
      );
      res.status(StatusCodes.OK).json({
        message: "Línea de producto actualizada correctamente",
        productLine,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteProductLine(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.productLinesService.deleteProductLine(Number(id));
      res
        .status(StatusCodes.OK)
        .json({ message: "Línea de producto eliminada correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchProductLine(req: Request, res: Response) {
    try {
      const searchDto: ProductLineSearchDto = plainToClass(
        ProductLineSearchDto,
        req.body
      );
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const productLine =
        await this.productLinesService.searchProductLinePaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(productLine);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Metas Mensuales
  async createMonthlyGoal(req: Request, res: Response) {
    try {
      const createMonthlyGoalDto: CreateMonthlyGoalDto = plainToClass(
        CreateMonthlyGoalDto,
        req.body
      );
      const monthlyGoal =
        await this.monthlyGoalsService.createMonthlyGoal(createMonthlyGoalDto);
      res
        .status(StatusCodes.OK)
        .json({ message: "Meta mensual creada correctamente", monthlyGoal });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateMonthlyGoal(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateMonthlyGoalDto: UpdateMonthlyGoalDto = plainToClass(
        UpdateMonthlyGoalDto,
        req.body
      );
      const monthlyGoal = await this.monthlyGoalsService.updateMonthlyGoal(
        Number(id),
        updateMonthlyGoalDto
      );
      res.status(StatusCodes.OK).json({
        message: "Meta mensual actualizada correctamente",
        monthlyGoal,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteMonthlyGoal(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.monthlyGoalsService.deleteMonthlyGoal(Number(id));
      res
        .status(StatusCodes.OK)
        .json({ message: "Meta mensual eliminada correctamente" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async searchMonthlyGoal(req: Request, res: Response) {
    try {
      const searchDto: MonthlyGoalSearchDto = plainToClass(
        MonthlyGoalSearchDto,
        req.body
      );
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const monthlyGoal =
        await this.monthlyGoalsService.searchMonthlyGoalPaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(monthlyGoal);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  // Resultados Mensuales
  async createMonthlyResult(req: Request, res: Response): Promise<void> {
    try {
      const createDto = plainToInstance(CreateMonthlyResultDto, req.body);
      const errors = await validate(createDto);

      if (errors.length > 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ errors });
        return;
      }

      const result =
        await this.monthlyResultsService.createMonthlyResult(createDto);
      res
        .status(StatusCodes.OK)
        .json({ message: "Resultado mensual creado correctamente", result });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateMonthlyResult(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateDto = plainToInstance(UpdateMonthlyResultDto, req.body);
      const errors = await validate(updateDto);

      if (errors.length > 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ errors });
        return;
      }

      const result = await this.monthlyResultsService.updateMonthlyResult(
        id,
        updateDto
      );
      res.status(StatusCodes.OK).json({
        message: "Resultado mensual actualizado correctamente",
        result,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteMonthlyResult(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.monthlyResultsService.deleteMonthlyResult(id);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async searchMonthlyResults(req: Request, res: Response): Promise<void> {
    try {
      const searchDto = plainToInstance(MonthlyResultSearchDto, req.query);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const results =
        await this.monthlyResultsService.searchMonthlyResultsPaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(results);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
  // Periodos de liquidacion
  async createSettlementPeriod(req: Request, res: Response): Promise<void> {
    try {
      const createDto = plainToInstance(CreateSettlementPeriodDto, req.body);
      const result =
        await this.settlementPeriodsService.createSettlementPeriod(createDto);
      res.status(StatusCodes.OK).json({
        message: "Período de liquidación creado correctamente",
        result,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateSettlementPeriod(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateDto = plainToInstance(UpdateSettlementPeriodDto, req.body);
      const result = await this.settlementPeriodsService.updateSettlementPeriod(
        id,
        updateDto
      );
      res.status(StatusCodes.OK).json({
        message: "Período de liquidación actualizado correctamente",
        result,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteSettlementPeriod(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.settlementPeriodsService.deleteSettlementPeriod(id);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async searchSettlementPeriod(req: Request, res: Response): Promise<void> {
    try {
      const searchDto = plainToInstance(SettlementPeriodSearchDto, req.query);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const results =
        await this.settlementPeriodsService.searchSettlementPeriodPaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(results);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  // Parameter Lines
  async createParameterLine(req: Request, res: Response): Promise<void> {
    try {
      const createDto = plainToInstance(CreateParameterLineDto, req.body);
      const result =
        await this.parameterLinesService.createParameterLines(createDto);
      res
        .status(StatusCodes.OK)
        .json({ message: "Línea de parámetro creada correctamente", result });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateParameterLine(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateDto = plainToInstance(UpdateParameterLineDto, req.body);
      const result = await this.parameterLinesService.updateParameterLines(
        id,
        updateDto
      );
      res.status(StatusCodes.OK).json({
        message: "Línea de parámetro actualizada correctamente",
        result,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteParameterLine(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.parameterLinesService.deleteParameterLines(id);
      res
        .status(StatusCodes.OK)
        .json({ message: "Línea de parámetro eliminada correctamente" });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async searchParameterLine(req: Request, res: Response): Promise<void> {
    try {
      const searchDto = plainToInstance(CreateParameterLineSearchDto, req.body);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const results =
        await this.parameterLinesService.searchParameterLinePaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(results);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  // Configuración de Temporadas
  async createSeason(req: Request, res: Response): Promise<void> {
    try {
      const createDto = plainToInstance(CreateSeasonDto, req.body);
      const result = await this.seasonsService.createSeason(createDto);
      res
        .status(StatusCodes.OK)
        .json({ message: "Temporada creada correctamente", result });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateSeason(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateDto = plainToInstance(UpdateSeasonDto, req.body);
      const result = await this.seasonsService.updateSeason(id, updateDto);
      res
        .status(StatusCodes.OK)
        .json({ message: "Temporada actualizada correctamente", result });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteSeason(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.seasonsService.deleteSeason(id);
      res
        .status(StatusCodes.OK)
        .json({ message: "Temporada eliminada correctamente" });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async searchSeason(req: Request, res: Response): Promise<void> {
    try {
      const searchDto = plainToInstance(SearchSeasonDto, req.body);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const results = await this.seasonsService.searchSeasonPaginated(
        searchDto,
        page,
        limit
      );
      res.status(StatusCodes.OK).json(results);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  // Configuracion de variables kpi
  async createKpiConfig(req: Request, res: Response): Promise<void> {
    try {
      const createDto = plainToInstance(CreateKpiConfigDto, req.body);
      const result = await this.kpiConfigService.createKpiConfig(createDto);
      res
        .status(StatusCodes.OK)
        .json({ message: "Configuración de KPI creada correctamente", result });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateKpiConfig(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateDto = plainToInstance(UpdateKpiConfigDto, req.body);
      const result = await this.kpiConfigService.updateKpiConfig(id, updateDto);
      res.status(StatusCodes.OK).json({
        message: "Configuración de KPI actualizada correctamente",
        result,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteKpiConfig(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      await this.kpiConfigService.deleteKpiConfig(id);
      res
        .status(StatusCodes.OK)
        .json({ message: "Configuración de KPI eliminada correctamente" });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async searchKpiConfig(req: Request, res: Response): Promise<void> {
    try {
      const searchDto = plainToInstance(SearchKpiConfigDto, req.body);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const results = await this.kpiConfigService.searchKpiConfigPaginated(
        searchDto,
        page,
        limit
      );
      res.status(StatusCodes.OK).json(results);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  // Configuracion de variables kpi
  async createVariableScale(req: Request, res: Response): Promise<void> {
    try {
      const createDto = plainToInstance(CreateVariableScaleDto, req.body);
      const result =
        await this.variableScalesService.createVariableScale(createDto);
      res
        .status(StatusCodes.OK)
        .json({ message: "Variable escala creada correctamente", result });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateVariableScale(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const updateDto = plainToInstance(UpdateVariableScaleDto, req.body);
      const result = await this.variableScalesService.updateVariableScale(
        id,
        updateDto
      );
      res
        .status(StatusCodes.OK)
        .json({ message: "Variable escala actualizada correctamente", result });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteVariableScale(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      await this.variableScalesService.deleteVariableScale(id);
      res
        .status(StatusCodes.OK)
        .json({ message: "Variable escala eliminada correctamente" });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async searchVariableScalePaginated(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const searchDto = plainToInstance(VariableScaleSearchDto, req.body);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const results =
        await this.variableScalesService.searchVariableScalePaginated(
          searchDto,
          page,
          limit
        );
      res.status(StatusCodes.OK).json(results);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
  // Tamaño de la tienda
  async createStoreSize(req: Request, res: Response): Promise<void> {
    try {
      const createDto = plainToInstance(CreateStoreSizeDto, req.body);
      const result = await this.storeSizeService.createStoreSize(createDto);
      res
        .status(StatusCodes.OK)
        .json({ message: "Tamaño de la tienda creado correctamente", result });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateStoreSize(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const updateDto = plainToInstance(UpdateStoreSizeDto, req.body);
      const result = await this.storeSizeService.updateStoreSize(id, updateDto);
      res.status(StatusCodes.OK).json({
        message: "Tamaño de la tienda actualizado correctamente",
        result,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteStoreSize(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.storeSizeService.deleteStoreSize(id);
      res
        .status(StatusCodes.OK)
        .json({ message: "Tamaño de la tienda eliminado correctamente" });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async searchStoreSizePaginated(req: Request, res: Response): Promise<void> {
    try {
      const searchDto = plainToInstance(StoreSizeSearchDto, req.body);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const results = await this.storeSizeService.searchStoreSizePaginated(
        searchDto,
        page,
        limit
      );
      res.status(StatusCodes.OK).json(results);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  // Configuracion de rotacion de ventas
  async createSalesRotationConfiguration(req: Request, res: Response): Promise<void> {
    try {
      const createDto = plainToInstance(CreateSalesRotationConfigurationDto, req.body);
      const result = await this.salesRotationConfigurationsService.createSalesRotationConfiguration(createDto);
      res.status(StatusCodes.OK).json({ message: "Configuración de rotación de ventas creada correctamente", result });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async createSalesRotationConfigurations(req: Request, res: Response): Promise<void> {
    try {
      const createDtos = plainToInstance(CreateSalesRotationConfigurationDto, req.body);

      if (!Array.isArray(createDtos) || createDtos.length === 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "El cuerpo de la solicitud debe ser un array no vacío." });
        return;
      }

      const results = await Promise.all(
        createDtos.map(dto => this.salesRotationConfigurationsService.createSalesRotationConfiguration(dto))
      );

      res.status(StatusCodes.OK).json(results);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateSalesRotationConfigurations(req: Request, res: Response): Promise<void> {
    try {
      if (!Array.isArray(req.body)) {
        throw new Error('Se esperaba un array de objetos para actualizar');
      }

      const updateDtos = plainToInstance(UpdateSalesRotationConfigurationDto, req.body);

      const results = await this.salesRotationConfigurationsService.updateSalesRotationConfigurations(updateDtos);

      res.status(StatusCodes.OK).json(results);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateSalesRotationConfiguration(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateDto = plainToInstance(UpdateSalesRotationConfigurationDto, req.body);
      const result = await this.salesRotationConfigurationsService.updateSalesRotationConfiguration(id, updateDto);
      res.status(StatusCodes.OK).json({ message: "Configuración de rotación de ventas actualizada correctamente", result });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteSalesRotationConfiguration(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.salesRotationConfigurationsService.deleteSalesRotationConfiguration(id);
      res.status(StatusCodes.OK).json({ message: "Configuración de rotación de ventas eliminada correctamente" });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteAllSalesRotationConfigurations(req: Request, res: Response): Promise<void> {
    try {
      const commissionConfigurationId = parseInt(req.params.id);
      await this.salesRotationConfigurationsService.deleteAllSalesRotationConfigurations(commissionConfigurationId);
      res.status(StatusCodes.OK).json({ message: "Configuraciones de rotación de ventas eliminadas correctamente" });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async searchSalesRotationConfiguration(req: Request, res: Response): Promise<void> {
    try {
      const searchDto = plainToInstance(SalesRotationConfigurationSearchDto, req.body);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const results = await this.salesRotationConfigurationsService.searchSalesRotationConfigurationPaginated(searchDto, page, limit);
      res.status(StatusCodes.OK).json(results);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }




}
