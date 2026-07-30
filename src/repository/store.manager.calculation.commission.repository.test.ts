import { StoreManagerCalculationCommissionRepository } from "./store.manager.calculation.commission.repository";
import { FilterReportCommissionDto } from "../dtos/report.dto";

// buildEmployeeFilterSql es privado y no usa `this`: lo invocamos sin
// levantar un DataSource real, igual que en otros tests de este repo.
function callBuildEmployeeFilterSql(filters: FilterReportCommissionDto) {
  const instance = Object.create(StoreManagerCalculationCommissionRepository.prototype);
  return (instance as any).buildEmployeeFilterSql(filters) as { filterSql: string; params: any[] };
}

describe("StoreManagerCalculationCommissionRepository.buildEmployeeFilterSql", () => {
  it("no filtros -> sin condiciones y sin parámetros", () => {
    const { filterSql, params } = callBuildEmployeeFilterSql({} as FilterReportCommissionDto);
    expect(filterSql).toBe("");
    expect(params).toEqual([]);
  });

  it("usa placeholders posicionales, nunca embebe el valor en el SQL (fix de inyección)", () => {
    const malicious = "GERENCIA'; DROP TABLE employees; --";
    const { filterSql, params } = callBuildEmployeeFilterSql({
      year: 2024,
      section: malicious,
    } as FilterReportCommissionDto);

    // El valor peligroso solo puede vivir en `params`, jamás en el texto SQL.
    expect(filterSql).not.toContain(malicious);
    expect(filterSql).not.toContain("DROP TABLE");
    expect(params).toContain(malicious);
  });

  it("arma un placeholder por cada filtro presente, en orden, con el mismo mapeo de columnas que antes", () => {
    const { filterSql, params } = callBuildEmployeeFilterSql({
      year: 2024,
      month: 3,
      companyId: 7,
      companyPositionId: 9,
      section: "VENTAS",
      descDivision: "NORTE",
      descDepar: "COMERCIAL",
      subDepar: "RETAIL",
    });

    expect(filterSql).toBe(
      [
        'AND e."year" = $1',
        'AND e."month" = $2',
        "AND e.company_id = $3",
        "AND e.company_position_id = $4",
        'AND e."section" = $5',
        "AND e.desc_division = $6",
        "AND e.desc_depar = $7",
        "AND e.sub_depar = $8",
      ].join("\n        ")
    );
    expect(params).toEqual([2024, 3, 7, 9, "VENTAS", "NORTE", "COMERCIAL", "RETAIL"]);
  });

  it("omite condiciones para filtros ausentes, sin dejar huecos en la numeración", () => {
    const { filterSql, params } = callBuildEmployeeFilterSql({
      year: 2024,
      section: "VENTAS",
    } as FilterReportCommissionDto);

    expect(filterSql).toBe('AND e."year" = $1\n        AND e."section" = $2');
    expect(params).toEqual([2024, "VENTAS"]);
  });
});
