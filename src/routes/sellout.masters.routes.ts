import {RequestHandler, Router} from 'express';
import AppDataSource from '../config/data-source';
import {authenticateToken} from '../middleware/auth.middleware';
import {validatorMiddleware} from '../middleware/validator.middleware';
import {SelloutMastersController} from '../controllers/sellout.masters.controller';
import {CreateSelloutStoreMasterDto, UpdateSelloutStoreMasterDto} from '../dtos/sellout.store.master.dto';
import {CreateSelloutProductMasterDto, UpdateSelloutProductMasterDto} from '../dtos/sellout.product.master.dto';

const router = Router();
const selloutMastersController = new SelloutMastersController(AppDataSource);

/**
 * @swagger
 * /api/sellout/masters/store:
 *   post:
 *     tags:
 *       - Maestro Almacen
 *     summary: Crear un nuevo maestro de almacen
 *     description: Crea un nuevo maestro de almacen en el sistema
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
 *               - storeDistributor
 *               - searchStore
 *               - codeStoreSic
 *               - status
 *             properties:
 *               distributor:
 *                 type: string
 *                 description: Distribuidor
 *               storeDistributor:
 *                 type: string
 *                 description: Distribuidor de la tienda
 *               searchStore:
 *                 type: string
 *                 description: Nombre de la tienda
 *               codeStoreSic:
 *                 type: string
 *                 description: Código de la tienda
 *               status:
 *                 type: boolean
 *                 description: Estado de la tienda (ACTIVO, INACTIVO)
 *     responses:
 *       200:
 *         description: Maestro de almacen creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 distributor:
 *                   type: string
 *                 storeDistributor:
 *                   type: string
 *                 searchStore:
 *                   type: string
 *                 codeStoreSic:
 *                   type: string
 *                 status:
 *                   type: boolean

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
    validatorMiddleware(CreateSelloutStoreMasterDto,
        false) as RequestHandler,
    selloutMastersController.createSelloutStoreMaster
);

/**
 * @swagger
 * /api/sellout/masters/store/{id}:
 *   put:
 *     tags:
 *       - Maestro Almacen
 *     summary: Actualizar un maestro de almacen
 *     description: Actualiza un maestro de almacen en el sistema
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
 *               - storeDistributor
 *               - searchStore
 *               - codeStoreSic
 *               - status
 *             properties:
 *               distributor:
 *                 type: string
 *                 description: Distribuidor
 *               storeDistributor:
 *                 type: string
 *                 description: Distribuidor de la tienda
 *               searchStore:
 *                 type: string
 *                 description: Nombre de la tienda
 *               codeStoreSic:
 *                 type: string
 *                 description: Código de la tienda
 *               status:
 *                 type: boolean
 *                 description: Estado de la tienda (ACTIVO, INACTIVO)
 *     responses:
 *       200:
 *         description: Maestro de almacen actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 distributor:
 *                   type: string
 *                 storeDistributor:
 *                   type: string
 *                 searchStore:
 *                   type: string
 *                 codeStoreSic:
 *                   type: string
 *                 status:
 *                   type: boolean

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
    validatorMiddleware(UpdateSelloutStoreMasterDto,
        false) as RequestHandler,
    selloutMastersController.updateSelloutStoreMaster
);

/**   
 * @swagger
 * /api/sellout/masters/batch:
 *   put:
 *     tags:
 *       - Maestro Almacen
 *     summary: Actualizar maestros de almacen en batch
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
 *                   description: ID de la tienda
 *                 distributor:
 *                   type: string
 *                   description: Distribuidor
 *                 storeDistributor:
 *                   type: string
 *                   description: Distribuidor de la tienda
 *                 codeStoreSic:  
 *                   type: number
 *                   description: Código de la tienda
 *     responses: 
 *       200:
 *         description: Maestros de almacen actualizados correctamente
 *       400:
 *         description: Bad request - errores de validación
 *       401:
 *         description: Unauthorized - token inválido 
 */
router.put(
    "/batch",
    authenticateToken,
    selloutMastersController.updateSelloutStoreMastersBatch
);

/**
 * @swagger
 * /api/sellout/masters/store/distribuidor-store-name/{storeSic}:
 *   get:
 *     tags:
 *       - Maestro Almacen
 *     summary: Obtener el distribuidor y nombre de la tienda por el código de almacen sic
 *     description: Obtiene el distribuidor y nombre de la tienda por el código de almacen sic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeSic
 *         required: true   
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Distribuidor y nombre de la tienda obtenidos correctamente
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
router.get(
    "/store/distribuidor-store-name/:storeSic",
    authenticateToken,
    selloutMastersController.getDistribuidorAndStoreNameByStoreSic
);
/**
 * @swagger
 * /api/sellout/masters/store/{id}:
 *   delete:
 *     tags:
 *       - Maestro Almacen
 *     summary: Eliminar un maestro de almacen
 *     description: Elimina un maestro de almacen en el sistema
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
 *         description: Maestro de almacen eliminado correctamente
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
    selloutMastersController.deleteSelloutStoreMaster);

/**
 * @swagger
 * /api/sellout/masters/store/filters:
 *   get:
 *     tags:
 *       - Maestro Almacen
 *     summary: Obtener maestros de almacen filtrados   
 *     description: Busqueda por nombre de distribuidor, distribuidor almacen, busqueda almacen o codigo de almacen sic
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
 *         description: Maestros de almacen filtrados correctamente
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
 *                       storeDistributor:  
 *                         type: string
 *                       searchStore:
 *                         type: string
 *                       codeStoreSic:
 *                         type: string
 *                       status:    
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
    "/store/filters",
    authenticateToken,
    selloutMastersController.getFilteredStoresMaster
);

/**
 * @swagger
 * /api/sellout/masters/store/unique:
 *   get:
 *     tags:
 *       - Maestro Almacen
 *     summary: Obtener maestros de almacen únicos
 *     description: Obtiene maestros de almacen únicos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchDistributor
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: searchStore
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Maestros de almacen únicos obtenidos correctamente
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
 *                   id:
 *                     type: integer
 *                   distributor:
 *                     type: string
 *                   storeDistributor:
 *                     type: string
 *                   searchStore:
 *                     type: string
 *                   codeStoreSic:
 *                     type: string
 *                   status:
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
    "/store/unique",
    authenticateToken,
    selloutMastersController.getUniqueStoresMaster
);

/**
 * @swagger
 * /api/sellout/masters/product:
 *   post:
 *     tags:
 *       - Maestro Producto
 *     summary: Crear un nuevo maestro de producto
 *     description: Crea un nuevo maestro de producto en el sistema
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
 *               - productDistributor
 *               - productStore
 *               - searchProductStore
 *               - codeProductSic
 *               - status
 *             properties:
 *               distributor:
 *                 type: string
 *                 description: Distribuidor
 *               productDistributor:
 *                 type: string
 *                 description: Distribuidor del producto
 *               productStore:
 *                 type: string
 *                 description: Tienda del producto
 *               searchProductStore:
 *                 type: string
 *                 description: Nombre de la tienda del producto
 *               codeProductSic:
 *                 type: string
 *                 description: Código del producto
 *               status:
 *                 type: boolean
 *                 description: Estado del producto (ACTIVO, INACTIVO)
 *     responses:
 *       200:
 *         description: Maestro de producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 distributor:
 *                   type: string
 *                 productDistributor:
 *                   type: string
 *                 productStore:
 *                   type: string
 *                 searchProductStore:
 *                   type: string
 *                 codeProductSic:
 *                   type: string
 *                 status:
 *                   type: boolean

 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/product",
    authenticateToken,
    validatorMiddleware(CreateSelloutProductMasterDto,
        false) as RequestHandler,
    selloutMastersController.createSelloutProductMaster
);

/**
 * @swagger
 * /api/sellout/masters/product/{id}:
 *   put:
 *     tags:
 *       - Maestro Producto
 *     summary: Actualizar un maestro de producto
 *     description: Actualiza un maestro de producto en el sistema
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
 *               - productDistributor
 *               - productStore
 *               - searchProductStore
 *               - codeProductSic
 *               - status
 *             properties:
 *               distributor:
 *                 type: string
 *                 description: Distribuidor
 *               productDistributor:
 *                 type: string
 *                 description: Distribuidor del producto
 *               productStore:
 *                 type: string
 *                 description: Tienda del producto
 *               searchProductStore:
 *                 type: string
 *                 description: Nombre de la tienda del producto
 *               codeProductSic:
 *                 type: string
 *                 description: Código del producto
 *               status:
 *                 type: boolean
 *                 description: Estado del producto (ACTIVO, INACTIVO)
 *     responses:
 *       200:
 *         description: Maestro de producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 distributor:
 *                   type: string
 *                 productDistributor:
 *                   type: string
 *                 productStore:
 *                   type: string
 *                 searchProductStore:
 *                   type: string
 *                 codeProductSic:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.put(
    "/product/:id",
    authenticateToken,
    validatorMiddleware(UpdateSelloutProductMasterDto,
        false) as RequestHandler,
    selloutMastersController.updateSelloutProductMaster
);

/**   
 * @swagger
 * /api/sellout/masters/product/batch:
 *   put:
 *     tags:
 *       - Maestro Producto
 *     summary: Actualizar maestros de producto en batch
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
 *                 - id
 *                 - distributor
 *                 - productDistributor
 *                 - productStore
 *                 - codeProductSic
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID 
 *                 distributor:
 *                   type: string
 *                   description: Distribuidor
 *                 productDistributor:
 *                   type: string
 *                   description: Distribuidor del producto
 *                 productStore:
 *                   type: string
 *                   description: Tienda del producto
 *                 codeProductSic:
 *                   type: string
 *                   description: Código del producto
 *     responses: 
 *       200:
 *         description: Maestros de producto actualizados correctamente
 *       400:
 *         description: Bad request - errores de validación
 *       401:
 *         description: Unauthorized - token inválido 
 */
router.put(
    "/product/batch",
    authenticateToken,
    selloutMastersController.updateSelloutProductMastersBatch
);

/**
 * @swagger
 * /api/sellout/masters/product/model/{productSic}:
 *   get:
 *     tags:
 *       - Maestro Producto
 *     summary: Obtener el modelo de producto por el código de producto sic
 *     description: Obtiene el modelo de producto por el código de producto sic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productSic
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Modelo de producto obtenido correctamente
 *         content:
 *           application/json: 
 *             schema:
 *               type: object
 *               properties:
 *                 idProductSic:
 *                   type: integer
 *                 productModel:    
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:   
 *         description: Error del servidor.
 */
router.get(
    "/product/model/:productSic",
    authenticateToken,
    selloutMastersController.getModelProductSicByProductSic
);

/**
 * @swagger
 * /api/sellout/masters/product/{id}:
 *   delete:
 *     tags:
 *       - Maestro Producto
 *     summary: Eliminar un maestro de producto
 *     description: Elimina un maestro de producto en el sistema
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
 *         description: Maestro de producto eliminado correctamente
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
    "/product/:id",
    authenticateToken,
    selloutMastersController.deleteSelloutProductMaster
);

/**
 * @swagger
 * /api/sellout/masters/product/filters:
 *   get:
 *     tags:
 *       - Maestro Producto
 *     summary: Obtener maestros de producto filtrados   
 *     description: Busqueda por nombre de distribuidor, distribuidor producto, busqueda producto o codigo de producto sic
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
 *         description: Maestros de producto filtrados correctamente
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
 *                       productDistributor:
 *                         type: string
 *                       productStore:
 *                         type: string
 *                       searchProductStore:
 *                         type: string
 *                       codeProductSic:
 *                         type: string
 *                       status:
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
    "/product/filters",
    authenticateToken,
    selloutMastersController.getFilteredProductsMaster
);

/**
 * @swagger
 * /api/sellout/masters/store/bulk:
 *   post:
 *     tags:
 *       - Maestro Almacen
 *     summary: Crear maestros de almacen en masa
 *     description: Crea maestros de almacen en masa en el sistema
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
 *                 distributor:
 *                   type: string
 *                 storeDistributor:    
 *                   type: string
 *                 codeStoreSic:
 *                   type: string
 *                 status:
 *                   type: boolean
 *     responses:   
 *       200:
 *         description: Maestros de almacen creados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer    
 *                       distributor:
 *                         type: string
 *                       storeDistributor:
 *                         type: string
 *                       searchStore:
 *                         type: string
 *                       codeStoreSic:
 *                         type: string 
 *                       status:
 *                         type: boolean
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/store/bulk",
    authenticateToken,
    selloutMastersController.createSelloutStoreMastersBatch
);

/**
 * @swagger
 * /api/sellout/masters/product/bulk:
 *   post:
 *     tags:
 *       - Maestro Producto
 *     summary: Crear maestros de producto en masa
 *     description: Crea maestros de producto en masa en el sistema
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
 *                 distributor:
 *                   type: string
 *                 productDistributor:    
 *                   type: string
 *                 productStore:
 *                   type: string
 *                 codeProductSic:
 *                   type: string
 *                 status:
 *                   type: boolean
 *     responses:   
 *       200:
 *         description: Maestros de producto creados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer    
 *                       distributor:
 *                         type: string
 *                       productDistributor:
 *                         type: string
 *                       productStore:
 *                         type: string
 *                       searchProductStore:
 *                         type: string 
 *                       codeProductSic:
 *                         type: string
 *                       status:
 *                         type: boolean
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/product/bulk",
    authenticateToken,
    selloutMastersController.createSelloutProductMastersBatch
);

export default router;