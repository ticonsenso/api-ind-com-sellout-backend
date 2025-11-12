import {Expose, Type} from "class-transformer";
import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString,} from "class-validator";
import {CompanyPositionResponseDto} from "./company.positions.dto";

export class CreateCommissionConfigurationDto {
  @IsNotEmpty()
  @IsNumber()
  companyId!: number;

  @IsNotEmpty()
  @IsNumber()
  companyPositionId!: number;

  @IsOptional()
  @IsBoolean()
  isRuleCommission?: boolean;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsNotEmpty()
  @IsString()
  version!: string;

  @IsOptional()
  @IsString()
  noteVersion?: string;
}

export class UpdateCommissionConfigurationDto {
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @IsOptional()
  @IsNumber()
  companyPositionId?: number;

  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsBoolean()
  isRuleCommission?: boolean;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  noteVersion?: string;
}

export class CompanyResponseDto {
  @Expose()
  id!: number;

  @IsOptional()
  @IsNumber()
  company?: CompanyResponseDto;

  @IsOptional()
  @IsNumber()
  companyPosition?: CompanyPositionResponseDto;

  @Expose()
  name!: string;

  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  status?: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  isRuleCommission?: boolean;

  @IsOptional()
  @IsString()
  @Expose()
  version?: string;

  @IsOptional()
  @IsString()
  @Expose()
  noteVersion?: string;
}

export class CompanyResponseSearchDto {
  @Expose()
  items!: CompanyResponseDto[];

  @Expose()
  total!: number;
}

export class CommissionConfigurationResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CompanyResponseDto)
  company!: CompanyResponseDto;

  @Expose()
  @Type(() => CompanyPositionResponseDto)
  companyPosition!: CompanyPositionResponseDto;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  status!: boolean;

  @Expose()
  isRuleCommission!: boolean;

  @Expose()
  version!: string;

  @Expose()
  noteVersion?: string;
}

export class CommissionConfigurationResponseSearchDto {
  @Expose()
  items!: CommissionConfigurationResponseDto[];

  @Expose()
  total!: number;
}

export class CommissionConfigurationListResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CompanyResponseDto)
  company!: CompanyResponseDto;

  @Expose()
  name!: string;

  @Expose()
  status!: boolean;

  @Expose()
  isRuleCommission!: boolean;

  @Expose()
  version!: string;

  @Expose()
  noteVersion?: string;
}

export class CompanySearchDto {
  @Expose()
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  @Expose()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  companyId?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  companyPositionId?: number;

  @IsOptional()
  @IsBoolean()
  @Expose()
  status?: boolean;

  @IsOptional()
  @IsString()
  @Expose()
  version?: string;

  @IsOptional()
  @IsString()
  @Expose()
  noteVersion?: string;
}

export class CompanySearchFieldsDto {
  @Expose()
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  @Expose()
  name?: string;

}

export class CommissionConfigurationSearchDto {
  @Expose()
  @IsOptional()
  @IsNumber()
  id?: number;

  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @Expose()
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  companyPositionId?: number;
}

export class CommissionConfigurationDataDto {
  @Expose()
  commissionweight!: number;

  @Expose()
  goalrotation!: number;

  @Expose()
  minsalevalue!: number;

  @Expose()
  maxsalevalue!: number;
}
