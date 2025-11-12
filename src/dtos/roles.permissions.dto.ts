import {IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import {Expose, Type} from 'class-transformer';
import {RoleResponseDto} from './roles.dto';
import {PermissionResponseDto} from './permissions.dto';

export class CreateRolePermissionDto {
  @IsNumber({}, { message: 'El ID del rol debe ser un número' })
  @IsNotEmpty({ message: 'El ID del rol es requerido' })
  @Expose()
  roleId!: number;

  @IsNumber({}, { message: 'El ID del permiso debe ser un número' })
  @IsNotEmpty({ message: 'El ID del permiso es requerido' })
  @Expose()
  permissionId!: number;
}

export class UpdateRolePermissionDto {
  @IsNumber({}, { message: 'El ID del rol debe ser un número' })
  @IsOptional()
  @Expose()
  roleId?: number;

  @IsNumber({}, { message: 'El ID del permiso debe ser un número' })
  @IsOptional()
  @Expose()
  permissionId?: number;
}

export class RolePermissionResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => RoleResponseDto)
  role!: RoleResponseDto;

  @Expose()
  @Type(() => PermissionResponseDto)
  permission!: PermissionResponseDto;
}

export class FilterRolePermissionDto {
  @IsNumber({}, { message: 'El ID del rol debe ser un número' })
  @IsOptional()
  @Expose()
  roleId?: number;

  @IsNumber({}, { message: 'El ID del permiso debe ser un número' })
  @IsOptional()
  @Expose()
  permissionId?: number;
}
