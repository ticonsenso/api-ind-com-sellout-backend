import {ParameterCategorySearchDto} from '../dtos/parameter.categories.dto';
import {ParameterCategory} from '../models/parameter.categories.model';
import {BaseRepository} from './base.respository';
import {DataSource as TypeORMDataSource} from 'typeorm';

export class ParameterCategoriesRepository extends BaseRepository<ParameterCategory> {
  constructor(dataSource: TypeORMDataSource) {
    super(ParameterCategory, dataSource);
  }

  async findByName(name: string): Promise<ParameterCategory | null> {
    return this.repository.findOne({ where: { name } });
  }

  async findByFilters(
    searchDto: ParameterCategorySearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: ParameterCategory[]; total: number }> {
    const { name, description } = searchDto;
    const query = this.repository.createQueryBuilder('parameterCategory');

    const hasFilters = [name, description].some((param) => param !== undefined);

    if (hasFilters) {
      if (name !== undefined) {
        query.andWhere('LOWER(parameterCategory.name) LIKE LOWER(:name)', { name: `%${name}%` });
      }

      if (description !== undefined) {
        query.andWhere('LOWER(parameterCategory.description) LIKE LOWER(:description)', {
          description: `%${description}%`,
        });
      }
    } else {
      query.orderBy('parameterCategory.createdAt', 'DESC').take(10);
    }

    if (hasFilters) {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }
}
