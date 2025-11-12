import {Router} from "express";
import {StatisticsController} from "../controllers/statistics.controller";
import AppDataSource from "../config/data-source";
import {authenticateToken} from '../middleware/auth.middleware';

const router = Router();
const statisticsController = new StatisticsController(AppDataSource);

/**
 * @swagger
 * /api/statistics/data:
 *   get:
 *     summary: Obtener valores de ventas y presupuesto por rango de fechas y empleado
 *     tags:
 *       - [Estadísticas]
 *     description: Obtiene los valores de ventas y presupuesto para un rango de fechas y un empleado específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         description: Año en formato YYYY
 *         required: true  
 *         schema:
 *           type: string
 *       - in: query
 *         name: regional
 *         description: Región
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: companyId
 *         description: ID de la empresa
 *         default: null
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Valores de ventas y presupuesto obtenidos correctamente para la región y la empresa
 *         content:
 *           application/json:
 *             schema:  
 *               type: object
 *               properties:
 *                 month:   
 *                   type: string
 *                 total_sale_value:  
 *                   type: number
 *                 total_budget_value:
 *                   type: number
 *                 compliance_range:  
 *                   type: number
 *       500:
 *         description: Error al obtener los valores de las ventas y el presupuesto
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string   
 *                 error:
 *                   type: object
 */
router.get("/data", authenticateToken, statisticsController.getMonthlyComplianceByRegionAndCompany);

/**
 * @swagger
 * /api/statistics/delete:
 *   delete:
 *     summary: Eliminar datos por rango de fechas
 *     tags:
 *       - [Estadísticas]
 *     description: Elimina los datos de ventas y presupuesto para un rango de fechas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate  
 *         description: Fecha de inicio en formato YYYY-MM-DD
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query    
 *         name: endDate
 *         description: Fecha de fin en formato YYYY-MM-DD
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Datos eliminados correctamente
 *       500:
 *         description: Error al eliminar los datos
 */
router.delete("/delete", authenticateToken, statisticsController.deleteByDateRange);

/**
 * @swagger
 * /api/statistics/delete-year-month:
 *   delete:
 *     summary: Eliminar datos por año y mes
 *     tags:
 *       - [Estadísticas]
 *     description: Elimina todos los datos por año y mes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         description: Año en formato YYYY
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: month
 *         description: Mes en formato MM
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Datos eliminados correctamente
 *       500:
 *         description: Error al eliminar los datos
 */
router.delete("/delete-year-month", authenticateToken, statisticsController.deleteByYearMonth);

/**
 * @swagger
 * /api/statistics/report:
 *   post:
 *     summary: Obtener datos de reporte
 *     tags:
 *       - [Estadísticas]
 *     description: Obtiene los datos de reporte
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: index
 *         description: Índice de reporte
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: number
 *               month:
 *                 type: number
 *               companyId:
 *                 type: number
 *               companyPositionId:
 *                 type: number
 *               section:
 *                 type: string
 *               descDivision:
 *                 type: string
 *               descDepar:
 *                 type: string
 *               subDepar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Datos de reporte obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:                   
 *         description: Error al obtener los datos de reporte
 */
router.post("/report", authenticateToken, statisticsController.getReportStatistics);

export default router;
