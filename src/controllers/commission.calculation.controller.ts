import {plainToInstance} from "class-transformer";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {DataSource} from "typeorm";
import {UpdateProductComplianceDto} from "../dtos/product.compliance.dto";
import {CalculationProductExtrategicService} from "../services/calculation.product.extrategic.service";
import {ConsolidatedCommissionCalculationService} from "../services/consolidated.commission.calculation.service";
import {ProductComplianceService} from "../services/product.compliance.service";
import {
    ConsolidatedCommissionCalculationRepository
} from "../repository/consolidated.commission.calculation.repository";

export class CommissionCalculationController {
  public productComplianceService: ProductComplianceService;
  public consolidatedCommissionCalculationService: ConsolidatedCommissionCalculationService;
  public calculationProductExtrategicService: CalculationProductExtrategicService;
  public consolidatedCommissionCalculationRepository: ConsolidatedCommissionCalculationRepository;
  constructor(dataSourceRepository: DataSource) {
    this.productComplianceService = new ProductComplianceService(
      dataSourceRepository
    );
    this.consolidatedCommissionCalculationService =
      new ConsolidatedCommissionCalculationService(dataSourceRepository);
    this.calculationProductExtrategicService =
      new CalculationProductExtrategicService(dataSourceRepository);
    this.consolidatedCommissionCalculationRepository =
      new ConsolidatedCommissionCalculationRepository(dataSourceRepository);
    this.getProductComplianceByEmployeeAndMonth =
      this.getProductComplianceByEmployeeAndMonth.bind(this);
    this.getConsolidatedCommissionCalculation =
      this.getConsolidatedCommissionCalculation.bind(this);
    this.getCalculationProductExtrategic =
      this.getCalculationProductExtrategic.bind(this);
    this.getBonusSummaryByMonthYear = this.getBonusSummaryByMonthYear.bind(this);
    this.consolidateData = this.consolidateData.bind(this);
    this.deleteByDateRange = this.deleteByDateRange.bind(this);
    this.getSummaryByMonthCompanyRegion = this.getSummaryByMonthCompanyRegion.bind(this);
  }

  async getProductComplianceByEmployeeAndMonth(req: Request, res: Response) {
    try {
      const { date, search, page, limit } = req.query;
      const productCompliance =
        await this.productComplianceService.getProductComplianceByEmployeeAndMonth(
          new Date(date as string),
          (search as string | undefined) || "",
          parseInt(page as string) || 1,
          parseInt(limit as string) || 10
        );
      res.status(StatusCodes.OK).json(productCompliance);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async updateProductCompliance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateProductComplianceDto = plainToInstance(
        UpdateProductComplianceDto,
        req.body
      );
      const productCompliance =
        await this.productComplianceService.updateProductCompliance(
          Number(id),
          updateProductComplianceDto
        );
      res.status(StatusCodes.OK).json({
        mensaje: "Producto actualizado, correctamente.",
        productCompliance,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async getConsolidatedCommissionCalculation(req: Request, res: Response) {
    try {
      const { search, page, limit } = req.query;
      const calculateDate = req.query.calculateDate
        ? new Date(`${req.query.calculateDate}T00:00:00`)
        : null;
      const consolidatedCommissionCalculation =
        await this.consolidatedCommissionCalculationService.getConsolidatedCommissionCalculation(
          search as string,
          calculateDate,
          parseInt(page as string) || 1,
          parseInt(limit as string) || 10
        );
      res.status(StatusCodes.OK).json(consolidatedCommissionCalculation);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async getCalculationProductExtrategic(req: Request, res: Response) {
    try {
      const { search, calculateDate, page, limit } = req.query;
      const calculationProductExtrategic =
        await this.calculationProductExtrategicService.getCalculationProductExtrategic(
          search as string,
          new Date(calculateDate as string),
          parseInt(page as string) || 1,
          parseInt(limit as string) || 10
        );
      res.status(StatusCodes.OK).json(calculationProductExtrategic);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async getBonusSummaryByMonthYear(req: Request, res: Response) {
    try {
      const month = parseInt(req.query.month as string);
      const year = parseInt(req.query.year as string);
      const companyId = req.query.companyId ? Number(req.query.companyId) : undefined;
      const regional = req.query.regional as string | undefined;

      const bonusSummary = await this.calculationProductExtrategicService.getBonusSummaryByMonthYear(
        month,
        year,
        companyId,
        regional
      );

      res.status(StatusCodes.OK).json(bonusSummary);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }



  async consolidateData(req: Request, res: Response) {
    try {
      const { employeeId, calculateDate } = req.query;
      const consolidateData =
        await this.consolidatedCommissionCalculationService.consolidateData(
          Number(employeeId),
          new Date(calculateDate as string)
        );
      res.status(StatusCodes.OK).json(consolidateData);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async deleteByDateRange(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      await this.calculationProductExtrategicService.deleteByDateRangeService(new Date(startDate as string), new Date(endDate as string));
      res.status(StatusCodes.OK).json({
        message: "Datos eliminados correctamente",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  async getSummaryByMonthCompanyRegion(req: Request, res: Response) {
    try {
      const month = parseInt(req.query.month as string);
      const year = parseInt(req.query.year as string);
      const companyId = req.query.companyId ? Number(req.query.companyId) : undefined;
      const regional = req.query.regional as string | undefined;
      const summary = await this.consolidatedCommissionCalculationRepository.summaryByMonthCompanyRegion(month, year, companyId, regional);
      res.status(StatusCodes.OK).json(summary);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
