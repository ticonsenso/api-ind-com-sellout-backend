import { Expose, Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { UserResponseDto } from "./users.dto";

export class CreateDataSourceColumnConfigDto {
  @IsOptional()
  @IsString({ message: "El nombre de la columna debe ser una cadena de texto" })
  @MaxLength(255, {
    message: "El nombre de la columna no debe exceder los 255 caracteres",
  })
  columnName!: string;

  @IsOptional()
  @IsNumber({}, { message: "El índice de la columna debe ser un número" })
  columnIndex!: number;

  @IsOptional()
  @IsString({ message: "La letra de la columna debe ser una cadena de texto" })
  @MaxLength(10, {
    message: "La letra de la columna no debe exceder los 10 caracteres",
  })
  columnLetter!: string;

  @IsNotEmpty({ message: "El tipo de datos es requerido" })
  @IsString({ message: "El tipo de datos debe ser una cadena de texto" })
  @MaxLength(50, {
    message: "El tipo de datos no debe exceder los 50 caracteres",
  })
  dataType!: string;

  @IsOptional()
  @IsString({ message: "El patrón de formato debe ser una cadena de texto" })
  @MaxLength(100, {
    message: "El patrón de formato no debe exceder los 100 caracteres",
  })
  formatPattern!: string;

  @IsOptional()
  @IsBoolean({ message: "El campo requerido debe ser un valor booleano" })
  isRequired!: boolean;

  @IsOptional()
  @IsString({ message: "El valor por defecto debe ser una cadena de texto" })
  defaultValue!: string;

  @IsOptional()
  @IsString({ message: "El campo de mapeo debe ser una cadena de texto" })
  @MaxLength(255, {
    message: "El campo de mapeo no debe exceder los 255 caracteres",
  })
  @Expose()
  mappingToField!: string;

  @IsOptional()
  @IsInt({ message: "La fila de encabezado debe ser un número entero" })
  @IsPositive({ message: "La fila de encabezado debe ser un número positivo" })
  @Expose()
  headerRow!: number;

  @IsOptional()
  @IsInt({ message: "La fila de inicio debe ser un número entero" })
  @IsPositive({ message: "La fila de inicio debe ser un número positivo" })
  @Expose()
  startRow!: number;

  @IsOptional()
  @IsBoolean({ message: "El estado activo debe ser un valor booleano" })
  @Expose()
  isActive!: boolean;

  @IsOptional()
  @IsBoolean({ message: "El valor negativo debe ser un valor booleano" })
  @Expose()
  hasNegativeValue!: boolean;

  @IsNotEmpty({ message: "El ID de la fuente de datos es requerido" })
  @IsInt({ message: "El ID de la fuente de datos debe ser un número entero" })
  @IsPositive({
    message: "El ID de la fuente de datos debe ser un número positivo",
  })
  @Expose()
  dataSourceId!: number;

  @IsOptional()
  @IsInt({ message: "El ID del creador debe ser un número entero" })
  @Expose()
  createdBy!: number;

  @IsOptional()
  @IsInt({ message: "El ID del actualizador debe ser un número entero" })
  @Expose()
  updatedBy!: number;
}

export class UpdateDataSourceColumnConfigDto {
  @IsOptional()
  @IsString({ message: "El nombre de la columna debe ser una cadena de texto" })
  @MaxLength(255, {
    message: "El nombre de la columna no debe exceder los 255 caracteres",
  })
  columnName?: string;

  @IsOptional()
  @IsNumber({}, { message: "El índice de la columna debe ser un número" })
  columnIndex?: number;

  @IsOptional()
  @IsString({ message: "La letra de la columna debe ser una cadena de texto" })
  @MaxLength(10, {
    message: "La letra de la columna no debe exceder los 10 caracteres",
  })
  columnLetter?: string;

  @IsOptional()
  @IsString({ message: "El tipo de datos debe ser una cadena de texto" })
  @MaxLength(50, {
    message: "El tipo de datos no debe exceder los 50 caracteres",
  })
  dataType?: string;

  @IsOptional()
  @IsString({ message: "El patrón de formato debe ser una cadena de texto" })
  @MaxLength(100, {
    message: "El patrón de formato no debe exceder los 100 caracteres",
  })
  formatPattern?: string;

  @IsOptional()
  @IsBoolean({ message: "El campo requerido debe ser un valor booleano" })
  isRequired?: boolean;

  @IsOptional()
  @IsString({ message: "El valor por defecto debe ser una cadena de texto" })
  defaultValue?: string;

  @IsOptional()
  @IsString({ message: "El campo de mapeo debe ser una cadena de texto" })
  @MaxLength(255, {
    message: "El campo de mapeo no debe exceder los 255 caracteres",
  })
  mappingToField?: string;

  @IsOptional()
  @IsInt({ message: "La fila de encabezado debe ser un número entero" })
  @IsPositive({ message: "La fila de encabezado debe ser un número positivo" })
  headerRow?: number;

  @IsOptional()
  @IsInt({ message: "La fila de inicio debe ser un número entero" })
  @IsPositive({ message: "La fila de inicio debe ser un número positivo" })
  startRow?: number;

  @IsOptional()
  @IsBoolean({ message: "El estado activo debe ser un valor booleano" })
  isActive?: boolean;

  @IsOptional()
  @IsInt({ message: "El ID de la fuente de datos debe ser un número entero" })
  @IsPositive({
    message: "El ID de la fuente de datos debe ser un número positivo",
  })
  dataSourceId?: number;

  @IsOptional()
  @IsInt({ message: "El ID del actualizador debe ser un número entero" })
  updatedBy?: number;
}

export class DataSourceResponseDto {
  @IsInt({ message: "El ID debe ser un número entero" })
  @Expose()
  id!: number;

  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @Expose()
  name!: string;

  @IsOptional()
  @IsString({ message: "La descripción debe ser una cadena de texto" })
  @Expose()
  description!: string;

  @IsString({ message: "El tipo de fuente debe ser una cadena de texto" })
  @Expose()
  sourceType!: string;

  @IsOptional()
  @IsObject({ message: "La información de conexión debe ser un objeto" })
  @Expose()
  connectionInfo!: Record<string, any>;

  @IsOptional()
  @IsObject({ message: "Los parámetros de configuración deben ser un objeto" })
  @Expose()
  configParams!: Record<string, any>;

  @IsBoolean({ message: "La extracción automática debe ser un valor booleano" })
  @Expose()
  autoExtract!: boolean;

  @IsOptional()
  @IsString({
    message: "La frecuencia de extracción debe ser una cadena de texto",
  })
  @Expose()
  extractionFrequency!: string;

  @IsOptional()
  @IsDate({
    message: "La fecha de última extracción debe ser una fecha válida",
  })
  @Expose()
  lastExtractionDate!: Date;
}

export class DataSourceColumnConfigResponseDto {
  @IsInt({ message: "El ID debe ser un número entero" })
  @Expose()
  id!: number;

  @IsOptional()
  @IsString({ message: "El nombre de la columna debe ser una cadena de texto" })
  @Expose()
  columnName!: string;

  @IsOptional()
  @IsNumber({}, { message: "El índice de la columna debe ser un número" })
  @Expose()
  columnIndex!: number;

  @IsOptional()
  @IsString({ message: "La letra de la columna debe ser una cadena de texto" })
  @Expose()
  columnLetter!: string;

  @IsString({ message: "El tipo de datos debe ser una cadena de texto" })
  @Expose()
  dataType!: string;

  @IsOptional()
  @IsString({ message: "El patrón de formato debe ser una cadena de texto" })
  @Expose()
  formatPattern!: string;

  @IsBoolean({ message: "El campo requerido debe ser un valor booleano" })
  @Expose()
  isRequired!: boolean;

  @IsOptional()
  @IsString({ message: "El valor por defecto debe ser una cadena de texto" })
  @Expose()
  defaultValue!: string;

  @IsOptional()
  @IsString({ message: "El campo de mapeo debe ser una cadena de texto" })
  @Expose()
  mappingToField!: string;

  @IsInt({ message: "La fila de encabezado debe ser un número entero" })
  @Expose()
  headerRow!: number;

  @IsInt({ message: "La fila de inicio debe ser un número entero" })
  @Expose()
  startRow!: number;

  @IsBoolean({ message: "El estado activo debe ser un valor booleano" })
  @Expose()
  isActive!: boolean;

  @ValidateNested({ message: "La fuente de datos debe ser un objeto válido" })
  @Type(() => DataSourceResponseDto)
  @Expose()
  dataSource!: DataSourceResponseDto;

  @ValidateNested({
    message: "El creador debe ser un objeto de usuario válido",
  })
  @Type(() => UserResponseDto)
  @Expose()
  creator!: UserResponseDto;

  @ValidateNested({
    message: "El actualizador debe ser un objeto de usuario válido",
  })
  @Type(() => UserResponseDto)
  @Expose()
  updater!: UserResponseDto;

  @IsDate({ message: "La fecha de creación debe ser una fecha válida" })
  @Expose()
  createdAt!: Date;

  @IsDate({ message: "La fecha de actualización debe ser una fecha válida" })
  @Expose()
  updatedAt!: Date;
}

export class DataSourceColumnConfigListResponseDto {
  @ValidateNested({
    each: true,
    message: "Los elementos deben ser configuraciones de columna válidas",
  })
  @Type(() => DataSourceColumnConfigResponseDto)
  items!: DataSourceColumnConfigResponseDto[];

  @IsInt({ message: "El total debe ser un número entero" })
  total!: number;

  @IsInt({ message: "La página debe ser un número entero" })
  page!: number;

  @IsInt({ message: "El límite debe ser un número entero" })
  limit!: number;
}

export class SearchDataSourceColumnConfigDto {
  @IsOptional()
  @IsString({ message: "El nombre de la columna debe ser una cadena de texto" })
  @MaxLength(255, {
    message: "El nombre de la columna no debe exceder los 255 caracteres",
  })
  columnName?: string;

  @IsOptional()
  @IsString({ message: "El tipo de datos debe ser una cadena de texto" })
  @MaxLength(50, {
    message: "El tipo de datos no debe exceder los 50 caracteres",
  })
  dataType?: string;

  @IsOptional()
  @IsBoolean({ message: "El estado activo debe ser un valor booleano" })
  isActive?: boolean;

  @IsOptional()
  @IsInt({ message: "El ID de la fuente de datos debe ser un número entero" })
  @IsPositive({
    message: "El ID de la fuente de datos debe ser un número positivo",
  })
  dataSourceId?: number;
}

export class ResponseDataSourceColumnConfigDto {
  @Expose()
  total!: number;

  @Expose()
  items!: DataSourceColumnConfigResponseDto[];
}
