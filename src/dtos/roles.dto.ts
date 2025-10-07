import { IsString, IsNotEmpty, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { PermissionResponseDto } from './permissions.dto';
import { UserResponseDto } from './users.dto';

export class CreateRoleDto {
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
}

export class UpdateRoleDto {
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
}

export class RoleResponseDto {
  @Expose()
  user!: UserResponseDto;

  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  status!: boolean;

  @Expose()
  @Type(() => PermissionResponseDto)
  permissions!: PermissionResponseDto[];
}

export class FilterRoleDto {
  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  status?: boolean;
}
