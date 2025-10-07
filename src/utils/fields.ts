import { ExportField } from "../controllers/export.data.controller";

export const fieldsProductSic: ExportField[] = [
    { key: 'idProductSic', header: 'ID' },
    { key: 'jdeCode', header: 'CODIGO JDE' },
    { key: 'imeName', header: 'NOMBRE IME' },
    { key: 'jdeName', header: 'NOMBRE JDE' },
    { key: 'sapCode', header: 'CODIGO SAP' },
    { key: 'sapName', header: 'NOMBRE SAP' },
    { key: 'companyLine', header: 'LINEA DE NEGOCIO' },
    { key: 'category', header: 'CATEGORIA' },
    { key: 'subCategory', header: 'SUBCATEGORIA' },
    { key: 'marModelLm', header: 'MAR MODELO IM' },
    { key: 'designLine', header: 'LINEA DISEÑO' },
    { key: 'brand', header: 'MARCA' },
    {
        key: 'discontinued', header: 'DISCONTINUADO',
        transform: (value) => value === true ? 'SI' : 'NO',
    },
    {
        key: 'status', header: 'ESTADO',
        transform: (value) => value === true ? 'ACTIVO' : 'INACTIVO',
    },
    { key: 'sheetVisit', header: 'HOJAS VIS' },
    { key: 'equivalentProId', header: 'PRO ID EQUIVALENCIA' },
    { key: 'equivalent', header: 'EQUIVALENCIA' },
    { key: 'validity', header: 'VIGENCIA' },
    { key: 'repeatedNumbers', header: 'NUM REPETIDOS ACTIVOS' },
];

export const fieldsStoresSic: ExportField[] = [
    { key: 'storeCode', header: 'COD ALMACEN' },
    { key: 'storeName', header: 'NOMBRE ALMACEN' },
    { key: 'storeAddress', header: 'DIRECCION ALMACEN' },
    { key: 'distributor', header: 'DISTRIBUIDOR' },
    { key: 'distributor2', header: 'DISTRIBUIDOR2' },
    { key: 'phone', header: 'TELEFONO' },
    { key: 'agencyManager', header: 'JEFE AGENCIA' },
    { key: 'size', header: 'TAMANIO' },
    { key: 'ubication', header: 'UBICACION' },
    { key: 'sales', header: 'VENTAS' },
    { key: 'channel', header: 'CANAL' },
    { key: 'distributorSap', header: 'DISTRIBUIDOR SAP' },
    { key: 'endChannel', header: 'CANAL FINAL' },
    { key: 'supervisor', header: 'SUPERVISOR' },
    { key: 'wholesaleRegion', header: 'REGION MAYOREO' },
    { key: 'city', header: 'CIUDAD' },
    { key: 'region', header: 'REGION' },
    { key: 'province', header: 'PROVINCIA' },
    { key: 'category', header: 'CATEGORIA' },
    { key: 'zone', header: 'ZONA OK' },
    {
        key: 'status', header: 'ESTADO',
        transform: (value) => value === true ? 'ACTIVO' : 'INACTIVO',
    },
];

export const fieldsSelloutProductMaster: ExportField[] = [
    { key: 'distributor', header: 'DISTRIBUIDOR' },
    { key: 'productStore', header: 'PRODUCTO ALMACEN' },
    { key: 'productDistributor', header: 'DESCRIPCION PRODUCTO ALMACEN' },
    { key: 'codeProductSic', header: 'COD. PRODUCTO SIC' },
    {
        key: 'status',
        header: 'ACTIVO',
        transform: (value) => value === true ? 'ACTIVO' : 'INACTIVO',
    },
];

export const fieldsSelloutStoreMaster: ExportField[] = [
    { key: 'distributor', header: 'DISTRIBUIDOR' },
    { key: 'storeDistributor', header: 'ALMACEN DISTRIBUIDOR' },
    { key: 'codeStoreSic', header: 'COD. ALMACEN SIC' },
    {
        key: 'status', header: 'ESTADO',
        transform: (value) => value === true ? 'ACTIVO' : 'INACTIVO',
    },
];

export const fieldsConsolidatedDataStores: ExportField[] = [
    { key: 'distributor', header: 'DISTRIBUIDOR' },
    { key: 'codeStoreDistributor', header: 'COD. ALMACEN DISTRIBUIDOR' },
    { key: 'codeProductDistributor', header: 'COD. PROD DISTRIBUIDOR' },
    { key: 'descriptionDistributor', header: 'DESCRIPCION DISTRIBUIDOR' },
    { key: 'unitsSoldDistributor', header: 'UNIDADES VENTA DISTRIBUIDOR' },
    { key: 'saleDate', header: 'FECHA ULTIMO DIA DEL MES' },
    { key: 'codeProduct', header: 'COD. PRODUCTO' },
    { key: 'codeStore', header: 'COD. ALMACEN' },
    { key: 'authorizedDistributor', header: 'DISTRIBUIDOR' },
    { key: 'storeName', header: 'NOMBRE ALMACEN' },
    { key: 'productModel', header: 'MODELO DEL PRODUCTO' },
    {
        key: 'status', header: 'ESTADO',

        transform: (value) => value === true ? 'ACTIVO' : 'INACTIVO',
    },
    { key: 'calculateDate', header: 'FECHA CALCULO' },
];

export const fieldsBaseValuesSellout = [
    { key: 'brand', header: 'MARCA' },
    { key: 'model', header: 'MODELO' },
    { key: 'unitBaseUnitary', header: 'UB NITARIA' },
    { key: 'pvdUnitary', header: 'PVD UNTARIA' },
];

export const fieldsBasePptoSellout = [
    { key: 'supervisor.codeSupervisor', header: 'COD. SUPERVISOR' },
    { key: 'supervisor.nameSupervisor', header: 'SUPERVISOR' },
    { key: 'zone.codeZone', header: 'COD. ZONAL' },
    { key: 'zone.nameEmployeeZone', header: 'ZONAL' },
    { key: 'store.region', header: 'REGION' },
    { key: 'store.storeCode', header: 'COD. ALMACEN' },
    { key: 'promotor.codePromotor', header: 'COD. PROMOTOR' },
    { key: 'promotor.nameEmployeePromotor', header: 'PROMOTOR' },
    { key: 'promotorPi.codePromotorPi', header: 'COD. PROMOTOR PI.' },
    { key: 'promotorPi.nameEmployeePromotorPi', header: 'PROMOTOR PI' },
    { key: 'promotorTv.codePromotorTv', header: 'COD. PROMOTOR TV' },
    { key: 'promotorTv.nameEmployeePromotorTv', header: 'PROMOTOR TV' },
    { key: 'store.storeName', header: 'ALMACEN' },
    { key: 'store.distributor', header: 'DISTRIBUIDOR' },
    { key: 'store.endChannel', header: 'CANAL' },
    { key: 'store.city', header: 'CIUDAD' },
    { key: 'productSic.companyLine', header: 'LINEA DE NEGOCIO' },
    { key: 'productSic.category', header: 'CATEGORIA' },
    { key: 'productSic.subCategory', header: 'SUBCATEGORIA' },
    { key: 'productSic.model', header: 'MODELO' },
    { key: 'productSic.equivalentProId', header: 'CODIGO EQUIVALENTE' },
    { key: 'productSic.jdeName', header: 'DESCRIPCION' },
    { key: 'productSic.brand', header: 'MARCA' },
    { key: 'productType', header: 'TIPO DE PRODUCTO' },
    { key: 'units', header: 'UND' },
    { key: 'unitBase', header: 'UB UNITARIA' },
];

export const fieldsAdvisorCommission = [
    { key: 'employee.documentNumber', header: 'IDENTIFICADOR' },
    { key: 'employee.code', header: 'CÓDIGO' },    
    { key: 'employee.name', header: 'COLABORADOR' },    
    { key: 'companyPosition.name', header: 'CARGO' },
    { key: 'employee.section', header: 'REGIONAL' },
    { key: 'employee.subDepar', header: 'SECCION' },
    { key: 'storeSize.name', header: 'TAMAÑO TIENDA' },
    { key: 'employee.employeeType', header: 'TIPO DE EMPLEADO' },
    { key: 'employee.ceco', header: 'CECO' },
    { key: 'employee.dateInitialContract', header: 'FECHA EMPLEO' },
    { key: 'employee.isActive', header: 'ESTADO' },
    { key: 'cashSale', header: 'VENTA CONTADO' },
    { key: 'creditSale', header: 'VENTA CREDITO' },
    { key: 'taxSale', header: 'TOTAL VENTAS' },
    { key: 'saleIntangible', header: 'TOTAL INTANGIBLES'},
    { key: 'budgetSale', header: 'PRESUPUESTO' },
    { key: 'complianceSale', header: 'CUMP' },
    { key: 'rangeApplyBonus', header: 'RANGO' },
    { key: 'commissionIntangible', header: 'CONTADO' },
    { key: 'commissionCredit', header: 'CREDITO' },
    { key: 'commissionCash', header: 'INTANGIBLES' },
    { key: 'commissionTotal', header: 'TOTAL PAGO' },
];

export const fieldsStoreConfiguration = [
    { key: 'regional', header: 'REGIONAL' },
    { key: 'storeName', header: 'TIENDA' },
    { key: 'ceco', header: 'CECO' },
    ...Array.from({ length: 12 }, (_, i) => ({
        key: `advisorConfiguration[${i}].numberEmployees`,
        header: `${i + 1}`
    })),
    { key: 'code', header: 'CODIGO' },
    { key: 'storeSize.name', header: 'TAMAÑO DE TIENDA' },
    { key: 'notes', header: 'OBSERVACION' },
];

export const fieldsMatriculacion: ExportField[] = [
    { key: 'distributor', header: 'DISTRIBUIDOR' },
    { key: 'storeName', header: 'NOMBRE ALMACEN' },
    { key: 'calculateMonth', header: 'MES' },
    {
        key: 'status', header: 'ESTADO',
        transform: (value) => value === true ? 'ACTIVO' : 'INACTIVO',
    },
];

export const fieldsMatriculacionLogs: ExportField[] = [
    { key: 'distributor', header: 'DISTRIBUIDOR' },
    { key: 'storeName', header: 'NOMBRE ALMACEN' },
    { key: 'calculateDate', header: 'FECHA DE REGISTRO' },
    {
        key: 'isUploaded', header: 'CARGADO',
        transform: (value) => value === true ? 'SI' : 'NO',
    },
    { key: 'productCountTotal', header: 'UNIDADES VENDIDAS' },
    { key: 'rowCountTotal', header: 'FILAS' },
];

export const fieldsStorePptoMarcimex: ExportField[] = [
    { key: 'storeConfiguration.storeName', header: 'NOMBRE DE LA TIENDA' },
    { key: 'ceco', header: 'CECO' },
    { key: 'storeConfiguration.storeSize.name', header: 'TAMAÑO DE TIENDA' },
    { key: 'year', header: 'AÑO' },
    { key: 'mount', header: 'MES' },
    { key: 'storePpto', header: 'PRESUPUESTO' },
    { key: 'storePptoGroup', header: 'PRESUPUESTO TOTAL' },
    { key: 'cecoGrouped', header: 'CECO (Agrupado)' },

];

export const fieldsEmployee: ExportField[] = [
    { key: 'company.name', header: 'EMPRESA' },
    { key: 'code', header: 'CODIGO' },
    { key: 'name', header: 'COLABORADOR' },
    { key: 'companyPosition.name', header: 'CARGO' },
    { key: 'ceco', header: 'CECO' },
    { key: 'descDivision', header: 'ÁREA' },
    { key: 'descDepar', header: 'DEPARTAMENTO' },
    { key: 'subDepar', header: 'SUB DEPARTAMENTO' },
    { key: 'section', header: 'SECCIÓN' },
    { key: 'documentNumber', header: 'CÉDULA' },
    { key: 'city', header: 'CIUDAD TRABAJO' },
    { key: 'dateInitialContract', header: 'FECHA EMPLEO' },
    { key: 'salary', header: 'SALARIO' },
    { key: 'variableSalary', header: 'SALARIO VARIABLE' },
    { key: 'descUniNego', header: 'UNIDAD DE NEGOCIO' },
    { key: 'employeeType', header: 'TIPO DE EMPLEADO' },
];

export const fieldsCalculationComissionStoreManager: ExportField[] = [
    { key: 'employee.documentNumber', header: 'CEDULA' },
    { key: 'employee.company.name', header: 'EMPRESA' },
    { key: 'employee.code', header: 'CODIGO' },
    { key: 'employee.name', header: 'COLABORADOR' },
    { key: 'employee.companyPosition.name', header: 'CARGO' },
    { key: 'storeConfiguration.regional', header: 'REGION' },
    { key: 'storeConfiguration.storeName', header: 'SECCIÓN' },
    { key: 'storeConfiguration.storeSize.name', header: 'TAMAÑO' },
    { key: 'employee.dateInitialContract', header: 'F. EMPLEO' },
    { key: 'storeConfiguration.ceco', header: 'CECO' },
    { key: 'fiscalSale', header: 'VENTA FISCAL' },
    { key: 'fiscalSaleCalculate', header: 'VENTA FISCAL CALCULADA' },
    { key: 'pptoSale', header: 'PTO VENTA' },
    { key: 'rangeCompliance', header: 'CUMPL VENTA' },
    { key: 'rangeComplianceApl', header: 'RANGO CUMPL VENTA' },
    { key: 'salesCompliancePercent', header: '% CUMPLIMIENTO VENTA' },
    { key: 'salesCommission', header: 'COMISION VENTA' },
    { key: 'directProfit', header: 'UTILIDAD DIRECTA' },
    { key: 'directProfitCalculate', header: 'UTILIDAD DIRECTA CALCULADA' },
    { key: 'directProfitPto', header: 'PTO UTILIDAD DIRECTA' },
    { key: 'profitCompliance', header: 'CUMPL UTILIDAD' },
    { key: 'profitComplianceApl', header: 'RANGO CUMPL UTILIDAD' },
    { key: 'profitCommissionPercent', header: '% COMISION' },
    { key: 'profitCommission', header: 'COMISION POR UTILIDAD' },
    {
        key: 'totalPayrollAmount', header: 'TOTAL A RECIBIR (NOMINA)',
        transform: (value: any) => {
            if (typeof value !== 'number') return value ?? '';
            return value
                .toFixed(2)
                .replace('.', ',')
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        },
    },
];

export const filedsConsolidatedCommissionCalculation: ExportField[] = [
    { key: 'employee.companyPosition.name', header: 'CARGO' },
    { key: 'employee.code', header: 'CÓDIGO' },
    { key: 'employee.name', header: 'COLABORADOR' },
    { key: 'employee.documentNumber', header: 'IDENTIFICIÓN' },
    { key: 'employee.city', header: 'CIUDAD TRABAJO' },
    { key: 'employee.dateInitialContract', header: 'FECHA EMPLEO' },
    { key: 'totalCommissionProductLine', header: 'COMISIÓN LINEA PRODUCTO' },
    { key: 'totalCommissionProductEstategic', header: 'COMISIÓN PRODUCTO ESTRATÉGICO' },
    { key: 'totalNomina', header: 'NÓMINA' },
    { key: 'pctNomina', header: '% NÓMINA' },
    { key: 'calculateDate', header: 'FECHA CALCULO' },
    { key: 'employee.employeeType', header: 'TIPO DE EMPLEADO' },
];