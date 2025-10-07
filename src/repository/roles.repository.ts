import { Role } from '../models/roles.model';
import { BaseRepository } from './base.respository';
import { DataSource } from 'typeorm';

export class RoleRepository extends BaseRepository<Role> {
  constructor(dataSource: DataSource) {
    super(Role, dataSource);
  }

  async findByFilters(filters: any): Promise<Role[]> {
    const queryBuilder = this.repository.createQueryBuilder('role');

    if (filters.name) {
      queryBuilder.andWhere('role.name LIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.status !== undefined) {
      queryBuilder.andWhere('role.status = :status', { status: filters.status });
    }

    return queryBuilder.getMany();
  }

  async findByName(name: string): Promise<Role | null> {
    return this.repository.findOne({
      where: { name: name },
    });
  }
}
