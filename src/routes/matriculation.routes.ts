import {RequestHandler, Router} from "express";
import AppDataSource from "../config/data-source";
import {authenticateToken} from '../middleware/auth.middleware';
import {MatriculationController} from "../controllers/matriculation.controller";
import {CreateMatriculationTemplateDto, UpdateMatriculationTemplateDto} from "../dtos/matriculation.templates.dto";
import {validatorMiddleware} from "../middleware/validator.middleware";
import {CreateMatriculationLogDto, UpdateMatriculationLogDto} from "../dtos/matriculation.logs.dto";
import {CreateClosingConfigurationDto, UpdateClosingConfigurationDto} from "../dtos/closing.cofiguration.dto";
import {ClosingConfigurationController} from "../controllers/closing.configuration.controller";

const router = Router();
const matriculationController = new MatriculationController(AppDataSource);
const closingConfigurationController = new ClosingConfigurationController(AppDataSource);

/**
 * @swagger
 * /api/matriculation/templates:
 *   post:
 *     tags:
 *       - Matriculación Plantillas
 *     summary: Crear nueva matriculación de plantilla
 *     description: Crea una nueva matriculación de plantilla en el sistema
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
 *             properties:
 *               distributor:
 *                 type: string
 *                 description: Distribuidor
 *               storeName:
 *                 type: string
 *                 description: Almacen
 *               calculateMonth:
 *                 type: string
 *                 description: Mes de cálculo
 *                 format: date
 *                 example: 2025-05-01
 *     responses:
 *       200:
 *         description: Matriculación de plantilla creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 distributor:
 *                   type: string
 *                 storeName:
 *                   type: string
 *                 calculateMonth:
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
    "/templates",
    authenticateToken,
    validatorMiddleware(CreateMatriculationTemplateDto,
        false) as RequestHandler,
    matriculationController.createMatriculationTemplate
);

/**
 * @swagger
 * /api/matriculation/templates/bulk:
 *   post:
 *     tags:
 *       - Matriculación Plantillas
 *     summary: Crear matriculación de plantillas en masa
 *     description: Crea matriculación de plantillas en masa en el sistema
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
 *                 storeName:
 *                   type: string
 *                 calculateMonth:
 *                   type: string
 *                 status:
 *                   type: boolean
 *     responses:   
 *       200:
 *         description: Matriculación de plantillas creadas correctamente
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
router.post(
    "/templates/bulk",
    authenticateToken,
    matriculationController.createMatriculationTemplatesBatch
);

/**
 * @swagger
 * /api/matriculation/templates/{id}:
 *   put:
 *     tags:
 *       - Matriculación Plantillas
 *     summary: Actualizar una plantilla de matriculación
 *     description: Actualiza una plantilla de matriculación en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la plantilla de matriculación
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
 *             properties:
 *               distributor:
 *                 type: string
 *                 description: Distribuidor
 *               storeName:
 *                 type: string
 *                 description: Almacen
 *               calculateMonth:
 *                 type: string
 *                 description: Mes de cálculo
 *     responses:
 *       200:
 *         description: Plantilla de matriculación actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 distributor:
 *                   type: string
 *                 storeName:
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
    "/templates/:id",
    authenticateToken,
    validatorMiddleware(UpdateMatriculationTemplateDto,
        false) as RequestHandler,
    matriculationController.updateMatriculationTemplate
);

/**
 * @swagger
 * /api/matriculation/templates/before-month:
 *   post:
 *     tags:
 *       - Matriculación Plantillas
 *     summary: Crear matriculación de plantillas antes de un mes
 *     description: Crea matriculación de plantillas antes de un mes en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: calculateMonth
 *         schema:  
 *           type: string
 *           format: date
 *           example: 2025-05-01
 *       - in: query
 *         name: copyMonth
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-04-01
 *     responses:
 *       200:
 *         description: Matriculación de plantillas creadas correctamente   
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
router.post(
    "/templates/before-month",
    authenticateToken,
    matriculationController.createMatriculationTemplateBeforeMonth
);
/**
 * @swagger
 * /api/matriculation/templates/{id}:
 *   delete:
 *     tags:
 *       - Matriculación Plantillas
 *     summary: Eliminar una plantilla de matriculación
 *     description: Elimina una plantilla de matriculación en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la plantilla de matriculación
 *     responses:
 *       200:
 *         description: Plantilla de matriculación eliminada correctamente
 *       400:
 *         description: Datos de entrada inválidos.
 *       404:
 *         description: Plantilla de matriculación no encontrada.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.delete(
    "/templates/:id",
    authenticateToken,
    matriculationController.deleteMatriculationTemplate
);

/**
 * @swagger
 * /api/matriculation/templates/delete-all:
 *   post:
 *     tags:
 *       - Matriculación - Plantillas
 *     summary: Eliminar varias plantillas de matriculación
 *     description: |
 *       Permite eliminar varias plantillas de matriculación enviando un arreglo de IDs.
 *       El sistema valida que cada plantilla exista; si alguna no existe, se detiene el proceso y devuelve un error.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *                 description: Lista de IDs de las plantillas a eliminar.
 *     responses:
 *       200:
 *         description: IDs procesados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "No se pudo eliminar: 1"
 *                     - "No se pudo eliminar: 2"
 *       400:
 *         description: Solicitud inválida.
 *       401:
 *         description: Token no autorizado o inválido.
 *       500:
 *         description: Error interno del servidor.
 */
router.post(
    "/templates/delete-all",
    authenticateToken,
    matriculationController.deleteMatriculationTemplateAll
);


/**
 * @swagger
 * /api/matriculation/templates/filters:
 *   get:
 *     tags:
 *       - Matriculación - Plantillas
 *     summary: Obtener todas las plantillas de matriculación con filtros
 *     description: Obtiene todas las plantillas de matriculación con sus logs por fecha de calculo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: calculateDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para filtrar logs
 *     responses:
 *       200:
 *         description: Plantillas obtenidas correctamente 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       distributor:
 *                         type: string
 *                       storeName:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       calculateMonth:
 *                         type: string
 *                       calculateDate:
 *                         type: string
 *                       isUploaded:
 *                         type: boolean
 *                       rowCountTotal:
 *                         type: integer
 *                       log:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           uploadTotal:
 *                             type: integer
 *                           uploadCount:
 *                             type: integer
 *                           rowsCount:
 *                             type: integer
 *                           productCount:
 *                             type: integer
 *                           isUploaded:
 *                             type: boolean
 *                           rowCountTotal:
 *                             type: integer
 *                           productCountTotal:
 *                             type: integer
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.get("/templates/filters",
    authenticateToken,
    matriculationController.getMatriculationTemplates
);

/**
 * @swagger
 * /api/matriculation/templates:
 *   get:
 *     tags:
 *       - Matriculación Plantillas 
 *     summary: Obtener todas las plantillas de matriculación
 *     description: Obtiene todas las plantillas de matriculación en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre de plantilla
 *       - in: query
 *         name: calculateMonth
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-05-01
 *         description: Mes de cálculo
 *     responses:
 *       200:               
 *         description: Plantillas de matriculación obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                 total:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items: 
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       distributor:
 *                         type: string
 *                       storeName:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       calculateMonth:
 *                         type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.get("/templates",
    authenticateToken,
    matriculationController.getMatriculationTemplatesSimple
);

/**
 * @swagger
 * /api/matriculation/logs:
 *   post:
 *     tags:
 *       - Matriculación Logs 
 *     summary: Crear nueva matriculación de log
 *     description: Crea una nueva matriculación de log en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object 
 *             required:
 *               - calculateDate
 *             properties:
 *               distributor:
 *                 type: string
 *                 description: Distribuidor
 *               storeName:
 *                 type: string
 *                 description: Almacen
 *               calculateDate:
 *                 type: string
 *                 description: Fecha de cálculo
 *               rowsCount:
 *                 type: integer
 *                 description: Total de registros procesados
 *               productCount:
 *                 type: integer
 *                 description: Total de registros procesados
 *     responses:
 *       200:
 *         description: Matriculación de log creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 distributor:
 *                   type: string
 *                 storeName:
 *                   type: string
 *                 calculateDate:
 *                   type: string
 *                 rowsCount:
 *                   type: integer
 *                 productCount:
 *                   type: integer
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/logs",
    authenticateToken,
    validatorMiddleware(CreateMatriculationLogDto,
        false) as RequestHandler,
    matriculationController.createMatriculationLog
);

/**
 * @swagger
 * /api/matriculation/logs/{id}:
 *   put:
 *     tags:
 *       - Matriculación Logs 
 *     summary: Actualizar una matriculación de log
 *     description: Actualiza una matriculación de log en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la matriculación de log
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object 
 *             required:
 *               - matriculationId
 *               - calculateDate
 *               - rowsCount
 *               - productCount
 *             properties:
 *               matriculationId:
 *                 type: integer
 *                 description: ID de la plantilla de matriculación
 *               distributor:
 *                 type: string
 *                 description: Distribuidor
 *               storeName:
 *                 type: string
 *                 description: Almacen
 *               calculateDate:
 *                 type: string
 *                 description: Fecha de cálculo
 *               rowsCount:
 *                 type: integer
 *                 description: Total de registros procesados
 *               productCount:
 *                 type: integer
 *                 description: Total de registros procesados
 *     responses:
 *       200:
 *         description: Matriculación de log actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 matriculationId:
 *                   type: integer
 *                 distributor:
 *                   type: string
 *                 storeName:
 *                   type: string
 *                 calculateDate:
 *                   type: string
 *                 rowsCount:
 *                   type: integer
 *                 productCount:
 *                   type: integer
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Matriculación de log no encontrada.
 *       500:
 *         description: Error del servidor.
 */
router.put(
    "/logs/:id",
    authenticateToken,
    validatorMiddleware(UpdateMatriculationLogDto,
        true) as RequestHandler,
    matriculationController.updateMatriculationLog
);

/**
 * @swagger
 * /api/matriculation/logs/{id}:
 *   delete:
 *     tags:
 *       - Matriculación Logs 
 *     summary: Eliminar una matriculación de log
 *     description: Elimina una matriculación de log en el sistema  
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la matriculación de log   
 *     responses:
 *       200:
 *         description: Matriculación de log eliminada correctamente
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Matriculación de log no encontrada.
 *       500:
 *         description: Error del servidor.
 */
router.delete(
    "/logs/:id",
    authenticateToken,
    matriculationController.deleteMatriculationLog
);

/**
 * @swagger
 * /api/matriculation/logs:
 *   get:
 *     tags:
 *       - Matriculación Logs
 *     summary: Obtener todos los logs de matriculación
 *     description: Obtiene todos los logs de matriculación en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: calculateDate
 *         required: true
 *         description: Fecha de cálculo
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Logs de matriculación obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 distributor:
 *                   type: string
 *                 storeName:
 *                   type: string
 *                 calculateDate:
 *                   type: string
 *                   format: date
 *                 rowsCount:
 *                   type: integer
 *                 productCount:
 *                   type: integer
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.get(
    "/logs",
    authenticateToken,
    matriculationController.getMatriculationLogs
);

/**
 * @swagger
 * /api/matriculation/logs/verfication:
 *   get:
 *     tags:
 *       - Matriculación Logs
 *     summary: Verificar si una matriculación ya ha sido cargada
 *     description: Verifica si una matriculación ya ha sido cargada en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: distributor
 *         required: true
 *         description: Distribuidor
 *         example: Distribuidor 1
 *         schema:
 *           type: string
 *       - in: query
 *         name: storeName
 *         required: true
 *         description: Almacen
 *         example: Almacen 1
 *         schema:
 *           type: string
 *       - in: query
 *         name: calculateDate
 *         required: true
 *         description: Fecha de cálculo
 *         example: 2025-01-01
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matriculación ya ha sido cargada
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.get("/logs/verfication",
    authenticateToken,
    matriculationController.isAlreadyUploaded
);

/**
 * @swagger
 * /api/matriculation/closing/configuration:
 *   post:
 *     tags:
 *       - Configuración de cierre
 *     summary: Crear nueva configuración de cierre
 *     description: Crea una nueva configuración de cierre en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - closingDate
 *             properties:
 *               startDate:
 *                 type: string
 *                 description: Fecha de inicio
 *                 format: date
 *                 example: 2025-01-01
 *               closingDate:
 *                 type: string
 *                 description: Fecha de cierre
 *                 format: date
 *                 example: 2025-01-01
 *               month:
 *                 type: string
 *                 description: Mes de extracción
 *                 format: date
 *                 example: 2025-05-01
 *               description:
 *                 type: string
 *                 description: Descripción
 *     responses:
 *       200:
 *         description: Configuración de cierre creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 startDate:
 *                   type: string
 *                 closingDate:
 *                   type: string
 *                 month:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
    "/closing/configuration",
    authenticateToken,
    validatorMiddleware(CreateClosingConfigurationDto,
        false) as RequestHandler,
    closingConfigurationController.createClosingConfiguration
);

/**
 * @swagger
 * /api/matriculation/closing/configuration/{id}:
 *   put:
 *     tags:
 *       - Configuración de cierre
 *     summary: Actualizar una configuración de cierre
 *     description: Actualiza una configuración de cierre en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la plantilla de matriculación
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - closingDate
 *             properties:
 *               startDate:
 *                 type: string
 *                 description: Fecha de inicio
 *                 format: date
 *                 example: 2025-01-01
 *               closingDate:
 *                 type: string
 *                 description: Fecha de cierre
 *                 format: date
 *                 example: 2025-01-01
 *               month:
 *                 type: string
 *                 description: Mes de extracción
 *                 format: date
 *                 example: 2025-05-01
 *               description:
 *                 type: string
 *                 description: Descripción
 *     responses:
 *       200:
 *         description: Configuración de cierre actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 closingDate:
 *                   type: string
 *                 month:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.put(
    "/closing/configuration/:id",
    authenticateToken,
    validatorMiddleware(UpdateClosingConfigurationDto,
        false) as RequestHandler,
    closingConfigurationController.updateClosingConfiguration
);

/**
 * @swagger
 * /api/matriculation/closing/configuration/{id}:
 *   delete:
 *     tags:
 *       - Configuración de cierre
 *     summary: Eliminar una configuración de cierre
 *     description: Elimina una configuración de cierre en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la configuración de cierre
 *     responses:
 *       200:
 *         description: Configuración de cierre eliminada correctamente
 *       400:
 *         description: Datos de entrada inválidos.
 *       404:
 *         description: Configuración de cierre no encontrada.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.delete(
    "/closing/configuration/:id",
    authenticateToken,
    closingConfigurationController.deleteClosingConfiguration
);


/**
 * @swagger
 * /api/matriculation/closing/configuration:
 *   get:
 *     tags:
 *       - Configuración de cierre
 *     summary: Obtener todas las configuraciones de cierre
 *     description: Obtiene todas las configuraciones de cierre en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por fecha por mes de calculo o descripción
 *       - in: query
 *         name: calculateMonth
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-05-01
 *         description: Mes de cálculo
 *     responses:
 *       200:               
 *         description: Configuraciones de cierre obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                 total:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items: 
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       closingDate:
 *                         type: string
 *                         format: date
 *                       month:
 *                         type: string
 *                         format: date
 *                       description:
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
router.get("/closing/configuration",
    authenticateToken,
    closingConfigurationController.getClosingConfigurations
);

export default router;