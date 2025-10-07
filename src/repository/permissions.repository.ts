import { Permission } from '../models/permissions.model';
import { BaseRepository } from './base.respository';
import { DataSource } from 'typeorm';

export class PermissionRepository extends BaseRepository<Permission> {
  constructor(dataSource: DataSource) {
    super(Permission, dataSource);
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.repository.findOne({ where: { name } });
  }
}
