import { DataSource } from 'typeorm';
import { exportToExcel } from '../helpers/export.to.excel.helper';
import { Request, Response } from 'express';
import { ProductSicRepository } from '../repository/product.sic.repository';
import {
    fieldsAdvisorCommission,
    fieldsBasePptoSellout,
    fieldsBaseValuesSellout,
    fieldsCalculationComissionStoreManager,
    fieldsConsolidatedDataStores,
    fieldsEmployee,
    fieldsMatriculacion,
    fieldsMatriculacionLogs,
    fieldsProductSic,
    fieldsSelloutProductMaster,
    fieldsSelloutStoreMaster,
    fieldsStoreConfiguration,
    fieldsStorePptoMarcimex,
    fieldsStoresSic,
    filedsConsolidatedCommissionCalculation,
    filedsNoHomologadosProducts,
    filedsNoHomologadosStores
} from '../utils/fields';
import { ConsolidatedDataStoresRepository } from '../repository/consolidated.data.stores.repository';
import { SelloutProductMasterRepository } from '../repository/sellout.product.master.repository';
import { SelloutStoreMasterRepository } from '../repository/sellout.store.master.repository';
import { StoresSicRepository } from '../repository/stores.repository';
import { BaseValuesSelloutRepository } from '../repository/base.values.sellout.repository';
import { BasePptoSelloutService } from '../services/base.ppto.sellout.service';
import { AdvisorCommissionService } from '../services/advisor.commision.service';
import { MatriculationService } from '../services/matriculation.service';
import { StoreConfigurationService } from '../services/store.configuration.service';
import { EmployeesService } from '../services/employees.service';
import { StoreManagerCalculationCommissionService } from '../services/store.manager.calculation.commission.service';
import { ConsolidatedCommissionCalculationService } from '../services/consolidated.commission.calculation.service';
import { ConsolidatedDataStoresService } from '../services/consolidated.data.stores.service';
import { NullFieldFilters } from '../dtos/consolidated.data.stores.dto';
import { ExcelImportService } from '../services/excel.processing.service';
import * as Excel from 'exceljs';

export interface ExportField {
    key: string;
    header: string;
    transform?: (value: any, item: any) => any;
}

export interface ExportFieldAvanced {
    key: string;
    header: string;
    width?: number;
    transform?: (value: any, item: any) => any;
}

export function flattenDataForExport<T>(data: T[], fields: ExportField[]): Record<string, any>[] {
    return data.map((item) => {
        const flatItem: Record<string, any> = {};

        for (const field of fields) {
            const pathParts = field.key.match(/([^[.\]]+)/g) || [];

            let value: any = item;
            for (const part of pathParts) {
                value = value?.[part];
                if (value === undefined || value === null) {
                    value = '';
                    break;
                }
            }

            if (field.transform) {
                value = field.transform(value, item);
            }

            if (value === 'NaN' || value === '-' || value === 'null') {
                value = '';
            }
            if (typeof value === 'number' && isNaN(value)) {
                value = '';
            }

            flatItem[field.key] = value;
        }

        return flatItem;
    });
}


export class ExportDataController {

    private productSicRepository: ProductSicRepository;
    private storesSicRepository: StoresSicRepository;
    private selloutProductMasterRepository: SelloutProductMasterRepository;
    private selloutStoreMasterRepository: SelloutStoreMasterRepository;
    private consolidatedDataStoresRepository: ConsolidatedDataStoresRepository;
    private basePptoSelloutService: BasePptoSelloutService;
    private baseValuesSelloutRepository: BaseValuesSelloutRepository;
    private advisorCommissionService: AdvisorCommissionService;
    private storeConfiguration: StoreConfigurationService;
    private matriculationService: MatriculationService;
    private employeeService: EmployeesService;
    private storeManagerCalculationCommissionService: StoreManagerCalculationCommissionService;
    private consolidatedCommissionCalculationService: ConsolidatedCommissionCalculationService;
    private consolidatedDataStoresService: ConsolidatedDataStoresService
    private excelService: ExcelImportService;

    constructor(dataSource: DataSource) {
        this.productSicRepository = new ProductSicRepository(dataSource);
        this.storesSicRepository = new StoresSicRepository(dataSource);
        this.selloutProductMasterRepository = new SelloutProductMasterRepository(dataSource);
        this.selloutStoreMasterRepository = new SelloutStoreMasterRepository(dataSource);
        this.consolidatedDataStoresRepository = new ConsolidatedDataStoresRepository(dataSource);
        this.basePptoSelloutService = new BasePptoSelloutService(dataSource);
        this.baseValuesSelloutRepository = new BaseValuesSelloutRepository(dataSource);
        this.advisorCommissionService = new AdvisorCommissionService(dataSource);
        this.storeConfiguration = new StoreConfigurationService(dataSource);
        this.matriculationService = new MatriculationService(dataSource);
        this.employeeService = new EmployeesService(dataSource);
        this.storeManagerCalculationCommissionService = new StoreManagerCalculationCommissionService(dataSource);
        this.consolidatedCommissionCalculationService = new ConsolidatedCommissionCalculationService(dataSource);
        this.exportGenericHandler = this.exportGenericHandler.bind(this);
        this.exportDataHandler = this.exportDataHandler.bind(this);
        this.consolidatedDataStoresService = new ConsolidatedDataStoresService(dataSource);
        this.excelService = new ExcelImportService(dataSource);
        this.importDataHandler = this.importDataHandler.bind(this);
        this.exportDataAvancedHandler = this.exportDataAvancedHandler.bind(this);
    }

    async exportGenericHandler(
        fields: any[],
        excelName: string,
        req: Request,
        res: Response,
        calculateDate: string | null = null
    ) {
        let rawData: any[] = [];

        switch (excelName) {
            case 'prod sic':
                rawData = await this.productSicRepository.findAll();
                break;
            case 'alm sic':
                rawData = await this.storesSicRepository.findAll();
                break;

            case 'mt prod':
                rawData = await this.selloutProductMasterRepository.findAll();
                break;

            case 'mt. alm':
                rawData = await this.selloutStoreMasterRepository.findAll();
                break;
            case 'valores':
                rawData = await this.baseValuesSelloutRepository.findAll();
                break;

            case 'Base Ppto':
                rawData = await this.basePptoSelloutService.getAllBasePptoSellout();
                break;

            case 'advisor_commission':
                if (!calculateDate) return res.status(400).json({ message: 'Fecha de cálculo requerida' });
                rawData = (await this.advisorCommissionService.searchAdvisorCommissionPaginated(
                    "",
                    undefined,
                    undefined,
                    new Date(calculateDate)
                )).items;
                rawData = rawData.map(item => ({
                    ...item,
                    taxSale: item.taxSale ? Number(item.taxSale) : 0,
                    budgetSale: item.budgetSale ? Number(item.budgetSale) : 0,
                    complianceSale: item.complianceSale ? Number(item.complianceSale) : 0,
                    rangeApplyBonus: item.rangeApplyBonus ? Number(item.rangeApplyBonus) : 0,
                    saleIntangible: item.saleIntangible ? Number(item.saleIntangible) : 0,
                    cashSale: item.cashSale ? Number(item.cashSale) : 0,
                    creditSale: item.creditSale ? Number(item.creditSale) : 0,
                    commissionIntangible: item.commissionIntangible ? Number(item.commissionIntangible) : 0,
                    commissionCash: item.commissionCash ? Number(item.commissionCash) : 0,
                    commissionCredit: item.commissionCredit ? Number(item.commissionCredit) : 0,
                    commissionTotal: item.commissionTotal ? Number(item.commissionTotal) : 0,
                }));
                break;

            case 'matriculation':
                if (!calculateDate) return res.status(400).json({ message: 'Fecha de cálculo requerida' });
                rawData = (await this.matriculationService.getMatriculationTemplates(
                    undefined,
                    undefined,
                    "",
                    calculateDate
                )).items;
                break;

            case 'matriculation_logs':
                if (!calculateDate) return res.status(400).json({ message: 'Fecha de cálculo requerida' });
                rawData = await this.matriculationService.getMatriculationTemplatesWithFilters(calculateDate);
                break;

            case 'store_configuration':
                rawData = (await this.storeConfiguration.searchStoreConfigurationPaginated("", undefined)).items;
                break;

            case 'store_ppto_marcimex':
                if (!calculateDate) return res.status(400).json({ message: 'Fecha de cálculo requerida' });
                rawData = (await this.storeConfiguration.getStorePptoMarcimexData(
                    undefined,
                    undefined,
                    "",
                    calculateDate
                )).items;
                rawData = rawData.map(item => ({
                    ...item,
                    storePpto: item.storePpto ? Number(item.storePpto) : 0,
                    storePptoGroup: item.storePptoGroup ? Number(item.storePptoGroup) : 0
                }));
                break;

            case 'employees':
                if (!calculateDate) return res.status(400).json({ message: 'Fecha de cálculo requerida' });
                rawData = (await this.employeeService.searchEmployeePaginated(
                    {},
                    undefined,
                    undefined,
                    calculateDate
                )).items;
                break;

            case 'calc_comm_mgr':
                if (!calculateDate) return res.status(400).json({ message: 'Fecha de cálculo requerida' });
                rawData = (await this.storeManagerCalculationCommissionService.searchStoreManagerPaginated(
                    "",
                    undefined,
                    undefined,
                    new Date(calculateDate)
                )).items;
                rawData = rawData.map(item => ({
                    ...item,
                    fiscalSale: item.fiscalSale ? Number(item.fiscalSale) : 0,
                    pptoSale: item.pptoSale ? Number(item.pptoSale) : 0,
                    rangeCompliance: item.rangeCompliance ? Number(item.rangeCompliance) : 0,
                    salesCompliancePercent: item.salesCompliancePercent ? Number(item.salesCompliancePercent) : 0,
                    salesCommission: item.salesCommission ? Number(item.salesCommission) : 0,
                    directProfit: item.directProfit ? Number(item.directProfit) : 0,
                    directProfitPto: item.directProfitPto ? Number(item.directProfitPto) : 0,
                    profitCompliance: item.profitCompliance ? Number(item.profitCompliance) : 0,
                    profitCommissionPercent: item.profitCommissionPercent ? Number(item.profitCommissionPercent) : 0,
                    profitCommission: item.profitCommission ? Number(item.profitCommission) : 0,
                    performanceCommission: item.performanceCommission ? Number(item.performanceCommission) : 0,
                    averageSalesWithPerformance: item.averageSalesWithPerformance ? Number(item.averageSalesWithPerformance) : 0,
                    performanceCompliancePercent: item.performanceCompliancePercent ? Number(item.performanceCompliancePercent) : 0,
                    totalPayrollAmount: item.totalPayrollAmount ? Number(item.totalPayrollAmount) : 0,
                    fiscalSaleCalculate: item.fiscalSaleCalculate ? Number(item.fiscalSaleCalculate) : 0,
                    rangeComplianceApl: item.rangeComplianceApl ? Number(item.rangeComplianceApl) : 0,
                    profitComplianceApl: item.profitComplianceApl ? Number(item.profitComplianceApl) : 0,
                    directProfitCalculate: item.directProfitCalculate ? Number(item.directProfitCalculate) : 0,
                }));
                break;

            case 'consolidated_commission_calculation':
                if (!calculateDate) return res.status(400).json({ message: 'Fecha de cálculo requerida' });
                rawData = (await this.consolidatedCommissionCalculationService.getConsolidatedCommissionCalculation(
                    "",
                    new Date(calculateDate)
                )).data;
                rawData = rawData.map(item => ({
                    ...item,
                    totalCommissionProductLine: item.totalCommissionProductLine ? Number(item.totalCommissionProductLine) : 0,
                    totalCommissionProductEstategic: item.totalCommissionProductEstategic ? Number(item.totalCommissionProductEstategic) : 0,
                    totalNomina: item.totalNomina ? Number(item.totalNomina) : 0,
                    pctNomina: item.pctNomina ? Number(item.pctNomina) : 0,
                }));
                break;
            case 'noHomologadosStores':
                if (!calculateDate) return res.status(400).json({ message: 'Fecha de cálculo requerida' });
                const nullFieldFiltersStore: NullFieldFilters = {
                    codeStore: true,
                }
                rawData = (await this.consolidatedDataStoresService.getConsolidatedDataStoresValuesNullUnique(
                    nullFieldFiltersStore,
                    new Date(calculateDate)
                )).items;
                rawData = rawData.map(item => ({
                    ...item,
                    codeStore: 'NO SE VISITA',
                }));
                break;
            case 'noHomologadosProducts':
                const nullFieldFiltersProduct: NullFieldFilters = {
                    codeProduct: true,
                }
                if (!calculateDate) return res.status(400).json({ message: 'Fecha de cálculo requerida' });
                rawData = (await this.consolidatedDataStoresService.getConsolidatedDataStoresValuesNullUnique(
                    nullFieldFiltersProduct,
                    new Date(calculateDate)
                )).items;
                rawData = rawData.map(item => ({
                    ...item,
                    codeProduct: 'OTROS',
                }));
                break;
            default:
                return res.status(400).json({ message: 'Nombre de archivo no válido' });
        }

        const data = flattenDataForExport(rawData, fields);

        const columns = fields.map(field => ({
            header: field.header,
            key: field.key,
            width: 20
        }));

        const sheetName = excelName.length > 31 ? excelName.slice(0, 31) : excelName;

        const buffer = await exportToExcel(sheetName, columns, data);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${excelName}.xlsx`);
        res.send(buffer);
    }

    async exportDataHandler(req: Request, res: Response): Promise<void> {
        try {
            const { excel_name } = req.params as { excel_name: string };
            const { calculate_date } = req.query;

            const fieldMap: Record<string, any[]> = {
                'prod sic': fieldsProductSic,
                'alm sic': fieldsStoresSic,
                'mt prod': fieldsSelloutProductMaster,
                'mt. alm': fieldsSelloutStoreMaster,
                'valores': fieldsBaseValuesSellout,
                'Base Ppto': fieldsBasePptoSellout,
                'advisor_commission': fieldsAdvisorCommission,
                'matriculation': fieldsMatriculacion,
                'matriculation_logs': fieldsMatriculacionLogs,
                'store_configuration': fieldsStoreConfiguration,
                'store_ppto_marcimex': fieldsStorePptoMarcimex,
                'employees': fieldsEmployee,
                'calc_comm_mgr': fieldsCalculationComissionStoreManager,
                'consolidated_commission_calculation': filedsConsolidatedCommissionCalculation,
                'noHomologadosStores': filedsNoHomologadosStores,
                'noHomologadosProducts': filedsNoHomologadosProducts,
            };

            const fields = fieldMap[excel_name];
            if (!fields) {
                res.status(400).json({ message: 'Nombre de archivo no válido' });
                return;
            }

            await this.exportGenericHandler(fields, excel_name, req, res, calculate_date ? String(calculate_date) : null);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error });
        }
    }

    async importDataHandler(req: Request, res: Response): Promise<void> {
        try {
            const { type, date } = req.body;
            const file = req.file;

            if (!file) {
                res.status(400).json({ message: "Debe enviar un archivo Excel." });
                return;
            }

            if (!type) {
                res.status(400).json({ message: "Debe enviar el tipo de importación." });
                return;
            }

            // Procesamiento genérico
            const result = await this.excelService.processExcel(date, type, file);

            if (result.errorFileBuffer) {
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", `attachment; filename=errores_${type}.xlsx`);
                res.send(result.errorFileBuffer);
                return;
            }

            res.status(200).json({
                message: "Datos importados correctamente",
                total_registros: result.total,
                registros_ok: result.ok,
                registros_error: result.errors.length,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error procesando el archivo." });
        }
    }

    async exportDataAvancedHandler(req: Request, res: Response): Promise<void> {
        console.log(req.query);
        const { calculate_date } = req.query as { calculate_date: string };
        const calculateDate = new Date(calculate_date);

        // 1. Configurar headers para descarga inmediata
        const excelName = `sellou_mercado_${calculate_date}`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${excelName}.xlsx`);

        // 2. Crear el WorkbookWriter conectado directamente al Response
        // Esto escribe en la red a medida que genera las filas. ¡Cero memoria acumulada!
        const workbook = new Excel.stream.xlsx.WorkbookWriter({
            stream: res,
            useStyles: true,
            useSharedStrings: true
        });

        const worksheet = workbook.addWorksheet('Reporte');

        // 3. Definir columnas (mapeo con tus alias del SELECT)
        worksheet.columns = fieldsConsolidatedDataStores;

        // 4. Obtener el stream de la base de datos
        const dbStream = await this.consolidatedDataStoresRepository.findByCalculateDateDataAgrupacion(calculateDate);

        // 5. "Pipear" los datos: Leer DB -> Escribir Excel
        for await (const row of dbStream) {
            // row es un objeto crudo { distributor: 'X', unitsSoldDistributor: 10, ... }

            // Agregamos la fila y hacemos COMMIT inmediato.
            // .commit() libera la fila de la memoria una vez escrita.
            worksheet.addRow(row).commit();
        }

        // 6. Finalizar
        await worksheet.commit(); // Finalizar hoja
        await workbook.commit();  // Finalizar libro y cerrar stream de respuesta
    }

}
