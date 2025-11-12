import {CompanySearchDto} from '../dtos/companies.dto';
import {Company} from '../models/companies.model';
import {BaseRepository} from './base.respository';
import {DataSource as TypeORMDataSource} from 'typeorm';

export class CompaniesRepository extends BaseRepository<Company> {
  constructor(dataSource: TypeORMDataSource) {
    super(Company, dataSource);
  }

  async findByName(name: string): Promise<Company | null> {
    return this.repository.findOne({ where: { name } });
  }

  async findById(id: number): Promise<Company | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByFilters(
    searchDto: CompanySearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: Company[]; total: number }> {
    const { name, description } = searchDto;
    const query = this.repository.createQueryBuilder('company');

    const hasName = name !== undefined && name !== '' && name !== null;
    const hasDescription = description !== undefined && description !== '' && description !== null;

    if (hasName) {
      query.andWhere('company.name ILIKE :name', { name: `%${name}%` });
    }

    if (hasDescription) {
      query.andWhere('company.description ILIKE :description', { description: `%${description}%` });
    }

    query.orderBy('company.createdAt', 'DESC');

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }

}
