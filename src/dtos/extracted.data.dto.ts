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
  ValidateNested,
} from "class-validator";
import { DataSourceResponseDto } from "./data.sources.dto";
import { ExtractionLogResponseDto } from "./extraction.logs.dto";
import { UserResponseDto } from "./users.dto";

export class CreateExtractedDataDto {
  @IsNotEmpty({ message: "La fecha de extracción es requerida" })
  @IsDate({ message: "La fecha de extracción debe ser una fecha válida" })
  extractionDate!: Date;

  @IsNotEmpty({ message: "El contenido de datos es requerido" })
  @IsObject({ message: "El contenido de datos debe ser un objeto válido" })
  dataContent!: object;

  @IsOptional()
  @IsNumber({}, { message: "El conteo de registros debe ser un número" })
  recordCount?: number;

  @IsNotEmpty({ message: "El ID de la fuente de datos es requerido" })
  @IsInt({ message: "El ID de la fuente de datos debe ser un número entero" })
  @IsPositive({
    message: "El ID de la fuente de datos debe ser un número positivo",
  })
  dataSourceId!: number;

  @IsOptional()
  @IsString({ message: "El nombre de los datos debe ser una cadena de texto" })
  dataName?: string;

  @IsOptional()
  @IsString({ message: "La fecha de cálculo debe ser una cadena de texto" })
  calculateDate?: string;
}

export class UpdateExtractedDataDto {
  @IsOptional()
  @IsDate({ message: "La fecha de extracción debe ser una fecha válida" })
  extractionDate?: Date;

  @IsOptional()
  @IsObject({ message: "El contenido de datos debe ser un objeto válido" })
  dataContent?: object;

  @IsOptional()
  @IsNumber({}, { message: "El conteo de registros debe ser un número" })
  recordCount?: number;

  @IsOptional()
  @IsBoolean({
    message: "El estado de procesamiento debe ser un valor booleano",
  })
  isProcessed?: boolean;

  @IsOptional()
  @IsDate({ message: "La fecha de procesamiento debe ser una fecha válida" })
  processedDate?: Date;

  @IsOptional()
  @IsObject({
    message: "Los detalles de procesamiento deben ser un objeto válido",
  })
  processingDetails?: object;

  @IsOptional()
  @IsInt({ message: "El ID de la fuente de datos debe ser un número entero" })
  @IsPositive({
    message: "El ID de la fuente de datos debe ser un número positivo",
  })
  dataSourceId?: number;

  @IsOptional()
  @IsInt({
    message: "El ID del registro de extracción debe ser un número entero",
  })
  @IsPositive({
    message: "El ID del registro de extracción debe ser un número positivo",
  })
  extractionLogId?: number;

  @IsOptional()
  @IsString({ message: "El nombre de los datos debe ser una cadena de texto" })
  dataName?: string;

  @IsOptional()
  @IsString({ message: "La fecha de cálculo debe ser una cadena de texto" })
  calculateDate?: string;

}

export class ExtractedDataResponseDto {
  @Expose()
  @IsInt()
  id!: number;

  @Expose()
  @IsDate()
  extractionDate!: Date;

  @Expose()
  @IsNumber()
  recordCount!: number;

  @Expose()
  @IsBoolean()
  isProcessed!: boolean;

  @Expose()
  @IsOptional()
  @IsDate()
  processedDate!: Date;

  @Expose()
  @IsOptional()
  @IsObject()
  processingDetails!: object;

  @Expose()
  @ValidateNested()
  @Type(() => DataSourceResponseDto)
  dataSource!: DataSourceResponseDto;

  @Expose()
  @ValidateNested()
  @Type(() => ExtractionLogResponseDto)
  extractionLog!: ExtractionLogResponseDto;

  @Expose()
  @ValidateNested()
  @Type(() => UserResponseDto)
  processor!: UserResponseDto;

  @Expose()
  @ValidateNested()
  @Type(() => UserResponseDto)
  creator!: UserResponseDto;

  @Expose()
  @IsOptional()
  @IsString({ message: "El nombre de los datos debe ser una cadena de texto" })
  dataName?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "La fecha de cálculo debe ser una cadena de texto" })
  calculateDate?: string;
}

export class SearchExtractedDataDto {
  @IsOptional()
  @IsDate({ message: "La fecha de extracción debe ser una fecha válida" })
  extractionDate?: Date;

  @IsOptional()
  @IsBoolean({
    message: "El estado de procesamiento debe ser un valor booleano",
  })
  isProcessed?: boolean;

  @IsOptional()
  @IsDate({ message: "La fecha de procesamiento debe ser una fecha válida" })
  processedDate?: Date;

  @IsOptional()
  @IsInt({ message: "El ID de la fuente de datos debe ser un número entero" })
  @IsPositive({
    message: "El ID de la fuente de datos debe ser un número positivo",
  })
  dataSourceId?: number;

  @IsOptional()
  @IsInt({
    message: "El ID del registro de extracción debe ser un número entero",
  })
  @IsPositive({
    message: "El ID del registro de extracción debe ser un número positivo",
  })
  extractionLogId?: number;

  @IsOptional()
  @IsInt({ message: "El ID del procesador debe ser un número entero" })
  @IsPositive({ message: "El ID del procesador debe ser un número positivo" })
  processorId?: number;

  @IsOptional()
  @IsInt({ message: "El ID del creador debe ser un número entero" })
  @IsPositive({ message: "El ID del creador debe ser un número positivo" })
  creatorId?: number;
}

export class ExtractedDataListResponseDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ExtractedDataResponseDto)
  items!: ExtractedDataResponseDto[];

  @Expose()
  @IsInt()
  total!: number;
}
