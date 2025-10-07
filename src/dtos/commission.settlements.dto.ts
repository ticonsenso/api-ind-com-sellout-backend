import { Exclude, Expose, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EmployeeResponseDto } from './employees.dto';
import { SettlementPeriodResponseDto } from './settlement.periods.dto';

export enum CommissionSettlementStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class CreateCommissionSettlementDto {
  @IsNotEmpty()
  @IsNumber()
  employeeId!: number;

  @IsNotEmpty()
  @IsNumber()
  periodId!: number;

  @IsNotEmpty()
  @IsNumber()
  totalCommission!: number;

  @IsOptional()
  @IsNumber()
  totalBonus?: number;

  @IsOptional()
  @IsNumber()
  totalDeductions?: number;

  @IsNotEmpty()
  @IsNumber()
  finalAmount!: number;

  @IsOptional()
  @IsEnum(CommissionSettlementStatus)
  status?: string;

  @IsOptional()
  @IsString()
  approvedBy?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  approvedAt?: Date;
}

export class UpdateCommissionSettlementDto {
  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @IsNumber()
  periodId?: number;

  @IsOptional()
  @IsNumber()
  totalCommission?: number;

  @IsOptional()
  @IsNumber()
  totalBonus?: number;

  @IsOptional()
  @IsNumber()
  totalDeductions?: number;

  @IsOptional()
  @IsNumber()
  finalAmount?: number;

  @IsOptional()
  @IsEnum(CommissionSettlementStatus)
  status?: string;

  @IsOptional()
  @IsString()
  approvedBy?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  approvedAt?: Date;
}

export class CommissionSettlementResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => EmployeeResponseDto)
  employee!: EmployeeResponseDto;

  @Expose()
  @Type(() => SettlementPeriodResponseDto)
  period!: SettlementPeriodResponseDto;

  @Expose()
  totalCommission!: number;

  @Expose()
  totalBonus!: number;

  @Expose()
  totalDeductions!: number;

  @Expose()
  finalAmount!: number;

  @Expose()
  status!: string;

  @Expose()
  approvedBy!: string;

  @Expose()
  @Type(() => Date)
  approvedAt!: Date;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;
}

export class CommissionSettlementListResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => EmployeeResponseDto)
  employee!: EmployeeResponseDto;

  @Expose()
  @Type(() => SettlementPeriodResponseDto)
  period!: SettlementPeriodResponseDto;

  @Expose()
  totalCommission!: number;

  @Expose()
  totalBonus!: number;

  @Expose()
  totalDeductions!: number;

  @Expose()
  finalAmount!: number;

  @Expose()
  status!: string;
}
