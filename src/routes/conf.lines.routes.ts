import { Router } from "express";
import { ConfigLinesController } from "../controllers/conf.lines.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import AppDataSource from "../config/data-source";

const router = Router();
const configLinesController = new ConfigLinesController(
    AppDataSource
);

/**
 * @swagger
 * tags:
 *   name: Líneas de Configuración
 *   description: Gestión de líneas de configuración del sistema
 */

/**
 * @swagger
 * /api/conf-lines:
 *   post:
 *     summary: Crear una nueva línea de configuración
 *     tags: [Líneas de Configuración]
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
 *               - lineName
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Línea A"
 *               lineName:
 *                 type: string
 *                 example: "LINE_A_DESC"
 *     responses:
 *       200:
 *         description: Línea de configuración creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateToken, configLinesController.createConfigLine);

/**
 * @swagger
 * /api/conf-lines/charge/all:
 *   post:
 *     summary: Crear o actualizar múltiples líneas de configuración
 *     tags: [Líneas de Configuración]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lines
 *             properties:
 *               lines:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - lineName
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Línea A"
 *                     lineName:
 *                       type: string
 *                       example: "LINE_A_DESC"
 *     responses:
 *       200:
 *         description: Líneas de configuración creadas o actualizadas exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post('/charge/all', authenticateToken, configLinesController.createOrUpdateAllConfigLines);

/**
 * @swagger
 * /api/conf-lines/{id}:
 *   put:
 *     summary: Actualizar una línea de configuración
 *     tags: [Líneas de Configuración]
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
 *               name:
 *                 type: string
 *                 example: "Línea A Modificada"
 *               lineName:
 *                 type: string
 *                 example: "LINE_A_DESC_UPDATED"
 *     responses:
 *       200:
 *         description: Línea de configuración actualizada
 *       404:
 *         description: No encontrada
 */
router.put('/:id', authenticateToken, configLinesController.updateConfigLine);

/**
 * @swagger
 * /api/conf-lines/{id}:
 *   delete:
 *     summary: Eliminar una línea de configuración
 *     tags: [Líneas de Configuración]
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
 *         description: Línea eliminada correctamente
 *       404:
 *         description: No encontrada
 */
router.delete('/:id', authenticateToken, configLinesController.deleteConfigLine);

/**
 * @swagger
 * /api/conf-lines/{id}:
 *   get:
 *     summary: Obtener una línea de configuración por ID
 *     tags: [Líneas de Configuración]
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
 *         description: Datos de la línea de configuración
 *       404:
 *         description: No encontrada
 */
router.get('/:id', authenticateToken, configLinesController.getConfigLineById);

/**
 * @swagger
 * /api/conf-lines:
 *   get:
 *     summary: Obtener todas las líneas de configuración
 *     tags: [Líneas de Configuración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de líneas de configuración
 */
router.get('/', authenticateToken, configLinesController.getConfigLines);

/**
 * @swagger
 * /api/conf-lines/paginated/all:
 *   get:
 *     summary: Obtener líneas de configuración paginadas con filtros
 *     tags: [Líneas de Configuración]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtro parcial por nombre
 *       - in: query
 *         name: lineName
 *         schema:
 *           type: string
 *         description: Filtro parcial por nombre de línea
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: id
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Resultado paginado (data y total)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 */
router.get('/paginated/all', authenticateToken, configLinesController.getConfigLinesPaginated);

export default router;