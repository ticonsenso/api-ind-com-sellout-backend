import {NextFunction, Request, Response} from 'express';
import {validate, ValidationError} from 'class-validator';
import {plainToInstance} from 'class-transformer';

/**
 * Middleware para validar los datos de entrada utilizando class-validator
 * @param dto - Clase DTO que define las reglas de validación
 * @param skipMissingProperties - Indica si se deben omitir propiedades faltantes (opcional)
 * @returns Middleware para Express
 */
export function validatorMiddleware(dto: any, skipMissingProperties = false) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoObject = plainToInstance(dto, req.body, {
        excludeExtraneousValues: false,
        enableImplicitConversion: true,
      });
      // Validar el objeto según las reglas definidas en el DTO
      const errors: ValidationError[] = await validate(dtoObject, {
        skipMissingProperties,
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      // Si hay errores de validación, devolver respuesta con errores
      if (errors.length > 0) {
        const mensajes = errors.map((error) => {
          return {
            propiedad: error.property,
            restricciones: error.constraints ? Object.values(error.constraints) : ['Error de validación'],
          };
        });

        return res.status(400).json({
          status: 'error',
          message: 'Error de validación en los datos de entrada',
          errores: mensajes,
        });
      }

      // Si no hay errores, continuar con la siguiente función
      req.body = dtoObject;
      next();
    } catch (error) {
      console.error('Error en la validación:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Error interno durante la validación de datos',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };
}
