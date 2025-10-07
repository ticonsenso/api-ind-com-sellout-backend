import { DataSource } from "typeorm";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ProductComplianceService } from "../services/product.compliance.service";
import { CalculationProductExtrategicService } from "../services/calculation.product.extrategic.service";
import { FilterReportCommissionDto } from "../dtos/report.dto";
import { plainToClass } from "class-transformer";
import { StoreManagerCalculationCommissionService } from "../services/store.manager.calculation.commission.service";

export class StatisticsController {
  private productComplianceService: ProductComplianceService;
  private calculationProductExtrategicService: CalculationProductExtrategicService;
  private storeManagerCalculationCommissionService: StoreManagerCalculationCommissionService;
  constructor(dataSource: DataSource) {
    this.productComplianceService = new ProductComplianceService(dataSource);
    this.calculationProductExtrategicService = new CalculationProductExtrategicService(dataSource);
    this.storeManagerCalculationCommissionService = new StoreManagerCalculationCommissionService(dataSource);
    this.deleteByDateRange = this.deleteByDateRange.bind(this);
    this.getMonthlyComplianceByRegionAndCompany = this.getMonthlyComplianceByRegionAndCompany.bind(this);
    this.deleteByYearMonth = this.deleteByYearMonth.bind(this);
    this.getReportStatistics = this.getReportStatistics.bind(this);
  }

  async getMonthlyComplianceByRegionAndCompany(req: Request, res: Response) {
    try {
      const { year, regional, companyId } = req.query;

      const result = await this.productComplianceService.getMonthlyComplianceByRegionAndCompany(
        parseInt(year as string),
        regional ? (regional as string) : undefined,
        companyId ? parseInt(companyId as string) : undefined
      );

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error al obtener los valores de las ventas y el presupuesto",
        error: (error as any)?.message || error,
      });
    }
  }

  async deleteByYearMonth(req: Request, res: Response) {
    try {
      const { year, month } = req.query;
      const result = await this.calculationProductExtrategicService.deleteByYearMonth(parseInt(year as string), parseInt(month as string));
      res.status(StatusCodes.OK).json({
        message: "Datos eliminados correctamente",
        result: result,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error al eliminar los datos",
        error: (error as any)?.message || error,
      });
    }
  }

  async deleteByDateRange(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      await this.productComplianceService.deleteByDateRangeService(new Date(startDate as string), new Date(endDate as string));
      res.status(StatusCodes.OK).json({
        message: "Datos eliminados correctamente",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error al eliminar los datos",
        error: (error as any)?.message || error,
      });
    }
  }

  async getReportStatistics(req: Request, res: Response) {
    try {
      const { index } = req.query;
      const indexNumber = Number(index);
      const filter = plainToClass(FilterReportCommissionDto, req.body);
      if (indexNumber == 1) { //Total de gasto de comsiones
        const result = await this.storeManagerCalculationCommissionService.getTotalMonthlyExpenses(filter);
        res.status(StatusCodes.OK).json(result); 
      } else if (indexNumber == 2) { //Total de empleados comisionados
        const result = await this.storeManagerCalculationCommissionService.getTotalEmployeesComissioned(filter);
        res.status(StatusCodes.OK).json(result);
      } else if (indexNumber == 3) { //Porcentaje de cumplimiento promedio venta y utilidad
        await this.validateParams(filter);
        const result = await this.storeManagerCalculationCommissionService.getAverageCompliance(filter);
        res.status(StatusCodes.OK).json(result);
      } else if (indexNumber == 4) { //Cumplimiento por tramos
        await this.validateParams(filter);
        const result = await this.storeManagerCalculationCommissionService.getComplianceBracketsCombined(filter);
        res.status(StatusCodes.OK).json(result);
      } else if (indexNumber == 5) { //Maximo / minimo /promedio
        const result = await this.storeManagerCalculationCommissionService.getDataRanges(filter);
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ mensaje: "Índice no válido" });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error al obtener los datos de reporte",
        error: (error as any)?.message || error,
      });
    }
  }

  async validateParams(filter: FilterReportCommissionDto) {
    if (!filter.year) {
      throw new Error("El campo 'año' es obligatorio en el filtro.");
    }
    if (!filter.month) {
      throw new Error("El campo 'mes' es obligatorio en el filtro.");
    }
    if (filter.month && (filter.month < 1 || filter.month > 12)) {
      throw new Error("El campo 'mes' debe estar entre 1 y 12 si se proporciona.");
    }
  }



}