import {RequestHandler, Router} from 'express';
import AppDataSource from '../config/data-source';
import {authenticateToken} from '../middleware/auth.middleware';
import {validatorMiddleware} from '../middleware/validator.middleware';
import {ConsolidatedDataStoresController} from '../controllers/consolidated.data.stores.controller';
import {CreateConsolidatedDataStoresDto, UpdateConsolidatedDataStoresDto} from '../dtos/consolidated.data.stores.dto';
import {ConsolidateInformationConsenso} from '../controllers/consolidate.information.consenso';
import {SearchDataConsensoDto} from '../dtos/search.data.consenso';

const router = Router();
const consolidatedDataStoresController = new ConsolidatedDataStoresController(AppDataSource);
const consolidateInformationConsenso = new ConsolidateInformationConsenso(AppDataSource);


/**
 * @swagger
 * /api/sellout/consolidated/store:
 *   post:
 *     tags:
 *       - Datos consolidados
 *     summary: Crear una nueva configuración de datos consolidados de tiendas
 *     description: Crea una nueva configuración de datos consolidados de tiendas en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - distributor
 *               - codeStoreDistributor
 *               - codeProductDistributor
 *               - descriptionDistributor
 *               - unitsSoldDistributor
 *               - saleDate
 *               - codeProduct
 *               - codeStore
 *               - authorizedDistributor
 *               - storeName
 *               - productModel    
 *               - calculateDate
 *             properties:
 *               distributor:
 *                 type: string
 *                 description : Distribuidor
 *               codeStoreDistributor:
 *                 type: string
 *                 description: Código de la tienda distribuidora
 *               codeProductDistributor:
 *                 type: string
 *                 description: Código de la tienda distribuidora
 *               descriptionDistributor:
 *                 type: string
 *                 description: Descripción del distribuidor
 *               unitsSoldDistributor:
 *                 type: number
 *                 description: Unidades vendidas por el distribuidor
 *               saleDate:
 *                 type: string
 *                 description: Fecha de venta
 *               calculateDate:
 *                 type: string
 *                 description: Fecha de cálculo
 *     responses:
 *       200:
 *         description: Datos consolidados de tiendas creados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 distributor:
 *                   type: string
 *                 codeStoreDistributor:
 *                   type: string
 *                 codeProductDistributor:
 *                   type: string
 *                 descriptionDistributor:
 *                   type: string
 *                 unitsSoldDistributor:
 *                   type: number
 *                 saleDate:
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
router.post(
    "/store",
    authenticateToken,
    validatorMiddleware(CreateConsolidatedDataStoresDto,
        false) as RequestHandler,
    consolidatedDataStoresController.createConsolidatedDataStores
);

/**
 * @swagger
 * /api/sellout/consolidated/store/sync/{year}/{month}:
 *   put:
 *     tags:
 *       - Datos consolidados
 *     summary: Sincronizar datos consolidados de tiendas
 *     description: Sincroniza los datos consolidados de tiendas en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos consolidados de tiendas sincronizados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 distributor:
 *                   type: string
 *                 codeStoreDistributor:
 *                   type: string
 *                 codeProductDistributor:
 *                   type: string
 *                 descriptionDistributor:
 *                   type: string
 *                 unitsSoldDistributor:
 *                   type: number
 *                 saleDate:
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
    "/store/sync/:year/:month",
    authenticateToken,
    consolidatedDataStoresController.syncConsolidatedDataStores
);

/**
 * @swagger
 * /api/sellout/consolidated/store/{id}:
 *   put:
 *     tags:
 *       - Datos consolidados
 *     summary: Actualizar un registro consolidado de tienda
 *     description: Actualiza cualquier campo del registro consolidado indicado por su ID. Todos los campos son opcionales.
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del registro que se desea actualizar.
 *         schema:
 *           type: integer
 *           example: 15
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               distributor:
 *                 type: string
 *                 description: Nombre del distribuidor.
 *                 example: "COBODEL"
 *
 *               codeStoreDistributor:
 *                 type: string
 *                 description: Código de tienda asignado por el distribuidor.
 *                 example: "T0012"
 *
 *               codeProductDistributor:
 *                 type: string
 *                 description: Código del producto según el distribuidor.
 *                 example: "PRD-998"
 *
 *               descriptionDistributor:
 *                 type: string
 *                 description: Descripción del producto según distribuidor.
 *                 example: "Refrigeradora 300L"
 *
 *               unitsSoldDistributor:
 *                 type: number
 *                 description: Cantidad de unidades vendidas.
 *                 example: 10
 *
 *               saleDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de venta (YYYY-MM-DD).
 *                 example: "2025-01-10"
 *
 *               codeProduct:
 *                 type: string
 *                 description: Código del producto en el sistema interno.
 *                 example: "IM-5544"
 *
 *               codeStore:
 *                 type: string
 *                 description: Código de la tienda interna.
 *                 example: "ST-33"
 *
 *               authorizedDistributor:
 *                 type: string
 *                 description: Distribuidor autorizado (si aplica).
 *                 example: "IMPORTADORA XYZ"
 *
 *               storeName:
 *                 type: string
 *                 description: Nombre de la tienda.
 *                 example: "Tienda Central Loja"
 *
 *               productModel:
 *                 type: string
 *                 description: Modelo del producto.
 *                 example: "MOD-300L-2025"
 *
 *               calculateDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha en que se realizó el cálculo.
 *                 example: "2025-01-11"
 *
 *               matriculationTemplateId:
 *                 type: number
 *                 description: Plantilla de matriculación asociada.
 *                 example: 4
 *
 *               status:
 *                 type: boolean
 *                 description: Estado activo/inactivo del registro.
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Registro actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 15
 *                 distributor:
 *                   type: string
 *                 codeStoreDistributor:
 *                   type: string
 *                 codeProductDistributor:
 *                   type: string
 *                 descriptionDistributor:
 *                   type: string
 *                 unitsSoldDistributor:
 *                   type: number
 *                 saleDate:
 *                   type: string
 *                 codeProduct:
 *                   type: string
 *                 codeStore:
 *                   type: string
 *                 authorizedDistributor:
 *                   type: string
 *                 storeName:
 *                   type: string
 *                 productModel:
 *                   type: string
 *                 calculateDate:
 *                   type: string
 *                 matriculationTemplateId:
 *                   type: number
 *                 status:
 *                   type: boolean
 *
 *       400:
 *         description: Datos enviados no válidos.
 *
 *       401:
 *         description: Autenticación requerida.
 *
 *       404:
 *         description: No se encontró el registro solicitado.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.put(
    "/store/:id",
    authenticateToken,
    validatorMiddleware(UpdateConsolidatedDataStoresDto,
        false) as RequestHandler,
    consolidatedDataStoresController.updateConsolidatedDataStores
);

/**
 * @swagger
 * /api/sellout/consolidated/batch:
 *   put:
 *     tags:
 *       - Datos consolidados
 *     summary: Actualizar múltiples datos consolidados de tiendas
 *     description: Actualiza múltiples registros de datos consolidados de tiendas.
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
 *               properties:
 *                 id:
 *                   type: integer
 *                 distributor:
 *                   type: string
 *                 codeStoreDistributor:
 *                   type: string
 *                 codeProductDistributor:
 *                   type: string
 *                 descriptionDistributor:
 *                   type: string
 *                 codeProduct:
 *                   type: string
 *                 codeStore:
 *                   type: string
 * 
 *     responses:
 *       200:
 *         description: Datos actualizados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       distributor:
 *                         type: string
 *                       codeStoreDistributor:
 *                         type: string
 *                       codeProductDistributor:
 *                         type: string
 *                       descriptionDistributor:
 *                         type: string     
 *                       codeProduct:
 *                         type: string
 *                       codeStore:
 *                         type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.put(
    "/batch",
    authenticateToken,
    consolidatedDataStoresController.updateManyConsolidatedDataStores
);

/**
 * @swagger
 * /api/sellout/consolidated/store/status/{id}:
 *   put:
 *     tags:
 *       - Datos consolidados
 *     summary: Actualizar el estado de un consolidado
 *     description: Actualiza el estado de un consolidado en el sistema
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
 *             properties:
 *               status:
 *                 type: boolean
 *     responses:   
 *       200:
 *         description: Datos consolidados de tiendas actualizados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object   
 */
router.put(
    "/store/status/:id",
    authenticateToken,
    consolidatedDataStoresController.updateJustStatus
);
/**
 * @swagger
 * /api/sellout/consolidated/store/{id}:
 *   delete:
 *     tags:
 *       - Datos consolidados
 *     summary: Eliminar una configuración de datos consolidados de tiendas
 *     description: Elimina una configuración de datos consolidados de tiendas en el sistema
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
 *         description: Datos consolidados de tiendas eliminados correctamente
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
    "/store/:id",
    authenticateToken,
    consolidatedDataStoresController.deleteConsolidatedDataStores
);

/**
 * @swagger
 * /api/sellout/consolidated/store/filters:
 *   post:
 *     tags:
 *       - Datos consolidados
 *     summary: Obtener datos consolidados de tiendas filtrados   
 *     description: Busqueda de datos consolidados de tiendas
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
 *       - in: query
 *         name: calculateDate
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:  
 *               codeProduct:
 *                 type: boolean
 *               codeStore:
 *                 type: boolean
 *               authorizedDistributor:
 *                 type: boolean    
 *               storeName:
 *                 type: boolean
 *               productModel:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Datos consolidados de tiendas filtrados correctamente
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
 *                       distributor:
 *                         type: string
 *                       codeStoreDistributor:
 *                         type: string
 *                       codeProductDistributor:
 *                         type: string
 *                       descriptionDistributor:
 *                         type: string
 *                       unitsSoldDistributor:
 *                         type: number
 *                       saleDate:
 *                         type: string
 *                       codeProduct:
 *                         type: string
 *                       codeStore:
 *                         type: string
 *                       authorizedDistributor:
 *                         type: string
 *                       storeName:
 *                         type: string
 *                       productModel:
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
router.post(
    "/store/filters",
    authenticateToken,
    consolidatedDataStoresController.getFilteredConsolidatedDataStores
);
/**
 * @swagger
 * /api/sellout/consolidated/store/filters-mod:
 *   post:
 *     tags:
 *       - Datos consolidados
 *     summary: Obtener datos consolidados agrupados y filtrados
 *     description: |
 *       Endpoint para consultar datos consolidados aplicando filtros por distribuidor,
 *       códigos y descripción, junto con paginación y filtrado por año y mes.
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Número de página para la paginación.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         description: Cantidad de registros por página.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: calculateDate
 *         description: Fecha utilizada para filtrar por año y mes (YYYY-MM-DD).
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-05-01
 *
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Filtros opcionales enviados en el cuerpo.
 *             properties:
 *               distributor:
 *                 type: string
 *                 example: IMPORTADORA CASTRO
 *               codeStoreDistributor:
 *                 type: string
 *                 example: AVQUITO
 *               codeProductDistributor:
 *                 type: string
 *                 example: AV-TVBL005
 *               descriptionDistributor:
 *                 type: string
 *                 example: TELEVISOR UHD SMART 65
 *
 *     responses:
 *       200:
 *         description: Datos consolidados obtenidos correctamente.
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
 *                       distributor:
 *                         type: string
 *                       codeStoreDistributor:
 *                         type: string
 *                       codeProductDistributor:
 *                         type: string
 *                       descriptionDistributor:
 *                         type: string
 *                       unitsSoldDistributor:
 *                         type: number
 *                       codeProduct:
 *                         type: string
 *                       codeStore:
 *                         type: string
 *                       storeName:
 *                         type: string
 *                       productModel:
 *                         type: string
 *                       calculateDate:
 *                         type: string
 *                         format: date
 *                 total:
 *                   type: integer
 *                 totalAll:
 *                   type: integer
 *
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post(
    "/store/filters-mod",
    authenticateToken,
    consolidatedDataStoresController.getFilteredConsolidatedDataStoresMod
);

/**
 * @swagger
 * /api/sellout/consolidated/store/detail-null-fields:
 *   get:
 *     tags:
 *       - Datos consolidados
 *     summary: Obtener datos consolidados de tiendas filtrados   
 *     description: Busqueda de datos consolidados de tiendas   
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: calculateDate
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos consolidados de tiendas filtrados correctamente
 *         content:     
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codeProduct:
 *                   type: integer  
 *                 codeStore:
 *                   type: integer
 *                 authorizedDistributor:
 *                   type: integer
 *                 storeName:
 *                   type: integer  
 *                 productModel:
 *                   type: integer
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.  
 *       500:
 *         description: Error del servidor.
 */
router.get(
    "/store/detail-null-fields",
    authenticateToken,
    consolidatedDataStoresController.getConsolidatedDataStoresDetailNullFields
);

/**
 * @swagger
 * /api/sellout/consolidated/store/values-null-unique:
 *   post:
 *     tags:
 *       - Datos consolidados
 *     summary: Obtener datos consolidados de tiendas filtrados   
 *     description: Busqueda de datos consolidados de tiendas   
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: calculateDate
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:  
 *               codeProduct:
 *                 type: boolean
 *               codeStore:
 *                 type: boolean
 *               authorizedDistributor:
 *                 type: boolean        
 *               storeName:
 *                 type: boolean
 *               productModel:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Datos consolidados de tiendas filtrados correctamente
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
 *                       distributor:
 *                         type: string
 *                       codeStoreDistributor:
 *                         type: string
 *                       codeProductDistributor:
 *                         type: string
 *                       descriptionDistributor:
 *                         type: string
 *                       unitsSoldDistributor:
 *                         type: number
 *                       saleDate:
 *                         type: string
 *                       codeProduct:
 *                         type: string
 *                       codeStore:
 *                         type: string
 *                       authorizedDistributor:
 *                         type: string
 *                       storeName:
 *                         type: string
 *                       productModel:
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
router.post(
    "/store/values-null-unique",
    authenticateToken,
    consolidatedDataStoresController.getConsolidatedDataStoresValuesNullUnique
);


/**
 * @swagger
 * /api/sellout/consolidated/information/sith:
 *   post:
 *     tags:
 *       - Datos consenso
 *     summary: Obtener datos de consenso SITH
 *     description: Busca y obtiene datos de consenso desde múltiples fuentes
 *     requestBody:
 *       description: Parámetros de búsqueda de consenso
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               empresa:
 *                 type: string
 *                 description: Nombre de la empresa (opcional)
 *                 example: "INDURAMA"
 *               anio:
 *                 type: integer
 *                 description: Año de cálculo (opcional)
 *                 example: 2025
 *               mes:
 *                 type: integer
 *                 description: Mes de cálculo (opcional)
 *                 example: 8
 *     responses:
 *       200:
 *         description: Lista de datos de consenso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   empresa:
 *                     type: string
 *                     example: "ACME Corp"
 *                   codigoEmpleado:
 *                     type: integer
 *                     example: 1001
 *                   cedulaColaborador:
 *                     type: string
 *                     example: "1712345678"
 *                   cargo:
 *                     type: string
 *                     example: "Analista"
 *                   anioCalculo:
 *                     type: integer
 *                     example: 2025
 *                   mesCalculo:
 *                     type: integer
 *                     example: 8
 *                   sueldoVariable:
 *                     type: number
 *                     example: 1200.50
 *                   porcentajeCumplimiento:
 *                     type: number
 *                     example: 85.5
 *                   valorComisionPagar:
 *                     type: number
 *                     example: 1020.42
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/information/sith",
    validatorMiddleware(SearchDataConsensoDto,false) as RequestHandler,
    consolidateInformationConsenso.searchDataSource
);

export default router;