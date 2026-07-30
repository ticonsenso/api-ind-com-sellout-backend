import { StoreManagerCalculationCommissionService } from "./store.manager.calculation.commission.service";
import { transformCommissionRules } from "../utils/commissionRules";

const rawRules = [
  {
    parameterLine: { name: "VENTA", groupProductLine: "GRANDE" },
    minComplace: "0",
    maxComplace: "100",
    commissionPercentage: "1.0",
  },
  {
    parameterLine: { name: "UTILIDAD", groupProductLine: "GRANDE" },
    minComplace: "0",
    maxComplace: "100",
    commissionPercentage: "2.0",
  },
];

// calculationComission no usa `this`, así que podemos invocarlo sin construir
// la clase completa (que requiere un DataSource real conectado).
function callCalculationComission(dto: any, storeSizeName: string, commissionRules: any) {
  const instance = Object.create(StoreManagerCalculationCommissionService.prototype);
  return instance.calculationComission(dto, storeSizeName, commissionRules);
}

describe("StoreManagerCalculationCommissionService.calculationComission", () => {
  const commissionRules = transformCommissionRules(rawRules);

  it("calcula comisión de venta cuando el cumplimiento está dentro de rango normal", async () => {
    const { calculationsFinal } = await callCalculationComission(
      { sale: "80", pptoSale: "100", directProfit: "0", directProfitPpto: "0" },
      "GRANDE",
      commissionRules
    );

    expect(calculationsFinal.rangeCompliance).toBe(80);
    expect(calculationsFinal.salesCompliancePercent).toBe(1);
    expect(calculationsFinal.salesCommission).toBeCloseTo(0.8, 5);
  });

  it("tope de comisión de venta al 120% cuando se supera el presupuesto", async () => {
    const { calculationsFinal } = await callCalculationComission(
      { sale: "150", pptoSale: "100", directProfit: "0", directProfitPpto: "0" },
      "GRANDE",
      commissionRules
    );

    expect(calculationsFinal.saleCalculate).toBe(120);
    expect(calculationsFinal.salesCommission).toBeCloseTo(1.2, 5);
  });

  it("calcula comisión de utilidad de forma independiente a la de venta", async () => {
    const { calculationsFinal } = await callCalculationComission(
      { sale: "0", pptoSale: "0", directProfit: "50", directProfitPpto: "100" },
      "GRANDE",
      commissionRules
    );

    expect(calculationsFinal.profitCommissionPercent).toBe(2);
    expect(calculationsFinal.profitCommission).toBeCloseTo(1, 5);
  });

  it("no genera comisión negativa cuando el cálculo da negativo", async () => {
    const { calculationsFinal } = await callCalculationComission(
      { sale: "-10", pptoSale: "100", directProfit: "0", directProfitPpto: "0" },
      "GRANDE",
      commissionRules
    );

    expect(calculationsFinal.salesCommission).toBe(0);
  });
});
