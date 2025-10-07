import { Between, DataSource } from "typeorm";
import { ConsolidatedCommissionCalculation } from "../models/consolidated.commission.calculation.model";
import { BaseRepository } from "./base.respository";
import { ResponseDataConsensoDto, SearchDataConsensoDto } from "../dtos/search.data.consenso";
import { plainToInstance } from "class-transformer";

export class ConsolidatedCommissionCalculationRepository extends BaseRepository<ConsolidatedCommissionCalculation> {
  constructor(dataSource: DataSource) {
    super(ConsolidatedCommissionCalculation, dataSource);
  }

  async findByCompanyAndPosition(
    companyId: number,
    companyPositionId: number
  ): Promise<ConsolidatedCommissionCalculation | null> {
    return this.repository.findOne({ where: { company: { id: companyId }, companyPosition: { id: companyPositionId } } });
  }

  async findByEmployeeAndCalculateDate(
    employeeId: number,
    calculateDate: Date
  ): Promise<ConsolidatedCommissionCalculation | null> {
    const targetDate = calculateDate.toISOString().substring(0, 10);

    return this.repository.findOne({
      where: {
        employee: { id: employeeId },
        calculateDate: targetDate as unknown as Date,
      },
      relations: ['employee', 'company', 'companyPosition'],
    });
  }

  async findByEmployeeAndCalculateDateWithPagination(
    search: string | null,
    calculateDate: Date | null,
    page?: number,
    limit?: number,
  ): Promise<{ items: ConsolidatedCommissionCalculation[]; total: number }> {
    const qb = this.repository
      .createQueryBuilder('ccc')
      .leftJoinAndSelect('ccc.employee', 'employee')
      .orderBy('ccc.calculateDate', 'DESC');
  
    if (calculateDate) {
      const firstDay = new Date(
        calculateDate.getFullYear(),
        calculateDate.getMonth(),
        1,
      );
      const lastDay = new Date(
        calculateDate.getFullYear(),
        calculateDate.getMonth() + 1,
        0,
      );
      qb.andWhere('ccc.calculateDate BETWEEN :firstDay AND :lastDay', {
        firstDay,
        lastDay,
      });
    }
  
    if (search) {
      qb.andWhere(
        '(employee.documentNumber ILIKE :search OR employee.name ILIKE :search OR employee.ceco ILIKE :search OR employee.code ILIKE :search)',
        { search: `%${search}%` },
      );
    }
  
    if (limit && page) {
      const skip = (page - 1) * limit;
      qb.skip(skip).take(limit);
    }
  
    const [data, total] = await qb.getManyAndCount();
    return { items: data, total };
  }
  

  async deleteCCByDateRange(startDate: Date, endDate: Date): Promise<void> {
    await this.repository.delete({
      calculateDate: Between(startDate, endDate),
    });
  }

  async summaryByMonthCompanyRegion(
    month?: number,
    year?: number,
    companyId?: number,
    regional?: string
  ): Promise<{
    month: string;
    applicable_employees: number;
    non_applicable_employees: number;
    total: number;
  } | null> {

    const qb = this.repository
      .createQueryBuilder("ccc")
      .select(`
        CASE EXTRACT(MONTH FROM ccc.calculate_date)
          WHEN 1 THEN 'Enero'
          WHEN 2 THEN 'Febrero'
          WHEN 3 THEN 'Marzo'
          WHEN 4 THEN 'Abril'
          WHEN 5 THEN 'Mayo'
          WHEN 6 THEN 'Junio'
          WHEN 7 THEN 'Julio'
          WHEN 8 THEN 'Agosto'
          WHEN 9 THEN 'Septiembre'
          WHEN 10 THEN 'Octubre'
          WHEN 11 THEN 'Noviembre'
          WHEN 12 THEN 'Diciembre'
        END
      `, "month")
      .addSelect(`
        COUNT(DISTINCT CASE
          WHEN ccc.pct_nomina BETWEEN 85 AND 160 THEN ccc.employee_id
        END)
      `, "applicable_employees")
      .addSelect(`
        COUNT(DISTINCT CASE
          WHEN ccc.pct_nomina < 85 OR ccc.pct_nomina > 160 THEN ccc.employee_id
        END)
      `, "non_applicable_employees")
      .innerJoin("ccc.employee", "e");

    if (regional) {
      qb.andWhere("e.regional ILIKE :regional", { regional: `%${regional}%` });
    }
    if (companyId) {
      qb.andWhere("ccc.company_id = :companyId", { companyId });
    }
    if (month) {
      qb.andWhere("EXTRACT(MONTH FROM ccc.calculate_date) = :month", { month });
    }
    if (year) {
      qb.andWhere("EXTRACT(YEAR FROM ccc.calculate_date) = :year", { year });
    }

    const result = await qb
      .groupBy("EXTRACT(MONTH FROM ccc.calculate_date)")
      .getRawOne();

    return result
      ? {
        month: result.month.trim(),
        applicable_employees: Number(result.applicable_employees),
        non_applicable_employees: Number(result.non_applicable_employees),
        total:
          Number(result.applicable_employees) +
          Number(result.non_applicable_employees),
      }
      : null;
  }

  async deleteByDateRange(startDate: Date, endDate: Date): Promise<{ affected: number | null | undefined; raw: any }> {
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(ConsolidatedCommissionCalculation)
      .where('calculate_date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      })
      .execute();

    return {
      affected: result.affected,
      raw: result.raw
    };
  }

  async getDataNominaConsolidated(dto: SearchDataConsensoDto): Promise<ResponseDataConsensoDto[]> {
    const { empresa, anio, mes } = dto;
    const qb = this.repository
        .createQueryBuilder('ccc')
        .select([
            'c.name AS empresa',
            'e.code AS codigo_empleado',
            'e.documentNumber AS cedula_colaborador',
            'cp.name AS cargo',
            'EXTRACT(YEAR FROM ccc.calculateDate) AS anio_calculo',
            'EXTRACT(MONTH FROM ccc.calculateDate) AS mes_calculo',
            'e.variableSalary AS sueldo_variable',
            'ccc.pctNomina AS porcentaje_cumplimiento',
            'ccc.totalNomina AS valor_comision_pagar'
        ])
        .innerJoin('ccc.employee', 'e')
        .innerJoin('e.company', 'c')
        .innerJoin('e.companyPosition', 'cp')
        .where('EXTRACT(YEAR FROM ccc.calculateDate) = :anio', { anio })
        .andWhere('EXTRACT(MONTH FROM ccc.calculateDate) = :mes', { mes });

    if (empresa) {
        qb.andWhere('c.name = :empresa', { empresa });
    }

    const rawData = await qb.getRawMany();

    return plainToInstance(ResponseDataConsensoDto, rawData, { excludeExtraneousValues: true });
  }


}
