import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsInt } from 'class-validator';
import { ColumnCategoryResponseDto } from './column.category.dto';

export class CreateColumnKeywordDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsInt()
  categoryId!: number;
}

export class UpdateColumnKeywordDto extends CreateColumnKeywordDto {}

export class ColumnKeywordResponseDto {
  @Expose()
  id!: number;

  @Expose()
  keyword!: string;

  @Expose()
  category!: ColumnCategoryResponseDto;
}

export class ColumnKeywordResponseSearchDto {
  @Expose()
  items!: ColumnKeywordResponseDto[];

  @Expose()
  total!: number;
}

export class ColumnKeywordSearchDto {
  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;

  @IsOptional()
  @IsInt()
  @Expose()
  categoryId?: number;
}
