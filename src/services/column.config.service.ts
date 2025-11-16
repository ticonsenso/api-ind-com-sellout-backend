import { plainToInstance } from "class-transformer";
import { DataSource, ILike } from "typeorm";
import { ColumnCategory } from "../models/column.category.model";
import { ColumnCategoryRepository } from "../repository/column.category.repository";
import { ColumnKeywordRepository } from "../repository/column.keyword.repository";
import { ColumnCategoryResponseDto, ColumnCategoryResponseSearchDto, ColumnCategorySearchDto, CreateColumnCategoryDto, UpdateColumnCategoryDto } from "../dtos/column.category.dto";
import { ColumnKeywordResponseDto, ColumnKeywordResponseSearchDto, ColumnKeywordSearchDto, CreateColumnKeywordDto, UpdateColumnKeywordDto } from "../dtos/column.keyword.dto";

export class ColumnConfigService {
  private columnCategoryRepository: ColumnCategoryRepository;
  private columnKeywordRepository: ColumnKeywordRepository;

  constructor(dataSource: DataSource) {
    this.columnCategoryRepository = new ColumnCategoryRepository(dataSource);
    this.columnKeywordRepository = new ColumnKeywordRepository(dataSource);
  }

  // =========================================================
  // 🟢 MÉTODOS PARA CATEGORY
  // =========================================================

  async createCategory(dto: CreateColumnCategoryDto): Promise<ColumnCategoryResponseDto> {
    const category = plainToInstance(ColumnCategory, dto);
    const saved = this.columnCategoryRepository.create(category);
    return plainToInstance(ColumnCategoryResponseDto, saved, { excludeExtraneousValues: true });
  }

  async updateCategory(id: number, dto: UpdateColumnCategoryDto): Promise<ColumnCategoryResponseDto> {
    const category = await this.columnCategoryRepository.findOneBy(id);
    if (!category) throw new Error("La categoria no existe.");
    const updatedCategory = plainToInstance(ColumnCategory, dto);
    Object.assign(category, updatedCategory);
    const updated = await this.columnCategoryRepository.update(id, category);
    return plainToInstance(ColumnCategoryResponseDto, updated, { excludeExtraneousValues: true });
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.columnCategoryRepository.findOneBy(id);
    if (!category) throw new Error("La categoria no existe.");
    await this.columnCategoryRepository.delete(id);
  }

  async findCategories(search?: ColumnCategorySearchDto): Promise<ColumnCategoryResponseSearchDto> {
    const where: any = {};
    if (search?.name) where.name = ILike(`%${search.name}%`);

    const [items, total] = await this.columnCategoryRepository.findAndCount({
      where,
      relations: ["keywords"],
      order: { id: "ASC" },
    });
    const itemDto = items.map(item => plainToInstance(ColumnCategoryResponseDto, item, { excludeExtraneousValues: true }));
    return plainToInstance(
      ColumnCategoryResponseSearchDto,
      { items: itemDto, total },
      { excludeExtraneousValues: true }
    );
  }

  // =========================================================
  // 🟣 MÉTODOS PARA KEYWORD
  // =========================================================

  async createKeyword(dto: CreateColumnKeywordDto): Promise<ColumnKeywordResponseDto> {
    const category = await this.columnCategoryRepository.findOneBy(dto.categoryId);
    if (!category) throw new Error("La categoria no existe.");

    const keyword = this.columnKeywordRepository.create({
      keyword: dto.keyword,
      category,
    });
    return plainToInstance(ColumnKeywordResponseDto, keyword, { excludeExtraneousValues: true });
  }

  async updateKeyword(id: number, dto: UpdateColumnKeywordDto): Promise<ColumnKeywordResponseDto> {
    const keyword = await this.columnKeywordRepository.findOneBy(id);
    if (!keyword) throw new Error("La palabra clave no existe.");

    if (dto.categoryId) {
      const category = await this.columnCategoryRepository.findOneBy(dto.categoryId);
      if (!category) throw new Error("La categoría no existe.");
      keyword.category = category;
    }

    Object.assign(keyword, dto);
    const updated = await this.columnKeywordRepository.create(keyword);
    return plainToInstance(ColumnKeywordResponseDto, updated, { excludeExtraneousValues: true });
  }

  async deleteKeyword(id: number): Promise<void> {
    const keyword = await this.columnKeywordRepository.findOneBy(id);
    if (!keyword) throw new Error("La palabra clave no existe.");
    await this.columnKeywordRepository.delete(id);
  }

  async findKeywords(search?: ColumnKeywordSearchDto): Promise<ColumnKeywordResponseSearchDto> {
    const where: any = {};
    if (search?.keyword) where.keyword = ILike(`%${search.keyword}%`) ;
    if (search?.categoryId) where.category = { id: search.categoryId };

    const [items, total] = await this.columnKeywordRepository.findAndCount({
      where,
      relations: ["category"],
      order: { id: "ASC" },
    });
    const itemDto = items.map(item => plainToInstance(ColumnKeywordResponseDto, item, { excludeExtraneousValues: true }));
    return plainToInstance(
      ColumnKeywordResponseSearchDto,
      { items: itemDto, total },
      { excludeExtraneousValues: true }
    );
  }


}
