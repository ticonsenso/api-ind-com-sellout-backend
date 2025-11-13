import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ColumnKeywordResponseDto } from './column.keyword.dto';

export class CreateColumnCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateColumnCategoryDto extends CreateColumnCategoryDto {}

export class ColumnCategoryResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  description?: string;

  @Expose()
  keywords?: ColumnKeywordResponseDto[];
}

export class ColumnCategoryResponseSearchDto {
  @Expose()
  items!: ColumnCategoryResponseDto[];

  @Expose()
  total!: number;
}

export class ColumnCategorySearchDto {
  @IsOptional()
  @IsString()
  @Expose()
  name?: string;
}
