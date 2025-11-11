import {Expose} from "class-transformer";
import {
    IsBoolean,
    IsDateString,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";
import {SourceType} from "../enums/source.type.enum";

export class CreateDataSourceDto {
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre es requerido" })
  @MinLength(3, { message: "El nombre debe tener entre 3 y 100 caracteres" })
  @MaxLength(255, { message: "El nombre debe tener máximo 255 caracteres" })
  @Expose()
  name!: string;

  @IsString({ message: "La descripción debe ser una cadena de texto" })
  @IsOptional()
  @Expose()
  description?: string;

  @IsEnum(SourceType, { message: "Tipo de fuente de datos no válido" })
  @IsNotEmpty({ message: "El tipo de fuente de datos es requerido" })
  @Expose()
  sourceType!: SourceType;

  @IsObject({ message: "La información de conexión debe ser un objeto" })
  @IsOptional()
  @Expose()
  connectionInfo?: Record<string, any>;

  @IsObject({ message: "Los parámetros de configuración deben ser un objeto" })
  @IsOptional()
  @Expose()
  configParams?: Record<string, any>;

  @IsBoolean({ message: "El campo autoExtract debe ser un valor booleano" })
  @IsOptional()
  @Expose()
  autoExtract?: boolean;

  @IsString({
    message: "La frecuencia de extracción debe ser una cadena de texto",
  })
  @IsOptional()
  @Expose()
  extractionFrequency?: string;

  @IsBoolean({ message: "El campo isActive debe ser un valor booleano" })
  @IsOptional()
  @Expose()
  isActive?: boolean;

  @IsString({ message: "El nombre de la hoja debe ser una cadena de texto" })
  @IsOptional()
  @Expose()
  sheetName?: string;

  @IsInt({ message: "El ID de la compañía debe ser un número entero" })
  @IsOptional()
  @Expose()
  companyId?: number;

  @IsInt({ message: "El día de extracción debe ser un número entero" })
  @IsOptional()
  @Expose()
  dayExtraction?: number;

  @IsString({ message: "La hora de extracción debe ser una cadena de texto" })
  @IsOptional()
  @Expose()
  hourExtraction?: string;
}

export class UpdateDataSourceDto {
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsOptional()
  @Expose()
  name?: string;

  @IsString({ message: "La descripción debe ser una cadena de texto" })
  @IsOptional()
  @Expose()
  description?: string;

  @IsEnum(SourceType, { message: "Tipo de fuente de datos no válido" })
  @IsOptional()
  @Expose()
  sourceType?: SourceType;

  @IsObject({ message: "La información de conexión debe ser un objeto" })
  @IsOptional()
  @Expose()
  connectionInfo?: Record<string, any>;

  @IsObject({ message: "Los parámetros de configuración deben ser un objeto" })
  @IsOptional()
  @Expose()
  configParams?: Record<string, any>;

  @IsBoolean({ message: "El campo autoExtract debe ser un valor booleano" })
  @IsOptional()
  @Expose()
  autoExtract?: boolean;

  @IsString({
    message: "La frecuencia de extracción debe ser una cadena de texto",
  })
  @IsOptional()
  @Expose()
  extractionFrequency?: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        "La fecha de última extracción debe tener un formato de fecha válido (YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss)",
    }
  )
  @Expose()
  lastExtractionDate?: string | Date;

  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        "La fecha de próxima extracción debe tener un formato de fecha válido (YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss)",
    }
  )
  @Expose()
  nextScheduledExtraction?: string | Date;

  @IsString({ message: "El estado de extracción debe ser una cadena de texto" })
  @IsOptional()
  @Expose()
  extractionStatus?: string;

  @IsBoolean({ message: "El campo isActive debe ser un valor booleano" })
  @IsOptional()
  @Expose()
  isActive?: boolean;

  @IsString({ message: "El nombre de la hoja debe ser una cadena de texto" })
  @IsOptional()
  @Expose()
  sheetName?: string;

  @IsInt({ message: "El día de extracción debe ser un número entero" })
  @IsOptional()
  @Expose()
  dayExtraction?: number;

  @IsString({ message: "La hora de extracción debe ser una cadena de texto" })
  @IsOptional()
  @Expose()
  hourExtraction?: string;
}

export class DataSourceResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  description?: string;

  @Expose()
  sourceType!: SourceType;

  @Expose()
  connectionInfo?: Record<string, any>;

  @Expose()
  configParams?: Record<string, any>;

  @Expose()
  autoExtract!: boolean;

  @Expose()
  sheetName?: string;
  @Expose()
  extractionFrequency?: string;

  @Expose()
  lastExtractionDate?: Date;

  @Expose()
  nextScheduledExtraction?: Date;

  @Expose()
  extractionStatus!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  companyId?: number;

  @Expose()
  dayExtraction?: number;

  @Expose()
  hourExtraction?: string;

  @Expose()
  createdBy?: number;

  @Expose()
  updatedBy?: number;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export class DataSourceResponseSearchDto {
  @Expose()
  dataSources!: DataSourceResponseDto[];

  @Expose()
  total!: number;
}
export class FilterDataSourceDto {
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsOptional()
  @Expose()
  name?: string;

  @IsEnum(SourceType, { message: "Tipo de fuente de datos no válido" })
  @IsOptional()
  @Expose()
  sourceType?: SourceType;

  @IsBoolean({ message: "El campo isActive debe ser un valor booleano" })
  @IsOptional()
  @Expose()
  isActive?: boolean;

  @IsString({ message: "El estado de extracción debe ser una cadena de texto" })
  @IsOptional()
  @Expose()
  extractionStatus?: string;

  @IsInt({ message: "El ID de la compañía debe ser un número entero" })
  @IsOptional()
  @Expose()
  companyId?: number;

  @IsInt({ message: "El día de extracción debe ser un número entero" })
  @IsOptional()
  @Expose()
  dayExtraction?: number;

  @IsString({ message: "La hora de extracción debe ser una cadena de texto" })
  @IsOptional()
  @Expose()
  hourExtraction?: string;
}

export class SearchDataSourceDto extends FilterDataSourceDto {
  @IsString({ message: "El término de búsqueda debe ser una cadena de texto" })
  @IsOptional()
  @Expose()
  search?: string;

  @IsInt({ message: "El número de página debe ser un número entero" })
  @IsOptional()
  @Expose()
  page?: number;

  @IsInt({ message: "El límite debe ser un número entero" })
  @IsOptional()
  @Expose()
  limit?: number;

  @IsString({
    message: "El campo de ordenamiento debe ser una cadena de texto",
  })
  @IsOptional()
  @Expose()
  sortBy?: string;

  @IsString({ message: "El orden debe ser una cadena de texto (ASC o DESC)" })
  @IsOptional()
  @Expose()
  sortOrder?: "ASC" | "DESC";
}
