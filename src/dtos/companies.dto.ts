import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name!: string;

  @IsOptional()
  @IsString()
  @Expose()
  description?: string;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @Expose()
  name!: string;

  @IsOptional()
  @IsString()
  @Expose()
  description?: string;
}

export class CompanyResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  description!: string;
}

export class CompanySearchDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  description!: string;
}

export class CompanyListResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @IsOptional()
  @Expose()
  description?: string;
}
