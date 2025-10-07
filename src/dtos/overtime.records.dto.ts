import { Exclude, Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EmployeeResponseDto } from './employees.dto';

export class CreateOvertimeRecordDto {
  @IsNotEmpty()
  @IsNumber()
  employeeId!: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  month!: Date;

  @IsNotEmpty()
  @IsNumber()
  hours!: number;

  @IsNotEmpty()
  @IsNumber()
  rate!: number;

  @IsOptional()
  @IsString()
  approvedBy?: string;
}

export class UpdateOvertimeRecordDto {
  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  month?: Date;

  @IsOptional()
  @IsNumber()
  hours?: number;

  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsOptional()
  @IsString()
  approvedBy?: string;
}

export class OvertimeRecordResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => EmployeeResponseDto)
  employee!: EmployeeResponseDto;

  @Expose()
  @Type(() => Date)
  month!: Date;

  @Expose()
  hours!: number;

  @Expose()
  rate!: number;

  @Expose()
  approvedBy!: string;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;
}

export class OvertimeRecordListResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => EmployeeResponseDto)
  employee!: EmployeeResponseDto;

  @Expose()
  @Type(() => Date)
  month!: Date;

  @Expose()
  hours!: number;

  @Expose()
  rate!: number;

  @Expose()
  approvedBy!: string;
}
