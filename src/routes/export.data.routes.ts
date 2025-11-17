import {Router} from 'express';
import AppDataSource from '../config/data-source';
import {ExportDataController} from '../controllers/export.data.controller';
import {authenticateToken} from '../middleware/auth.middleware';
import { uploadExcel } from '../middleware/excel.middleware';

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

/**
 * @swagger
 * /api/export/data/import:
 *   post:
 *     tags:
 *       - Export Data
 *     summary: Importar datos desde un archivo Excel
 *     description: |
 *       Importa y valida datos desde un archivo Excel según el tipo especificado.
 *       El sistema procesa el archivo, valida cada fila según las reglas del tipo seleccionado,
 *       y devuelve un resumen de la importación. Si existen errores de validación,
 *       se genera y devuelve un archivo Excel con los registros erróneos para su corrección.
 *       
 *       **Tipos de importación soportados:**
 *       - `noHomologadosStore`: Importación de tiendas no homologadas
 *       - `noHomologadosProducts`: Importación de productos no homologados
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
*                - date
 *               - type
 *               - file
 *             properties:
 *                date: 
 *                  type: string
 *                 format: date
 *                 description: Fecha de cálculo asociada a los datos importados
 *                  example: 2025-06-01
 *               type:
 *                 type: string
 *                 description: Tipo de datos a importar
 *                 enum:
 *                   - noHomologadosStore
 *                   - noHomologadosProducts
 *                 example: noHomologadosStore
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo Excel (.xlsx) con los datos a importar
 *     responses:
 *       200:
 *         description: Importación procesada exitosamente sin errores de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Datos importados correctamente
 *                 total_registros:
 *                   type: number
 *                   description: Total de registros procesados
 *                   example: 100
 *                 registros_ok:
 *                   type: number
 *                   description: Registros validados correctamente
 *                   example: 95
 *                 registros_error:
 *                   type: number
 *                   description: Registros con errores de validación
 *                   example: 5
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *               description: Archivo Excel con los registros que presentaron errores de validación (solo si existen errores)
 *       400:
 *         description: Solicitud incorrecta - falta archivo o tipo de importación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Debe enviar un archivo Excel.
 *       500:
 *         description: Error interno del servidor al procesar el archivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error procesando el archivo.
 */
router.post(
  "/import",
  authenticateToken,
  uploadExcel.single("file"),
  exportDataController.importDataHandler);


export default router;