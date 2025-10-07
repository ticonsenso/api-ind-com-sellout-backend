import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";
import { CommissionConfigurationResponseDto } from "./commission.configurations.dto";
import { CompanyResponseDto } from "./companies.dto";
import { CompanyPositionResponseDto } from "./company.positions.dto";

export class CreateVariableScaleDto {
  @IsNotEmpty({ message: "El ID de la empresa es obligatorio." })
  @IsNumber({}, { message: "El ID de la empresa debe ser un número." })
  @Type(() => Number)
  companyId!: number;

  @IsNotEmpty({ message: "El ID del cargo es obligatorio." })
  @IsNumber({}, { message: "El ID del cargo debe ser un número." })
  @Type(() => Number)
  companyPositionId!: number;

  @IsNotEmpty({
    message: "El ID de la configuración de comisión es obligatorio.",
  })
  @IsNumber(
    {},
    { message: "El ID de la configuración de comisión debe ser un número." }
  )
  @Type(() => Number)
  commissionConfigurationId!: number;

  @IsNotEmpty({ message: "La puntuación mínima es obligatoria." })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: "La puntuación mínima debe ser un número con hasta 2 decimales.",
    }
  )
  @Min(0, { message: "La puntuación mínima no puede ser negativa." })
  @Max(9999999.99, {
    message: "La puntuación mínima no puede exceder 9999999.99.",
  })
  @Type(() => Number)
  minScore!: number;

  @IsNotEmpty({ message: "La puntuación máxima es obligatoria." })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: "La puntuación máxima debe ser un número con hasta 2 decimales.",
    }
  )
  @Min(0, { message: "La puntuación máxima no puede ser negativa." })
  @Max(9999999.99, {
    message: "La puntuación máxima no puede exceder 9999999.99.",
  })
  @Type(() => Number)
  maxScore!: number;

  @IsNotEmpty({ message: "El monto variable es obligatorio." })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "El monto variable debe ser un número con hasta 2 decimales." }
  )
  @Min(0, { message: "El monto variable no puede ser negativo." })
  @Max(9999999.99, {
    message: "El monto variable no puede exceder 9999999.99.",
  })
  @Type(() => Number)
  variableAmount!: number;
}

export class UpdateVariableScaleDto {
  @IsOptional()
  @IsNumber({}, { message: "El ID de la empresa debe ser un número." })
  @Type(() => Number)
  companyId?: number;

  @IsOptional()
  @IsNumber({}, { message: "El ID del cargo debe ser un número." })
  @Type(() => Number)
  companyPositionId?: number;

  @IsOptional()
  @IsNumber(
    {},
    { message: "El ID de la configuración de comisión debe ser un número." }
  )
  @Type(() => Number)
  commissionConfigurationId?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: "La puntuación mínima debe ser un número con hasta 2 decimales.",
    }
  )
  @Min(0, { message: "La puntuación mínima no puede ser negativa." })
  @Max(9999999.99, {
    message: "La puntuación mínima no puede exceder 9999999.99.",
  })
  @Type(() => Number)
  minScore?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: "La puntuación máxima debe ser un número con hasta 2 decimales.",
    }
  )
  @Min(0, { message: "La puntuación máxima no puede ser negativa." })
  @Max(9999999.99, {
    message: "La puntuación máxima no puede exceder 9999999.99.",
  })
  @Type(() => Number)
  maxScore?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "El monto variable debe ser un número con hasta 2 decimales." }
  )
  @Min(0, { message: "El monto variable no puede ser negativo." })
  @Max(9999999.99, {
    message: "El monto variable no puede exceder 9999999.99.",
  })
  @Type(() => Number)
  variableAmount?: number;
}

export class VariableScaleResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CompanyResponseDto)
  company!: CompanyResponseDto;

  @Expose()
  @Type(() => CompanyPositionResponseDto)
  companyPosition!: CompanyPositionResponseDto;

  @Expose()
  @Type(() => CommissionConfigurationResponseDto)
  commissionConfiguration!: CommissionConfigurationResponseDto;

  @Expose()
  minScore!: number;

  @Expose()
  maxScore!: number;

  @Expose()
  variableAmount!: number;
}

export class VariableScaleResponseSearchDto {
  @Expose()
  @Type(() => VariableScaleResponseDto)
  items!: VariableScaleResponseDto[];

  @Expose()
  total!: number;
}

export class VariableScaleSearchDto {
  @IsOptional()
  @IsNumber({}, { message: "El ID de la empresa debe ser un número." })
  @Type(() => Number)
  companyId?: number;

  @IsOptional()
  @IsNumber({}, { message: "El ID del cargo debe ser un número." })
  @Type(() => Number)
  companyPositionId?: number;

  @IsOptional()
  @IsNumber(
    {},
    { message: "El ID de la configuración de comisión debe ser un número." }
  )
  @Type(() => Number)
  commissionConfigurationId?: number;
}
