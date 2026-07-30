import { transformCommissionRules, getCommissionPercent } from "./commissionRules";

// "GRANDE" cae en el grupo combinado GRANDE-MEDIANA-PEQUEÑA-EXPRESS (ver getStoreSizeKey)
const STORE_GROUP_KEY = "GRANDE-MEDIANA-PEQUEÑA-EXPRESS";

const rawRules = [
  {
    parameterLine: { name: "VENTA", groupProductLine: "GRANDE" },
    minComplace: "0",
    maxComplace: "79.99",
    commissionPercentage: "0.5",
  },
  {
    parameterLine: { name: "VENTA", groupProductLine: "GRANDE" },
    minComplace: "80",
    maxComplace: "119.99",
    commissionPercentage: "1.2",
  },
  {
    parameterLine: { name: "UTILIDAD", groupProductLine: "GRANDE" },
    minComplace: "0",
    maxComplace: "100",
    commissionPercentage: "2.0",
  },
];

describe("transformCommissionRules", () => {
  it("separa reglas de venta y utilidad por tamaño de tienda", () => {
    const result = transformCommissionRules(rawRules);
    expect(result.sale[STORE_GROUP_KEY]).toHaveLength(2);
    expect(result.profit[STORE_GROUP_KEY]).toHaveLength(1);
  });

  it("parsea min/max/value como números", () => {
    const result = transformCommissionRules(rawRules);
    expect(result.sale[STORE_GROUP_KEY][0]).toEqual({ min: 0, max: 79.99, value: 0.5 });
  });
});

describe("getCommissionPercent", () => {
  const rules = transformCommissionRules(rawRules);

  it("devuelve el porcentaje de la regla cuyo rango contiene el cumplimiento", () => {
    const result = getCommissionPercent(rules, "GRANDE", 50, "sale");
    expect(result.percent).toBe(0.5);
    expect(result.calculate_rule).toBe(0);
  });

  it("devuelve el porcentaje de la última regla si el cumplimiento supera el máximo", () => {
    const result = getCommissionPercent(rules, "GRANDE", 150, "sale");
    expect(result.percent).toBe(1.2);
    expect(result.calculate_rule).toBe(80);
  });

  it("devuelve 0 si no hay reglas para ese tamaño de tienda", () => {
    const result = getCommissionPercent(rules, "TIENDA_INEXISTENTE", 50, "sale");
    expect(result).toEqual({ percent: 0, calculate_rule: 0 });
  });

  it("agrupa GRANDE/MEDIANA/PEQUEÑA/EXPRESS bajo la misma clave", () => {
    const result = getCommissionPercent(rules, "MEDIANA", 50, "sale");
    expect(result.percent).toBe(0.5);
  });
});
