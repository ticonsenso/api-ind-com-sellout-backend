import { SearchDataSourceDto } from '../dtos/data.sources.dto';
import { DataSource } from '../models/data.sources.model';
import { BaseRepository } from './base.respository';
import { DataSource as TypeORMDataSource } from 'typeorm';

export class DataSourceRepository extends BaseRepository<DataSource> {
  constructor(dataSource: TypeORMDataSource) {
    super(DataSource, dataSource);
  }

  async findByFilters(
    searchDto: SearchDataSourceDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: DataSource[]; total: number }> {
    const { name, sourceType, isActive, extractionStatus, companyId, search, sortBy, sortOrder } = searchDto;
    const query = this.repository
      .createQueryBuilder('dataSource');

    // Apply filters
    if (search) {
      query.andWhere('LOWER(dataSource.name) LIKE LOWER(:search) OR LOWER(dataSource.description) LIKE LOWER(:search)', 
        { search: `%${search}%` });
    }

    if (name) {
      query.andWhere('LOWER(dataSource.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }

    if (sourceType) {
      query.andWhere('dataSource.sourceType = :sourceType', { sourceType });
    }

    if (isActive !== undefined) {
      query.andWhere('dataSource.isActive = :isActive', { isActive });
    }

    if (extractionStatus) {
      query.andWhere('dataSource.extractionStatus = :extractionStatus', { extractionStatus });
    }

    if (companyId) {
      query.andWhere('dataSource.companyId = :companyId', { companyId });
    }

    // Apply sorting
    if (sortBy) {
      const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
      query.orderBy(`dataSource.${sortBy}`, order);
    } else {
      query.orderBy('dataSource.createdAt', 'DESC');
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }
}
