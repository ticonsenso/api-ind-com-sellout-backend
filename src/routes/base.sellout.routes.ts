import {RequestHandler, Router} from 'express';
import AppDataSource from '../config/data-source';
import {BaseSelloutController} from '../controllers/base.sellout.controller';
import {CreateBasePptoSelloutDto, UpdateBasePptoSelloutDto} from '../dtos/base.ppto.sellout.dto';
import {authenticateToken} from '../middleware/auth.middleware';
import {validatorMiddleware} from '../middleware/validator.middleware';
import {CreateBaseValuesSelloutDto, UpdateBaseValuesSelloutDto} from '../dtos/base.values.sellout.dto';
import {CreateRotationBaseDto} from '../dtos/rotation.base.dto';
import {RotationBaseController} from '../controllers/rotation.base.controller';

const router = Router();
const baseSelloutController = new BaseSelloutController(AppDataSource);
const rotationBaseController = new RotationBaseController(AppDataSource);

/**
 * @swagger
 * /api/base/sellout/ppto:
 *   post:
 *     tags:
 *       - Base de ppto de sellout
 *     summary: Crear un nuevo base de ppto de sellout
 *     description: Crea un nuevo base de ppto de sellout en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codeSupervisor
 *               - codeZone
 *               - storeCode
 *               - promotorCode
 *               - equivalentCode
 *               - units
 *               - unitBase
 *             properties:
 *               codeSupervisor:
 *                 type: string
 *                 description: Código de supervisor
 *               codeZone:
 *                 type: string
 *                 description: Código de zona
 *               storeCode:
 *                 type: string
 *                 description: Código de tienda
 *               promotorCode:
 *                 type: string
 *                 description: Código de promotor
 *               codePromotorPi:
 *                 type: string
 *                 description: Código de promotor Pi
 *               codePromotorTv:
 *                 type: string
 *                 description: Código de promotor TV
 *               equivalentCode:
 *                 type: string
 *                 description: Código equivalente
 *               units:
 *                 type: number
 *                 description: Unidades
 *               unitBase:
 *                 type: number
 *                 description: Unidad base
 *     responses:
 *       200:
 *         description: Base de ppto de sellout creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 codeSupervisor:
 *                   type: string
 *                 codeZone:
 *                   type: string
 *                 storeCode:
 *                   type: string
 *                 promotorCode:
 *                   type: string
 *                 codePromotorPi:
 *                   type: string
 *                 codePromotorTv:
 *                   type: string
 *                 equivalentCode:
 *                   type: string
 *                 units:
 *                   type: number
 *                 unitBase:
 *                   type: number
 *                 idEmployeeSupervisor:
 *                   type: integer
 *                 idCodeZone:
 *                   type: integer
 *                 idStore:
 *                   type: integer
 *                   format: date
 *                   example: 2025-01-01
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/ppto",
    authenticateToken,
    validatorMiddleware(CreateBasePptoSelloutDto,
        false) as RequestHandler,
    baseSelloutController.createBasePptoSellout
);

/**
 * @swagger
 * /api/base/sellout/ppto/bulk:
 *   post:
 *     tags:
 *       - Base de ppto de sellout
 *     summary: Crear bases de ppto de sellout en masa
 *     description: Crea bases de ppto de sellout en masa en el sistema
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
 *                 codeSupervisor:
 *                   type: string
 *                 codeZone:
 *                   type: string
 *                 storeCode:
 *                   type: string
 *                 promotorCode:
 *                   type: string
 *                 codePromotorPi:
 *                   type: string
 *                 codePromotorTv:
 *                   type: string
 *                 equivalentCode:
 *                   type: string
 *                 units:
 *                   type: number
 *                 unitBase:
 *                   type: number
 *     responses:
 *       200:
 *         description: Bases de ppto de sellout creadas correctamente
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/ppto/bulk",
    authenticateToken,
    baseSelloutController.createBasePptoSelloutBatch
);

/**
 * @swagger
 * /api/base/sellout/ppto/{id}:
 *   put:
 *     tags:
 *       - Base de ppto de sellout
 *     summary: Actualizar un base de ppto de sellout
 *     description: Actualiza un base de ppto de sellout en el sistema
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
 *               - codeSupervisor
 *               - codeZone
 *               - storeCode
 *               - promotorCode
 *               - units
 *               - unitBase
 *             properties:
 *               codeSupervisor:
 *                 type: string
 *                 description: Código de supervisor
 *               codeZone:
 *                 type: string
 *                 description: Código de zona
 *               storeCode:
 *                 type: string
 *                 description: Código de tienda
 *               promotorCode:
 *                 type: string
 *                 description: Código de promotor
 *               codePromotorPi:
 *                 type: string
 *                 description: Código de promotor Pi
 *               codePromotorTv:
 *                 type: string
 *                 description: Código de promotor TV
 *               equivalentCode:
 *                 type: string
 *                 description: Código equivalente
 *               units:
 *                 type: number
 *                 description: Unidades
 *               unitBase:
 *                 type: number
 *                 description: Unidad base
 *     responses:
 *       200:
 *         description: Base de ppto de sellout creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 codeSupervisor:
 *                   type: string
 *                 codeZone:
 *                   type: string
 *                 storeCode:
 *                   type: string
 *                 promotorCode:
 *                   type: string
 *                 codePromotorPi:
 *                   type: string
 *                 codePromotorTv:
 *                   type: string
 *                 equivalentCode:
 *                   type: string
 *                 units:
 *                   type: number
 *                 unitBase:
 *                   type: number
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.put(
    "/ppto/:id",
    authenticateToken,
    validatorMiddleware(UpdateBasePptoSelloutDto,
        false) as RequestHandler,
    baseSelloutController.updateBasePptoSellout
);

/**
 * @swagger
 * /api/base/sellout/ppto/{id}:
 *   delete:
 *     tags:
 *       - Base de ppto de sellout
 *     summary: Eliminar un base de ppto de sellout
 *     description: Elimina un base de ppto de sellout en el sistema
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
 *         description: Base de ppto de sellout eliminado correctamente
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
    "/ppto/:id",
    authenticateToken,
    baseSelloutController.deleteBasePptoSellout
);

/**
 * @swagger
 * /api/base/sellout/ppto/filters:
 *   get:
 *     tags:
 *       - Base de ppto de sellout
 *     summary: Obtener bases de ppto de sellout filtrados   
 *     description: Busqueda de bases de ppto de sellout codigo de supervisor, codigo de zona, codigo de tienda, codigo de promotor, codigo de promotor Pi, codigo de promotor TV, unidad base, fecha de cálculo
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
 *         description: Bases de ppto de sellout filtrados correctamente
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
 *                       codeSupervisor:
 *                         type: string
 *                       codeZone:  
 *                         type: string
 *                       storeCode:
 *                         type: string
 *                       promotorCode:
 *                         type: string
 *                       codePromotorPi:
 *                         type: string
 *                       codePromotorTv:
 *                         type: string
 *                       equivalentCode:
 *                         type: string
 *                       unitBase:
 *                         type: number
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
    "/ppto/filters",
    authenticateToken,
    baseSelloutController.getBasePptoSellout
);

// Base de valores de sellout

/**
 * @swagger
 * /api/base/sellout/values:
 *   post:
 *     tags:
 *       - Base de valores de sellout
 *     summary: Crear un nuevo base de valores de sellout
 *     description: Crea un nuevo base de valores de sellout en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - model
 *             properties:
 *               brand:
 *                 type: string
 *                 description: Marca
 *               model:
 *                 type: string
 *                 description: Modelo
 *               unitBaseUnitary:
 *                 type: string
 *                 description: Unidad base unitaria
 *               pvdUnitary:
 *                 type: string
 *                 description: PVD unitario

 *     responses:
 *       200:
 *         description: Base de valores de sellout creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 brand:
 *                   type: string
 *                 model:
 *                   type: string
 *                 unitBaseUnitary:
 *                   type: string
 *                 pvdUnitary:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/values",
    authenticateToken,
    validatorMiddleware(CreateBaseValuesSelloutDto,
        false) as RequestHandler,
    baseSelloutController.createBaseValuesSellout
);

/**
 * @swagger
 * /api/base/sellout/values/bulk:
 *   post:
 *     tags:
 *       - Base de valores de sellout
 *     summary: Crear bases de valores de sellout en masa
 *     description: Crea bases de valores de sellout en masa en el sistema
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
 *                 brand:
 *                   type: string
 *                 model:
 *                   type: string
 *                 unitBaseUnitary:
 *                   type: string
 *                 pvdUnitary:
 *                   type: string
 *     responses:
 *       200:
 *         description: Bases de valores de sellout creadas correctamente
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/values/bulk",
    authenticateToken,
    baseSelloutController.createBaseValuesSelloutBatch
);

/**
 * @swagger
 * /api/base/sellout/values/{id}:
 *   put:
 *     tags:
 *       - Base de valores de sellout
 *     summary: Actualizar un base de valores de sellout
 *     description: Actualiza un base de valores de sellout en el sistema
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
 *               - brand
 *               - model
 *               - calculateDate
 *             properties:
 *               brand:
 *                 type: string
 *                 description: Marca
 *               model:
 *                 type: string
 *                 description: Modelo
 *               unitBaseUnitary:
 *                 type: string
 *                 description: Unidad base unitaria
 *               pvdUnitary:
 *                 type: string
 *                 description: PVD unitario
 *     responses:
 *       200:
 *         description: Base de valores de sellout creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 brand:
 *                   type: string
 *                 model:
 *                   type: string
 *                 unitBaseUnitary:
 *                   type: string
 *                 pvdUnitary:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.put(
    "/values/:id",
    authenticateToken,
    validatorMiddleware(UpdateBaseValuesSelloutDto,
        false) as RequestHandler,
    baseSelloutController.updateBaseValuesSellout
);

/**
 * @swagger
 * /api/base/sellout/values/{id}:
 *   delete:
 *     tags:
 *       - Base de valores de sellout
 *     summary: Eliminar un base de valores de sellout
 *     description: Elimina un base de valores de sellout en el sistema
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
 *         description: Base de valores de sellout eliminado correctamente
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
    "/values/:id",
    authenticateToken,
    baseSelloutController.deleteBaseValuesSellout
);

/**
 * @swagger
 * /api/base/sellout/values/filters:
 *   get:
 *     tags:
 *       - Base de valores de sellout
 *     summary: Obtener bases de valores de sellout filtrados   
 *     description: Busqueda de bases de valores de sellout marca, modelo, unidad base unitaria, pvd unitario, fecha de cálculo
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
 *         description: Bases de valores de sellout filtrados correctamente
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
 *                       brand:
 *                         type: string
 *                       model:  
 *                         type: string
 *                       unitBaseUnitary:
 *                         type: string
 *                       pvdUnitary:
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
    "/values/filters",
    authenticateToken,
    baseSelloutController.getBaseValuesSellout
);

// Rotación base

/**
 * @swagger
 * /api/base/sellout/rotation:
 *   post:
 *     tags:
 *       - Base de rotación
 *     summary: Crear una nueva base de rotación
 *     description: Crea una nueva entrada en la base de rotación en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - visitCode
 *               - visitDate
 *               - visitYear
 *               - visitMonth
 *               - storeCode
 *               - productCode
 *               - pvdValue
 *               - selloutUnits
 *               - selloutMonth
 *               - period
 *               - lessThan3Months
 *               - between3And6Months
 *               - moreThan6Months
 *               - moreThan2Years
 *               - totalDisplayed
 *               - mappingTarget
 *               - unitPrice
 *               - totalUbValue
 *               - unitUb
 *               - salesAccount
 *               - displayAccount
 *               - idEmployeePromotor
 *               - idEmployeeCoordinatorZonal
 *               - idEmployeePromotorPi
 *               - idEmployeeSupervisor
 *               - idEmployeePromotorTv
 *               - moreThan9Months
 *               - moreThan1Year
 *               - isConsignment
 *               - selloutYear
 *               - selloutMonthNumber
 *               - currentUbValue
 *               - currentPvdValue
 *               - visitType
 *             properties:
 *               visitCode:
 *                 type: string
 *               visitSheetNumber:
 *                 type: string
 *               visitDate:
 *                 type: string
 *                 format: date
 *               visitYear:
 *                 type: integer
 *               visitMonth:
 *                 type: integer
 *               storeCode:
 *                 type: string
 *               productCode:
 *                 type: string
 *               pvdValue:
 *                 type: number
 *               selloutUnits:
 *                 type: number
 *               selloutMonth:
 *                 type: integer
 *               period:
 *                 type: string
 *               lessThan3Months:
 *                 type: integer
 *               between3And6Months:
 *                 type: integer
 *               moreThan6Months:
 *                 type: integer
 *               moreThan2Years:
 *                 type: integer
 *               totalDisplayed:
 *                 type: integer
 *               mappingTarget:
 *                 type: integer
 *               unitPrice:
 *                 type: number
 *               totalUbValue:
 *                 type: number
 *               unitUb:
 *                 type: number
 *               salesAccount:
 *                 type: string
 *               displayAccount:
 *                 type: string
 *               moreThan9Months:
 *                 type: integer
 *               moreThan1Year:
 *                 type: integer
 *               isConsignment:
 *                 type: integer
 *               selloutYear:
 *                 type: integer
 *               selloutMonthNumber:
 *                 type: integer
 *               currentUbValue:
 *                 type: number
 *               currentPvdValue:
 *                 type: number
 *               visitType:
 *                 type: string
 *               idEmployeePromotor:
 *                 type: integer
 *               idEmployeeCoordinatorZonal:
 *                 type: integer
 *               idEmployeePromotorPi:
 *                 type: integer
 *               idEmployeeSupervisor:
 *                 type: integer
 *               idEmployeePromotorTv:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Base de rotación creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 visitCode:
 *                   type: string
 *                 visitDate:
 *                   type: string
 *                 storeCode:
 *                   type: string
 *                 productCode:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post(
    "/rotation",
    authenticateToken,
    validatorMiddleware(CreateRotationBaseDto,
        false) as RequestHandler,
    rotationBaseController.createRotationBase
);

/**
* @swagger
* /api/base/sellout/rotation/filters:
*   get:
*     tags:
*       - Base de rotación
*     summary: Obtener bases de rotación filtrados   
*     description: Busqueda de bases de rotación código de visita, código de tienda, código de producto, fecha de cálculo
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
*         description: Bases de rotación filtrados correctamente
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
*                       visitCode:
*                         type: string
*                       visitDate:  
*                         type: string
*                       storeCode:
*                         type: string
*                       productCode:
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
    "/rotation/filters",
    authenticateToken,
    rotationBaseController.getRotationBases
);

export default router;