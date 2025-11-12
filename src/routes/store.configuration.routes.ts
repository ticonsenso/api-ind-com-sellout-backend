import {RequestHandler, Router} from "express";
import {StoreConfigurationController} from "../controllers/store_configuration.controller";
import AppDataSource from "../config/data-source";
import {authenticateToken} from "../middleware/auth.middleware";

import {validatorMiddleware} from "../middleware/validator.middleware";
import {CreateStoreConfigurationDtoIds, UpdateStoreConfigurationDto} from "../dtos/store.configuration.dto";
import {CreateEmployForMonthDto, UpdateEmployForMonthDto} from "../dtos/advisor.configuration.dto";
import {CreateGroupedByAdvisorDto} from "../dtos/grouped.by.advisor.dto";

const router = Router();

const storeConfigurationController = new StoreConfigurationController(
    AppDataSource
);

/**
* @swagger
* /api/store/configuration:
*   post:
*     summary: Crear una nueva configuración de tienda con empleados
*     tags: [Configuración de tienda]
*     description: Crea una nueva configuración de tienda en el sistema con empleados
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - regional
*               - store_name
*               - ceco
*               - code
*               - notes 
*               - storeSizeId
*               - registerDate
*               - companyId
*               - advisorConfiguration
*             properties:
*               regional:
*                 type: string
*               store_name:
*                 type: string
*               ceco:
*                 type: string
*               code:
*                 type: string
*               notes:
*                 type: string
*               registerDate:
*                 type: string
*               storeSizeId:
*                 type: integer
*               companyId:
*                 type: integer
*     responses:
*       201:
*         description: Configuración de tienda creada exitosamente con empleados
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: integer
*                 name:
*                   type: string
*                 description:
*                   type: string
*       400:
*         description: Datos de entrada inválidos
*       401:
*         description: No autorizado
*       500:
*         description: Error del servidor
*/
router.post(
    "/configuration",
    authenticateToken,
    validatorMiddleware(CreateStoreConfigurationDtoIds, false) as RequestHandler,
    storeConfigurationController.createStoreConfiguration
);

/**
* @swagger
* /api/store/configuration:
*   put:
*     summary: Actualizar una configuración de tienda
*     tags: [Configuración de tienda]
*     description: Actualiza una configuración de tienda existente
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: id
*         schema:
*           type: integer
*         description: ID de la configuración de tienda
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - id
*             properties:
*               regional:
*                 type: string
*                 description: Región de la configuración de tienda
*               store_name:
*                 type: string
*                 description: Nombre de la configuración de tienda
*               ceco:
*                 type: string
*                 description: Centro de costos de la configuración de tienda
*               code:
*                 type: string
*                 description: Código de la configuración de tienda
*               storeSizeId:
*                 type: integer
*                 description: ID del tamaño de tienda
*               companyId:
*                 type: integer
*                 description: ID de la empresa
*           example:
*             id: 1
*             regional: "Región de la configuración de tienda"
*             store_name: "Nombre de la configuración de tienda"
*             ceco: "Centro de costos de la configuración de tienda"
*             code: "Código de la configuración de tienda"
*             storeSizeId: 1
*             companyId: 1
*             notes: "Notas de la configuración de tienda"
*             registerDate: "2021-01-01"
*     responses:
*       200:
*         description: Configuración de tienda actualizada exitosamente
*       400:
*         description: Datos de entrada inválidos   
*       401:
*         description: No autorizado
*       500:
*         description: Error del servidor
*/
router.put(
    "/configuration",
    authenticateToken,
    validatorMiddleware(UpdateStoreConfigurationDto, false) as RequestHandler,
    storeConfigurationController.updateStoreConfiguration
);

/**
* @swagger
* /api/store/configuration:
*   delete:
*     summary: Eliminar una configuración de tienda
*     tags: [Configuración de tienda]
*     description: Elimina una configuración de tienda existente
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: id
*         schema:
*           type: integer
*         description: ID de la configuración de tienda
*     responses:
*       200:
*         description: Configuración de tienda eliminada exitosamente  
*       400:
*         description: Datos de entrada inválidos
*       401:
*         description: No autorizado
*       500:
*         description: Error del servidor
*/
router.delete(
    "/configuration",
    authenticateToken,
    storeConfigurationController.deleteStoreConfiguration
);

/**
 * @swagger
 * /api/store/configuration-search:
 *   get:
 *     summary: Obtener todas las configuraciones de tienda con filtros y paginación
 *     tags:
 *       - Configuración de tienda
 *     description: Obtiene todas las configuraciones de tienda, filtrando por regional, nombre, código y tamaño de tienda, con paginación.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filtro para la búsqueda de sincronizaciones de tienda
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: integer
 *         description: ID de la empresa 
 *     responses:
 *       200:
 *         description: Lista de configuraciones de tienda
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
 *                       regional:
 *                         type: string
 *                       storeName:
 *                         type: string
 *                       ceco:
 *                         type: string
 *                         nullable: true
 *                       code:
 *                         type: string
 *                         nullable: true
 *                       storeSizeId:
 *                         type: integer
 *                       companyId:
 *                         type: integer
 *                         nullable: true
 *                       notes:
 *                         type: string
 *                         nullable: true
 *                       registerDate:
 *                         type: string
 *                         format: date
 *                 total:
 *                   type: integer
 *                   description: Total de resultados
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

router.get(
    "/configuration-search",
    authenticateToken,
    storeConfigurationController.searchStoreConfiguration
);

/**
 * @swagger
 * /api/store/ppto:
 *   get:
 *     summary: Obtener presupuesto mensual de tiendas con filtros y paginación
 *     tags:
 *       - Presupuesto de Tienda Marcimex
 *     description: |
 *       Obtiene presupuestos mensuales por tienda, filtrando por búsqueda en nombre, código, ceco y tamaño de tienda, con paginación y filtrado por fecha (año y mes).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto para filtrar por nombre de tienda, código, ceco o tamaño
 *       - in: query
 *         name: calculateDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para filtrar presupuesto por año y mes (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista paginada de presupuestos Marcimex
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
 *                       ceco:
 *                         type: string
 *                       mount:
 *                         type: integer
 *                       year:
 *                         type: integer
 *                       storePpto:
 *                         type: string
 *                       storeConfiguration:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           storeName:
 *                             type: string
 *                           code:
 *                             type: string
 *                           ceco:
 *                             type: string
 *                             nullable: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           storeSize:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                 total:
 *                   type: integer
 *                   description: Total de resultados
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
    "/ppto",
    authenticateToken,
    storeConfigurationController.getFilteredStorePptpMarcimex
);


/**
* @swagger
* /api/store/advisor-configuration:
*   post:
*     summary: Crear una nueva configuración de un empleado para un mes
*     tags: [Configuración de empleado]
*     description: Crea una nueva configuración de un empleado para un mes en el sistema
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - mountName
*               - month
*               - numberEmployees
*               - storeConfigurationId
*             properties:
*               mountName:
*                 type: string
*                 description: Nombre del mes
*               month:
*                 type: number
*                 description: Mes
*               numberEmployees:
*                 type: number
*                 description: Número de empleados
*               storeConfigurationId:
*                 type: number
*                 description: ID de la sincronización de tienda
*     responses:
*       200:
*         description: Configuración de un empleado para un mes creado exitosamente
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: integer
*                 name:
*                   type: string
*                 description:
*                   type: string
*       400:
*         description: Datos de entrada inválidos
*       401:
*         description: No autorizado
*       500:
*         description: Error del servidor
*/
router.post(
    "/advisor-configuration",
    authenticateToken,
    validatorMiddleware(CreateEmployForMonthDto, false) as RequestHandler,
    storeConfigurationController.createAdvisorConfiguration
);

/**
* @swagger
* /api/store/advisor-configuration-multiple:
*   post:
*     summary: Crear configuraciones de varios empleados para un mes
*     tags: [Configuración de empleado]
*     description: Crea múltiples configuraciones de empleados para un mes en el sistema.
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
*                 - mountName
*                 - month
*                 - numberEmployees
*                 - storeConfigurationId
*               properties:
*                 mountName:
*                   type: string
*                   description: Nombre del mes
*                 month:
*                   type: number
*                   description: Mes
*                 numberEmployees:
*                   type: number
*                   description: Número de empleados
*                 storeConfigurationId:
*                   type: number
*                   description: ID de la sincronización de tienda
*     responses:
*       201:
*         description: Configuraciones creadas exitosamente
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 advisorConfigurations:
*                   type: array
*                   items:
*                     type: object
*       400:
*         description: Datos de entrada inválidos
*       401:
*         description: No autorizado
*       500:
*         description: Error del servidor
*/
router.post(
    "/advisor-configuration-multiple",
    authenticateToken,
    storeConfigurationController.createEmployForMonthConfigurations
);

/**
* @swagger
* /api/store/advisor-configuration:
*   put:
*     summary: Actualizar una configuración de un empleado para un mes
*     tags: [Configuración de empleado]
*     description: Actualiza una configuración de un empleado para un mes existente
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: id
*         schema:
*           type: integer
*         description: ID de la configuración de un empleado para un mes
*     requestBody:
*       required: true
*       content:
*         application/json: 
*           schema:
*             type: object
*             required:
*               - id
*             properties:
*               mountName:
*                 type: string
*                 description: Nombre del mes
*               month:
*                 type: number
*                 description: Mes
*               numberEmployees:
*                 type: number
*                 description: Número de empleados
*               storeConfigurationId:
*                 type: number
*                 description: ID de la sincronización de tienda
*     responses:
*       200:
*         description: Configuración de un empleado para un mes actualizada exitosamente
*       400:
*         description: Datos de entrada inválidos
*       401:
*         description: No autorizado
*       500:
*         description: Error del servidor
*/
router.put(
    "/advisor-configuration",
    authenticateToken,
    validatorMiddleware(UpdateEmployForMonthDto, false) as RequestHandler,
    storeConfigurationController.updateAdvisorConfiguration
);

/**
* @swagger
* /api/store/advisor-configuration:
*   delete:
*     summary: Eliminar configuración de un empleado para un mes
*     tags: [Configuración de empleado]
*     description: Elimina la configuración de un empleado para un mes existente
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: id
*         schema:
*           type: integer
*         description: ID de la configuración de un empleado para un mes
*     responses:
*       200:
*         description: Configuración de un empleado para un mes eliminada exitosamente
*       400:
*         description: Datos de entrada inválidos
*       401:
*         description: No autorizado
*       500:
*         description: Error del servidor
*/
router.delete(
    "/advisor-configuration",
    authenticateToken,
    storeConfigurationController.deleteAdvisorConfiguration
);

/**
* @swagger
* /api/store/advisor-configuration-by-store-configuration-id:
*   get:
*     summary: Obtener configuraciones de advisor por ID de sincronización de tienda
*     tags: [Configuración de empleado]
*     description: Obtiene todas las configuraciones de advisor por ID de sincronización de tienda
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: id
*         schema:   
*           type: integer
*         description: ID de la sincronización de tienda
*     responses:
*       200:
*         description: Configuraciones de advisor obtenidas exitosamente
*       401:
*         description: No autorizado            
*       500:
*         description: Error del servidor
*/
router.get(
    "/advisor-configuration-by-store-configuration-id",
    authenticateToken,
    storeConfigurationController.getAdvisorConfigurationByStoreConfigurationId
);

/**
 * @swagger
 * /api/store/store-configuration/batch:
 *   post:
 *     summary: Crear múltiples configuraciones de tienda con asesores por mes
 *     tags: [Configuración de tienda]
 *     description: Crea múltiples configuraciones de tienda junto con la información de asesores para cada mes.
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
 *                 - storeName
 *                 - code
 *                 - ceco
 *                 - storeSizeId
 *                 - calculateDate
 *                 - advisorConfiguration
 *               properties:
 *                 storeName:
 *                   type: string
 *                 code:
 *                   type: string
 *                 regional:
 *                   type: string
 *                 ceco:
 *                   type: string
 *                 notes:
 *                   type: string
 *                 storeSizeId:
 *                   type: string
 *                 companyId:
 *                   type: number
 *                 registerDate:
 *                   type: string
 *                   format: date
 *                 advisorConfiguration:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required:
 *                       - mountName
 *                       - month
 *                       - numberEmployees
 *                     properties:
 *                       mountName:
 *                         type: string
 *                       month:
 *                         type: number
 *                       numberEmployees:
 *                         type: number
 *     responses:
 *       201:
 *         description: Configuraciones creadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: number
 *                 errorCount:
 *                   type: number
 *                 smsErrors:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

router.post(
    "/store-configuration/batch",
    authenticateToken,
    storeConfigurationController.createStoreConfigurationBatch
);

/**
 * @swagger
 * /api/store/grouped-store:
 *   post:
 *     summary: Crear agrupación de tiendas principal/secundarias
 *     tags:
 *       - Agrupación de Tiendas Marcimex
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storePrincipal:
 *                 type: integer
 *                 example: 1
 *               storeSecondaryIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 3, 4]
 *     responses:
 *       201:
 *         description: Agrupación creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
    "/grouped-store",
    authenticateToken,
    storeConfigurationController.createGroupedByStore
);

/**
 * @swagger
 * /api/store/grouped-store:
 *   get:
 *     summary: Obtener agrupaciones de tiendas
 *     tags:
 *       - Agrupación de Tiendas Marcimex
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: storeId
 *         schema:
 *           type: integer
 *         description: ID de la tienda principal para filtrar agrupaciones
 *       - in: query
 *         name: calculateDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de cálculo
 *     responses:
 *       200:
 *         description: Lista de agrupaciones de tiendas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GroupedByStoreResponseDto'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
    "/grouped-store",
    authenticateToken,
    storeConfigurationController.getGroupedByStore
);

/**
* @swagger
* /api/store/grouped-store:
*   delete:
*     summary: Eliminar una agrupación de tiendas
*     tags: [Agrupación de Tiendas Marcimex]
*     description: Elimina una agrupación de tiendas existente
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: id
*         schema:
*           type: integer
*         description: ID de la agrupación de tiendas
*     responses:
*       200:
*         description: Agrupación de tiendas eliminada exitosamente
*       400:
*         description: Datos de entrada inválidos
*       401:
*         description: No autorizado
*       500:
*         description: Error del servidor
*/
router.delete(
    "/grouped-store",
    authenticateToken,
    storeConfigurationController.deleteGroupedByStore
);

/**
 * @swagger
 * /api/store/grouped-advisor:
 *   post:
 *     summary: Crear agrupación de asesores por tienda
 *     tags:
 *       - Agrupación de Asesores por Tienda
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storePrincipal:
 *                 type: integer
 *                 example: 1
 *               storeSecondaryIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 3, 4]
 *     responses:
 *       201:
 *         description: Agrupación creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
    "/grouped-advisor",
    authenticateToken,
    validatorMiddleware(CreateGroupedByAdvisorDto, false) as RequestHandler,
    storeConfigurationController.createGroupedByAdvisor
);

/**
 * @swagger
 * /api/store/grouped-advisor:
 *   get:
 *     summary: Obtener agrupaciones de asesores por tienda
 *     tags:
 *       - Agrupación de Asesores por Tienda
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: storeId
 *         schema:
 *           type: integer
 *         description: ID de la tienda principal para filtrar agrupaciones
 *     responses:
 *       200:
 *         description: Lista de agrupaciones de asesores por tiendas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GroupedByAdvisorResponseDto'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
    "/grouped-advisor",
    authenticateToken,
    storeConfigurationController.getGroupedByAdvisor
);

/**
* @swagger
* /api/store/grouped-advisor:
*   delete:
*     summary: Eliminar una agrupación de asesores
*     tags: [Agrupación de Asesores por Tienda]
*     description: Elimina una agrupación de asesores existente
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: id
*         schema:
*           type: integer
*         description: ID de la agrupación de asesores
*     responses:
*       200:
*         description: Agrupación de asesores eliminada exitosamente
*       400:
*         description: Datos de entrada inválidos
*       401:
*         description: No autorizado
*       500:
*         description: Error del servidor
*/
router.delete(
    "/grouped-advisor",
    authenticateToken,
    storeConfigurationController.deleteGroupedByAdvisor
);

export default router;
