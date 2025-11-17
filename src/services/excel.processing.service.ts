import XLSX from "xlsx";
import { DataSource } from "typeorm";
import { SelloutMastersService } from "./sellout.masters.service";
import { CreateSelloutStoreMasterDto } from "../dtos/sellout.store.master.dto";
import { CreateSelloutProductMasterDto } from "../dtos/sellout.product.master.dto";
import { SelloutStoreMaster } from "../models/sellout.store.master.model";

const HEADERS_MAP: Record<string, Record<string, string>> = {
  noHomologadosStore: {
    DISTRIBUIDOR: "distribuidor",
    "ALMACEN DISTRIBUIDOR": "almacenDistribuidor",
    "COD. ALMACEN SIC": "codAlmSic",
  },

  noHomologadosProducts: {
    DISTRIBUIDOR: "distribuidor",
    "PRODUCTO ALMACEN": "productoAlmacen",
    "DESCRIPCIÓN PRODUCTO ALMACEN": "descriptionProduct",
    "COD. PRODUCTO SIC": "codProdSic",
  },
};

export class ExcelImportService {

    static readonly NOHOMOLOGADOSPRODUCTS = "noHomologadosProducts";
    static readonly NOHOMOLOGADOSSTORE = "noHomologadosStore";
    private selloutMastersService:SelloutMastersService;
  constructor(dataSource: DataSource) {
    this.selloutMastersService = new SelloutMastersService(dataSource);
  }

  async processExcel(type: string, file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convertimos usando encabezados ajustados
    const rows = this.convertExcelToJson(type, sheet);

    const errors: any[] = [];
    const valid: any[] = [];

    for (const row of rows) {
      const validation = this.validateRow(type, row);

      if (validation === true) {
        valid.push(row);
      } else {
        errors.push({ ...row, error: validation });
      }
    }

    await this.saveValidRows(type, valid);

    if (errors.length > 0) {
      const errorFileBuffer = this.buildErrorExcel(errors);
      return { total: rows.length, ok: valid.length, errors, errorFileBuffer };
    }

    return { total: rows.length, ok: valid.length, errors };
  }

  // ===============================
  // 1. Normaliza encabezados
  // ===============================
  private normalizeHeaders(type: string, headerRow: string[]): string[] {
    const map = HEADERS_MAP[type];
    if (!map) return headerRow;
    return headerRow.map((h) => map[h.trim()] || h.trim());
  }

  // ===============================
  // 2. Convierte Excel a JSON ajustado
  // ===============================
  private convertExcelToJson(type: string, sheet: XLSX.WorkSheet): any[] {
    const raw: any = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    const headerRow = raw[0];

    const normalizedHeaders = this.normalizeHeaders(type, headerRow);

    return raw.slice(1).map((row: any[]) => {
      const obj: any = {};
      normalizedHeaders.forEach((col, i) => {
        obj[col] = row[i] ?? "";
      });
      return obj;
    });
  }

  // ===============================
  // 3. Validación personalizada
  // ===============================
  validateRow(type: string, row: any): true | string {
    switch (type) {
      case ExcelImportService.NOHOMOLOGADOSSTORE:
        if (!row.distribuidor) return "Falta el distribuidor";
        if (!row.almacenDistribuidor) return "Falta el almacén del distribuidor";
        if (!row.codAlmSic) return "Falta el código SIC - NO SE VISITA";
        return true;

      case ExcelImportService.NOHOMOLOGADOSPRODUCTS:
        if (!row.distribuidor) return "Falta el distribuidor";
        if (!row.productoAlmacen) return "Falta el productoAlmacen";
        if (!row.descriptionProduct) return "Falta la descripción del producto";
        if (!row.codProdSic) return "Falta el código SIC - OTROS";
        return true;

      default:
        return "Tipo de importación no soportado.";
    }
  }

async saveValidRows(type: string, rows: any[]): Promise<void> {
  const processors: Record<string, () => Promise<void>> = {
    [ExcelImportService.NOHOMOLOGADOSSTORE]: async () => {
      const configs: CreateSelloutStoreMasterDto[] = rows
        .map((row) => ({
          distributor: row.distribuidor,
          storeDistributor: row.almacenDistribuidor,
          codeStoreSic: row.codAlmSic,
          status: true,
        }))
        .filter(cfg => cfg.codeStoreSic && cfg.codeStoreSic.trim() !== "NO SE VISITA");

      await Promise.allSettled(
        configs.map(cfg =>
          this.selloutMastersService.createSelloutStoreMasterExcel(cfg),
        ),
      );
    },
    
    [ExcelImportService.NOHOMOLOGADOSPRODUCTS]: async () => {
      const configs: CreateSelloutProductMasterDto[] = rows
        .map((row) => ({
          distributor: row.distribuidor,
          productDistributor: row.descriptionProduct,
          productStore: row.productoAlmacen,
          codeProductSic: row.codProdSic,
          status: true,
        }))
        .filter(cfg => cfg.productStore && cfg.productStore !== "OTROS");

      await Promise.allSettled(
        configs.map(cfg =>
          this.selloutMastersService.createSelloutProductMasterExcel(cfg),
        ),
      );
    }
  };

  // Ejecutar según tipo
  const processor = processors[type];
  if (processor) {
    await processor();
  }
}

  buildErrorExcel(rows: any[]): Buffer {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Errores");
    return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  }


  async updateData(fecha: string,selloutStoreMasters: SelloutStoreMaster[] ): Promise<void> {
    
  }

}
