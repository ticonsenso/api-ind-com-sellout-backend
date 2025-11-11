import {Expose, Type} from "class-transformer";
import {
    IsDate,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    ValidateNested,
} from "class-validator";
import {DataSourceResponseDto} from "./data.sources.dto";
import {UserResponseDto} from "./users.dto";
import {UserConsenso} from "../interfaces/user.consenso";

export class CreateExtractionLogDto {
  @IsNotEmpty({ message: "La hora de inicio es requerida" })
  @IsDate({ message: "La hora de inicio debe ser una fecha válida" })
  startTime!: Date;

  @IsOptional()
  @IsDate({ message: "La hora de finalización debe ser una fecha válida" })
  endTime?: Date;

  @IsOptional()
  @IsString({ message: "El estado debe ser una cadena de texto" })
  status?: string;

  @IsOptional()
  @IsNumber({}, { message: "El número de registros extraídos debe ser un número" })
  recordsExtracted?: number;

  @IsOptional()
  @IsNumber({}, { message: "El número de registros procesados debe ser un número" })
  recordsProcessed?: number;

  @IsOptional()
  @IsNumber({}, { message: "El número de registros fallidos debe ser un número" })
  recordsFailed?: number;

  @IsOptional()
  @IsString({ message: "El mensaje de error debe ser una cadena de texto" })
  errorMessage?: string;

  @IsOptional()
  @IsObject({ message: "Los detalles de ejecución deben ser un objeto válido" })
  executionDetails?: object;

  @IsNotEmpty({ message: "El ID de la fuente de datos es requerido" })
  @IsInt({ message: "El ID de la fuente de datos debe ser un número entero" })
  @IsPositive({ message: "El ID de la fuente de datos debe ser un número positivo" })
  dataSourceId!: number;

  @IsOptional()
  @IsInt({ message: "El ID del ejecutor debe ser un número entero" })
  @IsPositive({ message: "El ID del ejecutor debe ser un número positivo" })
  executorId?: number;
}

export class UpdateExtractionLogDto {
  @IsOptional()
  @IsDate({ message: "La hora de inicio debe ser una fecha válida" })
  startTime?: Date;

  @IsOptional()
  @IsDate({ message: "La hora de finalización debe ser una fecha válida" })
  endTime?: Date;

  @IsOptional()
  @IsString({ message: "El estado debe ser una cadena de texto" })
  status?: string;

  @IsOptional()
  @IsNumber({}, { message: "El número de registros extraídos debe ser un número" })
  recordsExtracted?: number;

  @IsOptional()
  @IsNumber({}, { message: "El número de registros procesados debe ser un número" })
  recordsProcessed?: number;

  @IsOptional()
  @IsNumber({}, { message: "El número de registros fallidos debe ser un número" })
  recordsFailed?: number;

  @IsOptional()
  @IsString({ message: "El mensaje de error debe ser una cadena de texto" })
  errorMessage?: string;

  @IsOptional()
  @IsObject({ message: "Los detalles de ejecución deben ser un objeto válido" })
  executionDetails?: object;

  @IsOptional()
  @IsInt({ message: "El ID de la fuente de datos debe ser un número entero" })
  @IsPositive({ message: "El ID de la fuente de datos debe ser un número positivo" })
  dataSourceId?: number;

  @IsOptional()
  @IsInt({ message: "El ID del ejecutor debe ser un número entero" })
  @IsPositive({ message: "El ID del ejecutor debe ser un número positivo" })
  executorId?: number;
}

export class ExtractionLogResponseDto {
  @Expose()
  @IsInt()
  id!: number;

  @Expose()
  @IsDate()
  startTime!: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  endTime!: Date;

  @Expose()
  @IsString()
  status!: string;

  @Expose()
  @IsNumber()
  recordsExtracted!: number;

  @Expose()
  @IsNumber()
  recordsProcessed!: number;

  @Expose()
  @IsNumber()
  recordsFailed!: number;

  @Expose()
  @IsOptional()
  @IsString()
  errorMessage!: string;

  @Expose()
  @IsOptional()
  @IsObject()
  executionDetails!: object;

  @Expose()
  @ValidateNested()
  @Type(() => DataSourceResponseDto)
  dataSource!: DataSourceResponseDto;

  @Expose()
  @ValidateNested()
  @Type(() => UserResponseDto)
  executor!: UserResponseDto;
}

export class SearchExtractionLogDto {
  @IsOptional()
  @IsDate({ message: "La hora de inicio debe ser una fecha válida" })
  startTime?: Date;

  @IsOptional()
  @IsDate({ message: "La hora de finalización debe ser una fecha válida" })
  endTime?: Date;

  @IsOptional()
  @IsString({ message: "El estado debe ser una cadena de texto" })
  status?: string;

  @IsOptional()
  @IsInt({ message: "El ID de la fuente de datos debe ser un número entero" })
  @IsPositive({ message: "El ID de la fuente de datos debe ser un número positivo" })
  dataSourceId?: number;

  @IsOptional()
  @IsInt({ message: "El ID del ejecutor debe ser un número entero" })
  @IsPositive({ message: "El ID del ejecutor debe ser un número positivo" })
  executorId?: number;
}

export class ExtractionLogListResponseDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ExtractionLogResponseDto)
  items!: ExtractionLogResponseDto[];

  @Expose()
  @IsInt()
  total!: number;
}

export class ExtractionLogLocalDto {
  @IsNotEmpty({ message: "El tipo de acción es requerido" })
  @IsString({ message: "El tipo de acción debe ser una cadena de texto" })
  typeAction!: string; // "CREATE" o "UPDATE"

  @IsNotEmpty({ message: "El estado es requerido" })
  @IsString({ message: "El estado debe ser una cadena de texto" })
  status!: string;

  @IsNotEmpty({ message: "El ID de la fuente de datos es requerido" })
  @IsInt({ message: "El ID de la fuente de datos debe ser un número entero" })
  @IsPositive({
    message: "El ID de la fuente de datos debe ser un número positivo",
  })
  dataSourceId!: number;

  @IsNotEmpty({ message: "El número de registros extraídos es requerido" })
  @IsNumber(
    {},
    { message: "El número de registros extraídos debe ser un número" }
  )
  recordsExtracted!: number;

  @IsNotEmpty({ message: "El número de registros procesados es requerido" })
  @IsNumber(
    {},
    { message: "El número de registros procesados debe ser un número" }
  )
  recordsProcessed!: number;

  @IsNotEmpty({ message: "El número de registros fallidos es requerido" })
  @IsNumber(
    {},
    { message: "El número de registros fallidos debe ser un número" }
  )
  recordsFailed!: number;

  @IsOptional()
  @IsString({ message: "El mensaje de error debe ser una cadena de texto" })
  errorMessage?: string;

  @IsNotEmpty({ message: "Los detalles de ejecución son requeridos" })
  @IsObject({ message: "Los detalles de ejecución deben ser un objeto válido" })
  executionDetails!: object;

  @IsNotEmpty({ message: "El usuario es requerido" })
  userConsenso!: UserConsenso;
}
