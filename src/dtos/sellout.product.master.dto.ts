import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { SelloutStoreMasterDto } from './sellout.store.master.dto';

export class CreateSelloutProductMasterDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    distributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    productDistributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    productStore?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    searchProductStore?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    codeProductSic?: string;

    @IsOptional()
    @IsBoolean()
    status!: boolean;

}


export class UpdateSelloutProductMasterDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    distributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    productDistributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    productStore?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    searchProductStore?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    codeProductSic?: string;

    @IsOptional()
    @IsBoolean()
    status?: boolean;
}

export class SelloutProductMasterDto {
    @Expose()
    id!: number;

    @Expose()
    distributor?: string;

    @Expose()
    productDistributor?: string;

    @Expose()
    productStore?: string;

    @Expose()
    searchProductStore?: string;

    @Expose()
    codeProductSic?: string;

    @Expose()
    status!: boolean;
}

export class SelloutProductMasterFiltersResponseDto {
    items!: SelloutProductMasterDto[];
    total!: number;
}


