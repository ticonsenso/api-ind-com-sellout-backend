import { Expose } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { SelloutConfigurationDto } from './sellout.configuration.dto';
import { ExtractionLogsSelloutDto } from './extraction.logs.sellout.dto';

export class CreateSelloutConfigurationColumnConfigsDto {
    @IsOptional()
    @IsNumber()
    selloutConfigurationId?: number;

    @IsOptional()
    @IsString()
    columnName?: string;

    @IsOptional()
    @IsNumber()
    columnIndex?: number;

    @IsOptional()
    @IsString()
    columnLetter?: string;

    @IsOptional()
    @IsString()
    dataType?: string;

    @IsOptional()
    @IsBoolean()
    isRequired?: boolean;

    @IsOptional()
    @IsString()
    mappingToField?: string;

    @IsOptional()
    @IsNumber()
    headerRow?: number;

    @IsOptional()
    @IsNumber()
    startRow?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsBoolean()
    hasNegativeValue?: boolean;

    @IsOptional()
    @IsNumber()
    createdBy?: number;

    @IsOptional()
    @IsNumber()
    updatedBy?: number;
}


export class UpdateSelloutConfigurationColumnConfigsDto {
    @IsOptional()
    @IsNumber()
    selloutConfigurationId?: number;

    @IsOptional()
    @IsString()
    columnName?: string;

    @IsOptional()
    @IsNumber()
    columnIndex?: number;

    @IsOptional()
    @IsString()
    columnLetter?: string;

    @IsOptional()
    @IsString()
    dataType?: string;

    @IsOptional()
    @IsBoolean()
    isRequired?: boolean;

    @IsOptional()
    @IsString()
    mappingToField?: string;

    @IsOptional()
    @IsNumber()
    headerRow?: number;

    @IsOptional()
    @IsNumber()
    startRow?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;     

    @IsOptional()
    @IsBoolean()
    hasNegativeValue?: boolean;

    @IsOptional()
    @IsNumber()
    createdBy?: number;

    @IsOptional()
    @IsNumber()
    updatedBy?: number;
}

export class SelloutConfigurationColumnConfigsDto {
    @Expose()
    id!: number;

    @Expose()
    selloutConfiguration?: SelloutConfigurationDto;

    @Expose()
    columnName?: string;

    @Expose()
    columnIndex?: number;

    @Expose()
    columnLetter?: string;

    @Expose()
    dataType?: string;

    @Expose()
    isRequired?: boolean;

    @Expose()
    mappingToField?: string;

    @Expose()
    headerRow?: number;

    @Expose()
    startRow?: number;

    @Expose()
    isActive?: boolean;

    @Expose()
    hasNegativeValue?: boolean;

}

export class SelloutConfigurationColumnConfigsResponseDto {
    @Expose()
    id!: number;

    @Expose()
    selloutConfigurationId?: number;

    @Expose()
    columnName?: string;

    @Expose()
    columnIndex?: number;

    @Expose()
    columnLetter?: string;

    @Expose()
    dataType?: string;

    @Expose()
    isRequired?: boolean;

    @Expose()
    mappingToField?: string;

    @Expose()
    headerRow?: number;

    @Expose()
    startRow?: number;

    @Expose()
    isActive?: boolean;

    @Expose()
    hasNegativeValue?: boolean;

}

export class SelloutConfigurationColumnConfigsFiltersResponseDto {
    items!: SelloutConfigurationColumnConfigsDto[];
    total!: number;
}


