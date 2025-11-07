import { Request, Response } from "express";
import { statusConeccion } from "../config/data-source";
import { env } from "../config/env";
export class HealthController {
  async healthCheck(req: Request, res: Response) {
    try {
      const dbStatus = statusConeccion;
      const appStatus = `Servidor corriendo en http://${env.BASE_URL}`;
      res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "sellout-backend",
        environment: process.env.NODE_ENV || "development",
        database: dbStatus,
        app: appStatus,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        timestamp: new Date().toISOString(),
        service: "consenso-backend",
        environment: process.env.NODE_ENV || "development",
        database: {
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Database connection failed",
        },
      });
    }
  }
}
