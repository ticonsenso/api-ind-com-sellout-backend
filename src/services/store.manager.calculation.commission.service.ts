import {DataSource} from "typeorm";
import {
    CreateStoreManagerCalculationCommissionDto,
    StoreManagerCalculationCommissionPaginatedResponseDto,
    StoreManagerCalculationCommissionResponseDto,
} from "../dtos/store.manager.calculation.commission.dto";
import {
    StoreManagerCalculationCommissionRepository
} from "../repository/store.manager.calculation.commission.repository";
import {EmployeesRepository} from "../repository/employees.repository";
import {StoreConfigurationRepository} from "../repository/store.configuration.repository";
import {plainToClass, plainToInstance} from "class-transformer";
import {StoreManagerCalculationCommission} from "../models/store.manager.calculation.commission.model";
import {getCommissionPercent, transformCommissionRules,} from "../utils/commissionRules";
import {parseEuropeanNumber} from "../utils/utils";
import {CommissionRulesRepository} from "../repository/commission.rules.repository";
import {GroupedByStoreRepository} from "../repository/grouped.by.store.repository";
import {FilterReportCommissionDto, TotalMonthlyExpensesAllDto,} from "../dtos/report.dto";
import {AdvisorCommissionRepository} from "../repository/advisor.commission.repository";
import {StoreSizeRepository} from "../repository/store.size.repository";

export class StoreManagerCalculationCommissionService {
  private storeManagerCalculationCommissionRepository: StoreManagerCalculationCommissionRepository;
  private advisorComissionRepository: AdvisorCommissionRepository;
  private employeesRepository: EmployeesRepository;
  private storeConfiguration: StoreConfigurationRepository;
  private groupedByStoreRepository: GroupedByStoreRepository;
  private comissionRules: CommissionRulesRepository;
  private storeSizeRepository: StoreSizeRepository;
  constructor(dataSource: DataSource) {
    this.storeManagerCalculationCommissionRepository =
      new StoreManagerCalculationCommissionRepository(dataSource);
    this.employeesRepository = new EmployeesRepository(dataSource);
    this.advisorComissionRepository = new AdvisorCommissionRepository(
      dataSource
    );
    this.groupedByStoreRepository = new GroupedByStoreRepository(dataSource);
    this.storeConfiguration = new StoreConfigurationRepository(dataSource);
    this.comissionRules = new CommissionRulesRepository(dataSource);
    this.storeSizeRepository = new StoreSizeRepository(dataSource);
  }

  async createStoreManagerCalculationCommission(
    dtos: CreateStoreManagerCalculationCommissionDto[],
    calculateDate: Date
  ): Promise<{ recordCount: number; smsErrors: string[]; errorCount: number }> {
    let count = 0;
    let errorCount = 0;
    const smsErrors: string[] = [];

    if (calculateDate) {
      await this.storeManagerCalculationCommissionRepository.deleteByCalculateDate(
        calculateDate
      );
    }
    for (const dto of dtos) {
      try {
        const groupedStore =
          await this.groupedByStoreRepository.findByStoreCeco(dto.ceco!);
        let mainCeco = dto.ceco!;
        let aggregatedDto = { ...dto };

        let totalSale = parseEuropeanNumber(dto.sale ?? 0);
        let totalPptoSale = parseEuropeanNumber(dto.pptoSale ?? 0);
        let totalDirectProfit = parseEuropeanNumber(dto.directProfit ?? 0);
        let totalDirectProfitPpto = parseEuropeanNumber(
          dto.directProfitPpto ?? 0
        );

        if (groupedStore?.length) {
          mainCeco = groupedStore[0].storePrincipal?.ceco ?? dto.ceco ?? "";

          const secondaryStores = groupedStore
            .map((s) => s.storeSecondary?.ceco)
            .filter((c): c is string => !!c);

          for (const secStore of secondaryStores) {
            const secDto = dtos.find((d) => d.ceco === secStore);
            if (secDto) {
              totalSale += parseEuropeanNumber(secDto.sale ?? 0);
              totalPptoSale += parseEuropeanNumber(secDto.pptoSale ?? 0);
              totalDirectProfit += parseEuropeanNumber(
                secDto.directProfit ?? 0
              );
              totalDirectProfitPpto += parseEuropeanNumber(
                secDto.directProfitPpto ?? 0
              );
            }
          }

          aggregatedDto = {
            ...dto,
            ceco: mainCeco,
            sale: totalSale,
            pptoSale: totalPptoSale,
            directProfit: totalDirectProfit,
            directProfitPpto: totalDirectProfitPpto,
          };
        }

        const mainStoreConfig =
          await this.storeConfiguration.findByCeco(mainCeco);
        const employee =
          await this.employeesRepository.findByCecoAndCompanyPosition(
            mainCeco,
            calculateDate.toString()
          );

        const storeSize = await this.storeSizeRepository.findStoreByName(
          mainStoreConfig?.storeSize.name!
        );

        if (!employee) {
          smsErrors.push(
            `No se encontró el empleado para el CECO principal: ${mainCeco} en ${calculateDate.toString()}`
          );
          continue;
        }

        const dateInitialContractStr = employee.dateInitialContract
          ? String(employee.dateInitialContract)
          : null;
        const calcDateStr =
          calculateDate instanceof Date
            ? calculateDate.toISOString().slice(0, 7)
            : String(calculateDate).slice(0, 7);

        let isTemporary = false;
        if (dateInitialContractStr) {
          const contractYearMonth = dateInitialContractStr.slice(0, 7); // "YYYY-MM"
          isTemporary = contractYearMonth === calcDateStr;
        }
        console.log(
          "isTemporary",
          isTemporary,
          employee.dateInitialContract,
          calculateDate
        );
        const { calculationsFinal } = isTemporary
          ? { calculationsFinal: this.zeroCalculations() }
          : await this.calculationComission(
              aggregatedDto,
              mainStoreConfig?.storeSize.name!
            );

        const storeManagerCalculationComissionData = plainToClass(
          StoreManagerCalculationCommission,
          {
            employee,
            storeConfiguration: mainStoreConfig,
            fiscalSale: totalSale,
            pptoSale: totalPptoSale,
            salesCompliancePercent: calculationsFinal.salesCompliancePercent,
            rangeCompliance: Math.min(calculationsFinal.rangeCompliance, 120),
            salesCommission: calculationsFinal.salesCommission,
            directProfit: totalDirectProfit,
            directProfitPto: totalDirectProfitPpto,
            profitCompliance: calculationsFinal.profitCompliance,
            profitCommissionPercent: calculationsFinal.profitCommissionPercent,
            profitCommission: calculationsFinal.profitCommission,
            performanceCommission: calculationsFinal.performanceCommission,
            averageSalesWithPerformance:
              calculationsFinal.averageSalesWithPerformance,
            performanceCompliancePercent:
              calculationsFinal.performanceCompliancePercent,
            totalPayrollAmount: isTemporary
              ? storeSize?.bonus
              : calculationsFinal.totalPayrollAmount,
            calculateDate,
            fiscalSaleCalculate: calculationsFinal.saleCalculate,
            rangeComplianceApl: calculationsFinal.rangeComplianceApl,
            profitComplianceApl: calculationsFinal.profitComplianceApl,
            directProfitCalculate: calculationsFinal.directProfitCalculate,
          }
        );

        await this.storeManagerCalculationCommissionRepository.create(
          storeManagerCalculationComissionData
        );
        count++;
      } catch (error) {
        console.log(
          "Error al procesar comisión de jefe de tienda:",
          error,
          calculateDate.toString()
        );
        errorCount++;
        smsErrors.push("Error al procesar la comisión de jefe de tienda.");
      }
    }

    return { recordCount: count, smsErrors, errorCount };
  }

  private zeroCalculations() {
    return {
      saleCalculate: 0,
      salesCompliancePercent: 0,
      rangeCompliance: 0,
      rangeComplianceApl: 0,
      profitComplianceApl: 0,
      salesCommission: 0,
      profitCompliance: 0,
      directProfitCalculate: 0,
      profitCommissionPercent: 0,
      profitCommission: 0,
      performanceCommission: 0,
      averageSalesWithPerformance: 0,
      performanceCompliancePercent: 0,
      totalPayrollAmount: 0,
    };
  }

  async calculationComission(
    dto: CreateStoreManagerCalculationCommissionDto,
    storeSizeName: string
  ) {
    const sale = parseEuropeanNumber(dto.sale ?? 0);
    let saleCalculate = sale;
    const pptoSale = parseEuropeanNumber(dto.pptoSale ?? 0);
    const directProfit = parseEuropeanNumber(dto.directProfit ?? 0);
    let directProfitCalculate = directProfit;
    const directProfitPpto = parseEuropeanNumber(dto.directProfitPpto ?? 0);

    const rangeCompliance =
      pptoSale > 0 ? (sale / pptoSale) * 100 : sale > 0 ? 120 : 0;
    const rangeComplianceProfit =
      directProfitPpto > 0
        ? (directProfit / directProfitPpto) * 100
        : directProfit > 0
          ? 120
          : 0;

    console.log("directProfit", directProfit);

    const rawRules =
      await this.comissionRules.findByCommissionConfigurationName(
        "JEFE DE TIENDA"
      );
    const commissionRules = transformCommissionRules(rawRules!);

    let salesCompliancePercent = getCommissionPercent(
      commissionRules,
      storeSizeName,
      rangeCompliance,
      "sale"
    );

    let profitCommissionPercent = getCommissionPercent(
      commissionRules,
      storeSizeName,
      rangeComplianceProfit,
      "profit"
    );

    console.log("profitCommissionPercent", profitCommissionPercent);

    let salesCommission = 0;
    let profitCommission = 0;

    if (rangeCompliance > 120) {
      saleCalculate = pptoSale * 1.2;
      salesCommission = +(
        pptoSale *
        1.2 *
        (salesCompliancePercent.percent / 100)
      ).toFixed(5);
    } else {
      salesCommission = +(
        sale *
        (salesCompliancePercent.percent / 100)
      ).toFixed(5);
    }

    if (rangeComplianceProfit > 120) {
      directProfitCalculate = directProfitPpto * 1.2;
      profitCommission = +(
        directProfitPpto *
        1.2 *
        (profitCommissionPercent.percent / 100)
      ).toFixed(5);
    } else {
      profitCommission = +(
        directProfit *
        (profitCommissionPercent.percent / 100)
      ).toFixed(5);
    }
    const rangeComplianceApl = salesCompliancePercent.calculate_rule;
    const profitComplianceApl = profitCommissionPercent.calculate_rule;
    const salesCommissionFinal = salesCommission < 0 ? 0 : salesCommission;
    const profitCommissionFinal = profitCommission < 0 ? 0 : profitCommission;

    const profitCompliance = (directProfit / directProfitPpto) * 100;

    let averageSalesWithPerformance = 0;
    let performanceCompliancePercent = 0;

    const performanceCommission =
      averageSalesWithPerformance * performanceCompliancePercent;

    const totalPayrollAmount =
      performanceCommission + profitCommissionFinal + salesCommissionFinal;

    const calculationsFinal = {
      saleCalculate,
      salesCompliancePercent: salesCompliancePercent.percent,
      rangeCompliance,
      rangeComplianceApl,
      profitComplianceApl,
      salesCommission: salesCommissionFinal,
      profitCompliance,
      directProfitCalculate,
      profitCommissionPercent: profitCommissionPercent?.percent,
      profitCommission: profitCommissionFinal,
      performanceCommission,
      averageSalesWithPerformance,
      performanceCompliancePercent,
      totalPayrollAmount,
    };

    return { calculationsFinal };
  }

  async searchStoreManagerPaginated(
    search: string = "",
    page?: number,
    limit?: number,
    calculateDate?: Date
  ): Promise<StoreManagerCalculationCommissionPaginatedResponseDto> {
    console.log(calculateDate);
    const { items, total } =
      await this.storeManagerCalculationCommissionRepository.findByFilters(
        search,
        page,
        limit,
        calculateDate
      );

    const itemsDto = items.map((ac) =>
      plainToInstance(StoreManagerCalculationCommissionResponseDto, ac, {
        excludeExtraneousValues: true,
      })
    );

    return plainToInstance(
      StoreManagerCalculationCommissionPaginatedResponseDto,
      { items: itemsDto, total },
      { excludeExtraneousValues: true }
    );
  }

  async getTotalMonthlyExpenses(
    filter: FilterReportCommissionDto
  ): Promise<TotalMonthlyExpensesAllDto[]> {
    const respuestas =
      await this.storeManagerCalculationCommissionRepository.getTotalMonthlyExpensesRepository(
        filter
      );

    // Agrupar por mes y sumar
    const acumulado = respuestas.reduce(
      (acc, curr) => {
        if (!acc[curr.month]) {
          acc[curr.month] = 0;
        }
        acc[curr.month] += curr.gasto_comisiones;
        return acc;
      },
      {} as Record<number, number>
    );

    // Convertir en arreglo de objetos
    const result: TotalMonthlyExpensesAllDto[] = Object.entries(acumulado).map(
      ([month, total]) => ({
        mount: Number(month),
        value: total,
      })
    );

    return result;
  }

  async getTotalEmployeesComissioned(
    filter: FilterReportCommissionDto
  ): Promise<{ mes: number; comisionan: number; no_comisionan: number }[]> {
    const respuesta =
      await this.storeManagerCalculationCommissionRepository.getTotalEmployeesComissioned(
        filter
      );
    const consolidado: Record<
      number,
      { comisionan: number; no_comisionan: number }
    > = {};
    for (const row of respuesta) {
      const { mes, comisionan, no_comisionan } = row;
      if (!consolidado[mes]) {
        consolidado[mes] = { comisionan: 0, no_comisionan: 0 };
      }
      consolidado[mes].comisionan += Number(comisionan) || 0;
      consolidado[mes].no_comisionan += Number(no_comisionan) || 0;
    }
    return Object.entries(consolidado).map(([mes, valores]) => ({
      mes: Number(mes),
      ...valores,
    }));
  }

  async getAverageCompliance(filter: FilterReportCommissionDto): Promise<{
    indurama: { name: string; cargo: string; porcentaje_cumplimiento: number | null }[];
    asesorComercial: { nombre: string; cargo: string; porcentaje_cumplimiento: number | null }[];
    jefeTienda: {
      nombre: string;
      cargo: string;
      porcentaje_cumplimiento_venta: number | null;
      porcentaje_cumplimiento_utilidad: number | null;
    }[];
  }> {
    return await this.storeManagerCalculationCommissionRepository.getAverageCompliance(
      filter
    );
  }

  async getComplianceBracketsCombined(
    filter: FilterReportCommissionDto
  ): Promise<{
    indurama: {
      name: string;
      cargo: string;
      rango_cumplimiento: number | null;
    }[];
    asesorComercial: {
      nombre: string;
      cargo: string;
      rango_cumplimiento: number | null;
    }[];
    jefeTienda: {
      nombre: string;
      cargo: string;
      rango_cumplimiento_venta: number | null;
      rango_cumplimiento_utilidad: number | null;
    }[];
  }> {
    return await this.storeManagerCalculationCommissionRepository.getComplianceBrackets(
      filter
    );
  }

  async getDataRanges(
    filters: FilterReportCommissionDto
  ): Promise<{ maximo: number; minimo_sin_cero: number; promedio: number; mes: number }[]> {
    const respuesta =
      await this.storeManagerCalculationCommissionRepository.getMonthlyCommissionStats(
        filters
      );

    // Agrupar por mes
    const agrupadoPorMes: Record<number, any[]> = {};
    for (const r of respuesta) {
      if (!agrupadoPorMes[r.mes]) agrupadoPorMes[r.mes] = [];
      agrupadoPorMes[r.mes].push(r);
    }

    // Calcular para cada mes
    const resultado = Object.entries(agrupadoPorMes).map(([mesStr, datos]) => {
      const maximos = datos.map((r: any) => r.maximo ?? 0);
      const minimos = datos
        .map((r: any) => r.minimo_sin_cero ?? 0)
        .filter((v: number) => v > 0);
      const promedios = datos.map((r: any) => r.promedio ?? 0);

      return {
        maximo: maximos.length ? Math.max(...maximos) : 0,
        minimo_sin_cero: minimos.length ? Math.min(...minimos) : 0,
        promedio: promedios.length
          ? promedios.reduce((a: number, b: number) => a + b, 0) / promedios.length
          : 0,
        mes: Number(mesStr),
      };
    });

    return resultado;
  }
}
