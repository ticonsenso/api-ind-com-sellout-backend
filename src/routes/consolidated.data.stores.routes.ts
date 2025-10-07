
import { Router, RequestHandler } from 'express';
import AppDataSource from '../config/data-source';
import { authenticateToken } from '../middleware/auth.middleware';
import { validatorMiddleware } from '../middleware/validator.middleware';
import { ConsolidatedDataStoresController } from '../controllers/consolidated.data.stores.controller';
import { CreateConsolidatedDataStoresDto, UpdateConsolidatedDataStoresDto } from '../dtos/consolidated.data.stores.dto';
import { ConsolidateInformationConsenso } from '../controllers/consolidate.information.consenso';
import { SearchDataConsensoDto } from '../dtos/search.data.consenso';

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
 *     summary: Actualizar una configuración de datos consolidados de tiendas
 *     description: Actualiza una configuración de datos consolidados de tiendas en el sistema
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
 *                 description: Distribuidor
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
 *         description: Datos consolidados de tiendas actualizados correctamente
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