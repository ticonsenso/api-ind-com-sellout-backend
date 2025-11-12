import {Expose} from "class-transformer";
import {IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString,} from "class-validator";
import {CalculationProductExtrategicResponseDto} from "./calculation.product.extrategic.dto";
import {ProductComplianceResponseDto} from "./product.compliance.dto";
import {EmployeeHistoryResponseDto} from "./employees.history.dto";

export class CreateConsolidatedCommissionCalculationDto {
  @IsNotEmpty({ message: "El ID de la empresa es requerido" })
  @IsNumber({}, { message: "El ID de la empresa debe ser un número" })
  @IsPositive({ message: "El ID de la empresa debe ser positivo" })
  companyId!: number;

  @IsNotEmpty({ message: "El ID del cargo es requerido" })
  @IsNumber({}, { message: "El ID del cargo debe ser un número" })
  @IsPositive({ message: "El ID del cargo debe ser positivo" })
  companyPositionId!: number;

  @IsNotEmpty({ message: "El ID del empleado es requerido" })
  @IsNumber({}, { message: "El ID del empleado debe ser un número" })
  @IsPositive({ message: "El ID del empleado debe ser positivo" })
  employeeId!: number;

  @IsNotEmpty({
    message: "La comisión total por línea de producto es requerida",
  })
  @IsNumber(
    {},
    { message: "La comisión total por línea de producto debe ser un número" }
  )
  @IsPositive({
    message: "La comisión total por línea de producto debe ser positiva",
  })
  totalCommissionProductLine!: number;

  @IsNotEmpty({
    message: "La comisión total por producto estratégico es requerida",
  })
  @IsNumber(
    {},
    { message: "La comisión total por producto estratégico debe ser un número" }
  )
  @IsPositive({
    message: "La comisión total por producto estratégico debe ser positiva",
  })
  totalCommissionProductEstategic!: number;

  @IsNotEmpty({ message: "El total de horas extra es requerido" })
  @IsNumber({}, { message: "El total de horas extra debe ser un número" })
  @IsPositive({ message: "El total de horas extra debe ser positivo" })
  totalHoursExtra!: number;

  @IsNotEmpty({ message: "El total de nómina es requerido" })
  @IsNumber({}, { message: "El total de nómina debe ser un número" })
  @IsPositive({ message: "El total de nómina debe ser positivo" })
  totalNomina!: number;

  @IsNotEmpty({ message: "El porcentaje de nómina es requerido" })
  @IsNumber({}, { message: "El porcentaje de nómina debe ser un número" })
  @IsPositive({ message: "El porcentaje de nómina debe ser positivo" })
  pctNomina!: number;

  @IsOptional()
  @IsString({ message: "La observación debe ser un texto" })
  observation?: string;
}

export class UpdateConsolidatedCommissionCalculationDto {
  @IsNotEmpty({ message: "El total de horas extra es requerido" })
  @IsNumber({}, { message: "El total de horas extra debe ser un número" })
  @IsPositive({ message: "El total de horas extra debe ser positivo" })
  totalHoursExtra!: number;

  @IsNotEmpty({ message: "El porcentaje de nómina es requerido" })
  @IsNumber({}, { message: "El porcentaje de nómina debe ser un número" })
  @IsPositive({ message: "El porcentaje de nómina debe ser positivo" })
  pctNomina!: number;

  @IsOptional()
  @IsString({ message: "La observación debe ser un texto" })
  observation?: string;
}

export class ConsolidatedCommissionCalculationResponseDto {
  @Expose()
  id!: number;

  @Expose()
  employee!: EmployeeHistoryResponseDto | null;

  @Expose()
  totalCommissionProductLine!: number;

  @Expose()
  totalCommissionProductEstategic!: number;

  @Expose()
  totalHoursExtra!: number;

  @Expose()
  totalNomina!: number;

  @Expose()
  pctNomina!: number;

  @Expose()
  observation?: string;

  @Expose()
  calculateDate!: Date;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export class ConsolidatedCommissionCalculationPaginationResponseDto {
  @Expose()
  data!: ConsolidatedCommissionCalculationResponseDto[];

  @Expose()
  total!: number;
}

export class ConsolidateDataResponseDto {
  @Expose()
  productCompliance!: ProductComplianceResponseDto[];

  @Expose()
  calculationProductExtrategic!: CalculationProductExtrategicResponseDto;

  @Expose()
  consolidatedCommissionCalculation!: ConsolidatedCommissionCalculationResponseDto;
}
