import { SearchExtractedDataDto } from '../dtos/extracted.data.dto';
import { ExtractedData } from '../models/extracted.data.model';
import { BaseRepository } from './base.respository';
import { Raw, DataSource as TypeORMDataSource } from 'typeorm';

export class ExtractedDataRepository extends BaseRepository<ExtractedData> {
  constructor(dataSource: TypeORMDataSource) {
    super(ExtractedData, dataSource);
  }

  async existsByDataNameAndCalcDate(
    dataName: string,
    calculateDate: Date,
  ): Promise<boolean> {
    const yyyyMmDd = calculateDate?.toISOString().slice(0, 10);

    return await this.repository.exists({
      where: {
        dataName,
        calculateDate: Raw(alias => `${alias} = :cDate`, { cDate: yyyyMmDd }),
      },
    });
  }


  async findByFilters(
    searchDto: SearchExtractedDataDto,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: ExtractedData[]; total: number }> {
    const { dataSourceId, extractionDate, isProcessed, processedDate, extractionLogId, processorId, creatorId } = searchDto;
    const query = this.repository.createQueryBuilder("extracted_data")
      .leftJoinAndSelect("extracted_data.dataSource", "dataSource")
      .leftJoinAndSelect("extracted_data.extractionLog", "extractionLog")
      .leftJoinAndSelect("extracted_data.processor", "processor")
      .leftJoinAndSelect("extracted_data.creator", "creator");

    const hasFilters = [dataSourceId, extractionDate, isProcessed, processedDate, extractionLogId, processorId, creatorId].some(
      (param) => param !== undefined
    );

    if (hasFilters) {
      if (dataSourceId !== undefined) {
        query.andWhere(
          "extracted_data.dataSource.id = :dataSourceId",
          { dataSourceId }
        );
      }

      if (extractionDate !== undefined) {
        query.andWhere(
          "DATE(extracted_data.extractionDate) = DATE(:extractionDate)",
          { extractionDate }
        );
      }

      if (isProcessed !== undefined) {
        query.andWhere("extracted_data.isProcessed = :isProcessed", {
          isProcessed,
        });
      }

      if (processedDate !== undefined) {
        query.andWhere(
          "DATE(extracted_data.processedDate) = DATE(:processedDate)",
          { processedDate }
        );
      }

      if (extractionLogId !== undefined) {
        query.andWhere(
          "extracted_data.extractionLog.id = :extractionLogId",
          { extractionLogId }
        );
      }

      if (processorId !== undefined) {
        query.andWhere(
          "extracted_data.processor.id = :processorId",
          { processorId }
        );
      }

      if (creatorId !== undefined) {
        query.andWhere(
          "extracted_data.creator.id = :creatorId",
          { creatorId }
        );
      }
    } else {
      query.orderBy("extracted_data.createdAt", "DESC").take(10);
    }

    if (hasFilters) {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }


  async deleteExtractedDataByCurrentMonth(): Promise<{ affected: number | null | undefined; raw: any }> {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from('extracted_data')
      .where('DATE(created_at) BETWEEN DATE(:firstDay) AND DATE(:lastDay)', { 
        firstDay: firstDayOfMonth, 
        lastDay: lastDayOfMonth 
      })
      .execute();

    return {
      affected: result.affected,
      raw: result.raw
    };
  }
}
