import {Expose, Type} from "class-transformer";
import {IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString,} from "class-validator";
import {CompanyResponseDto} from "./commission.configurations.dto";

export class CreateStoreSizeDto {
  @IsNotEmpty({ message: "El nombre es requerido" })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  name!: string;

  @IsNotEmpty({
    message: "El bono es requerido",
  })
  @IsNumber(
    {},
    { message: "El bono debe ser un número" }
  )
  @IsPositive({
    message:
      "El bono debe ser un valor positivo",
  })
  bonus!: number;
  @IsNotEmpty({ message: "El tiempo es requerido", })
  @IsNumber({}, { message: "El tiempo debe ser un número" })
  @IsPositive({
    message:
      "El tiempo debe ser un valor positivo",
  })
  time!: number;

  @IsNotEmpty({ message: "El ID de la empresa es requerido" })
  @IsNumber({}, { message: "El ID de la empresa debe ser un número" })
  @IsPositive({ message: "El ID de la empresa debe ser un valor positivo" })
  companyId!: number;
}

export class UpdateStoreSizeDto {
  @IsOptional()
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  name?: string;

  @IsOptional()
  @IsNumber(
    {},
    { message: "El bono debe ser un número" }
  )
  @IsPositive({
    message:
      "El bono debe ser un valor positivo",
  })
  bonus?: number;

  @IsOptional()
  @IsNumber(
    {},
    { message: "El tiempo debe ser un número" }
  )
  @IsPositive({
    message:
      "El tiempo debe ser un valor positivo",
  })
  time?: number;

  @IsOptional()
  @IsNumber({}, { message: "El ID de la empresa debe ser un número" })
  @IsPositive({ message: "El ID de la empresa debe ser un valor positivo" })
  companyId?: number;
}

export class StoreSizeResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  bonus!: number;

  @Expose()
  time!: number;

  @Expose()
  @Type(() => CompanyResponseDto)
  company!: CompanyResponseDto;
}

export class StoreSizeSearchDto {
  @IsOptional()
  @IsNumber({}, { message: "El ID debe ser un número" })
  id?: number;

  @IsOptional()
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: "El ID de la empresa debe ser un número" })
  companyId?: number;
}

export class StoreSizePaginatedResponseDto {
  @Expose()
  @Type(() => StoreSizeResponseDto)
  items!: StoreSizeResponseDto[];

  @Expose()
  total!: number;
}
