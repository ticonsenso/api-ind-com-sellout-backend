import {RequestHandler, Router} from "express";
import AppDataSource from "../config/data-source";
import {ConfigureEtlController} from "../controllers/configure.etl.controller";
import {
    CreateDataSourceColumnConfigDto,
    SearchDataSourceColumnConfigDto,
    UpdateDataSourceColumnConfigDto,
} from "../dtos/data.source.column.configs.dto";
import {CreateDataSourceDto, SearchDataSourceDto, UpdateDataSourceDto,} from "../dtos/data.sources.dto";
import {
    CreateDetailTablesConfigDto,
    DetailTablesConfigSearchParamsDto,
    UpdateDetailTablesConfigDto,
} from "../dtos/detail.tables.config.dto";
import {CreateExtractedDataDto, SearchExtractedDataDto, UpdateExtractedDataDto,} from "../dtos/extracted.data.dto";
import {CreateExtractionLogDto, SearchExtractionLogDto, UpdateExtractionLogDto,} from "../dtos/extraction.logs.dto";
import {authenticateToken} from "../middleware/auth.middleware";
import {validatorMiddleware} from "../middleware/validator.middleware";

const router = Router();

const configureEtlController = new ConfigureEtlController(AppDataSource);

/**
 * @swagger
 * /api/configure/etl/data-sources:
 *   post:
 *     summary: Crear una nueva fuente de datos
 *     tags: [Fuentes de Datos]
 *     description: Crea una nueva fuente de datos en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sourceType
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 description: Nombre de la fuente de datos
 *               description:
 *                 type: string
 *                 description: Descripción de la fuente de datos
 *               sourceType:
 *                 type: string
 *                 enum: [API, DATABASE, FILE, EXCEL, CSV]
 *                 description: Tipo de fuente de datos
 *               connectionInfo:
 *                 type: object
 *                 description: Información de conexión a la fuente de datos
 *               configParams:
 *                 type: object
 *                 description: Parámetros de configuración adicionales
 *               autoExtract:
 *                 type: boolean
 *                 description: Indica si se debe extraer automáticamente
 *               extractionFrequency:
 *                 type: string
 *                 description: Frecuencia de extracción (diario, semanal, etc.)
 *               isActive:
 *                 type: boolean
 *                 description: Indica si la fuente de datos está activa
 *               sheetName:
 *                 type: string
 *                 description: Nombre de la hoja en el Excel (para fuentes tipo Excel)
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa asociada
 *               dayExtraction: 
 *                 type: integer
 *                 description: Día del mes 1
 *               hourExtraction:
 *                 type: string
 *                 description: Hora tipo 10:40
 *     responses:
 *       200:
 *         description: Fuente de datos creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/data-sources",
  authenticateToken as RequestHandler,
  validatorMiddleware(CreateDataSourceDto) as RequestHandler,
  configureEtlController.createDataSource
);

/**
 * @swagger
 * /api/configure/etl/data-sources/{id}:
 *   put:
 *     summary: Actualizar una fuente de datos
 *     tags: [Fuentes de Datos]
 *     description: Actualiza una fuente de datos existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la fuente de datos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la fuente de datos
 *               description:
 *                 type: string
 *                 description: Descripción de la fuente de datos
 *               sourceType:
 *                 type: string
 *                 enum: [API, DATABASE, FILE, EXCEL, CSV]
 *                 description: Tipo de fuente de datos
 *               connectionInfo:
 *                 type: object
 *                 description: Información de conexión a la fuente de datos
 *               configParams:
 *                 type: object
 *                 description: Parámetros de configuración adicionales
 *               autoExtract:
 *                 type: boolean
 *                 description: Indica si se debe extraer automáticamente
 *               extractionFrequency:
 *                 type: string
 *                 description: Frecuencia de extracción (diario, semanal, etc.)
 *               lastExtractionDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de la última extracción
 *               nextScheduledExtraction:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de la próxima extracción programada
 *               extractionStatus:
 *                 type: string
 *                 description: Estado de la extracción
 *               isActive:
 *                 type: boolean
 *                 description: Indica si la fuente de datos está activa
 *               sheetName:
 *                 type: string
 *                 description: Nombre de la hoja en el Excel (para fuentes tipo Excel)
 *     responses:
 *       200:
 *         description: Fuente de datos actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Fuente de datos no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/data-sources/:id",
  authenticateToken as RequestHandler,
  validatorMiddleware(UpdateDataSourceDto) as RequestHandler,
  configureEtlController.updateDataSource
);

/**
 * @swagger
 * /api/configure/etl/data-sources/{id}:
 *   delete:
 *     summary: Eliminar una fuente de datos
 *     tags: [Fuentes de Datos]
 *     description: Elimina una fuente de datos existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la fuente de datos
 *     responses:
 *       200:
 *         description: Fuente de datos eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Fuente de datos no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/data-sources/:id",
  authenticateToken as RequestHandler,
  configureEtlController.deleteDataSource
);

/**
 * @swagger
 * /api/configure/etl/data-sources/search:
 *   post:
 *     summary: Buscar fuentes de datos paginadas
 *     tags: [Fuentes de Datos]
 *     description: Busca fuentes de datos con paginación
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Límite de resultados por página
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Filtrar por nombre
 *               sourceType:
 *                 type: string
 *                 enum: [API, DATABASE, FILE, EXCEL, CSV]
 *                 description: Filtrar por tipo de fuente
 *               isActive:
 *                 type: boolean
 *                 description: Filtrar por estado activo/inactivo
 *               extractionStatus:
 *                 type: string
 *                 description: Filtrar por estado de extracción
 *               companyId:
 *                 type: integer
 *                 description: Filtrar por empresa
 *               search:
 *                 type: string
 *                 description: Término de búsqueda general
 *               page:
 *                 type: integer
 *                 description: Número de página
 *               limit:
 *                 type: integer
 *                 description: Límite de resultados por página
 *               sortBy:
 *                 type: string
 *                 description: Campo por el cual ordenar
 *               sortOrder:
 *                 type: string
 *                 enum: [ASC, DESC]
 *                 description: Orden de clasificación
 *     responses:
 *       200:
 *         description: Lista paginada de fuentes de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dataSources:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       sourceType:
 *                         type: string
 *                       connectionInfo:
 *                         type: object
 *                       configParams:
 *                         type: object
 *                       autoExtract:
 *                         type: boolean
 *                       extractionFrequency:
 *                         type: string
 *                       lastExtractionDate:
 *                         type: string
 *                         format: date-time
 *                       nextScheduledExtraction:
 *                         type: string
 *                         format: date-time
 *                       extractionStatus:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                       sheetName:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   description: Total de registros encontrados
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/data-sources/search",
  authenticateToken as RequestHandler,
  validatorMiddleware(SearchDataSourceDto) as RequestHandler,
  configureEtlController.searchDataSourcePaginated
);

// Data Source Column Configs

/**
 * @swagger
 * /api/configure/etl/data-source-column-configs:
 *   post:
 *     summary: Crear una nueva configuración de columna para fuente de datos
 *     tags: [Configuración ETL]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dataType
 *               - dataSourceId
 *             properties:
 *               columnName:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Nombre"
 *               columnIndex:
 *                 type: number
 *                 example: 1
 *               columnLetter:
 *                 type: string
 *                 maxLength: 10
 *                 example: "A"
 *               dataType:
 *                 type: string
 *                 maxLength: 50
 *                 example: "string"
 *               formatPattern:
 *                 type: string
 *                 maxLength: 100
 *                 example: "dd/MM/yyyy"
 *               isRequired:
 *                 type: boolean
 *                 example: true
 *               defaultValue:
 *                 type: string
 *                 example: "N/A"
 *               mappingToField:
 *                 type: string
 *                 maxLength: 255
 *                 example: "user.name"
 *               headerRow:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               startRow:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               dataSourceId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               createdBy:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Configuración de columna creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Configuración de columna creada correctamente"
 *                 config:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     columnName:
 *                       type: string
 *                       example: "Nombre"
 *                     columnIndex:
 *                       type: number
 *                       example: 1
 *                     columnLetter:
 *                       type: string
 *                       example: "A"
 *                     dataType:
 *                       type: string
 *                       example: "string"
 *                     formatPattern:
 *                       type: string
 *                       example: "dd/MM/yyyy"
 *                     isRequired:
 *                       type: boolean
 *                       example: true
 *                     defaultValue:
 *                       type: string
 *                       example: "N/A"
 *                     mappingToField:
 *                       type: string
 *                       example: "user.name"
 *                     headerRow:
 *                       type: integer
 *                       example: 1
 *                     startRow:
 *                       type: integer
 *                       example: 2
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/data-source-column-configs",
  authenticateToken as RequestHandler,
  validatorMiddleware(CreateDataSourceColumnConfigDto) as RequestHandler,
  configureEtlController.createDataSourceColumnConfig
);

/**
 * @swagger
 * /api/configure/etl/data-source-column-configs/{id}:
 *   put:
 *     summary: Actualizar una configuración de columna existente
 *     tags: [Configuración ETL]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la configuración de columna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               columnName:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Nombre Actualizado"
 *               columnIndex:
 *                 type: number
 *                 example: 2
 *               columnLetter:
 *                 type: string
 *                 maxLength: 10
 *                 example: "B"
 *               dataType:
 *                 type: string
 *                 maxLength: 50
 *                 example: "number"
 *               formatPattern:
 *                 type: string
 *                 maxLength: 100
 *                 example: "#,##0.00"
 *               isRequired:
 *                 type: boolean
 *                 example: false
 *               defaultValue:
 *                 type: string
 *                 example: "0"
 *               mappingToField:
 *                 type: string
 *                 maxLength: 255
 *                 example: "user.age"
 *               headerRow:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               startRow:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               dataSourceId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               updatedBy:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Configuración de columna actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Configuración de columna actualizada correctamente"
 *                 config:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     columnName:
 *                       type: string
 *                       example: "Nombre Actualizado"
 *                     columnIndex:
 *                       type: number
 *                       example: 2
 *                     columnLetter:
 *                       type: string
 *                       example: "B"
 *                     dataType:
 *                       type: string
 *                       example: "number"
 *                     formatPattern:
 *                       type: string
 *                       example: "#,##0.00"
 *                     isRequired:
 *                       type: boolean
 *                       example: false
 *                     defaultValue:
 *                       type: string
 *                       example: "0"
 *                     mappingToField:
 *                       type: string
 *                       example: "user.age"
 *                     headerRow:
 *                       type: integer
 *                       example: 2
 *                     startRow:
 *                       type: integer
 *                       example: 3
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Configuración de columna no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/data-source-column-configs/:id",
  authenticateToken as RequestHandler,
  validatorMiddleware(UpdateDataSourceColumnConfigDto) as RequestHandler,
  configureEtlController.updateDataSourceColumnConfig
);

/**
 * @swagger
 * /api/configure/etl/data-source-column-configs/{id}:
 *   delete:
 *     summary: Eliminar una configuración de columna
 *     tags: [Configuración ETL]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la configuración de columna a eliminar
 *     responses:
 *       200:
 *         description: Configuración de columna eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Configuración de columna eliminada correctamente"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Configuración de columna no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/data-source-column-configs/:id",
  authenticateToken as RequestHandler,
  configureEtlController.deleteDataSourceColumnConfig
);

/**
 * @swagger
 * /api/configure/etl/data-source-column-configs/search:
 *   post:
 *     summary: Buscar configuraciones de columna con paginación
 *     tags: [Configuración ETL]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               columnName:
 *                 type: string
 *                 example: "Nombre"
 *               dataType:
 *                 type: string
 *                 example: "string"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               dataSourceId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Lista paginada de configuraciones de columna
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 15
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       columnName:
 *                         type: string
 *                         example: "Nombre"
 *                       columnIndex:
 *                         type: number
 *                         example: 1
 *                       columnLetter:
 *                         type: string
 *                         example: "A"
 *                       dataType:
 *                         type: string
 *                         example: "string"
 *                       formatPattern:
 *                         type: string
 *                         example: "dd/MM/yyyy"
 *                       isRequired:
 *                         type: boolean
 *                         example: true
 *                       defaultValue:
 *                         type: string
 *                         example: "N/A"
 *                       mappingToField:
 *                         type: string
 *                         example: "user.name"
 *                       headerRow:
 *                         type: integer
 *                         example: 1
 *                       startRow:
 *                         type: integer
 *                         example: 2
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       dataSource:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Excel de Usuarios"
 *                       creator:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           username:
 *                             type: string
 *                             example: "admin"
 *                           email:
 *                             type: string
 *                             example: "admin@example.com"
 *                       updater:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           username:
 *                             type: string
 *                             example: "editor"
 *                           email:
 *                             type: string
 *                             example: "editor@example.com"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/data-source-column-configs/search",
  authenticateToken as RequestHandler,
  validatorMiddleware(SearchDataSourceColumnConfigDto) as RequestHandler,
  configureEtlController.searchDataSourceColumnConfigPaginated
);

// Extraction Logs
/**
 * @swagger
 * /api/configure/etl/extraction-logs:
 *   post:
 *     summary: Crear un nuevo registro de extracción
 *     tags: [Extracción ETL]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-15T10:30:00Z"
 *                 required: true
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-15T10:35:00Z"
 *               status:
 *                 type: string
 *                 example: "completed"
 *               recordsExtracted:
 *                 type: integer
 *                 example: 150
 *               recordsProcessed:
 *                 type: integer
 *                 example: 148
 *               recordsFailed:
 *                 type: integer
 *                 example: 2
 *               errorMessage:
 *                 type: string
 *                 example: "Error en 2 registros"
 *               executionDetails:
 *                 type: object
 *                 example: {"duration": "00:05:23", "errors": 2}
 *               dataSourceId:
 *                 type: integer
 *                 example: 1
 *                 required: true
 *               executorId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Registro de extracción creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registro de extracción creado correctamente"
 *                 log:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T10:30:00Z"
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T10:35:00Z"
 *                     status:
 *                       type: string
 *                       example: "completed"
 *                     recordsExtracted:
 *                       type: integer
 *                       example: 150
 *                     recordsProcessed:
 *                       type: integer
 *                       example: 148
 *                     recordsFailed:
 *                       type: integer
 *                       example: 2
 *                     errorMessage:
 *                       type: string
 *                       example: "Error en 2 registros"
 *                     executionDetails:
 *                       type: object
 *                       example: {"duration": "00:05:23", "errors": 2}
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/extraction-logs",
  authenticateToken as RequestHandler,
  validatorMiddleware(CreateExtractionLogDto) as RequestHandler,
  configureEtlController.createExtractionLog
);

/**
 * @swagger
 * /api/configure/etl/extraction-logs/{id}:
 *   put:
 *     summary: Actualizar un registro de extracción existente
 *     tags: [Extracción ETL]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de extracción a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-15T10:30:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-15T10:35:00Z"
 *               status:
 *                 type: string
 *                 example: "completed"
 *               recordsExtracted:
 *                 type: integer
 *                 example: 150
 *               recordsProcessed:
 *                 type: integer
 *                 example: 148
 *               recordsFailed:
 *                 type: integer
 *                 example: 2
 *               errorMessage:
 *                 type: string
 *                 example: "Error en 2 registros"
 *               executionDetails:
 *                 type: object
 *                 example: {"duration": "00:05:23", "errors": 2}
 *               dataSourceId:
 *                 type: integer
 *                 example: 1
 *               executorId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Registro de extracción actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registro de extracción actualizado correctamente"
 *                 log:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T10:30:00Z"
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T10:35:00Z"
 *                     status:
 *                       type: string
 *                       example: "completed"
 *                     recordsExtracted:
 *                       type: integer
 *                       example: 150
 *                     recordsProcessed:
 *                       type: integer
 *                       example: 148
 *                     recordsFailed:
 *                       type: integer
 *                       example: 2
 *                     errorMessage:
 *                       type: string
 *                       example: "Error en 2 registros"
 *                     executionDetails:
 *                       type: object
 *                       example: {"duration": "00:05:23", "errors": 2}
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Registro de extracción no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/extraction-logs/:id",
  authenticateToken as RequestHandler,
  validatorMiddleware(UpdateExtractionLogDto) as RequestHandler,
  configureEtlController.updateExtractionLog
);

/**
 * @swagger
 * /api/configure/etl/extraction-logs/{id}:
 *   delete:
 *     summary: Eliminar un registro de extracción
 *     tags: [Extracción ETL]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de extracción a eliminar
 *     responses:
 *       200:
 *         description: Registro de extracción eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registro de extracción eliminado correctamente"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Registro de extracción no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/extraction-logs/:id",
  authenticateToken as RequestHandler,
  configureEtlController.deleteExtractionLog
);

/**
 * @swagger
 * /api/configure/etl/extraction-logs/search:
 *   post:
 *     summary: Buscar registros de extracción con paginación
 *     tags: [Extracción ETL]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-15T00:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-16T00:00:00Z"
 *               status:
 *                 type: string
 *                 example: "completed"
 *               dataSourceId:
 *                 type: integer
 *                 example: 1
 *               executorId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Lista paginada de registros de extracción
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T10:30:00Z"
 *                       endTime:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T10:35:00Z"
 *                       status:
 *                         type: string
 *                         example: "completed"
 *                       recordsExtracted:
 *                         type: integer
 *                         example: 150
 *                       recordsProcessed:
 *                         type: integer
 *                         example: 148
 *                       recordsFailed:
 *                         type: integer
 *                         example: 2
 *                       errorMessage:
 *                         type: string
 *                         example: "Error en 2 registros"
 *                       executionDetails:
 *                         type: object
 *                         example: {"duration": "00:05:23", "errors": 2}
 *                       dataSource:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Excel de Usuarios"
 *                       executor:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           username:
 *                             type: string
 *                             example: "admin"
 *                           email:
 *                             type: string
 *                             example: "admin@example.com"
 *                 total:
 *                   type: integer
 *                   example: 25
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/extraction-logs/search",
  authenticateToken as RequestHandler,
  validatorMiddleware(SearchExtractionLogDto) as RequestHandler,
  configureEtlController.searchExtractionLogPaginated
);

// Extraction Logs
/**
 * @swagger
 * /api/configure/etl/extracted-data:
 *   post:
 *     summary: Crear nuevos datos extraídos
 *     tags: [Datos Extraídos]
 *     description: Crea un nuevo registro de datos extraídos en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - extractionDate
 *               - dataContent
 *               - dataSourceId
 *             properties:
 *               extractionDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de extracción de los datos
 *                 example: "2023-05-15T10:30:00Z"
 *               dataContent:
 *                 type: object
 *                 description: Contenido de los datos extraídos
 *                 example: {"users": [{"id": 1, "name": "Juan"}, {"id": 2, "name": "María"}]}
 *               recordCount:
 *                 type: integer
 *                 description: Número de registros extraídos
 *                 example: 150
 *               dataSourceId:
 *                 type: integer
 *                 description: ID de la fuente de datos
 *                 example: 1
 *               dataName:
 *                 type: string
 *                 description: Nombre del bloque de datos
 *                 example: "calculation_product_extrategic"
 *               calculateDate:
 *                 type: string
 *                 description: Fecha de cálculo
 *                 example: "2023-05-15"
 *     responses:
 *       201:
 *         description: Datos extraídos creados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Los datos extraidos se han guardado correctamente"
 *                 extractedData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     extractionDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-05-15T10:30:00Z"
 *                     dataContent:
 *                       type: object
 *                       example: {"users": [{"id": 1, "name": "Juan"}, {"id": 2, "name": "María"}]}
 *                     recordCount:
 *                       type: integer
 *                       example: 150
 *                     dataName:
 *                       type: string
 *                       example: "calculation_product_extrategic"
 *                     calculateDate:
 *                       type: string
 *                       format: date
 *                       example: "2023-05-15"
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/extracted-data",
  authenticateToken as RequestHandler,
  validatorMiddleware(CreateExtractedDataDto) as RequestHandler,
  configureEtlController.createExtractedData
);

/**
 * @swagger
 * /api/configure/etl/extracted-data/{id}:
 *   put:
 *     summary: Actualizar datos extraídos
 *     tags: [Datos Extraídos]
 *     description: Actualiza un registro de datos extraídos existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de datos extraídos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               extractionDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de extracción de los datos
 *                 example: "2023-05-15T10:30:00Z"
 *               dataContent:
 *                 type: object
 *                 description: Contenido de los datos extraídos
 *                 example: {"users": [{"id": 1, "name": "Juan"}, {"id": 2, "name": "María"}]}
 *               recordCount:
 *                 type: integer
 *                 description: Número de registros extraídos
 *                 example: 150
 *               isProcessed:
 *                 type: boolean
 *                 description: Indica si los datos han sido procesados
 *                 example: true
 *               processedDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de procesamiento de los datos
 *                 example: "2023-05-16T14:20:00Z"
 *               processingDetails:
 *                 type: object
 *                 description: Detalles del procesamiento
 *                 example: {"duration": "00:10:15", "errors": 0}
 *               dataSourceId:
 *                 type: integer
 *                 description: ID de la fuente de datos
 *                 example: 1
 *               extractionLogId:
 *                 type: integer
 *                 description: ID del registro de extracción
 *                 example: 5
 *               processorId:
 *                 type: integer
 *                 description: ID del usuario que procesó los datos
 *                 example: 2
 *               creatorId:
 *                 type: integer
 *                 description: ID del usuario que creó el registro
 *                 example: 1
 *               dataName:
 *                 type: string
 *                 description: Nombre del bloque de datos
 *                 example: "calculation_product_extrategic"
 *               calculateDate:
 *                 type: string
 *                 description: Fecha de cálculo
 *                 example: "2023-05-15"
 *     responses:
 *       200:
 *         description: Datos extraídos actualizados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos extraídos actualizados correctamente"
 *                 extractedData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     extractionDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-05-15T10:30:00Z"
 *                     dataContent:
 *                       type: object
 *                       example: {"users": [{"id": 1, "name": "Juan"}, {"id": 2, "name": "María"}]}
 *                     isProcessed:
 *                       type: boolean
 *                       example: true
 *                     dataName:
 *                       type: string
 *                       example: "calculation_product_extrategic"
 *                     calculateDate:
 *                       type: string
 *                       format: date
 *                       example: "2023-05-15"
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/extracted-data/:id",
  authenticateToken as RequestHandler,
  validatorMiddleware(UpdateExtractedDataDto) as RequestHandler,
  configureEtlController.updateExtractedData
);

/**
 * @swagger
 * /api/configure/etl/extracted-data/{id}:
 *   delete:
 *     summary: Eliminar datos extraídos
 *     tags: [Datos Extraídos]
 *     description: Elimina un registro de datos extraídos del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de datos extraídos
 *     responses:
 *       200:
 *         description: Datos extraídos eliminados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos extraídos eliminados correctamente"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/extracted-data/:id",
  authenticateToken as RequestHandler,
  configureEtlController.deleteExtractedData
);

/**
 * @swagger
 * /api/configure/etl/extracted-data/search:
 *   post:
 *     summary: Buscar datos extraídos paginados
 *     tags: [Datos Extraídos]
 *     description: Busca y devuelve una lista paginada de datos extraídos según los criterios de búsqueda
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de registros por página
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               extractionDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de extracción para filtrar
 *                 example: "2023-05-15T00:00:00Z"
 *               isProcessed:
 *                 type: boolean
 *                 description: Filtrar por estado de procesamiento
 *                 example: true
 *               processedDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de procesamiento para filtrar
 *                 example: "2023-05-16T00:00:00Z"
 *               dataSourceId:
 *                 type: integer
 *                 description: ID de la fuente de datos para filtrar
 *                 example: 1
 *               extractionLogId:
 *                 type: integer
 *                 description: ID del registro de extracción para filtrar
 *                 example: 5
 *               processorId:
 *                 type: integer
 *                 description: ID del procesador para filtrar
 *                 example: 2
 *               creatorId:
 *                 type: integer
 *                 description: ID del creador para filtrar
 *                 example: 1
 *               dataName:
 *                 type: string
 *                 description: Nombre del bloque de datos para filtrar
 *                 example: "calculation_product_extrategic"
 *               calculateDate:
 *                 type: string
 *                 description: Fecha de cálculo para filtrar
 *                 example: "2023-05-15"
 *     responses:
 *       200:
 *         description: Lista paginada de datos extraídos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       extractionDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-05-15T10:30:00Z"
 *                       dataContent:
 *                         type: object
 *                         example: {"users": [{"id": 1, "name": "Juan"}, {"id": 2, "name": "María"}]}
 *                       recordCount:
 *                         type: integer
 *                         example: 150
 *                       isProcessed:
 *                         type: boolean
 *                         example: true
 *                       processedDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-05-16T14:20:00Z"
 *                       processingDetails:
 *                         type: object
 *                         example: {"duration": "00:10:15", "errors": 0}
 *                       dataName:
 *                         type: string
 *                         example: "calculation_product_extrategic"
 *                       calculateDate:
 *                         type: string
 *                         format: date
 *                         example: "2023-05-15"
 *                       dataSource:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Excel de Usuarios"
 *                       extractionLog:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           executionDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-05-15T10:00:00Z"
 *                       processor:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           username:
 *                             type: string
 *                             example: "processor"
 *                           email:
 *                             type: string
 *                             example: "processor@example.com"
 *                       creator:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           username:
 *                             type: string
 *                             example: "admin"
 *                           email:
 *                             type: string
 *                             example: "admin@example.com"
 *                 total:
 *                   type: integer
 *                   example: 25
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/extracted-data/search",
  authenticateToken as RequestHandler,
  validatorMiddleware(SearchExtractedDataDto) as RequestHandler,
  configureEtlController.searchExtractedDataPaginated
);

// Detail Tables Config
/**
 * @swagger
 * /api/configure/etl/detail-tables-config:
 *   post:
 *     summary: Crear una nueva configuración de tablas de detalle
 *     tags: [Configuración de Tablas de Detalle]
 *     description: Crea una nueva configuración de tablas de detalle en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - name
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID de la compañía
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Nombre de la configuración
 *                 maxLength: 255
 *                 example: "Configuración de Ventas"
 *               description:
 *                 type: string
 *                 description: Descripción de la configuración
 *                 example: "Configuración para tablas de detalle de ventas"
 *     responses:
 *       201:
 *         description: Configuración de tablas de detalle creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Configuración de tablas de detalle creada correctamente"
 *                 detailTablesConfig:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     companyId:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Configuración de Ventas"
 *                     description:
 *                       type: string
 *                       example: "Configuración para tablas de detalle de ventas"
 *                     company:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Empresa ABC"
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/detail-tables-config",
  authenticateToken as RequestHandler,
  validatorMiddleware(CreateDetailTablesConfigDto) as RequestHandler,
  configureEtlController.createDetailTablesConfig
);

/**
 * @swagger
 * /api/configure/etl/detail-tables-config/{id}:
 *   put:
 *     summary: Actualizar una configuración de tablas de detalle
 *     tags: [Configuración de Tablas de Detalle]
 *     description: Actualiza una configuración de tablas de detalle existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la configuración a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID de la compañía
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Nombre de la configuración
 *                 maxLength: 255
 *                 example: "Configuración de Ventas Actualizada"
 *               description:
 *                 type: string
 *                 description: Descripción de la configuración
 *                 example: "Configuración actualizada para tablas de detalle de ventas"
 *     responses:
 *       200:
 *         description: Configuración de tablas de detalle actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Configuración de tablas de detalle actualizada correctamente"
 *                 detailTablesConfig:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     companyId:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Configuración de Ventas Actualizada"
 *                     description:
 *                       type: string
 *                       example: "Configuración actualizada para tablas de detalle de ventas"
 *                     company:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Empresa ABC"
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Configuración no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/detail-tables-config/:id",
  authenticateToken as RequestHandler,
  validatorMiddleware(UpdateDetailTablesConfigDto) as RequestHandler,
  configureEtlController.updateDetailTablesConfig
);

/**
 * @swagger
 * /api/configure/etl/detail-tables-config/{id}:
 *   delete:
 *     summary: Eliminar una configuración de tablas de detalle
 *     tags: [Configuración de Tablas de Detalle]
 *     description: Elimina una configuración de tablas de detalle existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la configuración a eliminar
 *     responses:
 *       200:
 *         description: Configuración de tablas de detalle eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Configuración de tablas de detalle eliminada correctamente"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Configuración no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/detail-tables-config/:id",
  authenticateToken as RequestHandler,
  configureEtlController.deleteDetailTablesConfig
);

/**
 * @swagger
 * /api/configure/etl/detail-tables-config/search:
 *   post:
 *     summary: Buscar configuraciones de tablas de detalle paginadas
 *     tags: [Configuración de Tablas de Detalle]
 *     description: Busca configuraciones de tablas de detalle con filtros y paginación
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID de la configuración
 *                 example: 1
 *               companyId:
 *                 type: integer
 *                 description: ID de la compañía
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Nombre de la configuración
 *                 example: "Ventas"
 *     responses:
 *       200:
 *         description: Lista paginada de configuraciones de tablas de detalle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       companyId:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Configuración de Ventas"
 *                       description:
 *                         type: string
 *                         example: "Configuración para tablas de detalle de ventas"
 *                       company:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Empresa ABC"
 *                 total:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/detail-tables-config/search",
  authenticateToken as RequestHandler,
  validatorMiddleware(DetailTablesConfigSearchParamsDto) as RequestHandler,
  configureEtlController.searchDetailTablesConfigPaginated
);

export default router;
