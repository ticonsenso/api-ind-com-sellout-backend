import {SearchExtractionLogDto} from '../dtos/extraction.logs.dto';
import {ExtractionLog} from '../models/extraction.logs.model';
import {BaseRepository} from './base.respository';
import {DataSource as TypeORMDataSource} from 'typeorm';

export class ExtractionLogsRepository extends BaseRepository<ExtractionLog> {
  constructor(dataSource: TypeORMDataSource) {
    super(ExtractionLog, dataSource);
  }

  async findByFilters(
    searchDto: SearchExtractionLogDto,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: ExtractionLog[]; total: number }> {
    const { startTime, endTime, status, dataSourceId, executorId } = searchDto;
    const query = this.repository.createQueryBuilder("extraction_log")
      .leftJoinAndSelect("extraction_log.dataSource", "dataSource")
      .leftJoinAndSelect("extraction_log.executor", "executor");
    
    const hasFilters = [startTime, endTime, status, dataSourceId, executorId].some(
      (param) => param !== undefined
    );

    if (hasFilters) {
      if (startTime !== undefined) {
        query.andWhere(
          "DATE(extraction_log.start_time) >= DATE(:startTime)",
          { startTime }
        );
      }

      if (endTime !== undefined) {
        query.andWhere(
          "DATE(extraction_log.end_time) <= DATE(:endTime)",
          { endTime }
        );
      }

      if (status !== undefined) {
        query.andWhere(
          "LOWER(extraction_log.status) = LOWER(:status)",
          { status }
        );
      }

      if (dataSourceId !== undefined) {
        query.andWhere(
          "extraction_log.data_source_id = :dataSourceId",
          { dataSourceId }
        );
      }

      if (executorId !== undefined) {
        query.andWhere(
          "extraction_log.executed_by = :executorId",
          { executorId }
        );
      }
    } else {
      query.orderBy("extraction_log.createdAt", "DESC").take(10);
    }

    if (hasFilters) {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }
}