import { DataSource, ILike } from 'typeorm';
import { CreateParameterLineSearchDto } from '../dtos/parameter.lines.dto';
import { ParameterLine } from '../models/parameter.lines.model';
import { BaseRepository } from './base.respository';

export class ParameterLinesRepository extends BaseRepository<ParameterLine> {
  constructor(dataSource: DataSource) {
    super(ParameterLine, dataSource);
  }

  async findByName(name: string): Promise<ParameterLine | null> {
    return this.repository.findOne({
      where: {
        name: ILike(`%${name}%`)
      }
    });
  }

  async findByFilters(
    searchDto: CreateParameterLineSearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: ParameterLine[]; total: number }> {
    const { name, description, groupProductLine } = searchDto;
    const query = this.repository.createQueryBuilder('parameterLine');
    const hasFilters = [name, description, groupProductLine].some((param) => param !== undefined);

    if (hasFilters) {
      if (name !== undefined) {
        query.andWhere('LOWER(parameterLine.name) LIKE LOWER(:name)', { name: `%${name}%` });
      }

      if (description !== undefined) {
        query.andWhere('LOWER(parameterLine.description) LIKE LOWER(:description)', {
          description: `%${description}%`,
        });
      }

      if (groupProductLine !== undefined) {
        query.andWhere('LOWER(parameterLine.groupProductLine) LIKE LOWER(:groupProductLine)', {
          groupProductLine: `%${groupProductLine}%`,
        });
      }
    } else {
      query.orderBy('parameterLine.createdAt', 'DESC').take(10);
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }
}
