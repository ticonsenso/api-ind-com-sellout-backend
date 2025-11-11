import {Between, DataSource} from "typeorm";
import {ProductCompliance} from "../models/product.compliance.model";
import {BaseRepository} from "./base.respository";

export class ProductComplianceRepository extends BaseRepository<ProductCompliance> {
  constructor(dataSource: DataSource) {
    super(ProductCompliance, dataSource);
  }

  async findByEmployeeAndMonth(
    employeeId: number,
    calculateDate: Date
  ): Promise<ProductCompliance[]> {
    const date: Date = new Date(calculateDate);
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return await this.repository.find({
      where: {
        employee: { id: employeeId },
        calculateDate: Between(startDate, endDate),
      },
      relations: ["employee", "parameterLine"],
    });

  }

  async findByEmployeeAndMonthDetail(
    employeeId: number,
    calculateDate: Date
  ): Promise<ProductCompliance[]> {
    const targetDate = calculateDate.toISOString().substring(0, 10);

    return await this.repository.find({
      where: {
        employee: { id: employeeId },
        calculateDate: targetDate as unknown as Date,
      },
      relations: ["employee", "parameterLine"],
    });

  }

  async findByMountAndSearch(
    date: Date,
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: ProductCompliance[]; total: number }> {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    console.log(startDate," end ", endDate);
    // Crear query builder
    const qb = this.repository
      .createQueryBuilder("pc")
      .leftJoinAndSelect("pc.employee", "employee")
      .leftJoinAndSelect("pc.parameterLine", "parameterLine")
      .where("pc.calculateDate >= :start AND pc.calculateDate <= :end", { start: startDate, end: endDate });

    // Si hay parámetro de búsqueda
    if (search && search.trim() !== "") {
      qb.andWhere(
        "(employee.documentNumber ILIKE :search OR employee.name ILIKE :search OR employee.code ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    // Paginación
    qb.skip((page - 1) * limit).take(limit);

    // Ejecutar y obtener datos y total
    const [data, total] = await qb.getManyAndCount();

    return { data, total };
  }


  async getProductComplianceSummary(
    employeeId: number,
    calculateDate: Date
  ): Promise<{
    sumSaleValue: number;
    sumBudgetValue: number;
    ratio: number;
  }> {
    const cacule: string = String(calculateDate);
    const [year, month] = cacule.split("-");
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const result = await this.repository
      .createQueryBuilder("pc")
      .select("CAST(SUM(pc.sale_value) AS DECIMAL(18,2))", "sumSaleValue")
      .addSelect(
        "CAST(SUM(pc.budget_value) AS DECIMAL(18,2))",
        "sumBudgetValue"
      )
      .addSelect(
        "CAST((SUM(pc.sale_value) / NULLIF(SUM(pc.budget_value), 0)) * 100 AS DECIMAL(18,2))",
        "ratio"
      )
      .where("pc.employee_id = :employeeId", { employeeId })
      .andWhere("pc.calculate_date >= :startDate", { startDate })
      .andWhere("pc.calculate_date < :endDate", { endDate })
      .getRawOne();

    return {
      sumSaleValue: Number(result?.sumSaleValue) || 0,
      sumBudgetValue: Number(result?.sumBudgetValue) || 0,
      ratio: Number(result?.ratio) || 0,
    };
  }

  async getMonthlyComplianceByRegionAndCompany(
    year: number,
    regional?: string,
    companyId?: number
  ): Promise<
    {
      month: string;
      total_sale_value: number;
      total_budget_value: number;
      compliance_range: number;
    }[]
  > {
    const query = this.repository
      .createQueryBuilder("pc")
      .select("INITCAP(TO_CHAR(pc.calculate_date, 'TMMonth'))", "month")
      .addSelect("SUM(pc.sale_value)", "total_sale_value")
      .addSelect("SUM(pc.budget_value)", "total_budget_value")
      .addSelect(
        `ROUND(
          CASE 
            WHEN SUM(pc.budget_value) = 0 THEN 0
            ELSE (SUM(pc.sale_value) / SUM(pc.budget_value)) * 100
          END, 2
        )`,
        "compliance_range"
      )
      .innerJoin("employees", "e", "e.id = pc.employee_id")
      .where("EXTRACT(YEAR FROM pc.calculate_date) = :year", { year });

    if (regional) {
      query.andWhere("e.regional ILIKE :regional", { regional: `%${regional}%` });
    }

    if (companyId) {
      query.andWhere("pc.company_id = :companyId", { companyId });
    }

    const result = await query
      .groupBy("EXTRACT(MONTH FROM pc.calculate_date), TO_CHAR(pc.calculate_date, 'TMMonth')")
      .orderBy("EXTRACT(MONTH FROM pc.calculate_date)")
      .getRawMany();

    return result.map((row) => ({
      month: row.month,
      total_sale_value: Number(row.total_sale_value),
      total_budget_value: Number(row.total_budget_value),
      compliance_range: Number(row.compliance_range),
    }));
  }


  async deletePCByDateRange(startDate: Date, endDate: Date): Promise<void> {
    await this.repository.delete({
      calculateDate: Between(startDate, endDate),
    });
  }

  async deleteByDateRange(startDate: Date, endDate: Date): Promise<{ affected: number | null | undefined; raw: any }> {
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(ProductCompliance)
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
