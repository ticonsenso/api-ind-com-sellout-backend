import {FilterReportCommissionDto} from "../dtos/report.dto";
import {AdvisorCommission} from "../models/advisor.commission.model";
import {BaseRepository} from "./base.respository";
import {Brackets, DataSource} from "typeorm";
import {plainToInstance} from "class-transformer";
import {ResponseDataConsensoDto, SearchDataConsensoDto} from "../dtos/search.data.consenso";
import {getMonthRange} from "../utils/utils";

export class AdvisorCommissionRepository extends BaseRepository<AdvisorCommission> {
  constructor(dataSource: DataSource) {
    super(AdvisorCommission, dataSource);
  }

  async findByFilters(
    filters: string = "",
    page?: number,
    limit?: number,
    calculateDate?: Date
  ): Promise<{ items: AdvisorCommission[]; total: number }> {
    const qb = this.repository
      .createQueryBuilder("ac")
      .leftJoinAndSelect("ac.employee", "e")
      .leftJoinAndSelect("ac.company", "c")
      .leftJoinAndSelect("ac.companyPosition", "p")
      .leftJoinAndSelect("ac.storeSize", "s")
      .orderBy("ac.createdAt", "ASC");

    if (filters) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where("e.documentNumber ILIKE :search", { search: `%${filters}%` })
            .orWhere("e.name ILIKE :search", { search: `%${filters}%` })
            .orWhere("e.code ILIKE :search", { search: `%${filters}%` });
        })
      );
    }

    if (calculateDate) {
      const [filterYear, filterMonth] = calculateDate.toISOString().slice(0, 7).split("-");
      const { start: monthStart, end: monthEnd } = getMonthRange(filterYear, filterMonth);
      qb.andWhere("ac.calculateDate >= :monthStart AND ac.calculateDate < :monthEnd", {
        monthStart,
        monthEnd,
      });
    }

    if (page && limit) {
      qb.skip((page - 1) * limit).take(limit);
    }

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  async findByFiltersTotal(
    filters: FilterReportCommissionDto,
    year: number,
    month?: number
  ): Promise<{ month: number; totalComission: number }[]> {
    const qb = this.repository
      .createQueryBuilder("ac")
      .leftJoinAndSelect("ac.employee", "e")
      .leftJoinAndSelect("e.company", "c")
      .leftJoinAndSelect("e.companyPosition", "p")
      .leftJoinAndSelect("ac.storeSize", "sz")
      .orderBy("ac.createdAt", "ASC");

    // Filtros exactos y parciales
    if (filters) {
      qb.andWhere(
        new Brackets((qb) => {
          if (filters.companyId) {
            qb.andWhere("e.company.id = :company", { company: filters.companyId });
          }
          if (filters.companyPositionId) {
            qb.andWhere("e.companyPosition.id = :companyPosition", {
              companyPosition: filters.companyPositionId,
            });
          }
          if (filters.section) {
            qb.andWhere("e.section ILIKE :section", {
              section: `%${filters.section}%`,
            });
          }
          // if (filters.area) {
          //     qb.orWhere("e.area ILIKE :area", { area: `%${filters.area}%` });
          // }
          // if (filters.department) {
          //     qb.orWhere("e.department ILIKE :department", { department: `%${filters.department}%` });
          // }
          // if (filters.subDepartment) {
          //     qb.orWhere("e.subDepartment ILIKE :subDepartment", { subDepartment: `%${filters.subDepartment}%` });
          // }
          // if (filters.subSection) {
          //     qb.orWhere("e.subSection ILIKE :subSection", { subSection: `%${filters.subSection}%` });
          // }
        })
      );
    }

    // Rango de fechas
    if (year && month) {
      qb.andWhere(`ac.calculateDate BETWEEN :start AND :end`, {
        start: new Date(year, month - 1, 1),
        end: new Date(year, month, 0, 23, 59, 59),
      })
        .select("SUM(ac.commissionTotal) AS totalComission")
        .addSelect("EXTRACT(MONTH FROM ac.calculateDate) AS month")
        .groupBy("EXTRACT(MONTH FROM ac.calculateDate)");
    } else if (year) {
      qb.andWhere(`ac.calculateDate >= :yearStart AND ac.calculateDate < :yearEnd`, {
        yearStart: `${year}-01-01`,
        yearEnd: `${year + 1}-01-01`,
      })
        .select("SUM(ac.commissionTotal) AS totalComission")
        .addSelect("EXTRACT(MONTH FROM ac.calculateDate) AS month")
        .groupBy("EXTRACT(MONTH FROM ac.calculateDate)")
        .orderBy("month", "ASC");
    } else {
      qb.select("SUM(ac.commissionTotal) AS totalComission")
        .addSelect("EXTRACT(MONTH FROM ac.calculateDate) AS month")
        .groupBy("EXTRACT(MONTH FROM ac.calculateDate)")
        .orderBy("month", "ASC");
    }

    const result = await qb.getRawMany();

    // Convertir a número
    return result.map((r) => ({
      month: parseInt(r.month, 10),
      totalComission: parseFloat(r.totalComission),
    }));
  }

  async getDataComplacieNominaAdvisorCommisions(
    dto: SearchDataConsensoDto
  ): Promise<ResponseDataConsensoDto[]> {
    const { empresa, anio, mes } = dto;
    const { start: monthStart, end: monthEnd } = getMonthRange(anio, mes);
    const qb = this.repository
      .createQueryBuilder("ac")
      .select([
        "c.name AS empresa",
        "e.code AS codigo_empleado",
        "e.documentNumber AS cedula_colaborador",
        "cp.name AS cargo",
        "EXTRACT(YEAR FROM ac.calculateDate) AS anio_calculo",
        "EXTRACT(MONTH FROM ac.calculateDate) AS mes_calculo",
        "e.variableSalary AS sueldo_variable",
        "ac.complianceSale AS porcentaje_cumplimiento",
        "ac.commissionTotal AS valor_comision_pagar",
      ])
      .innerJoin("ac.employee", "e")
      .innerJoin("e.company", "c")
      .innerJoin("e.companyPosition", "cp")
      .where("ac.calculateDate >= :monthStart AND ac.calculateDate < :monthEnd", { monthStart, monthEnd });

    if (empresa) {
      qb.andWhere("c.name = :empresa", { empresa });
    }

    const rawData = await qb.getRawMany();
    return plainToInstance(ResponseDataConsensoDto, rawData, {
      excludeExtraneousValues: true,
    });
  }
}
