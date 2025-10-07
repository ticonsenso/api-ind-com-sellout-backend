import { Router, RequestHandler } from 'express';
import AppDataSource from '../config/data-source';
import { authenticateToken } from '../middleware/auth.middleware';
import { validatorMiddleware } from '../middleware/validator.middleware';
import { CreateSelloutConfigurationDto, UpdateSelloutConfigurationDto } from '../dtos/sellout.configuration.dto';
import { SelloutConfigurationController } from '../controllers/sellout.configuration.controller';
import { CreateSelloutConfigurationColumnConfigsDto, UpdateSelloutConfigurationColumnConfigsDto } from '../dtos/sellout.configuration.column.configs.dto';
import { CreateExtractedDataSelloutDto, UpdateExtractedDataSelloutDto } from '../dtos/extrated.data.sellout.dto';

const router = Router();
const selloutConfigurationController = new SelloutConfigurationController(AppDataSource);

/**
 * @swagger
 * /api/sellout/configuration:
 *   post:
 *     tags:
 *       - Configuración de Sellout
 *     summary: Crear una nueva configuración de Sellout
 *     description: Crea una nueva configuración de Sellout en el sistema
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
 *               - description
 *               - distributorCompanyName
 *               - sheetName
 *               - codeStoreDistributor
 *               - companyId
 *               - calculateDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la configuración
 *               sourceType:
 *                 type: string
 *                 description: Tipo de fuente
 *               description:
 *                 type: string
 *                 description: Descripción de la configuración
 *               distributorCompanyName:
 *                 type: string
 *                 description: Nombre de la empresa distribuidora
 *               sheetName:
 *                 type: string
 *                 description: Nombre de la hoja del archivo
 *               codeStoreDistributor:
 *                 type: string
 *                 description: Código de la tienda
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa
 *               matriculationId:
 *                 type: integer
 *                 description: ID de la plantilla de matriculación
 *               calculateDate:
 *                 type: string
 *                 description: Fecha de cálculo
 *     responses:
 *       200:
 *         description: Configuración de Sellout creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 sourceType:
 *                   type: string
 *                 description:
 *                   type: string
 *                 distributorCompanyName:
 *                   type: string
 *                 sheetName:
 *                   type: string
 *                 codeStoreDistributor:
 *                   type: string
 *                 companyId:
 *                   type: integer
 *                 matriculationId:
 *                   type: integer
 *                 calculateDate:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/configuration",
    authenticateToken,
    validatorMiddleware(CreateSelloutConfigurationDto,
        false) as RequestHandler,
    selloutConfigurationController.createSelloutConfiguration
);

/**
 * @swagger
 * /api/sellout/configuration/{id}:
 *   put:
 *     tags:
 *       - Configuración de Sellout
 *     summary: Actualizar una configuración de Sellout
 *     description: Actualiza una configuración de Sellout en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sourceType
 *               - description
 *               - distributorCompanyName
 *               - sheetName
 *               - codeStoreDistributor
 *               - companyId
 *               - calculateDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la configuración
 *               sourceType:
 *                 type: string
 *                 description: Tipo de fuente
 *               description:
 *                 type: string
 *                 description: Descripción de la configuración
 *               distributorCompanyName:
 *                 type: string
 *                 description: Nombre de la empresa distribuidora
 *               sheetName:
 *                 type: string
 *                 description: Nombre de la hoja del archivo
 *               codeStoreDistributor:
 *                 type: string
 *                 description: Código de la tienda
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa
 *               matriculationId:
 *                 type: integer
 *                 description: ID de la plantilla de matriculación
 *               calculateDate:
 *                 type: string
 *                 description: Fecha de cálculo
 *     responses:
 *       200:
 *         description: Configuración de Sellout actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 sourceType:
 *                   type: string
 *                 description:
 *                   type: string
 *                 distributorCompanyName:
 *                   type: string
 *                 sheetName:
 *                   type: string
 *                 codeStoreDistributor:
 *                   type: string
 *                 companyId:
 *                   type: integer
 *                 matriculationId:
 *                   type: integer
 *                 calculateDate:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.put(
    "/configuration/:id",
    authenticateToken,
    validatorMiddleware(UpdateSelloutConfigurationDto,
        false) as RequestHandler,
    selloutConfigurationController.updateSelloutConfiguration
);

/**
 * @swagger
 * /api/sellout/configuration/{id}:
 *   delete:
 *     tags:
 *       - Configuración de Sellout
 *     summary: Eliminar una configuración de Sellout
 *     description: Elimina una configuración de Sellout en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Configuración de Sellout eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.delete(
    "/configuration/:id",
    authenticateToken,
    selloutConfigurationController.deleteSelloutConfiguration);

/**
 * @swagger
 * /api/sellout/configuration/filters:
 *   get:
 *     tags:
 *       - Configuración de Sellout
 *     summary: Obtener configuraciones de Sellout filtrados   
 *     description: Busqueda de configuraciones de Sellout
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page   
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false  
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         required: false
 *         schema:  
 *           type: string
 *     responses:
 *       200:
 *         description: Configuraciones de Sellout filtradas correctamente
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
 *                       name:
 *                         type: string
 *                       sourceType:
 *                         type: string
 *                       description:  
 *                         type: string
 *                       distributorCompanyName:
 *                         type: string
 *                       sheetName:
 *                         type: string
 *                       codeStoreDistributor:
 *                         type: string
 *                       companyId:
 *                         type: integer
 *                       matriculationId:
 *                         type: integer
 *                       calculateDate:
 *                         type: string
 *                 total:
 *                   type: integer
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.get(
    "/configuration/filters",
    authenticateToken,
    selloutConfigurationController.getFilteredSelloutConfigurations
);

// sellout configuration column configs

/**
 * @swagger
 * /api/sellout/configuration/column/configs:
 *   post:
 *     tags:
 *       - Configuración de Sellout columnas
 *     summary: Crear una nueva configuración de columna
 *     description: Crea una nueva configuración de columna en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - selloutConfigurationId
 *               - columnName
 *               - columnIndex
 *               - columnLetter
 *               - dataType
 *               - isRequired
 *               - mappingToField
 *               - headerRow
 *               - startRow
 *               - isActive
 *             properties:
 *               selloutConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de Sellout
 *               columnName:
 *                 type: string
 *                 description: Nombre de la columna
 *               columnIndex:
 *                 type: integer
 *                 description: Índice de la columna
 *               columnLetter:
 *                 type: string
 *                 description: Letra de la columna
 *               dataType:
 *                 type: string
 *                 description: Tipo de dato
 *               isRequired:
 *                 type: boolean
 *                 description: Indica si la columna es obligatoria
 *               mappingToField:
 *                 type: string
 *                 description: Campo al que se mapea en el sistema de destino
 *               headerRow:
 *                 type: integer
 *                 description: Fila donde están los encabezados
 *               startRow:
 *                 type: integer
 *                 description: Fila donde comienzan los datos
 *               isActive:
 *                 type: boolean
 *                 description: Indica si la columna está activa
 *               hasNegativeValue:
 *                 type: boolean
 *                 description: Indica si el valor es negativo
 *     responses:
 *       200:
 *         description: Configuración de columna creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 selloutConfigurationId:
 *                   type: integer
 *                 columnName:
 *                   type: string
 *                 columnIndex:
 *                   type: integer
 *                 columnLetter:
 *                   type: string
 *                 dataType:
 *                   type: string
 *                 isRequired:
 *                   type: boolean
 *                 mappingToField:
 *                   type: string
 *                 headerRow:
 *                   type: integer
 *                 startRow:
 *                   type: integer
 *                 isActive:
 *                   type: boolean
 *                 hasNegativeValue:
 *                   type: boolean
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/configuration/column/configs",
    authenticateToken,
    validatorMiddleware(CreateSelloutConfigurationColumnConfigsDto,
        false) as RequestHandler,
    selloutConfigurationController.createSelloutConfigurationColumnConfigs
);

/**
 * @swagger
 * /api/sellout/configuration/column/configs/batch:
 *   post:
 *     tags:
 *       - Configuración de Sellout columnas
 *     summary: Crear múltiples configuraciones de columna
 *     description: Crea varias configuraciones de columna en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - selloutConfigurationId
 *                 - columnName
 *                 - columnIndex
 *                 - columnLetter
 *                 - dataType
 *                 - isRequired
 *                 - mappingToField
 *                 - headerRow
 *                 - startRow
 *                 - isActive
 *                 - hasNegativeValue
 *               properties:
 *                 selloutConfigurationId:
 *                   type: integer
 *                   description: ID de la configuración de Sellout
 *                 columnName:
 *                   type: string
 *                   description: Nombre de la columna
 *                 columnIndex:
 *                   type: integer
 *                   description: Índice de la columna
 *                 columnLetter:
 *                   type: string
 *                   description: Letra de la columna
 *                 dataType:
 *                   type: string
 *                   description: Tipo de dato
 *                 isRequired:
 *                   type: boolean
 *                   description: Indica si la columna es obligatoria
 *                 mappingToField:
 *                   type: string
 *                   description: Campo al que se mapea
 *                 headerRow:
 *                   type: integer
 *                   description: Fila del encabezado
 *                 startRow:
 *                   type: integer
 *                   description: Fila de inicio de datos
 *                 isActive:
 *                   type: boolean
 *                   description: Si la columna está activa
 *                 hasNegativeValue:
 *                   type: boolean
 *                   description: Indica si el valor es negativo
 *     responses:
 *       201:
 *         description: Configuraciones de columnas creadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 configs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       selloutConfigurationId:
 *                         type: integer
 *                       columnName:        
 *                         type: string
 *                       columnIndex:
 *                         type: integer
 *                       columnLetter:
 *                         type: string
 *                       dataType:  
 *                         type: string
 *                       isRequired:
 *                         type: boolean
 *                       mappingToField:
 *                         type: string
 *                       headerRow:     
 *                         type: integer
 *                       startRow:
 *                         type: integer
 *                       isActive:
 *                         type: boolean
 *                       hasNegativeValue:  
 *                         type: boolean
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */

router.post(
    "/configuration/column/configs/batch",
    authenticateToken,
    selloutConfigurationController.createSelloutConfigurationColumnConfigsBatch
);

/**
 * @swagger
 * /api/sellout/configuration/column/configs/{id}:
 *   put:
 *     tags:
 *       - Configuración de Sellout columnas
 *     summary: Actualizar una configuración de columna
 *     description: Actualiza una configuración de columna en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - selloutConfigurationId
 *               - columnName
 *               - columnIndex
 *               - columnLetter
 *               - dataType
 *               - isRequired
 *               - mappingToField
 *               - headerRow
 *               - startRow
 *               - isActive
 *               - hasNegativeValue
 *             properties:
 *               selloutConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de Sellout
 *               columnName:
 *                 type: string
 *                 description: Nombre de la columna
 *               columnIndex:
 *                 type: integer
 *                 description: Índice de la columna
 *               columnLetter:
 *                 type: string
 *                 description: Letra de la columna
 *               dataType:
 *                 type: string
 *                 description: Tipo de dato
 *               isRequired:
 *                 type: boolean
 *                 description: Indica si la columna es obligatoria
 *               mappingToField:
 *                 type: string
 *                 description: Campo al que se mapea en el sistema de destino
 *               headerRow:
 *                 type: integer
 *                 description: Fila donde están los encabezados
 *               startRow:
 *                 type: integer
 *                 description: Fila donde comienzan los datos
 *               isActive:
 *                 type: boolean
 *                 description: Indica si la columna está activa
 *               hasNegativeValue:
 *                 type: boolean
 *                 description: Indica si el valor es negativo
 *     responses:
 *       200:
 *         description: Configuración de columna actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 selloutConfigurationId:
 *                   type: integer
 *                 columnName:
 *                   type: string
 *                 columnIndex:
 *                   type: integer
 *                 columnLetter:
 *                   type: string
 *                 dataType:
 *                   type: string
 *                 isRequired:
 *                   type: boolean
 *                 mappingToField:
 *                   type: string
 *                 headerRow:
 *                   type: integer
 *                 startRow:
 *                   type: integer
 *                 isActive:
 *                   type: boolean
 *                 hasNegativeValue:
 *                   type: boolean
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.put(
    "/configuration/column/configs/:id",
    authenticateToken,
    validatorMiddleware(UpdateSelloutConfigurationColumnConfigsDto,
        false) as RequestHandler,
    selloutConfigurationController.updateSelloutConfigurationColumnConfigs
);

/**
 * @swagger
 * /api/sellout/configuration/column/configs/{id}:
 *   delete:
 *     tags:
 *       - Configuración de Sellout columnas
 *     summary: Eliminar una configuración de columna
 *     description: Elimina una configuración de columna en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.delete(
    "/configuration/column/configs/:id",
    authenticateToken,
    selloutConfigurationController.deleteSelloutConfigurationColumnConfigs
);

/**
 * @swagger
 * /api/sellout/configuration/column/configs/filters:
 *   get:
 *     tags:
 *       - Configuración de Sellout columnas
 *     summary: Obtener configuraciones de columna filtradas   
 *     description: Busqueda por nombre de columna o por id de configuración de sellout
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: selloutConfigurationId
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuraciones de columna filtradas correctamente
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
 *                       selloutConfigurationId:
 *                         type: integer
 *                       columnName:
 *                         type: string
 *                       columnIndex:
 *                         type: integer
 *                       columnLetter:
 *                         type: string
 *                       dataType:
 *                         type: string
 *                       isRequired:
 *                         type: boolean
 *                       mappingToField:
 *                         type: string
 *                       headerRow:
 *                         type: integer
 *                       startRow:
 *                         type: integer
 *                       isActive:
 *                         type: boolean
 *                       hasNegativeValue:
 *                         type: boolean
 *                 total:
 *                   type: integer
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.get(
    "/configuration/column/configs/filters",
    authenticateToken,
    selloutConfigurationController.getFilteredSelloutConfigurationColumnConfigs
);

// extracted data sellout

/**
 * @swagger
 * /api/sellout/configuration/extracted/data:
 *   post:
 *     summary: Crear nuevos datos extraídos sellout
 *     tags: [Datos extraídos sellout]
 *     description: Crea un nuevo registro de datos extraídos sellout en el sistema
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
 *               - selloutConfigurationId
 *             properties:
 *               extractionDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de extracción de los datos
 *                 example: "2023-05-15T10:30:00Z"
 *               dataContent:
 *                 type: object
 *                 description: Contenido de los datos extraídos
 *                 example: {"consolidated_data_stores": [{"distributor": "MAYOREO", "codeStoreDistributor": "3444", "codeProductDistributor": "9877", "descriptionDistributor": "TV INDURAMA", "unitsSoldDistributor": 1, "saleDate": "2023-05-15"}]}
 *               selloutConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de Sellout
 *                 example: 1
 *               recordCount:
 *                 type: integer
 *                 description: Número de registros extraídos
 *                 example: 1
 *               dataName:
 *                 type: string
 *                 description: Nombre del bloque de datos
 *                 example: "consolidated_data_stores"
 *               distributor:
 *                 type: string
 *                 description: Distribuidor
 *                 example: "Almacenes Alfa"
 *               storeName:
 *                 type: string
 *                 description: Nombre de la tienda
 *                 example: "Almacenes 1"
 *               calculateDate:
 *                 type: string
 *                 description: Fecha de cálculo
 *                 example: "2025-06-20"
 *               productCount:
 *                 type: integer
 *                 description: Total de productos procesados
 *                 example: 15  
 *               uploadTotal:
 *                 type: integer
 *                 description: Total de registros extraídos
 *                 example: 2
 *               uploadCount:
 *                 type: integer
 *                 description: Total de registros procesados
 *                 example: 1
 *               matriculationId:
 *                 type: integer
 *                 description: ID de la plantilla de matriculación
 *                 example: 1
 *               matriculationLogs:
 *                 type: array  
 *                 description: Log de matriculación
 *                 items:
 *                   type: object
 *                   properties:
 *                     distributor:
 *                       type: string
 *                       description: Distribuidor    
 *                       example: "Almacenes Alfa"
 *                     storeName:
 *                       type: string
 *                       description: Nombre de la tienda
 *                       example: "Almacenes 1"
 *                     rowsCount:
 *                       type: integer
 *                       description: Total de filas procesadas
 *                       example: 150
 *                     productCount:
 *                       type: integer    
 *                       description: Total de productos procesados
 *                       example: 15
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
 *                     recordCount:
 *                       type: integer
 *                       example: 150
 *                     dataName:
 *                       type: string
 *                       example: "consolidated_data_stores"
 *                     distributor:
 *                       type: string
 *                       example: "Almacenes Alfa"
 *                     storeName:
 *                       type: string
 *                       example: "Almacenes 1"
 *                     calculateDate:
 *                       type: string
 *                       example: "2025-06-20"
 *                     productCount:
 *                       type: integer
 *                       example: 15
 *                     uploadTotal:
 *                       type: integer
 *                       example: 2
 *                     uploadCount:
 *                       type: integer
 *                       example: 1
 *                     matriculationId:
 *                       type: integer
 *                       example: 1
 *                     matriculationLogs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           matriculationId:
 *                             type: integer
 *                             example: 1
 *                           rowsCount:
 *                             type: integer
 *                             example: 150
 *                           distributor:
 *                             type: string
 *                             example: "Almacenes Alfa"
 *                           storeName:
 *                             type: string
 *                             example: "Almacenes 1"
 *                           productCount:
 *                             type: integer
 *                             example: 15
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
    "/configuration/extracted/data",
    authenticateToken as RequestHandler,
    validatorMiddleware(CreateExtractedDataSelloutDto) as RequestHandler,
    selloutConfigurationController.createExtractedDataSellout
);

/**
 * @swagger
 * /api/sellout/configuration/extracted/data/{id}:
 *   put:
 *     tags:
 *       - Datos extraídos sellout
 *     summary: Actualizar un dato extraído
 *     description: Actualiza un dato extraído en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - selloutConfigurationId
 *               - extractionLogId
 *               - extractionDate
 *               - dataContent
 *               - recordCount
 *               - isProcessed
 *               - processedDate
 *               - processedBy
 *               - processingDetails
 *               - dataName
 *               - calculateDate
 *             properties:
 *               selloutConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de Sellout
 *               extractionLogId:
 *                 type: integer
 *                 description: ID de la ejecución de log
 *               extractionDate:
 *                 type: string
 *                 description: Fecha de extracción
 *               dataContent:
 *                 type: array
 *                 description: Contenido de los datos extraídos
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     value:
 *                       type: string
 *               recordCount:
 *                 type: integer
 *                 description: Número de registros contenidos en dataContent
 *               isProcessed:
 *                 type: boolean
 *                 description: Indica si los datos ya fueron procesados
 *               processedDate:
 *                 type: string
 *                 description: Fecha de procesamiento
 *               processedBy:
 *                 type: integer
 *                 description: ID del usuario que procesó los datos
 *               processingDetails:
 *                 type: integer
 *                 description: Detalles del procesamiento
 *               dataName:
 *                 type: string
 *                 description: Nombre de los datos extraídos
 *               calculateDate:
 *                 type: string
 *                 description: Fecha de cálculo
 *     responses:
 *       200:
 *         description: Datos extraídos actualizados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 selloutConfigurationId:
 *                   type: integer
 *                 extractionLogId:
 *                   type: integer
 *                 extractionDate:
 *                   type: string
 *                 dataContent:
 *                   type: string
 *                 recordCount:
 *                   type: integer
 *                 isProcessed:
 *                   type: boolean
 *                 processedDate:
 *                   type: string
 *                 processedBy:
 *                   type: integer
 *                 processingDetails:
 *                   type: string
 *                 dataName:
 *                   type: string
 *                 calculateDate:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.put(
    "/configuration/extracted/data/:id",
    authenticateToken,
    validatorMiddleware(UpdateExtractedDataSelloutDto,
        false) as RequestHandler,
    selloutConfigurationController.updateExtractedDataSellout
);

/**
 * @swagger
 * /api/sellout/configuration/extracted/data/{id}:
 *   delete:
 *     tags:
 *       - Datos extraídos sellout
 *     summary: Eliminar un dato extraído
 *     description: Elimina un dato extraído en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.delete(
    "/configuration/extracted/data/:id",
    authenticateToken,
    selloutConfigurationController.deleteExtractedDataSellout
);

/**
 * @swagger
 * /api/sellout/configuration/extracted/data/filters:
 *   get:
 *     tags:
 *       - Datos extraídos sellout
 *     summary: Obtener datos extraídos filtrados   
 *     description: Busqueda por nombre de datos extraídos, fecha de extracción, fecha de procesamiento, fecha de cálculo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page   
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos extraídos filtrados correctamente
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
 *                       selloutConfigurationId:
 *                         type: integer
 *                       extractionLogId:
 *                         type: integer
 *                       extractionDate:
 *                         type: string
 *                       dataContent:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                       recordCount:
 *                         type: integer
 *                       isProcessed:
 *                         type: boolean
 *                       processedDate:
 *                         type: string
 *                       processedBy:
 *                         type: integer
 *                       processingDetails:
 *                         type: string
 *                       dataName:
 *                         type: string
 *                       calculateDate:
 *                         type: string
 *                 total:
 *                   type: integer
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.get(
    "/configuration/extracted/data/filters",
    authenticateToken,
    selloutConfigurationController.getFilteredExtractedDataSellout
);

export default router;