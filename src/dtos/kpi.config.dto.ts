import { Expose, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
export class CreateKpiConfigDto {
  @IsNotEmpty()
  @IsNumber()
  companyId!: number;

  @IsNotEmpty()
  @IsNumber()
  companyPositionId!: number;

  @IsNotEmpty()
  @IsNumber()
  commissionConfigurationId!: number;

  @IsNotEmpty()
  @IsString()
  kpiName!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  meta?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  metaTb?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  metaTa?: number;
}

export class UpdateKpiConfigDto {
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @IsOptional()
  @IsNumber()
  companyPositionId?: number;

  @IsOptional()
  @IsNumber()
  commissionConfigurationId?: number;

  @IsOptional()
  @IsString()
  kpiName?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  meta?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  metaTb?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  metaTa?: number;
}

export class KpiConfigResponseDto {
  @Expose()
  id!: number;

  @Expose()
  companyId!: number;

  @Expose()
  companyPositionId!: number;

  @Expose()
  commissionConfigurationId!: number;

  @Expose()
  kpiName!: string;

  @Expose()
  weight!: number;

  @Expose()
  meta!: number | null;

  @Expose()
  metaTb!: number | null;

  @Expose()
  metaTa!: number | null;
}

export class ResponseKpiConfigDto {
  @Expose()
  total!: number;

  @Expose()
  data!: KpiConfigResponseDto[];
}

export class SearchKpiConfigDto {
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @IsOptional()
  @IsNumber()
  companyPositionId?: number;

  @IsOptional()
  @IsNumber()
  commissionConfigurationId?: number;

  @IsOptional()
  @IsString()
  kpiName?: string;
}
