import { ColumnCategory } from '../models/column.category.model';
import { BaseRepository } from './base.respository';
import { DataSource as TypeORMDataSource } from 'typeorm';

export class ColumnCategoryRepository extends BaseRepository<ColumnCategory> {
  constructor(dataSource: TypeORMDataSource) {
    super(ColumnCategory, dataSource);
  }

  async findByName(name: string): Promise<ColumnCategory | null> {
    return this.repository.findOne({ where: { name } });
  }

  async findOneBy(id: number): Promise<ColumnCategory | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAndCount(options: any): Promise<[ColumnCategory[], number]> {
    return this.repository.findAndCount(options);
  }
}
