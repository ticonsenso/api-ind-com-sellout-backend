import {Expose} from "class-transformer";
import {IsInt, IsNotEmpty, IsOptional, IsString, MaxLength,} from "class-validator";
import {CompanyResponseDto} from "./companies.dto";

export class CreateDetailTablesConfigDto {
  @IsInt({ message: "El ID de la compañía debe ser un número entero" })
  @IsNotEmpty({ message: "El ID de la compañía es requerido" })
  companyId!: number;

  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre es requerido" })
  @MaxLength(255, { message: "El nombre no puede exceder los 255 caracteres" })
  name!: string;

  @IsString({ message: "La descripción debe ser una cadena de texto" })
  @IsOptional()
  description?: string;
}

export class UpdateDetailTablesConfigDto {
  @IsInt({ message: "El ID de la compañía debe ser un número entero" })
  @IsOptional()
  companyId?: number;

  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsOptional()
  @MaxLength(255, { message: "El nombre no puede exceder los 255 caracteres" })
  name?: string;

  @IsString({ message: "La descripción debe ser una cadena de texto" })
  @IsOptional()
  description?: string;
}

export class DetailTablesConfigResponseDto {
  @Expose()
  id!: number;

  @Expose()
  companyId!: number;

  @Expose()
  name!: string;

  @Expose()
  description!: string;
  company!: CompanyResponseDto;
}

export class DetailTablesConfigSearchParamsDto {
  @IsInt({ message: "El ID debe ser un número entero" })
  @IsOptional()
  id?: number;

  @IsInt({ message: "El ID de la compañía debe ser un número entero" })
  @IsOptional()
  companyId?: number;

  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsOptional()
  name?: string;
}

export class DetailTablesConfigWithTotalResponseDto {
  items!: DetailTablesConfigResponseDto[];
  total!: number;
}
