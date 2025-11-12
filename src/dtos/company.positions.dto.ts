import {Exclude, Expose, Type} from 'class-transformer';
import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import {CompanyResponseDto} from './companies.dto';

export class CreateCompanyPositionDto {
  @IsNotEmpty()
  @IsNumber()
  companyId!: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  salaryBase?: number;

  @IsOptional()
  @IsBoolean()
  isStoreSize?: boolean;
}

export class UpdateCompanyPositionDto {
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  salaryBase?: number;

  @IsOptional()
  @IsBoolean()
  isStoreSize?: boolean;
}

export class CompanyPositionResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CompanyResponseDto)
  company!: CompanyResponseDto;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  salaryBase!: number;

  @Expose()
  isStoreSize!: boolean;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;
}

export class CompanyPositionResponseSearchDto {
  @Expose()
  items!: CompanyPositionResponseDto[];

  @Expose()
  total!: number;
}

export class CompanyPositionListResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CompanyResponseDto)
  company!: CompanyResponseDto;

  @Expose()
  name!: string;

  @IsOptional()
  @Expose()
  salaryBase?: number;

  @IsOptional()
  @Expose()
  isStoreSize?: boolean;
}

export class CompanyPositionSearchDto {
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
