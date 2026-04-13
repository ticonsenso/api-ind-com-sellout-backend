import { Router } from 'express';
import { getDeltaRecordsPreview, startSync, getSyncStatus, getJobs } from '../controllers/delta.sharing.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/delta-sharing/preview:
 *   get:
 *     summary: Vista previa de datos (10 registros).
 *     tags: [Delta Sharing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Consulta exitosa.
 */
router.get('/preview', authenticateToken, getDeltaRecordsPreview);

/**
 * @swagger
 * /api/delta-sharing/sync/{entity}:
 *   post:
 *     summary: Inicia la sincronización masiva de una entidad.
 *     tags: [Delta Sharing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *           enum: [dim_producto_s08, dim_almacenes_s08]
 *     responses:
 *       202:
 *         description: Sincronización iniciada.
 */
router.post('/sync/:entity', authenticateToken, startSync);

/**
 * @swagger
 * /api/delta-sharing/job/{jobId}:
 *   get:
 *     summary: Consulta el estado de un proceso de sincronización.
 *     tags: [Delta Sharing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *     responses:
 *       200:
 *         description: Estado del proceso.
 */
router.get('/job/:jobId', authenticateToken, getSyncStatus);

/**
 * @swagger
 * /api/delta-sharing/jobs:
 *   get:
 *     summary: Obtiene el historial de trabajos de sincronización.
 *     tags: [Delta Sharing]
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
 *     responses:
 *       200:
 *         description: Lista paginada de trabajos.
 */
router.get('/jobs', authenticateToken, getJobs);

export default router;
