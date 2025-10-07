import { Expose, Type } from "class-transformer";
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";

export class CreateSelloutZoneDto {
    @IsNotEmpty({ message: "El nombre de la zona es requerido" })
    @IsString({ message: "El nombre de la zona debe ser una cadena de texto" })
    name!: string;

    @IsNotEmpty({ message: "El ID de la tienda es requerido" })
    @IsNumber({}, { message: "El ID de la tienda debe ser un número" })
    storesId!: number;

    @IsNotEmpty({ message: "El nombre del grupo es requerido" })
    @IsString({ message: "El nombre del grupo debe ser una cadena de texto" })
    groupName!: string;

    @IsNotEmpty({ message: "El estado es requerido" })
    @IsBoolean({ message: "El estado debe ser un booleano" })
    status!: boolean;

}

export class UpdateSelloutZoneDto {
    @IsNotEmpty({ message: "El nombre de la zona es requerido" })
    @IsString({ message: "El nombre de la zona debe ser una cadena de texto" })
    name!: string;

    @IsNotEmpty({ message: "El ID de la tienda es requerido" })
    @IsNumber({}, { message: "El ID de la tienda debe ser un número" })
    storesId!: number;

    @IsNotEmpty({ message: "El nombre del grupo es requerido" })
    @IsString({ message: "El nombre del grupo debe ser una cadena de texto" })
    groupName!: string;

    @IsNotEmpty({ message: "El estado es requerido" })
    @IsBoolean({ message: "El estado debe ser un booleano" })
    status!: boolean;
}

export class SelloutZoneResponseDto {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    storesId!: number;

    @Expose()
    groupName!: string;

    @Expose()
    status!: boolean;
}

export class SelloutZoneSearchDto {
    @IsOptional()
    @IsNumber({}, { message: "El ID debe ser un número" })
    id?: number;

    @IsOptional()
    @IsString({ message: "El nombre de la zona debe ser una cadena de texto" })
    name?: string;

    @IsOptional()
    @IsString({ message: "El nombre del grupo debe ser una cadena de texto" })
    groupName?: string;
}

export class SelloutZonePaginatedResponseDto {
    @Expose()
    @Type(() => SelloutZoneResponseDto)
    items!: SelloutZoneResponseDto[];

    @Expose()
    total!: number;
}
