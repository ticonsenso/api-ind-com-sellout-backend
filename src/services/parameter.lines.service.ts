import { plainToClass, plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import {
  CreateParameterLineDto,
  CreateParameterLineSearchDto,
  ParameterLineResponseDataDto,
  ParameterLineResponseDto,
  UpdateParameterLineDto,
} from '../dtos/parameter.lines.dto';
import { ParameterLine } from '../models/parameter.lines.model';
import { ParameterLinesRepository } from '../repository/parameter.lines.repository';

export class ParameterLinesService {
  private parameterLinesRepository: ParameterLinesRepository;

  constructor(dataSource: DataSource) {
    this.parameterLinesRepository = new ParameterLinesRepository(dataSource);
  }

  async createParameterLines(createPermissionDto: CreateParameterLineDto): Promise<ParameterLineResponseDto> {
    const createPermissionEntity = plainToClass(ParameterLine, createPermissionDto);
    const parameterLine = await this.parameterLinesRepository.create(createPermissionEntity);
    return plainToClass(ParameterLineResponseDto, parameterLine, { excludeExtraneousValues: true });
  }

  async updateParameterLines(
    id: number,
    updatePermissionDto: UpdateParameterLineDto,
  ): Promise<ParameterLineResponseDto> {
    const parameterLine = await this.parameterLinesRepository.findById(id);
    if (!parameterLine) {
      throw new Error(`No se encontro el parametro de linea con id ${id}`);
    }
    parameterLine.name = updatePermissionDto.name || parameterLine.name;
    parameterLine.description = updatePermissionDto.description || parameterLine.description;
    parameterLine.groupProductLine = updatePermissionDto.groupProductLine || parameterLine.groupProductLine;
    const updatedParameterLine = await this.parameterLinesRepository.update(id, parameterLine);
    return plainToClass(ParameterLineResponseDto, updatedParameterLine, {
      excludeExtraneousValues: true,
    });
  }

  async deleteParameterLines(id: number): Promise<void> {
    const parameterLine = await this.parameterLinesRepository.findById(id);
    if (!parameterLine) {
      throw new Error(`No se encontro el parametro de linea con id ${id}`);
    }
    await this.parameterLinesRepository.delete(id);
  }

  async searchParameterLinePaginated(
    searchDto: CreateParameterLineSearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<ParameterLineResponseDataDto> {
    const parameterLines = await this.parameterLinesRepository.findByFilters(searchDto, page, limit);
    const parameterLinesResponse = parameterLines.items.map((parameterLine) =>
      plainToInstance(ParameterLineResponseDto, parameterLine, { excludeExtraneousValues: true }),
    );
    return plainToInstance(ParameterLineResponseDataDto, {
      items: parameterLinesResponse,
      total: parameterLines.total,
    });
  }
}
