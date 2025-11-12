import {Exclude, Expose, Type} from 'class-transformer';
import {IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import {CompanyResponseDto} from './companies.dto';
import {CompanyPositionResponseDto} from './company.positions.dto';

export class CreateEmployeeDto {
  @IsNumber()
  companyId!: number;

  @IsNumber()
  companyPositionId!: number;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  documentNumber!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string | null;

  @IsString()
  @IsOptional()
  city?: string | null;

  @IsString()
  dateInitialContract!: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsString()
  @IsOptional()
  supervisorId?: string | null;

  @IsNumber()
  salary!: number;

  @IsNumber()
  variableSalary!: number;

  @IsString()
  @IsOptional()
  section?: string | null;

  @IsString()
  @IsOptional()
  ceco?: string | null;

  @IsString()
  @IsOptional()
  descUniNego?: string | null;

  @IsString()
  @IsOptional()
  descDivision?: string | null;

  @IsString()
  @IsOptional()
  descDepar?: string | null;

  @IsString()
  @IsOptional()
  subDepar?: string | null;

  @IsNumber()
  @IsOptional()
  month?: number;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  employeeType?: string | null;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsNumber({}, { message: 'El ID del cargo debe ser un número' })
  companyPositionId?: number;

  @IsOptional()
  @IsString({ message: 'El código debe ser una cadena de texto' })
  code?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  documentNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  city?: string;

  @IsOptional()
  @IsDate({ message: 'La fecha de inicio de contrato debe ser una fecha válida' })
  @Type(() => Date)
  dateInitialContract?: Date;

  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  isActive?: boolean;

  @IsOptional()
  @IsString({ message: 'El ID del supervisor debe ser una cadena de texto' })
  supervisorId?: string | null;

  @IsOptional()
  @IsNumber({}, { message: 'El salario debe ser un número' })
  salary?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El salario variable debe ser un número' })
  variableSalary?: number;

  @IsOptional()
  @IsString({ message: 'La sección debe ser una cadena de texto' })
  section?: string;

  @IsOptional()
  @IsString({ message: 'El ceco debe ser una cadena de texto' })
  ceco?: string;

  @IsOptional()
  @IsString({ message: 'La unidad de negocio debe ser una cadena de texto' })
  descUniNego?: string;

  @IsOptional()
  @IsString({ message: 'La división debe ser una cadena de texto' })
  descDivision?: string;

  @IsOptional()
  @IsString({ message: 'El departamento debe ser una cadena de texto' })
  descDepar?: string;

  @IsOptional()
  @IsString({ message: 'El subdepartamento debe ser una cadena de texto' })
  subDepar?: string;

  @IsOptional()
  @IsString({ message: 'El tipo de empleado debe ser una cadena de texto' })
  employeeType?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El mes debe ser un número entre 1 y 12' })
  month?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El año debe ser un número' })
  year?: number;
}

export class EmployeeResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CompanyResponseDto)
  company!: CompanyResponseDto;

  @Expose()
  @Type(() => CompanyPositionResponseDto)
  companyPosition!: CompanyPositionResponseDto;

  @Expose()
  code!: number;

  @Expose()
  name!: string;

  @Expose()
  documentNumber!: string;

  @Expose()
  email!: string;

  @Expose()
  phone!: string;

  @Expose()
  city!: string;

  @Expose()
  dateInitialContract!: Date;

  @Expose()
  isActive!: boolean;

  @Expose()
  supervisorId!: string | null;

  @Expose()
  supervisorName!: string | null;

  @Expose()
  salary!: Number;

  @Expose()
  variableSalary!: Number;

  @Expose()
  descUniNego!: string;

  @Expose()
  descDivision!: string;

  @Expose()
  descDepar!: string;

  @Expose()
  subDepar!: string;

  @Expose()
  ceco!: string;

  @Expose()
  section!: string;

  @Expose()
  employeeType!: string;

  @Expose()
  month!: number;

  @Expose()
  year!: number;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;
}

export class EmployeeSupervisorResponseDto {
  @Expose()
  id!: number;

  @Expose()
  codeSupervisor!: string;

  @Expose()
  nameSupervisor!: string;

}

export class EmployeeZoneResponseDto {
  @Expose()
  id!: number;

  @Expose()
  codeZone!: string;

  @Expose()
  nameEmployeeZone!: string;
}

export class EmployeePromotorResponseDto {
  @Expose()
  id!: number;

  @Expose()
  codePromotor!: string;

  @Expose()
  nameEmployeePromotor!: string;
}

export class EmployeePromotorPiResponseDto {
  @Expose()
  id!: number;

  @Expose()
  codePromotorPi!: string;

  @Expose()
  nameEmployeePromotorPi!: string;
}

export class EmployeePromotorTvResponseDto {
  @Expose()
  id!: number;

  @Expose()
  codePromotorTv!: string;

  @Expose()
  nameEmployeePromotorTv!: string;
}

export class EmployeeResponseSearchDto {
  @Expose()
  items!: EmployeeResponseDto[];

  @Expose()
  total!: number;
}

export class EmployeeListResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => CompanyResponseDto)
  company!: CompanyResponseDto;

  @Expose()
  code!: string;

  @Expose()
  name!: string;

  @Expose()
  documentNumber!: string;

  @Expose()
  city!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  salary!: number;

  @Expose()
  variableSalary!: number;
}

export class EmployeeSearchDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Expose()
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El ID de la empresa debe ser un número' })
  @Expose()
  companyId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del cargo debe ser un número' })
  @Expose()
  companyPositionId?: number;

}
