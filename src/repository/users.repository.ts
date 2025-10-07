import { User } from '../models/users.model';
import { BaseRepository } from './base.respository';
import { DataSource } from 'typeorm';

export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }

  async findByFilters(filters: any): Promise<User[]> {
    const queryBuilder = this.repository.createQueryBuilder('user')
      .leftJoinAndSelect('user.company', 'company');

    if (filters.companyId) {
      queryBuilder.andWhere('user.company_id = :companyId', { companyId: filters.companyId });
    }

    if (filters.dni) {
      queryBuilder.andWhere('user.dni LIKE :dni', { dni: `%${filters.dni}%` });
    }

    if (filters.name) {
      queryBuilder.andWhere('user.name LIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.email) {
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${filters.email}%` });
    }
    
    if (filters.phone) {
      queryBuilder.andWhere('user.phone LIKE :phone', { phone: `%${filters.phone}%` });
    }

    if (filters.status !== undefined) {
      queryBuilder.andWhere('user.status = :status', { status: filters.status });
    }
    return queryBuilder.getMany();
  }

  async findByDni(dni: string): Promise<User | null> {
    return this.repository.findOne({ where: { dni } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByDniAndEmail(dni: string, email: string): Promise<User | null> {
    return this.repository.findOne({ where: { dni, email } });
  }

  async updateCompany(id: number, companyId: number | null): Promise<User> {
    await this.repository.update(id, {
      companyId: companyId,
    });

    const updatedUser = await this.repository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!updatedUser) {
      throw new Error('Usuario no encontrado');
    }

    return updatedUser;
  }



}
