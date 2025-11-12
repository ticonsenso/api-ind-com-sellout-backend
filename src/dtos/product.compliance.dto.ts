import {Expose} from "class-transformer";
import {IsInt, IsNotEmpty, IsNumber, IsPositive} from "class-validator";
import {CompanyResponseDto} from "./companies.dto";
import {EmployeeResponseDto} from "./employees.dto";
import {ParameterLineResponseDto} from "./parameter.lines.dto";

export class CreateProductComplianceDto {
  @IsNotEmpty({ message: "El valor de venta es requerido" })
  @IsNumber({}, { message: "El valor de venta debe ser un número" })
  @IsPositive({ message: "El valor de venta debe ser positivo" })
  saleValue!: number;

  @IsNotEmpty({ message: "El valor del presupuesto es requerido" })
  @IsNumber({}, { message: "El valor del presupuesto debe ser un número" })
  @IsPositive({ message: "El valor del presupuesto debe ser positivo" })
  budgetValue!: number;

  @IsNotEmpty({ message: "El ID del empleado es requerido" })
  @IsInt({ message: "El ID del empleado debe ser un número entero" })
  @IsPositive({ message: "El ID del empleado debe ser positivo" })
  employeeCode!: string;

  @IsNotEmpty({ message: "El ID de la línea de producto es requerido" })
  @IsInt({ message: "El ID de la línea de producto debe ser un número entero" })
  @IsPositive({ message: "El ID de la línea de producto debe ser positivo" })
  parameterLine!: string;

  @IsNotEmpty({ message: "La fecha de cálculo es requerida" })
  calculateDate!: Date;
}

export class UpdateProductComplianceDto {
  @IsNotEmpty({ message: "El valor de venta es requerido" })
  @IsNumber({}, { message: "El valor de venta debe ser un número" })
  @IsPositive({ message: "El valor de venta debe ser positivo" })
  saleValue!: number;

  @IsNotEmpty({ message: "El valor del presupuesto es requerido" })
  @IsNumber({}, { message: "El valor del presupuesto debe ser un número" })
  @IsPositive({ message: "El valor del presupuesto debe ser positivo" })
  budgetValue!: number;

  @IsNotEmpty({ message: "El ID de la línea de producto es requerido" })
  @IsInt({ message: "El ID de la línea de producto debe ser un número entero" })
  @IsPositive({ message: "El ID de la línea de producto debe ser positivo" })
  parameterLine!: string;

  @IsNotEmpty({ message: "La fecha de cálculo es requerida" })
  calculateDate!: Date;
}

export class ProductComplianceResponseDto {
  @Expose()
  id!: number;

  @Expose()
  saleValue!: number;

  @Expose()
  budgetValue!: number;

  @Expose()
  compliancePercentage!: number;

  @Expose()
  compliancePercentageMax!: number;

  @Expose()
  weight!: number;

  @Expose()
  valueBaseVariable!: number;

  @Expose()
  variableAmount!: number;

  @Expose()
  calculateDate!: Date;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  @Expose()
  company!: CompanyResponseDto;

  @Expose()
  employee!: EmployeeResponseDto;

  @Expose()
  parameterLine!: ParameterLineResponseDto;
}

export class ProductComplianceResponseDtoPaginated {
  @Expose()
  data!: ProductComplianceResponseDto[];

  @Expose()
  total!: number;
}
