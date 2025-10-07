import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MonthlyResultResponseDto } from './monthly.results.dto';

export class CreateStrategicProductMetricDto {
  @IsNotEmpty()
  @IsNumber()
  monthlyResultId!: number;

  @IsNotEmpty()
  @IsString()
  kpiName!: string;

  @IsNotEmpty()
  @IsNumber()
  weight!: number;

  @IsOptional()
  @IsNumber()
  goalValue?: number;

  @IsOptional()
  @IsNumber()
  actualValue?: number;

  @IsOptional()
  @IsNumber()
  compliance?: number;
}

export class UpdateStrategicProductMetricDto {
  @IsOptional()
  @IsNumber()
  monthlyResultId?: number;

  @IsOptional()
  @IsString()
  kpiName?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  goalValue?: number;

  @IsOptional()
  @IsNumber()
  actualValue?: number;

  @IsOptional()
  @IsNumber()
  compliance?: number;
}

export class StrategicProductMetricResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => MonthlyResultResponseDto)
  monthlyResult!: MonthlyResultResponseDto;

  @Expose()
  kpiName!: string;

  @Expose()
  weight!: number;

  @Expose()
  goalValue!: number;

  @Expose()
  actualValue!: number;

  @Expose()
  compliance!: number;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;
}

export class StrategicProductMetricListResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => MonthlyResultResponseDto)
  monthlyResult!: MonthlyResultResponseDto;

  @Expose()
  kpiName!: string;

  @Expose()
  weight!: number;

  @Expose()
  goalValue!: number;

  @Expose()
  actualValue!: number;

  @Expose()
  compliance!: number;
}
