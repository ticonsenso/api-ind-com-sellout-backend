import { Expose } from 'class-transformer';
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSelloutStoreMasterDto {
    @IsString()
    @MaxLength(255)
    distributor?: string;

    @IsString()
    @MaxLength(255)
    storeDistributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    searchStore?: string;

    @IsString()
    @MaxLength(255)
    codeStoreSic?: string;

    @IsOptional()
    @IsBoolean()
    status!: boolean;

    @IsOptional()
    @IsString()
    periodo?: string;

}


export class UpdateSelloutStoreMasterDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    distributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    storeDistributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    searchStore?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    codeStoreSic?: string;

    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @IsOptional()
    @IsString()
    periodo?: string;
}

export class SelloutStoreMasterDto {
    @Expose()
    id!: number;

    @Expose()
    distributor?: string;

    @Expose()
    storeDistributor?: string;

    @Expose()
    searchStore?: string;

    @Expose()
    codeStoreSic?: string;

    @Expose()
    periodo?: Date;

    @Expose()
    status!: boolean;
}

export class SelloutStoreMasterFiltersDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    distributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    storeDistributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    searchStore?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    codeStoreSic?: string;

    @IsOptional()
    @IsDateString()
    periodo?: Date;
}

export class SelloutStoreMasterFiltersResponseDto {
    items!: SelloutStoreMasterDto[];
    total!: number;
}