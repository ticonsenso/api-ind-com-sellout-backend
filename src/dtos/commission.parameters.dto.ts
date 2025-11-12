import {Expose, Type} from "class-transformer";
import {IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString,} from "class-validator";
import {CommissionConfigurationResponseDto} from "./commission.configurations.dto";
import {ParameterCategoryResponseDto} from "./parameter.categories.dto";

export class CreateCommissionParameterDto {
  @IsNotEmpty()
  @IsNumber()
  commissionConfigurationId!: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId!: number;

  @IsNotEmpty()
  @IsString()
  value!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsNumber()
  monthsCondition?: number;
}

export class UpdateCommissionParameterDto {
  @IsOptional()
  @IsNumber()
  commissionConfigurationId?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsNumber()
  monthsCondition?: number;
}

export class CommissionParameterResponseDto {
  @IsNumber()
  @Expose()
  id!: number;

  @Type(() => CommissionConfigurationResponseDto)
  @Expose()
  commissionConfigurationId!: CommissionConfigurationResponseDto;

  @Type(() => ParameterCategoryResponseDto)
  @Expose()
  categoryId!: ParameterCategoryResponseDto;

  @IsString()
  @Expose()
  value!: string;

  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @IsBoolean()
  @Expose()
  status!: boolean;

  @IsNumber()
  @Expose()
  monthsCondition?: number;
}

export class CommissionParameterSearchDto {
  @IsOptional()
  @IsNumber()
  @Expose()
  commissionConfigurationId?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  categoryId?: number;

  @IsOptional()
  @IsString()
  @Expose()
  value?: string;

  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  status?: boolean;
}

export class CommissionParameterResponseSearchDto {
  @Expose()
  @IsArray()
  items!: CommissionParameterResponseDto[];

  @Expose()
  @IsNumber()
  total!: number;
}
