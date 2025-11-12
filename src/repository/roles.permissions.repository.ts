import {RolePermission} from '../models/roles.permissions.model';
import {BaseRepository} from './base.respository';
import {DataSource} from 'typeorm';

export class RolePermissionRepository extends BaseRepository<RolePermission> {
  constructor(dataSource: DataSource) {
    super(RolePermission, dataSource);
  }

  async findByRoleId(roleId: number): Promise<RolePermission[]> {
    return this.repository.find({ where: { role: { id: roleId } } });
  }

  async deleteByRoleId(roleId: number): Promise<void> {
    await this.repository.delete({ role: { id: roleId } as any });
  }
}
