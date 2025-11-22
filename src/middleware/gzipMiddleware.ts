// src/middlewares/gzipMiddleware.ts
import { Request, Response, NextFunction } from "express";
import zlib from "zlib";

export const gzipMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Caso 1: viene como application/gzip (binario)
  if (req.is("application/gzip")) {
    const gzipBuffer = req.body as Buffer;

    zlib.gunzip(gzipBuffer, (err, buffer) => {
      if (err) {
        return res.status(400).json({
          error: "No se pudo descomprimir el contenido gzip",
          detalle: err.message,
        });
      }

      try {
        // Convierto a JSON antes de seguir
        const json = JSON.parse(buffer.toString("utf-8"));
        req.body = json;
        next();
      } catch (e) {
        return res.status(400).json({
          error: "El gzip descomprimido no es un JSON válido",
        });
      }
    });

    return; // Evita continuar dos veces
  }

  // Caso 2: viene base64 en JSON
  if (req.body?.gzipBase64) {
    try {
      const gzipBuffer = Buffer.from(req.body.gzipBase64, "base64");

      zlib.gunzip(gzipBuffer, (err, buffer) => {
        if (err) {
          return res.status(400).json({
            error: "No se pudo descomprimir gzip base64",
            detalle: err.message,
          });
        }

        try {
          const json = JSON.parse(buffer.toString("utf-8"));
          req.body = json; // Sobrescribimos body original
          next();
        } catch (e) {
          return res.status(400).json({
            error: "El contenido no es un JSON válido después de descomprimir",
          });
        }
      });

      return;
    } catch {
      return res.status(400).json({
        error: "Error al procesar gzip base64",
      });
    }
  }

  // Si no viene gzip → continuar normal
  next();
};