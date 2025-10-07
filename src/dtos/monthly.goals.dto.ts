import { Exclude, Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CompanyPositionResponseDto } from './company.positions.dto';
import { ProductLineResponseDto } from './product.lines.dto';

export class CreateMonthlyGoalDto {
  @IsNotEmpty()
  @IsNumber()
  companyPositionId!: number;

  @IsNotEmpty()
  @IsNumber()
  productLineId!: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  monthStart!: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  monthEnd!: Date;

  @IsNotEmpty()
  @IsNumber()
  goalValue!: number;
}

export class UpdateMonthlyGoalDto {
  @IsOptional()
  @IsNumber()
  companyPositionId?: number;

  @IsOptional()
  @IsNumber()
  productLineId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  monthStart?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  monthEnd?: Date;

  @IsOptional()
  @IsNumber()
  goalValue?: number;
}

export class MonthlyGoalResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CompanyPositionResponseDto)
  companyPosition!: CompanyPositionResponseDto;

  @Expose()
  @Type(() => ProductLineResponseDto)
  productLine!: ProductLineResponseDto;

  @Expose()
  monthStart!: Date;

  @Expose()
  monthEnd!: Date;

  @Expose()
  goalValue!: number;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;
}

export class MonthlyGoalResponseSearchDto {
  @Expose()
  items!: MonthlyGoalResponseDto[];

  @Expose()
  total!: number;
}

export class MonthlyGoalSearchDto {
  @IsOptional()
  @IsNumber()
  @Expose()
  companyPositionId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose()
  monthStart?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose()
  monthEnd?: Date;

  @IsOptional()
  @IsNumber()
  @Expose()
  productLineId?: number;
}
