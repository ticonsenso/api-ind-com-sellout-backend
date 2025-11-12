import {Expose, Type} from "class-transformer";
import {IsDate, IsNotEmpty, IsNumber, IsOptional, IsString,} from "class-validator";
import {CompanyResponseDto} from "./companies.dto";
import {CompanyPositionResponseDto} from "./company.positions.dto";
import {EmployeeResponseDto} from "./employees.dto";
import {KpiConfigResponseDto} from "./kpi.config.dto";

export class CreateCalculationProductExtrategicDto {
  @IsNotEmpty({ message: "El código del empleado es requerido" })
  @IsString({ message: "El código del empleado debe ser una cadena de texto" })
  employeeCode!: string;

  @IsNotEmpty({ message: "La ciudad es requerida" })
  @IsString({ message: "La ciudad debe ser una cadena de texto" })
  city!: string;

  @IsOptional()
  @IsString({ message: "La regional debe ser una cadena de texto" })
  regional?: string;

  @IsNotEmpty({ message: "La fecha de cálculo es requerida" })
  @IsDate({ message: "La fecha de cálculo debe ser una fecha válida" })
  @Type(() => Date)
  calculateDate!: Date;

  @IsNotEmpty({ message: "La utilidad bruta real es requerida" })
  @IsNumber({}, { message: "La utilidad bruta real debe ser un número" })
  ubReal!: number;

  @IsNotEmpty({ message: "El valor presupuestado es requerido" })
  @IsNumber({}, { message: "El valor presupuestado debe ser un número" })
  budgetValue!: number;

  @IsNotEmpty({ message: "La exhibición es requerida" })
  @IsNumber({}, { message: "La exhibición debe ser un número" })
  exhibition!: number;

  @IsNotEmpty({ message: "El total de exhibición es requerido" })
  @IsNumber({}, { message: "El total de exhibición debe ser un número" })
  totalExhibition!: number;

  @IsNotEmpty({ message: "Las unidades vendidas son requeridas" })
  @IsNumber({}, { message: "Las unidades vendidas deben ser un número" })
  unitsSold!: number;

  @IsNotEmpty({ message: "Las unidades exhibidas son requeridas" })
  @IsNumber({}, { message: "Las unidades exhibidas deben ser un número" })
  unitsExhibited!: number;

  @IsNotEmpty({ message: "La versión es requerida" })
  @IsNumber({}, { message: "La versión debe ser un número" })
  versionId!: number;
}

export class CalculationProductExtrategicResponseDto {
  @Expose()
  id!: number;

  @Expose()
  company!: CompanyResponseDto;

  @Expose()
  companyPosition!: CompanyPositionResponseDto;

  @Expose()
  employee!: EmployeeResponseDto;

  @Expose()
  kpiConfig!: KpiConfigResponseDto;

  @Expose()
  city!: string;

  @Expose()
  regional!: string;

  @Expose()
  calculateDate!: Date;

  @Expose()
  ubReal!: number;

  @Expose()
  budgetValue!: number;

  @Expose()
  strategicCompliancePct!: number;

  @Expose()
  exhibition!: number;

  @Expose()
  totalExhibition!: number;

  @Expose()
  exhibitionPct!: number;

  @Expose()
  unitsSold!: number;

  @Expose()
  unitsExhibited!: number;

  @Expose()
  rotationPct!: number;

  @Expose()
  productivityPct!: number;

  @Expose()
  appliesBonus!: boolean;

  @Expose()
  valueProductExtrategic!: number;

  @Expose()
  observation!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export class CalculationProductExtrategicPaginationResponseDto {
  @Expose()
  data!: CalculationProductExtrategicResponseDto[];

  @Expose()
  total!: number;
}
