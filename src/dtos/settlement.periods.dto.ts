import {Exclude, Expose, Type} from 'class-transformer';
import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import {CompanyResponseDto} from './companies.dto';
import {SettlementPeriodStatus} from '../enums/settlement.period.status.enum';

export class CreateSettlementPeriodDto {
  @IsNotEmpty()
  @IsNumber()
  companyId!: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate!: Date;

  @IsOptional()
  @IsEnum(SettlementPeriodStatus)
  status?: string;
}

export class UpdateSettlementPeriodDto {
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsEnum(SettlementPeriodStatus)
  status?: string;
}

export class SettlementPeriodSearchDto {
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsEnum(SettlementPeriodStatus)
  status?: string;
}

export class SettlementPeriodResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CompanyResponseDto)
  company!: CompanyResponseDto;

  @Expose()
  @Type(() => Date)
  startDate!: Date;

  @Expose()
  @Type(() => Date)
  endDate!: Date;

  @Expose()
  status!: string;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;
}

export class SettlementPeriodResponseSearchDto {
  @Expose()
  items!: SettlementPeriodResponseDto[];

  @Expose()
  total!: number;
}

export class SettlementPeriodListResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CompanyResponseDto)
  company!: CompanyResponseDto;

  @Expose()
  @Type(() => Date)
  startDate!: Date;

  @Expose()
  @Type(() => Date)
  endDate!: Date;

  @Expose()
  status!: string;
}
