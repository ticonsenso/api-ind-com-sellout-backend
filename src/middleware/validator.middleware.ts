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
      const isArray = Array.isArray(req.body);
      const dataToValidate = isArray ? req.body : [req.body];
      
      const dtoObjects = plainToInstance(dto, dataToValidate, {
        excludeExtraneousValues: false,
        enableImplicitConversion: true,
      });

      let allErrors: any[] = [];

      for (let i = 0; i < (dtoObjects as any[]).length; i++) {
        const item = (dtoObjects as any[])[i];
        const errors: ValidationError[] = await validate(item, {
          skipMissingProperties,
          whitelist: true,
          forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
          const mensajes = errors.map((error) => {
            return {
              index: isArray ? i : undefined,
              propiedad: error.property,
              restricciones: error.constraints ? Object.values(error.constraints) : ['Error de validación'],
            };
          });
          allErrors = allErrors.concat(mensajes);
        }
      }

      // Si hay errores de validación, devolver respuesta con errores
      if (allErrors.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Error de validación en los datos de entrada',
          errores: allErrors,
        });
      }

      // Si no hay errores, continuar con la siguiente función
      req.body = isArray ? dtoObjects : (dtoObjects as any[])[0];
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
