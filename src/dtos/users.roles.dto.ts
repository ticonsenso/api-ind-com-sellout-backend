import {IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import {Expose, Type} from 'class-transformer';
import {UserResponseDto} from './users.dto';
import {RoleResponseDto} from './roles.dto';

export class CreateUserRoleDto {
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @Expose()
  userId!: number;

  @IsNumber({}, { message: 'El ID del rol debe ser un número' })
  @IsNotEmpty({ message: 'El ID del rol es requerido' })
  @Expose()
  roleId!: number;
}

export class UpdateUserRoleDto {
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  @IsOptional()
  @Expose()
  userId?: number;

  @IsNumber({}, { message: 'El ID del rol debe ser un número' })
  @IsOptional()
  @Expose()
  roleId?: number;
}

export class UserRoleResponseDto {
  @Expose()
  id!: number;

  @Expose()
  @Type(() => UserResponseDto)
  user!: UserResponseDto;

  @Expose()
  @Type(() => RoleResponseDto)
  role!: RoleResponseDto;
}

export class FilterUserRoleDto {
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  @IsOptional()
  @Expose()
  userId?: number;

  @IsNumber({}, { message: 'El ID del rol debe ser un número' })
  @IsOptional()
  @Expose()
  roleId?: number;
}
