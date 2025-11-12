import {plainToInstance} from "class-transformer";
import {DataSource} from "typeorm";
import {
    CreateParameterCategoryDto,
    ParameterCategoryResponseDto,
    ParameterCategoryResponseSearchDto,
    ParameterCategorySearchDto,
    UpdateParameterCategoryDto,
} from "../dtos/parameter.categories.dto";
import {ParameterCategory} from "../models/parameter.categories.model";
import {ParameterCategoriesRepository} from "../repository/parameter.categories.repository";

export class ParameterCategoriesService {
  private parameterCategoryRepository: ParameterCategoriesRepository;

  constructor(dataSource: DataSource) {
    this.parameterCategoryRepository = new ParameterCategoriesRepository(
      dataSource
    );
  }

  async createParameterCategory(
    parameterCategory: CreateParameterCategoryDto
  ): Promise<ParameterCategoryResponseDto> {
    const parameterCategoryEntity = plainToInstance(
      ParameterCategory,
      parameterCategory
    );
    const savedParameterCategory =
      await this.parameterCategoryRepository.create(parameterCategoryEntity);
    return plainToInstance(
      ParameterCategoryResponseDto,
      savedParameterCategory,
      { excludeExtraneousValues: true }
    );
  }

  async updateParameterCategory(
    id: number,
    parameterCategory: UpdateParameterCategoryDto
  ): Promise<ParameterCategoryResponseDto> {
    const parameterCategoryEntity =
      await this.parameterCategoryRepository.findById(id);
    if (!parameterCategoryEntity) {
      throw new Error("la categoria de parametro no existe");
    }
    parameterCategoryEntity.name = parameterCategory.name;
    parameterCategoryEntity.description = parameterCategory.description || "";
    const updatedParameterCategory =
      await this.parameterCategoryRepository.update(
        id,
        parameterCategoryEntity
      );
    return plainToInstance(
      ParameterCategoryResponseDto,
      updatedParameterCategory,
      { excludeExtraneousValues: true }
    );
  }

  async deleteParameterCategory(id: number): Promise<void> {
    const parameterCategoryEntity =
      await this.parameterCategoryRepository.findById(id);
    if (!parameterCategoryEntity) {
      throw new Error("la categoria de parametro no existe");
    }
    await this.parameterCategoryRepository.delete(id);
  }

  async searchParameterCategoriesPaginated(
    searchDto: ParameterCategorySearchDto,
    page: number = 1,
    limit: number = 10
  ): Promise<ParameterCategoryResponseSearchDto> {
    const parameterCategories =
      await this.parameterCategoryRepository.findByFilters(
        searchDto,
        page,
        limit
      );
    const parameterCategoriesResponse = parameterCategories.items.map(
      (parameterCategory) =>
        plainToInstance(ParameterCategoryResponseDto, parameterCategory, {
          excludeExtraneousValues: true,
        })
    );
    return plainToInstance(
      ParameterCategoryResponseSearchDto,
      {
        items: parameterCategoriesResponse,
        total: parameterCategories.total,
      },
      { excludeExtraneousValues: true }
    );
  }
}
