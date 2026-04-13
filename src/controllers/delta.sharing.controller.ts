import { Request, Response } from 'express';
import { DeltaSharingService } from '../services/delta.sharing.service';
import AppDataSource from '../config/data-source';

let deltaSharingService: DeltaSharingService;

const getService = () => {
  if (!deltaSharingService) {
    deltaSharingService = new DeltaSharingService(AppDataSource);
  }
  return deltaSharingService;
};

/**
 * Prueba rápida: Obtiene los primeros 10 registros de las tablas configuradas.
 */
export const getDeltaRecordsPreview = async (req: Request, res: Response) => {
  try {
    const service = getService();
    const result = await service.get10RecordsFromRequiredTables();
    return res.status(result.success ? 200 : 206).json({
      message: 'Consulta de prueba a Delta Sharing procesada.',
      ...result
    });
  } catch (error: any) {
    console.error("Error en getDeltaRecordsTest:", error);
    return res.status(500).json({
      success: false,
      message: 'Error al consultar Delta Sharing',
      error: error.message || error
    });
  }
};

/**
 * Sincronización masiva: Inicia el proceso en segundo plano.
 */
export const startSync = async (req: Request, res: Response) => {
  try {
    const { entity } = req.params as { entity: string };
    const service = getService();

    let share = 'co_comisiones';
    let schema = 'dwh';

    const result = await service.startTableSync(share, schema, entity);

    return res.status(202).json({
      success: true,
      message: `Sincronización de ${entity} iniciada en segundo plano.`,
      ...result
    });
  } catch (error: any) {
    console.error("Error en startSync:", error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al iniciar sincronización'
    });
  }
};

/**
 * Consulta el estado de un Job específico.
 */
export const getSyncStatus = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params as { jobId: string };
    const service = getService();
    const status = await service.getSyncStatus(jobId);

    if (!status) {
      return res.status(404).json({ success: false, message: 'Job no encontrado' });
    }

    return res.json({
      success: true,
      data: status
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al consultar estado',
      error: error.message
    });
  }
};

/**
 * Retorna todos los trabajos (Jobs) paginados.
 */
export const getJobs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const service = getService();
    const result = await service.getAllJobs(page, limit);

    return res.json({
      success: true,
      data: result.items,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al listar trabajos',
      error: error.message
    });
  }
};
