import {Brackets, DataSource} from "typeorm";
import {BaseRepository} from "./base.respository";
import {StoreManagerCalculationCommission} from "../models/store.manager.calculation.commission.model";
import {FilterReportCommissionDto} from "../dtos/report.dto";
import {AdvisorCommissionRepository} from "./advisor.commission.repository";
import {ConsolidatedCommissionCalculationRepository} from "./consolidated.commission.calculation.repository";
import {ResponseDataConsensoDto, SearchDataConsensoDto,} from "../dtos/search.data.consenso";
import {plainToInstance} from "class-transformer";

export class StoreManagerCalculationCommissionRepository extends BaseRepository<StoreManagerCalculationCommission> {
  private advisorComissionRepository: AdvisorCommissionRepository;
  private consolidatedCommissionRepository: ConsolidatedCommissionCalculationRepository;
  constructor(dataSource: DataSource) {
    super(StoreManagerCalculationCommission, dataSource);
    this.advisorComissionRepository = new AdvisorCommissionRepository(
      dataSource
    );
    this.consolidatedCommissionRepository =
      new ConsolidatedCommissionCalculationRepository(dataSource);
  }

  async deleteByCalculateDate(calculateDate: Date): Promise<void> {
    console.log("deleteByCalculateDate", calculateDate);
    await this.repository.delete({ calculateDate });
  }

  async findByFilters(
    search: string = "",
    page?: number,
    limit?: number,
    calculateDate?: Date
  ): Promise<{ items: StoreManagerCalculationCommission[]; total: number }> {
    const qb = this.repository
      .createQueryBuilder("sm")
      .leftJoinAndSelect("sm.employee", "e")
      .leftJoinAndSelect("e.company", "c")
      .leftJoinAndSelect("e.companyPosition", "p")
      .leftJoinAndSelect("sm.storeConfiguration", "sc")
      .leftJoinAndSelect("sc.storeSize", "sz")

      .orderBy("sm.createdAt", "ASC");

    if (search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where("e.documentNumber ILIKE :search", { search: `%${search}%` })
            .orWhere("e.name ILIKE :search", { search: `%${search}%` })
            .orWhere("e.code ILIKE :search", { search: `%${search}%` })
            .orWhere("e.ceco ILIKE :search", { search: `%${search}%` })
            .orWhere("sz.name ILIKE :search", { search: `%${search}%` });
        })
      );
    }

    if (calculateDate) {
      const formatted = calculateDate.toISOString().slice(0, 7);
      qb.andWhere(`TO_CHAR(sm.calculateDate, 'YYYY-MM') = :formatted`, {
        formatted,
      });
    }

    if (page && limit) {
      qb.skip((page - 1) * limit).take(limit);
    }

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  async getDataNominaStoreManager(
      dto: SearchDataConsensoDto
    ): Promise<ResponseDataConsensoDto[]> {
      const { empresa, anio, mes } = dto;
      const qb = this.repository
        .createQueryBuilder("smcc")
        .select([
          "c.name AS empresa",
          "e.code AS codigo_empleado",
          "e.documentNumber AS cedula_colaborador",
          "cp.name AS cargo",
          "EXTRACT(YEAR FROM smcc.calculateDate) AS anio_calculo",
          "EXTRACT(MONTH FROM smcc.calculateDate) AS mes_calculo",
          "e.variableSalary AS sueldo_variable",
          "smcc.profitCompliance AS porcentaje_cumplimiento",
          "smcc.totalPayrollAmount AS valor_comision_pagar",
        ])
        .innerJoin("smcc.employee", "e")
        .innerJoin("e.company", "c")
        .innerJoin("e.companyPosition", "cp")
        .where("EXTRACT(YEAR FROM smcc.calculateDate) = :anio", { anio })
        .andWhere("EXTRACT(MONTH FROM smcc.calculateDate) = :mes", { mes });

      if (empresa) {
        qb.andWhere("c.name = :empresa", { empresa });
      }
      const rawData = await qb.getRawMany();
      return plainToInstance(ResponseDataConsensoDto, rawData, {
        excludeExtraneousValues: true,
      });
    }

  async getTotalMonthlyExpensesRepository(
    filters: FilterReportCommissionDto,
  ): Promise<
    {
      source: string;
      gasto_comisiones: number;
      month: number;
    }[]
  > {
    let filterSql = "";
    if (filters.year) {
      filterSql += ' AND e."year" = ' + filters.year;
    }
    if (filters.month) {
      filterSql += ' AND e."month" = ' + filters.month;
    }
    if (filters.companyId) {
      filterSql += " AND e.company_id = " + filters.companyId;
    }
    if (filters.companyPositionId) {
      filterSql += " AND e.company_position_id = " + filters.companyPositionId;
    }
    if (filters.section) {
      filterSql += ' AND e."section" = ' + `'${filters.section}'`;
    }
    if (filters.descDivision) {
      filterSql += " AND e.desc_division = " + `'${filters.descDivision}'`;
    }
    if (filters.descDepar) {
      filterSql += " AND e.desc_depar = " + `'${filters.descDepar}'`;
    }
    if (filters.subDepar) {
      filterSql += " AND e.sub_depar = " + `'${filters.subDepar}'`;
    }

    const sql = `
      SELECT 
          'asesor_comercial' AS source,
          SUM(ac.commission_total) AS gasto_comisiones,
          e."month"
      FROM "db-sellout".advisor_commission ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      WHERE 1=1
        ${filterSql}
      GROUP BY e."month"

      UNION ALL

      SELECT 
          'consolidado_indurama' AS source,
          SUM(ac.total_nomina) AS gasto_comisiones,
          e."month"
      FROM "db-sellout".consolidated_commission_calculation ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      WHERE 1=1
        ${filterSql}
      GROUP BY e."month"

      UNION ALL

      SELECT 
          'jefe_tienda' AS source,
          SUM(ac.total_payroll_amount) AS gasto_comisiones,
          e."month"
      FROM "db-sellout".store_manager_calculation_commission ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      WHERE 1=1
        ${filterSql}
      GROUP BY e."month"
    `;
    console.log("SQL getTotalMonthlyExpensesRepository:", sql);

    // TypeORM expects query params as array if using positional parameters, or as object for named parameters.
    // Here we use named parameters, so pass as object.
    const result = await this.dataSource.query(sql);
    return result.map((row: any) => ({
      source: row.source,
      gasto_comisiones: row.gasto_comisiones !== null ? Number(row.gasto_comisiones) : 0,
      month: row.month !== null ? Number(row.month) : null,
    }));
  }
  async getTotalEmployeesComissioned(
    filters: FilterReportCommissionDto
  ): Promise<
    {
      source: string;
      mes: number;
      comisionan: number;
      no_comisionan: number;
    }[]
  > {
     let filterSql = "";
    if (filters.year) {
      filterSql += ' AND e."year" = ' + filters.year;
    }
    if (filters.month) {
      filterSql += ' AND e."month" = ' + filters.month;
    }
    if (filters.companyId) {
      filterSql += " AND e.company_id = " + filters.companyId;
    }
    if (filters.companyPositionId) {
      filterSql += " AND e.company_position_id = " + filters.companyPositionId;
    }
    if (filters.section) {
      filterSql += ' AND e."section" = ' + `'${filters.section}'`;
    }
    if (filters.descDivision) {
      filterSql += " AND e.desc_division = " + `'${filters.descDivision}'`;
    }
    if (filters.descDepar) {
      filterSql += " AND e.desc_depar = " + `'${filters.descDepar}'`;
    }
    if (filters.subDepar) {
      filterSql += " AND e.sub_depar = " + `'${filters.subDepar}'`;
    }

    const sql = `
      SELECT 
        'asesor_comercial' AS source,
        e."month" AS mes,
        SUM(CASE WHEN ac.commission_total > 0 THEN 1 ELSE 0 END) AS comisionan,
        SUM(CASE WHEN ac.commission_total <= 0 THEN 1 ELSE 0 END) AS no_comisionan
      FROM "db-sellout".advisor_commission ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      WHERE 1=1
        ${filterSql}
      GROUP BY e."month"

      UNION ALL

      SELECT 
        'consolidado_indurama' AS source,
        e."month" AS mes,
        SUM(CASE WHEN ac.total_nomina > 0 THEN 1 ELSE 0 END) AS comisionan,
        SUM(CASE WHEN ac.total_nomina <= 0 THEN 1 ELSE 0 END) AS no_comisionan
      FROM "db-sellout".consolidated_commission_calculation ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      WHERE 1=1
        ${filterSql}
      GROUP BY e."month"

      UNION ALL

      SELECT 
        'jefe_tienda' AS source,
        e."month" AS mes,
        SUM(CASE WHEN ac.total_payroll_amount > 0 THEN 1 ELSE 0 END) AS comisionan,
        SUM(CASE WHEN ac.total_payroll_amount <= 0 THEN 1 ELSE 0 END) AS no_comisionan
      FROM "db-sellout".store_manager_calculation_commission ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      WHERE 1=1
        ${filterSql}
      GROUP BY e."month"
    `;

    const result = await this.dataSource.query(sql);
    return result.map((row: any) => ({
      source: row.source,
      mes: row.mes !== null ? Number(row.mes) : null,
      comisionan: row.comisionan !== null ? Number(row.comisionan) : 0,
      no_comisionan: row.no_comisionan !== null ? Number(row.no_comisionan) : 0,
    }));
  }

  /**
   * Get average compliance for three sources with the same filters.
   * Returns an object with three arrays: indurama, asesorComercial, jefeTienda.
   */
  async getAverageCompliance(
    filters: FilterReportCommissionDto,
  ): Promise<{
    indurama: { name: string; cargo: string; porcentaje_cumplimiento: number | null }[];
    asesorComercial: { nombre: string; cargo: string; porcentaje_cumplimiento: number | null }[];
    jefeTienda: {
      nombre: string;
      cargo: string;
      porcentaje_cumplimiento_venta: number | null;
      porcentaje_cumplimiento_utilidad: number | null;
    }[];
  }> {
     let filterSql = "";
    if (filters.year) {
      filterSql += ' AND e."year" = ' + filters.year;
    }
    if (filters.month) {
      filterSql += ' AND e."month" = ' + filters.month;
    }
    if (filters.companyId) {
      filterSql += " AND e.company_id = " + filters.companyId;
    }
    if (filters.companyPositionId) {
      filterSql += " AND e.company_position_id = " + filters.companyPositionId;
    }
    if (filters.section) {
      filterSql += ' AND e."section" = ' + `'${filters.section}'`;
    }
    if (filters.descDivision) {
      filterSql += " AND e.desc_division = " + `'${filters.descDivision}'`;
    }
    if (filters.descDepar) {
      filterSql += " AND e.desc_depar = " + `'${filters.descDepar}'`;
    }
    if (filters.subDepar) {
      filterSql += " AND e.sub_depar = " + `'${filters.subDepar}'`;
    }

    // Indurama (Extrategic)
    const induramaSql = `
      SELECT 
        e.name AS name,
        cp.name as cargo,
        AVG(ac.strategic_compliance_pct) as porcentaje_cumplimiento
      FROM "db-sellout".calculation_product_extrategic ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      INNER JOIN "db-sellout".company_positions cp ON e.company_position_id  = cp.id
      WHERE 1=1
        ${filterSql}
      GROUP BY e.name, cp.name
    `;

    // Asesor Comercial
    const asesorComercialSql = `
      SELECT 
        e.name as nombre,
        cp.name as cargo,
        AVG(ac.compliance_sale) as porcentaje_cumplimiento
      FROM "db-sellout".advisor_commission ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      INNER JOIN "db-sellout".company_positions cp ON e.company_position_id  = cp.id
      WHERE 1=1
        ${filterSql}
      GROUP BY e.name, cp.name
    `;

    // Jefe Tienda
    const jefeTiendaSql = `
      SELECT 
        e.name as nombre,
        cp.name as cargo,
        AVG(ac.range_compliance) as porcentaje_cumplimiento_venta,
        AVG(ac.profit_compliance) as porcentaje_cumplimiento_utilidad
      FROM "db-sellout".store_manager_calculation_commission ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      INNER JOIN "db-sellout".company_positions cp ON e.company_position_id  = cp.id
      WHERE 1=1
        ${filterSql}
      GROUP BY e.name, cp.name
    `;

    const [indurama, asesorComercial, jefeTienda] = await Promise.all([
      this.dataSource.query(induramaSql),
      this.dataSource.query(asesorComercialSql),
      this.dataSource.query(jefeTiendaSql),
    ]);

    return {
      indurama: indurama.map((row: any) => ({
        name: row.name,
        cargo: row.cargo,
        porcentaje_cumplimiento: row.porcentaje_cumplimiento !== null ? Number(row.porcentaje_cumplimiento) : null,
      })),
      asesorComercial: asesorComercial.map((row: any) => ({
        nombre: row.nombre,
        cargo: row.cargo,
        porcentaje_cumplimiento: row.porcentaje_cumplimiento !== null ? Number(row.porcentaje_cumplimiento) : null,
      })),
      jefeTienda: jefeTienda.map((row: any) => ({
        nombre: row.nombre,
        cargo: row.cargo,
        porcentaje_cumplimiento_venta: row.porcentaje_cumplimiento_venta !== null ? Number(row.porcentaje_cumplimiento_venta) : null,
        porcentaje_cumplimiento_utilidad: row.porcentaje_cumplimiento_utilidad !== null ? Number(row.porcentaje_cumplimiento_utilidad) : null,
      })),
    };
  }

  /**
   * Get compliance brackets for three sources with the same filters.
   * Returns an object with three arrays: extrategic, asesor_comercial, jefe_tienda.
   */
  async getComplianceBrackets(
    filters: FilterReportCommissionDto
  ): Promise<{
    indurama: { name: string; cargo: string; rango_cumplimiento: number | null }[];
    asesorComercial: { nombre: string; cargo: string; rango_cumplimiento: number | null }[];
    jefeTienda: {
      nombre: string;
      cargo: string;
      rango_cumplimiento_venta: number | null;
      rango_cumplimiento_utilidad: number | null;
    }[];
  }> {
     let filterSql = "";
    if (filters.year) {
      filterSql += ' AND e."year" = ' + filters.year;
    }
    if (filters.month) {
      filterSql += ' AND e."month" = ' + filters.month;
    }
    if (filters.companyId) {
      filterSql += " AND e.company_id = " + filters.companyId;
    }
    if (filters.companyPositionId) {
      filterSql += " AND e.company_position_id = " + filters.companyPositionId;
    }
    if (filters.section) {
      filterSql += ' AND e."section" = ' + `'${filters.section}'`;
    }
    if (filters.descDivision) {
      filterSql += " AND e.desc_division = " + `'${filters.descDivision}'`;
    }
    if (filters.descDepar) {
      filterSql += " AND e.desc_depar = " + `'${filters.descDepar}'`;
    }
    if (filters.subDepar) {
      filterSql += " AND e.sub_depar = " + `'${filters.subDepar}'`;
    }

    // Extrategic
    const extrategicSql = `
      SELECT 
        e.name AS name,
        cp.name as cargo,
        ac.strategic_compliance_pct as rango_cumplimiento
      FROM "db-sellout".calculation_product_extrategic ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      INNER JOIN "db-sellout".company_positions cp ON e.company_position_id  = cp.id
      WHERE 1=1
        ${filterSql}
    `;
    // Asesor Comercial
    const asesorComercialSql = `
      SELECT 
        e.name as nombre,
        cp.name as cargo,
        ac.range_apply_bonus as rango_cumplimiento
      FROM "db-sellout".advisor_commission ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      INNER JOIN "db-sellout".company_positions cp ON e.company_position_id  = cp.id
      WHERE 1=1
        ${filterSql}
    `;
    // Jefe Tienda
    const jefeTiendaSql = `
      SELECT 
        e.name as nombre,
        cp.name as cargo,
        ac.range_compliance_apl  as rango_cumplimiento_venta,
        ac.profit_compliance_apl  as rango_cumplimiento_utilidad
      FROM "db-sellout".store_manager_calculation_commission ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      INNER JOIN "db-sellout".company_positions cp ON e.company_position_id  = cp.id
      WHERE 1=1
        ${filterSql}
    `;

    const [extrategic, asesor_comercial, jefe_tienda] = await Promise.all([
      this.dataSource.query(extrategicSql),
      this.dataSource.query(asesorComercialSql),
      this.dataSource.query(jefeTiendaSql),
    ]);

    return {
      indurama: extrategic.map((row: any) => ({
        name: row.name,
        cargo: row.cargo,
        rango_cumplimiento: row.rango_cumplimiento !== null ? Number(row.rango_cumplimiento) : null,
      })),
      asesorComercial: asesor_comercial.map((row: any) => ({
        nombre: row.nombre,
        cargo: row.cargo,
        rango_cumplimiento: row.rango_cumplimiento !== null ? Number(row.rango_cumplimiento) : null,
      })),
      jefeTienda: jefe_tienda.map((row: any) => ({
        nombre: row.nombre,
        cargo: row.cargo,
        rango_cumplimiento_venta: row.rango_cumplimiento_venta !== null ? Number(row.rango_cumplimiento_venta) : null,
        rango_cumplimiento_utilidad: row.rango_cumplimiento_utilidad !== null ? Number(row.rango_cumplimiento_utilidad) : null,
      })),
    };
  }
  

  /**
   * Get max, min (excluding zero), and average commissions per month for each source.
   * All filters are optional and passed as parameters.
   */
  async getMonthlyCommissionStats(
    filters: FilterReportCommissionDto
  ): Promise<
    {
      source: string;
      maximo: number | null;
      minimo_sin_cero: number | null;
      promedio: number | null;
      mes: number;
    }[]
  > {
     let filterSql = "";
    if (filters.year) {
      filterSql += ' AND e."year" = ' + filters.year;
    }
    if (filters.month) {
      filterSql += ' AND e."month" = ' + filters.month;
    }
    if (filters.companyId) {
      filterSql += " AND e.company_id = " + filters.companyId;
    }
    if (filters.companyPositionId) {
      filterSql += " AND e.company_position_id = " + filters.companyPositionId;
    }
    if (filters.section) {
      filterSql += ' AND e."section" = ' + `'${filters.section}'`;
    }
    if (filters.descDivision) {
      filterSql += " AND e.desc_division = " + `'${filters.descDivision}'`;
    }
    if (filters.descDepar) {
      filterSql += " AND e.desc_depar = " + `'${filters.descDepar}'`;
    }
    if (filters.subDepar) {
      filterSql += " AND e.sub_depar = " + `'${filters.subDepar}'`;
    }

    const sql = `
      SELECT 
          'asesor_comercial' AS source,
          MAX(ac.commission_total) AS maximo,
          MIN(CASE WHEN ac.commission_total > 0 THEN ac.commission_total END) AS minimo_sin_cero,
          AVG(ac.commission_total) AS promedio,
          e."month" as mes
      FROM "db-sellout".advisor_commission ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      WHERE 1=1
        ${filterSql}
      GROUP BY e."month"

      UNION ALL

      SELECT 
          'consolidado_indurama' AS source,
          MAX(ac.total_nomina),
          MIN(CASE WHEN ac.total_nomina > 0 THEN ac.total_nomina END),
          AVG(ac.total_nomina),
          e."month" as mes
      FROM "db-sellout".consolidated_commission_calculation ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      WHERE 1=1
        ${filterSql}
      GROUP BY e."month"

      UNION ALL

      SELECT 
          'jefe_tienda' AS source,
          MAX(ac.total_payroll_amount),
          MIN(CASE WHEN ac.total_payroll_amount > 0 THEN ac.total_payroll_amount END),
          AVG(ac.total_payroll_amount),
          e."month" as mes
      FROM "db-sellout".store_manager_calculation_commission ac
      INNER JOIN "db-sellout".employees e ON e.id = ac.employee_id
      WHERE 1=1
        ${filterSql}
      GROUP BY e."month"
    `;

    const result = await this.dataSource.query(sql);
    return result.map((row: any) => ({
      source: row.source,
      maximo: row.maximo !== null ? Number(row.maximo) : null,
      minimo_sin_cero: row.minimo_sin_cero !== null ? Number(row.minimo_sin_cero) : null,
      promedio: row.promedio !== null ? Number(row.promedio) : null,
      mes: row.mes !== null ? Number(row.mes) : null,
    }));
  }

  
}
