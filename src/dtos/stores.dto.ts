import { Expose, Type } from "class-transformer";
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";

export class CreateStoreSicDto {
    @IsNotEmpty()
    @IsNumber()
    storeCode!: number;

    @IsNotEmpty()
    @IsString()
    storeName!: string;

    @IsOptional()
    @IsString()
    storeAddress?: string;

    @IsOptional()
    @IsString()
    distributor?: string;

    @IsNotEmpty()
    @IsString()
    distributor2!: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    agencyManager?: string;

    @IsOptional()
    @IsString()
    size?: string;

    @IsOptional()
    @IsString()
    ubication?: string;

    @IsOptional()
    @IsNumber()
    sales?: number;

    @IsOptional()
    @IsString()
    channel?: string;

    @IsNotEmpty()
    @IsString()
    distributorSap!: string;

    @IsNotEmpty()
    @IsString()
    endChannel!: string;

    @IsOptional()
    @IsString()
    supervisor?: string;

    @IsNotEmpty()
    @IsString()
    wholesaleRegion!: string;

    @IsNotEmpty()
    @IsString()
    city!: string;

    @IsNotEmpty()
    @IsString()
    region!: string;

    @IsNotEmpty()
    @IsString()
    province!: string;

    @IsNotEmpty()
    @IsString()
    category!: string;

    @IsOptional()
    @IsString()
    zone?: string;

    @IsOptional()
    @IsBoolean()
    status?: boolean;
}

export class UpdateStoreSicDto extends CreateStoreSicDto {}

export class StoreSicResponseDto {
    @Expose()
    id!: number;

    @Expose()
    storeCode!: number;

    @Expose()
    storeName!: string;

    @Expose()
    storeAddress!: string;

    @Expose()
    distributor!: string;

    @Expose()
    distributor2!: string;

    @Expose()
    phone!: string;

    @Expose()
    agencyManager!: string;

    @Expose()
    size!: string;

    @Expose()
    ubication!: string;

    @Expose()
    sales!: number;

    @Expose()
    channel!: string;

    @Expose()
    distributorSap!: string;

    @Expose()
    endChannel!: string;

    @Expose()
    supervisor!: string;

    @Expose()
    wholesaleRegion!: string;

    @Expose()
    city!: string;

    @Expose()
    region!: string;

    @Expose()
    province!: string;

    @Expose()
    category!: string;

    @Expose()
    zone?: string;

    @Expose()
    status!: boolean;
}

export class StoreResponseDto {
    @Expose()
    id!: number;

    @Expose()
    storeCode!: number;

    @Expose()
    storeName!: string;

    @Expose()
    endChannel!: string;

    @Expose()
    city!: string;

    @Expose()
    region!: string;
}

export class StoreSicSearchDto {
    @IsOptional()
    @IsNumber({}, { message: "El ID debe ser un número" })
    id?: number;

    @IsOptional()
    @IsNumber({}, { message: "El código de la tienda debe ser un número" })
    storeCode?: number;

    @IsOptional()
    @IsString({ message: "El nombre de la tienda debe ser una cadena de texto" })
    storeName?: string;
}

export class StorePaginatedResponseDto {
    @Expose()
    @Type(() => StoreSicResponseDto)
    items!: StoreSicResponseDto[];

    @Expose()
    total!: number;
}


export class NullFieldFiltersSic {
    zone?: boolean;
}
