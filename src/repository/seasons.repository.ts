import {DataSource} from 'typeorm';
import {SearchSeasonDto} from '../dtos/season.dto';
import {Season} from '../models/seasons.model';
import {BaseRepository} from './base.respository';

export class SeasonsRepository extends BaseRepository<Season> {
  constructor(dataSource: DataSource) {
    super(Season, dataSource);
  }

  async findByFilters(
    searchDto: SearchSeasonDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: Season[]; total: number }> {
    const { month, name, description, isHighSeason } = searchDto;
    const query = this.repository.createQueryBuilder('season');

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Apply filters if they exist
    if (month !== undefined && month !== null) {
      query.andWhere('season.month = :month', { month });
    }

    if (name !== undefined && name !== null && name.trim() !== '') {
      query.andWhere('LOWER(season.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }

    if (description !== undefined && description !== null && description.trim() !== '') {
      query.andWhere('LOWER(season.description) LIKE LOWER(:description)', { description: `%${description}%` });
    }

    if (isHighSeason !== undefined && isHighSeason !== null) {
      query.andWhere('season.isHighSeason = :isHighSeason', { isHighSeason });
    }

    // Add default sorting
    query.orderBy('season.created_at', 'DESC').addOrderBy('season.month', 'ASC');

    // Apply pagination
    query.skip(skip).take(limit);

    // Execute query and get results with total count
    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }
}
