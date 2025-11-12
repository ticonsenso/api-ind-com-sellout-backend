import {RequestHandler, Router} from 'express';
import AppDataSource from '../config/data-source';
import {authenticateToken} from '../middleware/auth.middleware';
import {validatorMiddleware} from '../middleware/validator.middleware';
import {CreateProductSicDto, UpdateProductSicDto} from '../dtos/product.sic.dto';
import {StoresController} from '../controllers/stores.controller';
import {CreateStoreSicDto, UpdateStoreSicDto} from '../dtos/stores.sic.dto';
import {CreateSelloutZoneDto, UpdateSelloutZoneDto} from '../dtos/selleout.zone.dto';

const router = Router();
const storesController = new StoresController(AppDataSource);

/**
 * @swagger
 * /api/stores:
 *   post:
 *     tags:
 *       - Almacenes Sic
 *     summary: Crear un nuevo almacen
 *     description: Crea un nuevo almacen en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeCode
 *               - storeName
 *               - distributor2
 *               - distributorSap
 *               - endChannel
 *               - wholesaleRegion
 *               - city
 *               - region
 *               - category
 *               - province
 *               - status   
 *               - zone
 *             properties:
 *               storeCode:
 *                 type: string
 *                 description: Código de la tienda
 *               storeName:
 *                 type: string
 *                 description: Nombre de la tienda
 *               distributor2:
 *                 type: string
 *                 description: Distribuidor 2
 *               distributorSap:
 *                 type: string
 *                 description: Distribuidor SAP
 *               endChannel:
 *                 type: string
 *                 description: Canal de venta
 *               wholesaleRegion:
 *                 type: string
 *                 description: Región mayorista
 *               city:
 *                 type: string
 *                 description: Ciudad
 *               region:
 *                 type: string
 *                 description: Región
 *               category:
 *                 type: string
 *                 description: Categoría
 *               province:
 *                 type: string
 *                 description: Provincia
 *               status:
 *                 type: boolean
 *                 description: Estado
 *               zone:
 *                 type: string
 *                 description: Zona
 *     responses:
 *       200:
 *         description: Almacen creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 storeCode:
 *                   type: string
 *                 storeName:
 *                   type: string
 *                 distributor2:
 *                   type: string
 *                 distributorSap:
 *                   type: string
 *                 endChannel:
 *                   type: string
 *                 wholesaleRegion:
 *                   type: string
 *                 city:
 *                   type: string
 *                 region:
 *                   type: string
 *                 category:
 *                   type: string
 *                 province:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 zone:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/",
    authenticateToken,
    validatorMiddleware(CreateStoreSicDto,
        false) as RequestHandler,
    storesController.createStores
);

/**
 * @swagger
 * /api/stores/bulk:
 *   post:
 *     tags:
 *       - Almacenes Sic
 *     summary: Crear almacenes en masa
 *     description: Crea múltiples almacenes en el sistema. Cada elemento del arreglo debe seguir la estructura de `CreateStoreSicDto`.
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
 *                 - storeCode
 *                 - storeName
 *                 - distributor2
 *                 - distributorSap
 *                 - endChannel
 *                 - wholesaleRegion
 *                 - city
 *                 - region
 *                 - province
 *                 - category
 *               properties:
 *                 storeCode:
 *                   type: integer
 *                   description: Código numérico de la tienda
 *                 storeName:
 *                   type: string
 *                   description: Nombre de la tienda
 *                 storeAddress:
 *                   type: string
 *                   description: Dirección de la tienda
 *                 distributor:
 *                   type: string
 *                   description: Distribuidor (opcional)
 *                 distributor2:
 *                   type: string
 *                   description: Distribuidor 2
 *                 phone:
 *                   type: string
 *                   description: Teléfono
 *                 agencyManager:
 *                   type: string
 *                   description: Gerente de agencia
 *                 size:
 *                   type: string
 *                   description: Tamaño
 *                 ubication:
 *                   type: string
 *                   description: Ubicación
 *                 sales:
 *                   type: number
 *                   description: Ventas (numérico)
 *                 channel:
 *                   type: string
 *                   description: Canal de venta
 *                 distributorSap:
 *                   type: string
 *                   description: Código distribuidor SAP
 *                 endChannel:
 *                   type: string
 *                   description: Canal final
 *                 supervisor:
 *                   type: string
 *                   description: Supervisor
 *                 wholesaleRegion:
 *                   type: string
 *                   description: Región mayorista
 *                 city:
 *                   type: string
 *                   description: Ciudad
 *                 region:
 *                   type: string
 *                   description: Región
 *                 province:
 *                   type: string
 *                   description: Provincia
 *                 category:
 *                   type: string
 *                   description: Categoría
 *                 zone:
 *                   type: string
 *                   description: Zona
 *                 status:
 *                   type: boolean
 *                   description: Estado (activo/inactivo)
 *     responses:
 *       200:
 *         description: Almacenes creados correctamente
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
 *                       storeCode:
 *                         type: integer
 *                       storeName:
 *                         type: string
 *                       storeAddress:
 *                         type: string
 *                       distributor:
 *                         type: string
 *                       distributor2:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       agencyManager:
 *                         type: string
 *                       size:
 *                         type: string
 *                       ubication:
 *                         type: string
 *                       sales:
 *                         type: number
 *                       channel:
 *                         type: string
 *                       distributorSap:
 *                         type: string
 *                       endChannel:
 *                         type: string
 *                       supervisor:
 *                         type: string
 *                       wholesaleRegion:
 *                         type: string
 *                       city:
 *                         type: string
 *                       region:
 *                         type: string
 *                       province:
 *                         type: string
 *                       category:
 *                         type: string
 *                       zone:
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
    "/bulk",
    authenticateToken,
    storesController.createStoresBatch
);

/**
 * @swagger
 * /api/stores/{id}:
 *   put:
 *     tags:
 *       - Almacenes Sic
 *     summary: Actualizar un almacen
 *     description: Actualiza un almacen en el sistema
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
 *               - storeCode
 *               - storeName
 *               - distributor2
 *               - distributorSap
 *               - endChannel
 *               - wholesaleRegion
 *               - city
 *               - region
 *               - category
 *               - province
 *               - status
 *               - zone
 *             properties:
 *               storeCode:
 *                 type: string
 *                 description: Código de la tienda
 *               storeName:
 *                 type: string
 *                 description: Nombre de la tienda
 *               distributor2:
 *                 type: string
 *                 description: Distribuidor 2
 *               distributorSap:
 *                 type: string
 *                 description: Distribuidor SAP
 *               endChannel:
 *                 type: string
 *                 description: Canal de venta
 *               wholesaleRegion:
 *                 type: string
 *                 description: Región mayorista
 *               city:
 *                 type: string
 *                 description: Ciudad
 *               region:
 *                 type: string
 *                 description: Región
 *               category:
 *                 type: string
 *                 description: Categoría
 *               province:
 *                 type: string
 *                 description: Provincia
 *               status:
 *                 type: boolean
 *                 description: Estado
 *               zone:
 *                 type: string
 *                 description: Zona
 *     responses:
 *       200:
 *         description: Almacen actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 storeCode:
 *                   type: string
 *                 storeName:
 *                   type: string
 *                 distributor2:
 *                   type: string
 *                 distributorSap:
 *                   type: string
 *                 endChannel:
 *                   type: string
 *                 wholesaleRegion:
 *                   type: string
 *                 city:
 *                   type: string
 *                 region:
 *                   type: string
 *                 category:
 *                   type: string
 *                 province:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 zone:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.put(
    "/:id",
    authenticateToken,
    validatorMiddleware(UpdateStoreSicDto,
        false) as RequestHandler,
    storesController.updateStores
);

/**
 * @swagger
 * /api/stores/{id}:
 *   delete:
 *     tags:
 *       - Almacenes Sic
 *     summary: Eliminar un almacen
 *     description: Elimina un almacen en el sistema
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
 *         description: Almacen eliminado correctamente
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
    "/:id",
    authenticateToken,
    storesController.deleteStores);

/**
 * @swagger
 * /api/stores/filters:
 *   post:
 *     tags:
 *       - Almacenes Sic
 *     summary: Obtener almacenes filtrados   
 *     description: Busqueda de almacenes codigo de almacen, nombre de almacen, ciudad, region, provincia
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
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:  
 *               zone:
 *                 type: boolean
 *                 description: Zona
 *     responses:
 *       200:
 *         description: Almacenes filtrados correctamente
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
 *                       storeCode:
 *                         type: string
 *                       storeName:  
 *                         type: string
 *                       distributor2:
 *                         type: string
 *                       distributorSap:
 *                         type: string
 *                       endChannel:
 *                         type: string
 *                       wholesaleRegion:
 *                         type: integer
 *                       city:
 *                         type: string
 *                       region:
 *                         type: string
 *                       category:
 *                         type: string
 *                       province:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       zone:
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
    "/filters",
    authenticateToken,
    storesController.getStores
);

/**
 * @swagger
 * /api/stores/product-sic:
 *   post:
 *     tags:
 *       - Productos SIC
 *     summary: Crear un nuevo producto SIC
 *     description: Crea un nuevo producto SIC en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jdeCode
 *               - jdeName
 *               - companyLine
 *               - category
 *               - subCategory
 *               - marModelLm
 *               - designLine
 *               - brand
 *               - discontinued
 *               - equivalentProId
 *               - equivalent
 *               - validity
 *             properties:
 *               jdeCode:
 *                 type: string
 *                 description: Código JDE
 *               jdeName:
 *                 type: string
 *                 description: Nombre JDE
 *               companyLine:
 *                 type: string
 *                 description: Línea de la empresa
 *               category:
 *                 type: string
 *                 description: Categoría
 *               subCategory:
 *                 type: string
 *                 description: Subcategoría
 *               marModelLm:
 *                 type: string
 *                 description: Modelo de marca
 *               designLine:
 *                 type: string
 *                 description: Línea de diseño
 *               brand:
 *                 type: string
 *                 description: Marca
 *               discontinued:
 *                 type: boolean
 *                 description: Discontinuado
 *               equivalentProId:
 *                 type: string
 *                 description: Código equivalente
 *               equivalent:
 *                 type: string
 *                 description: Equivalente
 *               validity:
 *                 type: string
 *                 description: Válido
 *     responses:
 *       200:
 *         description: Producto SIC creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 jdeCode:
 *                   type: string
 *                 jdeName:
 *                   type: string
 *                 companyLine:
 *                   type: string
 *                 category:
 *                   type: string
 *                 subCategory:
 *                   type: string
 *                 marModelLm:
 *                   type: string
 *                 designLine:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 discontinued:
 *                   type: boolean
 *                 equivalentProId:
 *                   type: string
 *                 equivalent:
 *                   type: string
 *                 validity:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/product-sic",
    authenticateToken,
    validatorMiddleware(CreateProductSicDto,
        false) as RequestHandler,
    storesController.createProductSic
);

/**
* @swagger
* /api/stores/product-sic/bulk:
*   post:
*     tags:
*       - Productos SIC
*     summary: Crear productos SIC en masa
*     description: Crea productos SIC en masa en el sistema
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
*                 idProductSic:
*                   type: integer
*                   description: ID del producto SIC (opcional)
*                 jdeCode:
*                   type: string
*                   description: Código JDE
*                 jdeName:
*                   type: string
*                   description: Nombre JDE
*                 imeName:
*                   type: string
*                   description: Nombre alterno
*                 sapCode:
*                   type: string
*                   description: Código SAP
*                 sapName:
*                   type: string
*                   description: Nombre SAP
*                 companyLine:
*                   type: string
*                   description: Distribuidor / línea de la empresa
*                 category:
*                   type: string
*                   description: Categoría
*                 subCategory:
*                   type: string
*                   description: Subcategoría
*                 marModelLm:
*                   type: string
*                   description: Región / modelo de marca
*                 model:
*                   type: string
*                   description: Modelo (opcional)
*                 designLine:
*                   type: string
*                   description: Línea de diseño
*                 brand:
*                   type: string
*                   description: Marca
*                 discontinued:
*                   type: boolean
*                   description: Discontinuado
*                 status:
*                   type: boolean
*                   description: Estado (activo/inactivo)
*                 sheetVisit:
*                   type: string
*                   description: Sheet visit
*                 equivalentProId:
*                   type: string
*                   description: Equivalente Pro ID
*                 equivalent:
*                   type: string
*                   description: Equivalente
*                 validity:
*                   type: string
*                   description: Vigencia (opcional)
*                 repeatedNumbers:
*                   type: string
*                   description: Repeated numbers (opcional)
*     responses:
*       200:
*         description: Productos SIC creados correctamente
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
*                         description: ID creado
*                       idProductSic:
*                         type: integer
*                         description: ID del producto SIC (si aplica)
*                       jdeCode:
*                         type: string
*                       jdeName:
*                         type: string
*                       imeName:
*                         type: string
*                       sapCode:
*                         type: string
*                       sapName:
*                         type: string
*                       companyLine:
*                         type: string
*                       category:
*                         type: string
*                       subCategory:
*                         type: string
*                       marModelLm:
*                         type: string
*                       model:
*                         type: string
*                       designLine:
*                         type: string
*                       brand:
*                         type: string
*                       discontinued:
*                         type: boolean
*                       status:
*                         type: boolean
*                       sheetVisit:
*                         type: string
*                       equivalentProId:
*                         type: string
*                       equivalent:
*                         type: string
*                       validity:
*                         type: string
*                       repeatedNumbers:
*                         type: string
*       400:
*         description: Datos de entrada inválidos.
*       401:
*         description: No autorizado.
*       500:
*         description: Error del servidor.
*/
router.post(
    "/product-sic/bulk",
    authenticateToken,
    storesController.createProductsSic
);

/**
 * @swagger
 * /api/stores/product-sic/{id}:
 *   put:
 *     tags:
 *       - Productos SIC
 *     summary: Actualizar un producto SIC
 *     description: Actualiza un producto SIC en el sistema
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
 *               - jdeCode
 *               - jdeName
 *               - companyLine
 *               - category
 *               - subCategory
 *               - marModelLm
 *               - designLine
 *               - brand
 *               - discontinued
 *               - equivalentProId
 *               - equivalent
 *               - validity
 *             properties:
 *               jdeCode:
 *                 type: string
 *                 description: Código JDE
 *               jdeName:
 *                 type: string
 *                 description: Nombre JDE
 *               companyLine:
 *                 type: string
 *                 description: Línea de la empresa
 *               category:
 *                 type: string
 *                 description: Categoría
 *               subCategory:
 *                 type: string
 *                 description: Subcategoría
 *               marModelLm:
 *                 type: string
 *                 description: Modelo de marca
 *               designLine:
 *                 type: string
 *                 description: Línea de diseño
 *               brand:
 *                 type: string
 *                 description: Marca
 *               discontinued:
 *                 type: boolean
 *                 description: Discontinuado
 *               equivalentProId:
 *                 type: string
 *                 description: Código equivalente
 *               equivalent:
 *                 type: string
 *                 description: Equivalente
 *               validity:
 *                 type: string
 *                 description: Válido
 *     responses:
 *       200:
 *         description: Producto SIC actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 jdeCode:
 *                   type: string
 *                 jdeName:
 *                   type: string
 *                 companyLine:
 *                   type: string
 *                 category:
 *                   type: string
 *                 subCategory:
 *                   type: string
 *                 marModelLm:
 *                   type: string
 *                 designLine:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 discontinued:
 *                   type: boolean
 *                 equivalentProId:
 *                   type: string
 *                 equivalent:
 *                   type: string
 *                 validity:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.put(
    "/product-sic/:id",
    authenticateToken,
    validatorMiddleware(UpdateProductSicDto,
        false) as RequestHandler,
    storesController.updateProductSic
);

/**
 * @swagger
 * /api/stores/product-sic/{id}:
 *   delete:
 *     tags:
 *       - Productos SIC
 *     summary: Eliminar un producto SIC
 *     description: Elimina un producto SIC en el sistema
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
 *         description: Producto SIC eliminado correctamente
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
    "/product-sic/:id",
    authenticateToken,
    storesController.deleteProductSic);

/**
 * @swagger
 * /api/stores/product-sic/filters:
 *   get:
 *     tags:
 *       - Productos SIC
 *     summary: Obtener productos SIC filtrados   
 *     description: Busqueda de productos SIC jdeCode, jdeName, companyLine, category
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
 *         description: Productos SIC filtrados correctamente
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
 *                       jdeCode:
 *                         type: string
 *                       jdeName:  
 *                         type: string
 *                       companyLine:
 *                         type: string
 *                       category:
 *                         type: string
 *                       subCategory:
 *                         type: string
 *                       marModelLm:
 *                         type: string
 *                       designLine:
 *                         type: string
 *                       brand:
 *                         type: string
 *                       discontinued:
 *                         type: boolean
 *                       equivalentProId:
 *                         type: string
 *                       equivalent:
 *                         type: string
 *                       validity:
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
    "/product-sic/filters",
    authenticateToken,
    storesController.getProductSic
);

/**
 * @swagger
 * /api/stores/sellout-zone:
 *   post:
 *     tags:
 *       - Sellout Zones
 *     summary: Crear una nueva zona de sellout
 *     description: Crea una nueva zona de sellout en el sistema
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
 *               - storesId
 *               - groupName
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la zona de sellout
 *               storesId:
 *                 type: integer
 *                 description: ID de la tienda
 *               groupName:
 *                 type: string
 *                 description: Nombre del grupo
 *               status:
 *                 type: boolean
 *                 description: Estado
 *     responses:
 *       200:
 *         description: Zona de sellout creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 storesId:
 *                   type: integer
 *                 groupName:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/sellout-zone",
    authenticateToken,
    validatorMiddleware(CreateSelloutZoneDto,
        false) as RequestHandler,
    storesController.createSelloutZone
);

/**
 * @swagger
 * /api/stores/sellout-zone/{id}:
 *   put:
 *     tags:
 *       - Sellout Zones
 *     summary: Actualizar una zona de sellout
 *     description: Actualiza una zona de sellout en el sistema
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
 *               - storesId
 *               - groupName
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la zona de sellout
 *               storesId:
 *                 type: string
 *                 description: ID de la tienda
 *               groupName:
 *                 type: string
 *                 description: Nombre del grupo
 *               status:
 *                 type: boolean
 *                 description: Estado
 *     responses:
 *       200:
 *         description: Zona de sellout actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 storesId:
 *                   type: string
 *                 groupName:
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
    "/sellout-zone/:id",
    authenticateToken,
    validatorMiddleware(UpdateSelloutZoneDto,
        false) as RequestHandler,
    storesController.updateSelloutZone
);

/**
 * @swagger
 * /api/stores/sellout-zone/{id}:
 *   delete:
 *     tags:
 *       - Sellout Zones
 *     summary: Eliminar una zona de sellout
 *     description: Elimina una zona de sellout en el sistema
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
 *         description: Zona de sellout eliminada correctamente
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
    "/sellout-zone/:id",
    authenticateToken,
    storesController.deleteSelloutZone);

/**
 * @swagger
 * /api/stores/sellout-zone/filters:
 *   get:
 *     tags:
 *       - Sellout Zones
 *     summary: Obtener zonas de sellout filtradas   
 *     description: Busqueda de zonas de sellout por nombre y nombre del grupo
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
 *         description: Zonas de sellout filtradas correctamente
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
 *                       storesId:  
 *                         type: string
 *                       groupName:
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
    "/sellout-zone/filters",
    authenticateToken,
    storesController.getSelloutZone
);

export default router;