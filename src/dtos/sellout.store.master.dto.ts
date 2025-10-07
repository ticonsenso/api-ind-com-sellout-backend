import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSelloutStoreMasterDto {
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
    status!: boolean;

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
}

export class SelloutStoreMasterFiltersResponseDto {
    items!: SelloutStoreMasterDto[];
    total!: number;
}