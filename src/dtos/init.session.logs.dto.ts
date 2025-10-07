import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

/**
 * DTO para crear un nuevo registro de sesión
 */
export class CreateInitSessionLogsDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsString()
  @IsNotEmpty()
  sessionIndex!: string;

  @IsString()
  @IsNotEmpty()
  inResponseTo!: string;
}

/**
 * DTO para actualizar un registro de sesión existente
 */
export class UpdateInitSessionLogsDto {
  @IsOptional()
  @IsDateString()
  logoutTime?: Date;
}
