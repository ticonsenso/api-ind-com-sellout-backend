import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { DataSource as TypeORMDataSource, QueryRunner } from "typeorm";
import { DeltaSharingJobRepository } from '../repository/delta.sharing.jobs.repository';

// Importación dinámica para hyparquet (módulo ESM)
let hyparquet: any = null;
let hyparquetCompressors: any = null;

const getHyParquet = async () => {
  if (!hyparquet) {
    hyparquet = await (eval('import("hyparquet")') as Promise<any>);
  }
  return hyparquet;
};

const getCompressors = async () => {
  if (!hyparquetCompressors) {
    hyparquetCompressors = await (eval('import("hyparquet-compressors")') as Promise<any>);
  }
  return hyparquetCompressors;
};

export class DeltaSharingService {
  private bearerToken: string;
  private endpoint: string;
  private jobRepository: DeltaSharingJobRepository;
  private dataSource: TypeORMDataSource;

  constructor(dataSource: TypeORMDataSource) {
    console.log("[DeltaSharingService] Inicializando...");
    const profilePath = path.resolve('./config/config_dev/config.share');
    const config = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    this.bearerToken = config.bearerToken;
    this.endpoint = config.endpoint;
    this.dataSource = dataSource;
    this.jobRepository = new DeltaSharingJobRepository(dataSource);
  }

  /**
   * Obtiene una muestra limitada de registros (para pruebas)
   */
  async getTableRecordsLimited(shareName: string, schemaName: string, tableName: string, limit: number = 10) {
    try {
      const queryUrl = `${this.endpoint}/shares/${shareName}/schemas/${schemaName}/tables/${tableName}/query`;
      const response = await axios.post(queryUrl, { limitHint: limit, responseFormat: "delta" }, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'delta-sharing-python/1.1.0',
          'Delta-Sharing-Version': '1.1',
          'delta-sharing-capabilities': 'responseFormat=delta;readerFeatures=deletionVectors'
        },
        responseType: 'text'
      });

      const lines = response.data.split('\n');
      const fileUrls: string[] = [];
      for (const line of lines) {
        if (!line.trim()) continue;
        const json = JSON.parse(line);
        if (json.file && json.file.url) fileUrls.push(json.file.url);
      }

      if (fileUrls.length === 0) return [];

      const { parquetReadObjects } = await getHyParquet();
      const { compressors } = await getCompressors();

      let allRecords: any[] = [];
      for (const url of fileUrls) {
        const fileRes = await axios.get(url, { responseType: 'arraybuffer' });
        const arrayBuffer = fileRes.data.buffer.slice(fileRes.data.byteOffset, fileRes.data.byteOffset + fileRes.data.byteLength);
        
        const rawRows = await parquetReadObjects({ file: arrayBuffer, rowEnd: limit, compressors: compressors } as any);
        const processedRows = rawRows.map((row: any) => this.mapDeltaToSic(tableName, row));

        allRecords.push(...processedRows);
        if (allRecords.length >= limit) break;
      }
      return allRecords.slice(0, limit);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Dispara la sincronización masiva
   */
  async startTableSync(shareName: string, schemaName: string, tableName: string) {
    const runningJob = await this.jobRepository.findRunningJobByEntity(tableName);
    if (runningJob) {
      throw new Error(`Ya existe un proceso activo para ${tableName} iniciado el ${runningJob.startTime}`);
    }

    const jobId = (require('crypto').randomUUID) ? require('crypto').randomUUID() : `job-${Date.now()}`;
    await this.jobRepository.create({
      jobId,
      entityName: tableName,
      status: 'EJECUTANDO',
      totalRecords: 0,
      processedRecords: 0,
      startTime: new Date()
    });

    // Lanzar en background
    this.executeFullSync(jobId, shareName, schemaName, tableName).catch(err => {
      console.error(`[DeltaSync] Error en Job ${jobId}:`, err);
    });

    return { jobId, status: 'EJECUTANDO' };
  }

  private async executeFullSync(jobId: string, shareName: string, schemaName: string, tableName: string) {
    try {
      const queryUrl = `${this.endpoint}/shares/${shareName}/schemas/${schemaName}/tables/${tableName}/query`;
      const response = await axios.post(queryUrl, { responseFormat: "delta" }, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'delta-sharing-python/1.1.0',
          'Delta-Sharing-Version': '1.1',
          'delta-sharing-capabilities': 'responseFormat=delta;readerFeatures=deletionVectors'
        },
        responseType: 'text'
      });

      const lines = response.data.split('\n');
      const fileUrls: string[] = [];
      for (const line of lines) {
        if (!line.trim()) continue;
        const json = JSON.parse(line);
        if (json.file && json.file.url) fileUrls.push(json.file.url);
      }

      const { parquetReadObjects } = await getHyParquet();
      const { compressors } = await getCompressors();

      const targetTable = tableName === 'dim_producto_s08' ? 'product_sic' : (tableName === 'dim_almacenes_s08' ? 'stores_sic' : null);
      if (!targetTable) throw new Error("Tabla de destino no configurada para " + tableName);

      // 1. Recolectar todos los registros en memoria (son ~6000, manejable)
      let allRawRows: any[] = [];
      const uniqueFiles = Array.from(new Set(fileUrls)); // De-duplicar URLs por si acaso

      for (const url of uniqueFiles) {
        const fileRes = await axios.get(url, { responseType: 'arraybuffer' });
        const arrayBuffer = fileRes.data.buffer.slice(fileRes.data.byteOffset, fileRes.data.byteOffset + fileRes.data.byteLength);
        const rawRows = await parquetReadObjects({ file: arrayBuffer, compressors: compressors } as any);
        allRawRows.push(...rawRows);
      }

      // FILTRO POR EMPRESA: Solo empresa 4
      allRawRows = allRawRows.filter((row: any) => {
        const empresaVal = row.empresa?.toString();
        return empresaVal === '4';
      });

      // 2. Si es Productos, contar repetidos de codigoJde
      const counts = new Map<string, number>();
      if (tableName === 'dim_producto_s08') {
        // Para el conteo, primero nos aseguramos de no procesar filas físicamente idénticas
        // basándonos en prodId o idProducto que son únicos por registro en Delta
        const uniqueEntriesMap = new Map();
        for (const row of allRawRows) {
            const entryId = row.prodId || row.idProducto;
            uniqueEntriesMap.set(entryId, row);
        }
        
        const uniqueData = Array.from(uniqueEntriesMap.values());
        for (const row of uniqueData) {
          const key = (row.codigoJde || 'null').toString();
          counts.set(key, (counts.get(key) || 0) + 1);
        }
      }

      // 3. Procesar y guardar en chunks
      let totalProcessed = 0;
      const chunkSize = 500;
      for (let i = 0; i < allRawRows.length; i += chunkSize) {
        const chunk = allRawRows.slice(i, i + chunkSize);
        
        // Mapear registros
        let processedRows = chunk.map((row: any) => {
          const mapped = this.mapDeltaToSic(tableName, row);
          if (tableName === 'dim_producto_s08') {
             const count = counts.get((row.codigoJde || 'null').toString()) || 0;
             // Si el conteo es 1, ponemos 0 (no hay repetidos). Si es > 1, el número.
             mapped.num_repetidos = count > 1 ? count.toString() : '0';
          }
          return mapped;
        });

        // DE-DUPLICAR por clave de conflicto para evitar error "ON CONFLICT cannot affect row a second time"
        const conflictKey = targetTable === 'product_sic' ? 'idproductosic' : 'cod_almacen';
        const uniqueRowsMap = new Map();
        for (const row of processedRows) {
            uniqueRowsMap.set(row[conflictKey], row);
        }
        processedRows = Array.from(uniqueRowsMap.values());

        await this.upsertToDatabase(targetTable, processedRows);
        
        totalProcessed += chunk.length; // Usamos el tamaño del chunk original para el progreso
        await this.jobRepository.updateJobProgress(jobId, totalProcessed, allRawRows.length);
      }

      await this.jobRepository.completeJob(jobId);
    } catch (error: any) {
      await this.jobRepository.failJob(jobId, error.message);
    }
  }

  /**
   * Mapeo de columnas Delta -> SIC
   */
  private mapDeltaToSic(sourceTable: string, row: any): any {
    const mapped: any = {};
    if (sourceTable === 'dim_producto_s08') {
      // Usamos prodId como identificador principal si es el que garantiza unicidad
      mapped.idproductosic = (row.prodId || row.idProducto).toString();
      mapped.codigo_jde = row.codigoJde || '';
      mapped.num_repetidos = row.num_repetidos || null;
      mapped.nombre_ime = row.nombreIme || '';
      mapped.codigo_sap = row.codigoSap || '';
      mapped.nombre_sap = row.nombreSap || '';
      mapped.linea_negocio_sap = row.lineaNegocioSap || '';
      mapped.mar_desc_grupo_art = row.descGrupoArt || '';
      mapped.mar_desc_jerarq = row.descJerarquia || '';
      mapped.mar_modelo_im = row.modeloIm || '';
      mapped.linea_disenio_sap = row.lineaDiseñoSap || '';
      mapped.marca_sap = row.marcaSap || '';
      mapped.color_sap = row.colorSap;
      mapped.descontinuado = row.descontinuado === true;
      mapped.estado = row.estado === true;
      mapped.hojas_vis = row.hojasVis || '';
      mapped.pro_id_equivalencia = row.idEquivalencia || '';
      mapped.equivalencia = row.equivalancia || '';
      mapped.vigencia = row.vigencia || null;
      mapped.prod_id = row.prodId ? parseInt(row.prodId.toString()) : 0;
      mapped.etl_extract_date = row.etlTimestamp ? row.etlTimestamp.toString() : null;
    } else if (sourceTable === 'dim_almacenes_s08') {
      // Mapeo exacto solicitado: cod_almacen = almId
      mapped.cod_almacen = (row.almId || row.idAlmacen).toString();
      mapped.nombre_almacen = row.nombre || '';
      mapped.direccion_almacen = row.direccion || '';
      mapped.distribuidor = row.distribuidor || '';
      mapped.categoria = row.categoria || '';
      mapped.ciudad = row.ciudad || '';
      mapped.region = row.region || '';
      mapped.provincia = row.provincia || '';
      mapped.estado = row.estadoAlmacen === 'ACTIVO' || row.estadoAlmacen === true;
      mapped.telefono = row.telefono || null;
      mapped.jefe_agencia = row.jefeAgencia || null;
      mapped.tamanio = row.tamanio || null;
      mapped.ubicacion = row.ubicacion || null;
      mapped.ventas = row.alamcenVentas ? parseInt(row.alamcenVentas.toString()) : 0;
      mapped.canal = row.canal || '';
      mapped.region_mayoreo = row.regionalMayoreo || null;
      mapped.distrib_sap = row.distribuidorSap || null;
      mapped.grupo_zona = row.grupoZona || null;
      mapped.supervisor = row.Supervisor || null;
      mapped.zona = row.zona || null;
      mapped.etl_extract_date = row.etlTimestamp ? row.etlTimestamp.toString() : null;
    }
    
    // Limpieza final de types para JSON
    for (const key in mapped) {
      if (typeof mapped[key] === 'bigint') mapped[key] = mapped[key].toString();
    }
    return mapped;
  }

  private async upsertToDatabase(tableName: string, rows: any[]) {
    if (rows.length === 0) return;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    
    const conflictKey = tableName === 'product_sic' ? 'idproductosic' : 'cod_almacen';
    const columns = Object.keys(rows[0]);
    const setClause = columns.map(col => `"${col}" = EXCLUDED."${col}"`).join(', ');

    try {
      const chunkSize = 500;
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        const query = `
          INSERT INTO "db-sellout"."${tableName}" ("${columns.join('", "')}")
          VALUES ${chunk.map((_, idx) => `(${columns.map((_, cIdx) => `$${idx * columns.length + cIdx + 1}`).join(', ')})`).join(', ')}
          ON CONFLICT ("${conflictKey}")
          DO UPDATE SET ${setClause};
        `;
        const values = chunk.flatMap(row => columns.map(col => row[col]));
        await queryRunner.query(query, values);
      }
    } finally {
      await queryRunner.release();
    }
  }

  async get10RecordsFromRequiredTables() {
    let dim_producto_s08 = [];
    let dim_almacenes_s08 = [];
    let errors = [];

    try {
      dim_producto_s08 = await this.getTableRecordsLimited('co_comisiones', 'dwh', 'dim_producto_s08', 10);
    } catch(err: any) {
      errors.push({ table: 'dim_producto_s08', error: err.message || err });
    }

    try {
      dim_almacenes_s08 = await this.getTableRecordsLimited('co_comisiones', 'dwh', 'dim_almacenes_s08', 10);
    } catch(err: any) {
      errors.push({ table: 'dim_almacenes_s08', error: err.message || err });
    }

    return {
      success: errors.length === 0,
      data: { dim_producto_s08, dim_almacenes_s08 },
      errors: errors.length > 0 ? errors : undefined
    };
  }

  async getSyncStatus(jobId: string) {
    return await this.jobRepository.repository.findOne({ where: { jobId } });
  }

  async getAllJobs(page: number, limit: number) {
    return await this.jobRepository.findAllPaginated(page, limit);
  }
}
