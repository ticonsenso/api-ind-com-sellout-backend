import { ColumnKeyword } from '../models/column.keyword.model';
import { BaseRepository } from './base.respository';
import { DataSource as TypeORMDataSource } from 'typeorm';

export class ColumnKeywordRepository extends BaseRepository<ColumnKeyword> {
  constructor(dataSource: TypeORMDataSource) {
    super(ColumnKeyword, dataSource);
  }

  async findByName(keyword: string): Promise<ColumnKeyword | null> {
    return this.repository.findOne({ where: { keyword } });
  }

  async findAndCount(options: any): Promise<[ColumnKeyword[], number]> {
    return this.repository.findAndCount(options);
  }

  async findOneBy(id: number): Promise<ColumnKeyword | null> {
    return this.repository.findOne({ where: { id } });
  }
}
