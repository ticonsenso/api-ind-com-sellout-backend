import { Router } from 'express';
import AppDataSource from '../config/data-source';
import { ExportDataController } from '../controllers/export.data.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { uploadExcel } from '../middleware/excel.middleware';

const router = Router();
const exportDataController = new ExportDataController(AppDataSource);


/**
 * @swagger
 * /api/export/data/avanced:
 *   get:
 *     tags:
 *       - Export Data
 *     summary: Exportación avanzada de datos en Excel (Streaming)
 *     description: |
 *       Genera y descarga un reporte en formato Excel utilizando un flujo de datos (streaming) para optimizar el rendimiento.
 *       El archivo se genera dinámicamente en base a la fecha de cálculo proporcionada.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: calculate_date
 *         in: query
 *         description: Fecha de corte para el cálculo de datos (Formato YYYY-MM-DD).
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Petición incorrecta o parámetros faltantes.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/avanced', authenticateToken, exportDataController.exportDataAvancedHandler);

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
 *       Permite cargar y validar información proveniente de un archivo Excel según el tipo de importación seleccionado.
 *       
 *       El sistema procesa el archivo fila por fila, validando cada registro según las reglas definidas para el tipo especificado.  
 *       Si existen errores de validación, el servicio genera un archivo Excel que contiene únicamente los registros con errores
 *       para su revisión y corrección.
 *       
 *       **Tipos de importación soportados:**
 *       - `noHomologadosStore`: Importación de tiendas no homologadas.
 *       - `noHomologadosProducts`: Importación de productos no homologados.
 *       
 *     security:
 *       - bearerAuth: []
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - type
 *               - file
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de cálculo asociada a los datos importados.
 *                 example: "2025-06-01"
 * 
 *               type:
 *                 type: string
 *                 description: Tipo de datos que se desea importar.
 *                 enum:
 *                   - noHomologadosStore
 *                   - noHomologadosProducts
 *                 example: noHomologadosStore
 * 
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo Excel (.xlsx) que contiene los datos a importar.
 * 
 *     responses:
 *       200:
 *         description: Importación realizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Datos importados correctamente.
 *                 total_registros:
 *                   type: number
 *                   description: Total de registros procesados.
 *                   example: 100
 *                 registros_ok:
 *                   type: number
 *                   description: Registros validados correctamente.
 *                   example: 95
 *                 registros_error:
 *                   type: number
 *                   description: Registros que presentaron errores de validación.
 *                   example: 5
 * 
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *               description: |
 *                 Archivo Excel generado automáticamente con los registros que contienen errores de validación.
 *                 Este archivo solo se devuelve si existen errores.
 * 
 *       400:
 *         description: Solicitud incorrecta, parámetros faltantes o inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Debe enviar un archivo Excel.
 * 
 *       500:
 *         description: Error interno al procesar la importación.
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