import {Exclude, Expose, Type} from 'class-transformer';
import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import {StoreConfigurationResponseDto} from './store.configuration.dto';

export class CreateStorePptoMarcimexDto {
    @IsNotEmpty()
    @IsString()
    ceco!: string;

    @IsNotEmpty()
    @IsNumber()
    mount!: number;

    @IsNotEmpty()
    @IsNumber()
    year!: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    storeConfigurationId?: number;

    @IsNotEmpty()
    @IsString()
    storePpto!: string;
}

export class UpdateStorePptoMarcimexDto {
    @IsOptional()
    @IsString()
    ceco?: string;

    @IsOptional()
    @IsNumber()
    mount?: number;

    @IsOptional()
    @IsNumber()
    year?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    storeConfigurationId?: number;

    @IsOptional()
    @IsString()
    storePpto?: string;
}

export class StorePptoMarcimexResponseDto {
    @Expose()
    id!: number;

    @Expose()
    ceco!: string;

    @Expose()
    mount!: number;

    @Expose()
    year!: number;

    @Expose()
    storePpto!: string;

    @Expose()
    @Type(() => StoreConfigurationResponseDto)
    storeConfiguration?: StoreConfigurationResponseDto | null;

    @Exclude()
    createdAt?: Date;

    @Exclude()
    updatedAt?: Date;
}


export class StorePptoMarcimexPaginatedResponseDto {
    @Expose()
    @Type(() => StorePptoMarcimexResponseDto)
    items!: StorePptoMarcimexResponseDto[];

    @Expose()
    total!: number;
}