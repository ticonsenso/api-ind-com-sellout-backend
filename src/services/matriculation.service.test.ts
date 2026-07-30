import { MatriculationService } from "./matriculation.service";

/**
 * Instanciamos sin pasar por el constructor real (que necesita un DataSource
 * conectado): solo inyectamos el repositorio que usa el método bajo prueba.
 */
function buildServiceWithMockRepo(mockRepo: {
  findById: jest.Mock;
  delete: jest.Mock;
}): MatriculationService {
  const instance = Object.create(MatriculationService.prototype);
  (instance as any).matriculationTemplateRepository = mockRepo;
  return instance as MatriculationService;
}

describe("MatriculationService.deleteMatriculationTemplate", () => {
  it("elimina todos los ids y espera cada operación antes de responder (sin condición de carrera)", async () => {
    const findById = jest.fn().mockResolvedValue({ id: 1 });
    const deleteFn = jest.fn().mockResolvedValue(undefined);
    const service = buildServiceWithMockRepo({ findById, delete: deleteFn });

    const result = await service.deleteMatriculationTemplate({
      ids: [1, 2, 3],
    } as any);

    expect(findById).toHaveBeenCalledTimes(3);
    expect(deleteFn).toHaveBeenCalledTimes(3);
    expect(result).toBe("Matriculación de plantilla eliminada correctamente");
  });

  it("reporta los ids no encontrados en el mensaje de respuesta", async () => {
    const findById = jest.fn().mockImplementation((id: number) =>
      Promise.resolve(id === 2 ? null : { id })
    );
    const deleteFn = jest.fn().mockResolvedValue(undefined);
    const service = buildServiceWithMockRepo({ findById, delete: deleteFn });

    const result = await service.deleteMatriculationTemplate({
      ids: [1, 2, 3],
    } as any);

    expect(result).toEqual(["Matriculación de plantilla no encontrada"]);
  });

  it("procesa los ids secuencialmente (findById termina antes del siguiente)", async () => {
    const order: string[] = [];
    const findById = jest.fn().mockImplementation(async (id: number) => {
      order.push(`find-start-${id}`);
      await new Promise((r) => setTimeout(r, 5));
      order.push(`find-end-${id}`);
      return { id };
    });
    const deleteFn = jest.fn().mockImplementation(async (id: number) => {
      order.push(`delete-${id}`);
    });
    const service = buildServiceWithMockRepo({ findById, delete: deleteFn });

    await service.deleteMatriculationTemplate({ ids: [1, 2] } as any);

    expect(order).toEqual([
      "find-start-1",
      "find-end-1",
      "delete-1",
      "find-start-2",
      "find-end-2",
      "delete-2",
    ]);
  });
});
