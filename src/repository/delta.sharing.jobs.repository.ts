import { DataSource as TypeORMDataSource } from "typeorm";
import { DeltaSharingJob } from "../models/delta.sharing.jobs.model";
import { BaseRepository } from "./base.respository";

export class DeltaSharingJobRepository extends BaseRepository<DeltaSharingJob> {
  constructor(dataSource: TypeORMDataSource) {
    super(DeltaSharingJob, dataSource);
  }

  async findRunningJobByEntity(entityName: string): Promise<DeltaSharingJob | null> {
    return await this.repository.findOne({
      where: {
        entityName,
        status: 'EJECUTANDO'
      }
    });
  }

  async updateJobProgress(jobId: string, processedRecords: number, totalRecords?: number): Promise<void> {
    const updateData: any = { processedRecords };
    if (totalRecords !== undefined) {
      updateData.totalRecords = totalRecords;
    }
    await this.repository.update({ jobId }, updateData);
  }

  async completeJob(jobId: string): Promise<void> {
    await this.repository.update({ jobId }, {
      status: 'COMPLETADO',
      endTime: new Date()
    });
  }

  async failJob(jobId: string, errorMessage: string): Promise<void> {
    await this.repository.update({ jobId }, {
      status: 'ERROR',
      errorMessage,
      endTime: new Date()
    });
  }

  async findAllPaginated(page: number = 1, limit: number = 10): Promise<{ items: DeltaSharingJob[]; total: number }> {
    const [items, total] = await this.repository.findAndCount({
      order: { id: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total };
  }
}
