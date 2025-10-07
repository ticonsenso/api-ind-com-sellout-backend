import { IsString, IsNotEmpty, IsEmail, IsBoolean, IsOptional, MinLength, MaxLength, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import { RoleResponseDto } from './roles.dto';
import { CompanyResponseDto } from './companies.dto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El DNI es requerido' })
  @MinLength(5, { message: 'El DNI debe tener al menos 5 caracteres' })
  @MaxLength(255, { message: 'El DNI no puede exceder los 255 caracteres' })
  @Expose()
  dni!: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder los 255 caracteres' })
  @Expose()
  name!: string;

  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @Expose()
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
  @MaxLength(255, { message: 'El teléfono no puede exceder los 255 caracteres' })
  @Expose()
  phone!: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  status?: boolean;

  @IsNumber()
  @IsOptional({ message: 'La compañia es requerida' })
  @Expose()
  companyId?: number;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(5, { message: 'El DNI debe tener al menos 5 caracteres' })
  @MaxLength(255, { message: 'El DNI no puede exceder los 255 caracteres' })
  @Expose()
  dni?: string;

  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder los 255 caracteres' })
  @Expose()
  name?: string;

  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  @IsOptional()
  @Expose()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
  @MaxLength(255, { message: 'El teléfono no puede exceder los 255 caracteres' })
  @Expose()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  status?: boolean;

  @IsNumber()
  @IsOptional()
  @Expose()
  companyId?: number;
}

export class UserResponseDto {
  @Expose()
  id!: number;

  @Expose()
  dni!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  phone!: string;

  @Expose()
  status!: boolean;

  @Expose()
  company?: CompanyResponseDto;

  @Expose()
  roles!: RoleResponseDto[];
}

export class FilterUserDto {
  @IsString()
  @IsOptional()
  @Expose()
  dni?: string;

  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  @IsOptional()
  @Expose()
  email?: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  status?: boolean;

  @IsNumber()
  @IsOptional()
  @Expose()
  company?: CompanyResponseDto;
}
