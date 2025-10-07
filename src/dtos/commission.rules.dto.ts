import { Expose, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { CommissionConfigurationResponseDto } from "./commission.configurations.dto";
import { ParameterLineResponseDto } from "./parameter.lines.dto";
import { StoreSizeResponseDto } from "./store.size.dto";

// DTO for creating a new commission rule
export class CreateCommissionRuleDto {
  @IsNotEmpty({
    message: "El ID de la configuración de comisión es obligatorio.",
  })
  @IsNumber(
    {},
    { message: "El ID de la configuración de comisión debe ser un número." }
  )
  commissionConfigurationId!: number;

  @IsNotEmpty({ message: "El valor mínimo de cumplimiento es obligatorio." })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        "El valor mínimo de cumplimiento debe ser un número con hasta 2 decimales.",
    }
  )
  @Min(0, { message: "El valor mínimo de cumplimiento no puede ser negativo." })
  @Max(9999999.99, {
    message: "El valor mínimo de cumplimiento no puede exceder 9999999.99.",
  })
  minComplace!: number;

  @IsNotEmpty({ message: "El valor máximo de cumplimiento es obligatorio." })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        "El valor máximo de cumplimiento debe ser un número con hasta 2 decimales.",
    }
  )
  @Min(0, { message: "El valor máximo de cumplimiento no puede ser negativo." })
  @Max(9999999.99, {
    message: "El valor máximo de cumplimiento no puede exceder 9999999.99.",
  })
  maxComplace!: number;

  @IsNotEmpty({ message: "El porcentaje de comisión es obligatorio." })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        "El porcentaje de comisión debe ser un número con hasta 2 decimales.",
    }
  )
  @Min(0, { message: "El porcentaje de comisión no puede ser negativo." })
  @Max(9999999.99, {
    message: "El porcentaje de comisión no puede exceder 9999999.99.",
  })
  commissionPercentage!: number;

  @IsNotEmpty({ message: "El bono extra es obligatorio." })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "El bono extra debe ser un número con hasta 2 decimales." }
  )
  @Min(0, { message: "El bono extra no puede ser negativo." })
  @Max(9999999.99, { message: "El bono extra no puede exceder 9999999.99." })
  boneExtra!: number;

  @IsOptional()
  parameterLinesId?: number;

}

// DTO for updating an existing commission rule
export class UpdateCommissionRuleDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsNumber(
    {},
    { message: "El ID de la configuración de comisión debe ser un número." }
  )
  commissionConfigurationId?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        "El valor mínimo de cumplimiento debe ser un número con hasta 2 decimales.",
    }
  )
  @Min(0, { message: "El valor mínimo de cumplimiento no puede ser negativo." })
  @Max(9999999.99, {
    message: "El valor mínimo de cumplimiento no puede exceder 9999999.99.",
  })
  minComplace?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        "El valor máximo de cumplimiento debe ser un número con hasta 2 decimales.",
    }
  )
  @Min(0, { message: "El valor máximo de cumplimiento no puede ser negativo." })
  @Max(9999999.99, {
    message: "El valor máximo de cumplimiento no puede exceder 9999999.99.",
  })
  maxComplace?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        "El porcentaje de comisión debe ser un número con hasta 2 decimales.",
    }
  )
  @Min(0, { message: "El porcentaje de comisión no puede ser negativo." })
  @Max(9999999.99, {
    message: "El porcentaje de comisión no puede exceder 9999999.99.",
  })
  commissionPercentage?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "El bono extra debe ser un número con hasta 2 decimales." }
  )
  @Min(0, { message: "El bono extra no puede ser negativo." })
  @Max(9999999.99, { message: "El bono extra no puede exceder 9999999.99." })
  boneExtra?: number;

  @IsOptional()
  parameterLinesId?: number;

}

// DTO for the response when fetching a single commission rule
export class CommissionRuleResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CommissionConfigurationResponseDto)
  commissionConfiguration!: CommissionConfigurationResponseDto;

  @Expose()
  minComplace!: number;

  @Expose()
  maxComplace!: number;

  @Expose()
  commissionPercentage!: number;

  @Expose()
  boneExtra!: number;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  @Expose()
  @Type(() => ParameterLineResponseDto)
  parameterLine!: ParameterLineResponseDto;

}

// DTO for the response when listing commission rules (potentially simplified)
export class CommissionRuleListResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CommissionConfigurationResponseDto)
  commissionConfiguration!: CommissionConfigurationResponseDto;

  @Expose()
  minComplace!: number;

  @Expose()
  maxComplace!: number;

  @Expose()
  commissionPercentage!: number;

  @Expose()
  boneExtra!: number;

  @Expose()
  parameterLines!: ParameterLineResponseDto;

}

// DTO for the paginated response when searching commission rules
export class CommissionRuleResponseSearchDto {
  @Expose()
  @Type(() => CommissionRuleResponseDto) // Ensure items are transformed
  items!: CommissionRuleResponseDto[];

  @Expose()
  total!: number;
}

// DTO for searching/filtering commission rules
export class CommissionRuleSearchDto {
  @IsOptional()
  @IsNumber(
    {},
    { message: "El ID de la configuración de comisión debe ser un número." }
  )
  @Type(() => Number) // Ensure transformation from query param string
  commissionConfigurationId?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        "El valor mínimo de cumplimiento debe ser un número con hasta 2 decimales.",
    }
  )
  @Min(0, { message: "El valor mínimo de cumplimiento no puede ser negativo." })
  @Max(9999999.99, {
    message: "El valor mínimo de cumplimiento no puede exceder 9999999.99.",
  })
  @Type(() => Number) // Ensure transformation from query param string
  minComplace?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        "El valor máximo de cumplimiento debe ser un número con hasta 2 decimales.",
    }
  )
  @Min(0, { message: "El valor máximo de cumplimiento no puede ser negativo." })
  @Max(9999999.99, {
    message: "El valor máximo de cumplimiento no puede exceder 9999999.99.",
  })
  @Type(() => Number) // Ensure transformation from query param string
  maxComplace?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        "El porcentaje de comisión debe ser un número con hasta 2 decimales.",
    }
  )
  @Min(0, { message: "El porcentaje de comisión no puede ser negativo." })
  @Max(9999999.99, {
    message: "El porcentaje de comisión no puede exceder 9999999.99.",
  })
  @Type(() => Number) // Ensure transformation from query param string
  commissionPercentage?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "El bono extra debe ser un número con hasta 2 decimales." }
  )
  @Min(0, { message: "El bono extra no puede ser negativo." })
  @Max(9999999.99, { message: "El bono extra no puede exceder 9999999.99." })
  @Type(() => Number) // Ensure transformation from query param string
  boneExtra?: number;

  @IsOptional()
  parameterLinesId?: number;
}
