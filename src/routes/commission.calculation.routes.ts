import { Router } from "express";
import AppDataSource from "../config/data-source";
import { CommissionCalculationController } from "../controllers/commission.calculation.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();
const commissionCalculationController = new CommissionCalculationController(
  AppDataSource
);

/**
 * @swagger
 * /api/commission/calculation/product-compliance:
 *   get:
 *     summary: Obtener cumplimiento de productos por empleado y mes
 *     tags: [Cálculo de Comisiones]
 *     description: Obtiene el cumplimiento de productos por empleado para un mes específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha del mes a consultar (YYYY-MM-DD)
 *         example: "2024-03-01"
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Número de documento, nombre o código del empleado para filtrar
 *         example: "12345678"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *         example: 10
 *     responses:
 *       200:
 *         description: Lista paginada de cumplimiento de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       saleValue:
 *                         type: number
 *                         example: 1500000
 *                       budgetValue:
 *                         type: number
 *                         example: 2000000
 *                       compliancePercentage:
 *                         type: number
 *                         example: 75
 *                       compliancePercentageMax:
 *                         type: number
 *                         example: 100
 *                       weight:
 *                         type: number
 *                         example: 0.3
 *                       valueBaseVariable:
 *                         type: number
 *                         example: 500000
 *                       variableAmount:
 *                         type: number
 *                         example: 150000
 *                       calculateDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-01T00:00:00.000Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-01T10:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-01T10:00:00.000Z"
 *                       company:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Empresa Ejemplo"
 *                       employee:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Juan Pérez"
 *                           documentNumber:
 *                             type: string
 *                             example: "12345678"
 *                       parameterLine:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Línea de Producto A"
 *                 total:
 *                   type: number
 *                   description: Total de registros
 *                   example: 50
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/product-compliance",
  authenticateToken,
  commissionCalculationController.getProductComplianceByEmployeeAndMonth
);

/**
 * @swagger
 * /api/commission/calculation/product-extrategic:
 *   get:
 *     tags:
 *       - Cálculo de Comisiones
 *     summary: Obtiene el cálculo de productos extrategic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Número de documento, nombre o código del empleado
 *       - in: query
 *         name: calculateDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha de cálculo
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Límite de registros por página
 *     responses:
 *       200:
 *         description: Cálculo de productos extrategic obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       employee:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Juan Pérez"
 *                           documentNumber:
 *                             type: string
 *                             example: "12345678"
 *                       calculateDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-01T00:00:00.000Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-01T10:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-01T10:00:00.000Z"
 *                 total:
 *                   type: number
 *                   example: 1
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/product-extrategic",
  authenticateToken,
  commissionCalculationController.getCalculationProductExtrategic
);

/**
 * @swagger
 * /api/commission/calculation/consolidated-commission-calculation:
 *   get:
 *     tags:
 *       - Cálculo de Comisiones
 *     summary: Obtiene el cálculo consolidado de comisiones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Parámetro de búsqueda por nombre, documento, ceco o código
 *       - in: query
 *         name: calculateDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de cálculo
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Límite de registros por página
 *     responses:
 *       200:
 *         description: Cálculo consolidado de comisiones obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       employee:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Juan Pérez"
 *                           documentNumber:
 *                             type: string
 *                             example: "12345678"
 *                       totalCommissionProductLine:
 *                         type: number
 *                         example: 1000
 *                       totalCommissionProductEstategic:
 *                         type: number
 *                         example: 500
 *                       totalHoursExtra:
 *                         type: number
 *                         example: 10
 *                       totalNomina:
 *                         type: number
 *                         example: 2000
 *                       pctNomina:
 *                         type: number
 *                         example: 5
 *                       observation:
 *                         type: string
 *                         example: "Observación del cálculo"
 *                       calculateDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-01T00:00:00.000Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-01T10:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-01T10:00:00.000Z"
 *                 total:
 *                   type: number
 *                   example: 1
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/consolidated-commission-calculation",
  authenticateToken,
  commissionCalculationController.getConsolidatedCommissionCalculation
);

/**
 * @swagger
 * /api/commission/calculation/consolidate-data:
 *   get:
 *     tags:
 *       - Cálculo de Comisiones
 *     summary: Obtiene datos consolidados de comisiones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID del empleado
 *       - in: query
 *         name: calculateDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Fecha de cálculo
 *     responses:
 *       200:
 *         description: Datos consolidados obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productCompliance:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       saleValue:
 *                         type: number
 *                       budgetValue:
 *                         type: number
 *                       compliancePercentage:
 *                         type: number
 *                       compliancePercentageMax:
 *                         type: number
 *                       weight:
 *                         type: number
 *                       valueBaseVariable:
 *                         type: number
 *                       variableAmount:
 *                         type: number
 *                       calculateDate:
 *                         type: string
 *                         format: date-time
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       company:
 *                         type: object
 *                       employee:
 *                         type: object
 *                       parameterLine:
 *                         type: object
 *                 calculationProductExtrategic:
 *                   type: object
 *                 consolidatedCommissionCalculation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     employee:
 *                       type: object
 *                     totalCommissionProductLine:
 *                       type: number
 *                     totalCommissionProductEstategic:
 *                       type: number
 *                     totalHoursExtra:
 *                       type: number
 *                     totalNomina:
 *                       type: number
 *                     pctNomina:
 *                       type: number
 *                     observation:
 *                       type: string
 *                     calculateDate:
 *                       type: string
 *                       format: date-time
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/consolidate-data",
  authenticateToken,
  commissionCalculationController.consolidateData
);

/**
 * @swagger
 * /api/commission/calculation/bonus-summary-by-month-year:
 *   get:
 *     tags:
 *       - Cálculo de Comisiones
 *     summary: Obtiene el resumen de bonos por mes y año
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: true
 *         description: Mes
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: Año
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID de la empresa
 *       - in: query
 *         name: regional
 *         schema:
 *           type: string
 *         required: false
 *         description: Región
 *     responses:
 *       200:
 *         description: Resumen de bonos obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   applies_bonus:
 *                     type: boolean
 *                   cantidad:
 *                     type: number
 *                   total_value:
 *                     type: number
 *                   total:
 *                     type: number
 *       400:
 *         description: Mes y año son requeridos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mes y año son requeridos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/bonus-summary-by-month-year",
  authenticateToken,
  commissionCalculationController.getBonusSummaryByMonthYear
);

/**
 * @swagger
 * /api/commission/calculation/delete-by-date-range:
 *   delete:
 *     tags:
 *       - Cálculo de Comisiones  
 *     summary: Elimina datos por rango de fechas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha de inicio
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha de fin  
 *     responses:
 *       200:
 *         description: Datos eliminados correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/delete-by-date-range",
  authenticateToken,
  commissionCalculationController.deleteByDateRange
);

/**
 * @swagger
 * /api/commission/calculation/summary-by-month-company-region:
 *   get:
 *     tags:
 *       - Cálculo de Comisiones
 *     summary: Obtiene el resumen de comisiones por mes y región
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: false
 *         description: Mes       
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: false
 *         description: Año
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID de la empresa
 *       - in: query
 *         name: regional   
 *         schema:
 *           type: string
 *         required: false
 *         description: Región
 *     responses:
 *       200:
 *         description: Resumen de comisiones obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object   
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/summary-by-month-company-region",
  authenticateToken,
  commissionCalculationController.getSummaryByMonthCompanyRegion
);

export default router;
