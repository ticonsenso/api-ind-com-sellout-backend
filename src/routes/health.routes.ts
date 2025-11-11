import {Router} from "express";
import {HealthController} from "../controllers/health.controller";

const router = Router();
const healthController = new HealthController();

/**
 * @swagger
 * /health:
 *   tags:
 *     name: Health
 *     description: Health check endpoint
 *   get:
 *     summary: Check the health of the application
 *     description: Returns the health status of the application
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get("/health", healthController.healthCheck);

export default router;
