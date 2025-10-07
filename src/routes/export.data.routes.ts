import { Router } from 'express';
import AppDataSource from '../config/data-source';
import { ExportDataController } from '../controllers/export.data.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const exportDataController = new ExportDataController(AppDataSource);


/**
 * @swagger
 * /api/export/data/{excel_name}:
 *   get:
 *     tags:
 *       - Export Data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: excel_name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: calculate_date
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get('/:excel_name', authenticateToken, exportDataController.exportDataHandler);


export default router;