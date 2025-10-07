import { UserRole } from '../models/users.roles.model';
import { BaseRepository } from './base.respository';
import { DataSource } from 'typeorm';

export class UserRoleRepository extends BaseRepository<UserRole> {
  constructor(dataSource: DataSource) {
    super(UserRole, dataSource);
  }

  async findByUserId(userId: number): Promise<UserRole[]> {
    return this.repository.find({ where: { user: { id: userId } } });
  }

  async findByDni(dni: string): Promise<UserRole[]> {
    return this.repository.find({ where: { user: { dni: dni } } });
  }

  async deleteRolesByUserId(userId: number): Promise<void> {
    await this.repository.delete({ user: { id: userId } as any });
  }
}
