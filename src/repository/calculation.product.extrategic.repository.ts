import {Between, DataSource as TypeORMDataSource} from "typeorm";
import {CalculationProductExtrategic} from "../models/calculation.product.extrategic.model";
import {BaseRepository} from "./base.respository";
import {resetSequences} from "../config/data-source";

export class CalculationProductExtrategicRepository extends BaseRepository<CalculationProductExtrategic> {
  constructor(dataSource: TypeORMDataSource) {
    super(CalculationProductExtrategic, dataSource);
  }

  async deleteByYearMonth(year: number, month: number) {

    const subQuery = this.dataSource
      .createQueryBuilder()
      .select('c.employee_id')
      .from('calculation_product_extrategic', 'c')
      .where('c.calculate_date IS NOT NULL')
      .andWhere('EXTRACT(YEAR  FROM c.calculate_date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM c.calculate_date) = :month', { month })
      .getQuery();

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('employees')
      .where(`id IN (${subQuery})`)
      .setParameters({ year, month })
      .execute();

    await this.repository
      .createQueryBuilder()
      .delete()
      .from('extracted_data')
      .where(
        `calculate_date IS NOT NULL
         AND EXTRACT(YEAR  FROM calculate_date) = :year
         AND EXTRACT(MONTH FROM calculate_date) = :month`,
        { year, month },
      )
      .execute();

    await resetSequences(
      this.dataSource.manager,
      [
        ['calculation_product_extrategic', 'id'],
        ['product_compliance', 'id'],
        ['employees', 'id'],
        ['extracted_data', 'id'],
        ['employees_history', 'id'],
        ['commission_configuration_history', 'id'],
        ['consolidated_commission_calculation', 'id'],
      ]
    );
  }



  async findByEmployeeAndCalculateDate(
    employeeId: number,
    calculateDate: Date
  ): Promise<CalculationProductExtrategic | null> {
    // Obtener el primer y último día del mes
    const firstDayOfMonth = new Date(
      calculateDate.getFullYear(),
      calculateDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      calculateDate.getFullYear(),
      calculateDate.getMonth() + 1,
      0
    );

    return await this.repository.findOne({
      where: {
        employee: { id: employeeId },
        calculateDate: Between(firstDayOfMonth, lastDayOfMonth),
      },
      relations: ["employee", "company", "companyPosition"],
    });
  }


  async findByEmployeeAndCalculateDateDetail(
    employeeId: number,
    calculateDate: Date
  ): Promise<CalculationProductExtrategic | null> {
    const targetDate = calculateDate.toISOString().substring(0, 10);

    return await this.repository.findOne({
      where: {
        employee: { id: employeeId },
        calculateDate: targetDate as unknown as Date,
      },
      relations: ["employee", "company", "companyPosition"],
    });
  }

  async findByMountAndSearch(
    date: Date,
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: CalculationProductExtrategic[]; total: number }> {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const qb = this.repository
      .createQueryBuilder("cpe")
      .leftJoinAndSelect("cpe.employee", "employee")
      .leftJoinAndSelect("cpe.company", "company")
      .leftJoinAndSelect("cpe.companyPosition", "companyPosition")
      .where("cpe.calculateDate >= :start AND cpe.calculateDate <= :end", { start: firstDayOfMonth, end: lastDayOfMonth });

    if (search && search.trim() !== "") {
      qb.andWhere(
        "(employee.documentNumber ILIKE :search OR employee.name ILIKE :search OR employee.code ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    qb.skip((page - 1) * limit).take(limit).orderBy("cpe.calculateDate", "DESC");

    const [data, total] = await qb.getManyAndCount();

    return { data, total };
  }

  async getBonusSummaryByMonthYear(
    month: number,
    year: number,
    companyId?: number,
    regional?: string
  ) {
    const query = this.repository
      .createQueryBuilder("calculation")
      .innerJoin("employees", "e", "e.id = calculation.employee_id")
      .select("calculation.applies_bonus", "applies_bonus")
      .addSelect("COUNT(DISTINCT calculation.employee_id)", "count") // empleados únicos
      .addSelect("SUM(calculation.value_product_extrategic)", "total_value")
      .where("EXTRACT(MONTH FROM calculation.calculate_date) = :month", { month })
      .andWhere("EXTRACT(YEAR FROM calculation.calculate_date) = :year", { year });

    if (companyId) {
      query.andWhere("calculation.company_id = :companyId", { companyId });
    }

    if (regional && regional.trim() !== "") {
      query.andWhere("e.regional ILIKE :regional", { regional: `%${regional}%` });
    }

    const rawData = await query
      .groupBy("calculation.applies_bonus")
      .orderBy("calculation.applies_bonus", "ASC")
      .getRawMany();

    const totalCount = rawData.reduce((acc, item) => acc + parseInt(item.count), 0);

    return {
      details: rawData,
      total: totalCount,
    };
  }

  async deleteCPEByDateRange(startDate: Date, endDate: Date): Promise<void> {
    await this.repository.delete({
      calculateDate: Between(startDate, endDate),
    });
  }

  async deleteByDateRange(startDate: Date, endDate: Date): Promise<{ affected: number | null | undefined; raw: any }> {
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(CalculationProductExtrategic)
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

}
