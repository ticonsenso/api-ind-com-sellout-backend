import { Router } from "express";
import { AdvisorCommissionController } from "../controllers/advisor.commission.controller";
import AppDataSource from "../config/data-source";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();
const advisorCommissionController = new AdvisorCommissionController(AppDataSource);

/**
 * @swagger
 * /api/commission/advisor/search-commission:
 *   get:
 *     summary: Obtener comisiones de asesores con filtros y paginación
 *     tags:
 *       - Calculo de comisiones Marcimex
 *     description: Devuelve las comisiones de asesores filtrando por empleado, cargo, tamaño de tienda, etc.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Resultados por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por número de documento, nombre o apellido
 *       - in: query
 *         name: calculateDate
 *         schema:
 *           type: string
 *         description: Fecha de cálculo
 *     responses:
 *       200:
 *         description: Lista paginada de comisiones de asesores
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
 *                       name:
 *                         type: string
 *                         storeSizeName:
 *                           type: string
 *                         employeeName:
 *                           type: string
 *                         companyPositionName:
 *                           type: string   
 *                 total:
 *                   type: integer
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

router.get(
    "/search-commission",
    authenticateToken,
    advisorCommissionController.getAdvisorCommission
);

export default router;
