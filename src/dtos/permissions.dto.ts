import {IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';
import {Expose} from 'class-transformer';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder los 255 caracteres' })
  @Expose()
  name!: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  status?: boolean;

  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @IsString()
  @IsOptional()
  @Expose()
  shortDescription?: string;
}

export class UpdatePermissionDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder los 255 caracteres' })
  @Expose()
  name?: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  status?: boolean;

  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @IsString()
  @IsOptional()
  @Expose()
  shortDescription?: string;
}

export class PermissionResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  status!: boolean;

  @Expose()
  description?: string;

  @Expose()
  shortDescription?: string;
}

export class FilterPermissionDto {
  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  status?: boolean;
}
