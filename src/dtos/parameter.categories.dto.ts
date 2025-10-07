import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateParameterCategoryDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateParameterCategoryDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class ParameterCategoryResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;
}

export class ParameterCategoryListResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @IsOptional()
  @Expose()
  description?: string;
}

export class ParameterCategorySearchDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class ParameterCategoryResponseSearchDto {
  @Expose()
  items!: ParameterCategoryResponseDto[];

  @Expose()
  total!: number;
}
