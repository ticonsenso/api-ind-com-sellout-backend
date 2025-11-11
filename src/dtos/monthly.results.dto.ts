import {Exclude, Expose, Type} from 'class-transformer';
import {IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import {EmployeeResponseDto} from './employees.dto';

export class CreateMonthlyResultDto {
  @IsNotEmpty()
  @IsNumber()
  employeeId!: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  month!: Date;

  @IsNotEmpty()
  @IsString()
  productLine!: string;

  @IsNotEmpty()
  @IsNumber()
  saleValue!: number;

  @IsOptional()
  @IsNumber()
  compliance?: number;

  @IsOptional()
  @IsNumber()
  productivity?: number;

  @IsOptional()
  @IsBoolean()
  bonusApplies?: boolean;

  @IsOptional()
  @IsNumber()
  commissionAmount?: number;

  @IsOptional()
  @IsString()
  observations?: string;
}

export class UpdateMonthlyResultDto {
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  month?: Date;

  @IsOptional()
  @IsString()
  productLine?: string;

  @IsOptional()
  @IsNumber()
  saleValue?: number;

  @IsOptional()
  @IsNumber()
  compliance?: number;

  @IsOptional()
  @IsNumber()
  productivity?: number;

  @IsOptional()
  @IsBoolean()
  bonusApplies?: boolean;

  @IsOptional()
  @IsNumber()
  commissionAmount?: number;

  @IsOptional()
  @IsString()
  observations?: string;
}

export class MonthlyResultSearchDto {
  @IsNumber()
  @IsOptional()
  employeeId?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  month?: Date;

  @IsString()
  @IsOptional()
  productLine?: string;

  @IsNumber()
  @IsOptional()
  minSaleValue?: number;

  @IsNumber()
  @IsOptional()
  maxSaleValue?: number;

  @IsBoolean()
  @IsOptional()
  bonusApplies?: boolean;
}

export class MonthlyResultResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => EmployeeResponseDto)
  employee!: EmployeeResponseDto;

  @Expose()
  @IsDate()
  @Type(() => Date)
  month!: Date;

  @Expose()
  productLine!: string;

  @Expose()
  saleValue!: number;

  @Expose()
  compliance!: number;

  @Expose()
  productivity!: number;

  @Expose()
  bonusApplies!: boolean;

  @Expose()
  commissionAmount!: number;

  @Expose()
  observations!: string;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;
}

export class MonthlyResultResponseSearchDto {
  @Expose()
  items!: MonthlyResultResponseDto[];

  @Expose()
  total!: number;
}

export class MonthlyResultListResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => EmployeeResponseDto)
  employee!: EmployeeResponseDto;

  @Expose()
  @IsDate()
  @Type(() => Date)
  month!: Date;

  @Expose()
  productLine!: string;

  @Expose()
  saleValue!: number;

  @Expose()
  compliance!: number;

  @Expose()
  productivity!: number;

  @Expose()
  bonusApplies!: boolean;

  @Expose()
  commissionAmount!: number;
}
