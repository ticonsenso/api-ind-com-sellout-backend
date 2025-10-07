import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";
import { CommissionConfigurationResponseDto } from "./commission.configurations.dto";
import { ParameterLineResponseDto } from "./parameter.lines.dto";

export class CreateProductLineDto {
  @IsNotEmpty()
  @IsNumber()
  commissionConfigurationId!: number;

  @IsNotEmpty()
  @IsNumber()
  parameterLineId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  commissionWeight!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  goalRotation!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minSaleValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxSaleValue?: number;
}

export class UpdateProductLineDto {
  @IsOptional()
  @IsNumber()
  commissionConfigurationId?: number;

  @IsOptional()
  @IsNumber()
  parameterLineId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  commissionWeight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  goalRotation?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minSaleValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxSaleValue?: number;
}

export class ProductLineResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CommissionConfigurationResponseDto)
  commissionConfiguration!: CommissionConfigurationResponseDto;

  @Expose()
  @Type(() => ParameterLineResponseDto)
  parameterLine!: ParameterLineResponseDto;

  @Expose()
  commissionWeight!: number;

  @Expose()
  goalRotation!: number;

  @Expose()
  minSaleValue!: number;

  @Expose()
  maxSaleValue!: number;
}

export class ProductLineListResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CommissionConfigurationResponseDto)
  commissionConfiguration!: CommissionConfigurationResponseDto;

  @Expose()
  @Type(() => ParameterLineResponseDto)
  parameterLine!: ParameterLineResponseDto;

  @Expose()
  commissionWeight!: number;

  @Expose()
  goalRotation!: number;

  @Expose()
  minSaleValue!: number;

  @Expose()
  maxSaleValue!: number;
}

export class ProductLineListResponseSearchDto {
  @Expose()
  items!: ProductLineListResponseDto[];

  @Expose()
  total!: number;
}

export class ProductLineSearchDto {
  @IsOptional()
  @IsNumber()
  commissionConfigurationId?: number;

  @IsOptional()
  @IsNumber()
  parameterLineId?: number;

  @IsOptional()
  @IsNumber()
  commissionWeight?: number;

  @IsOptional()
  @IsNumber()
  goalRotation?: number;

  @IsOptional()
  @IsNumber()
  minSaleValue?: number;

  @IsOptional()
  @IsNumber()
  maxSaleValue?: number;
}
