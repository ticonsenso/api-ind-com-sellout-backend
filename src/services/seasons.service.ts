import {plainToInstance} from 'class-transformer';
import {DataSource} from 'typeorm';
import {
    CreateSeasonDto,
    ResponseSeasonDto,
    SearchSeasonDto,
    SeasonResponseDto,
    UpdateSeasonDto,
} from '../dtos/season.dto';
import {Season} from '../models/seasons.model';
import {SeasonsRepository} from '../repository/seasons.repository';

export class SeasonsService {
  private seasonsRepository: SeasonsRepository;

  constructor(dataSource: DataSource) {
    this.seasonsRepository = new SeasonsRepository(dataSource);
  }

  async createSeason(season: CreateSeasonDto): Promise<SeasonResponseDto> {
    const seasonEntity = plainToInstance(Season, season);
    const createdSeason = await this.seasonsRepository.create(seasonEntity);
    return plainToInstance(SeasonResponseDto, createdSeason, { excludeExtraneousValues: true });
  }

  async updateSeason(id: number, season: UpdateSeasonDto): Promise<SeasonResponseDto> {
    const existingSeason = await this.seasonsRepository.findById(id);
    if (!existingSeason) {
      throw new Error('Temporada no encontrada');
    }
    existingSeason.month = season.month ?? existingSeason.month;
    existingSeason.name = season.name ?? existingSeason.name;
    existingSeason.description = season.description ?? existingSeason.description;
    existingSeason.isHighSeason = season.isHighSeason ?? existingSeason.isHighSeason;
    const updatedSeason = await this.seasonsRepository.update(id, existingSeason);
    return plainToInstance(SeasonResponseDto, updatedSeason, { excludeExtraneousValues: true });
  }

  async deleteSeason(id: number): Promise<void> {
    const existingSeason = await this.seasonsRepository.findById(id);
    if (!existingSeason) {
      throw new Error('Temporada no encontrada');
    }
    await this.seasonsRepository.delete(id);
  }

  async searchSeasonPaginated(
    searchDto: SearchSeasonDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseSeasonDto> {
    const seasons = await this.seasonsRepository.findByFilters(searchDto, page, limit);
    return {
      total: seasons.total,
      data: seasons.items.map((season) =>
        plainToInstance(SeasonResponseDto, season, { excludeExtraneousValues: true }),
      ),
    };
  }
}
