import {Router} from "express";
import AppDataSource from "../config/data-source";
import {authenticateToken} from "../middleware/auth.middleware";
import {StoreManagerCalculationCommissionController} from "../controllers/store.manager.calculation.controller";

const router = Router();
const storeManagerCalculationCommissionController = new StoreManagerCalculationCommissionController(AppDataSource);

/**
 * @swagger
 * /api/store/manager/calculation/search-commission:
 *   get:
 *     summary: Obtener calculo de comisiones de jefes de tienda
 *     tags:
 *       - Calculo de comisiones Jefes de Tienda
 *     description: Devuelve las comisiones de jefes de tienda filtrando por empleado, cargo, tamaño de tienda, etc.
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
 *         description: Lista paginada de comisiones de jefes de tienda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

router.get(
    "/calculation/search-commission",
    authenticateToken,
    storeManagerCalculationCommissionController.getStoreManagerCalculationCommission
);

export default router;
