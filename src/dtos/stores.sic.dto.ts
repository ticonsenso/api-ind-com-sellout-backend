import { Expose, Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStoreSicDto {
    @IsNotEmpty()
    @IsString()
    codAlmacen!: string;

    @IsNotEmpty()
    @IsString()
    nombreAlmacen!: string;

    @IsNotEmpty()
    @IsString()
    direccionAlmacen!: string;

    @IsNotEmpty()
    @IsString()
    distribuidor!: string;

    @IsNotEmpty()
    @IsString()
    categoria!: string;

    @IsNotEmpty()
    @IsString()
    ciudad!: string;

    @IsNotEmpty()
    @IsString()
    region!: string;

    @IsNotEmpty()
    @IsString()
    provincia!: string;

    @IsOptional()
    @IsBoolean()
    estado?: boolean;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsString()
    jefeAgencia?: string;

    @IsOptional()
    @IsString()
    tamanio?: string;

    @IsOptional()
    @IsString()
    ubicacion?: string;

    @IsOptional()
    @IsNumber()
    ventas?: number;

    @IsNotEmpty()
    @IsString()
    canal!: string;

    @IsOptional()
    @IsString()
    regionMayoreo?: string;

    @IsOptional()
    @IsString()
    distribSap?: string;

    @IsOptional()
    @IsString()
    grupoZona?: string;

    @IsOptional()
    @IsString()
    supervisor?: string;

    @IsOptional()
    @IsString()
    zona?: string;
}

export class UpdateStoreSicDto extends CreateStoreSicDto { }

export class StoreSicResponseDto {
    @Expose()
    id!: number;

    @Expose()
    codAlmacen!: string;

    @Expose()
    nombreAlmacen!: string;

    @Expose()
    direccionAlmacen!: string;

    @Expose()
    distribuidor!: string;

    @Expose()
    categoria!: string;

    @Expose()
    ciudad!: string;

    @Expose()
    region!: string;

    @Expose()
    provincia!: string;

    @Expose()
    estado?: boolean;

    @Expose()
    telefono?: string;

    @Expose()
    jefeAgencia?: string;

    @Expose()
    tamanio?: string;

    @Expose()
    ubicacion?: string;

    @Expose()
    ventas?: number;

    @Expose()
    canal!: string;

    @Expose()
    regionMayoreo?: string;

    @Expose()
    distribSap?: string;

    @Expose()
    grupoZona?: string;

    @Expose()
    supervisor?: string;

    @Expose()
    zona?: string;
}

export class StoreResponseDto {
    @Expose()
    id!: number;

    @Expose()
    codAlmacen!: string;

    @Expose()
    nombreAlmacen!: string;

    @Expose()
    canal!: string;

    @Expose()
    ciudad!: string;

    @Expose()
    region!: string;
}

export class StoreSicSearchDto {
    @IsOptional()
    @IsNumber({}, { message: "El ID debe ser un número" })
    id?: number;

    @IsOptional()
    @IsString({ message: "El código del almacén debe ser una cadena de texto" })
    codAlmacen?: string;

    @IsOptional()
    @IsString({ message: "El nombre del almacén debe ser una cadena de texto" })
    nombreAlmacen?: string;
}

export class StorePaginatedResponseDto {
    @Expose()
    @Type(() => StoreSicResponseDto)
    items!: StoreSicResponseDto[];

    @Expose()
    total!: number;
}


export class NullFieldFiltersSic {
    zona?: boolean;
}
