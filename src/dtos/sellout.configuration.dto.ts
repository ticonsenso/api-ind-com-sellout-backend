import {Exclude, Expose} from 'class-transformer';
import {IsNumber, IsOptional, IsString, MaxLength} from 'class-validator';
import {MatriculationTemplateResponseDto} from './matriculation.templates.dto';

export class CreateSelloutConfigurationDto {

    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    sourceType?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    distributorCompanyName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    sheetName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    companyId?: string;

    @IsOptional()
    @IsNumber()
    matriculationId?: number;

    @IsOptional()
    @IsString()
    calculateDate?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    codeStoreDistributor?: string;

    @IsOptional()
    @IsNumber()
    initialSheet?: number;

    @IsOptional()
    @IsNumber()
    endSheet?: number;

}


export class UpdateSelloutConfigurationDto {

    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    sourceType?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    distributorCompanyName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    sheetName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    codeStoreDistributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    companyId?: string;

    @IsOptional()
    @IsNumber()
    matriculationId?: number;

    @IsOptional()
    @IsString()
    calculateDate?: string;

    @IsOptional()
    @IsNumber()
    initialSheet?: number;

    @IsOptional()
    @IsNumber()
    endSheet?: number;

}

export class SelloutConfigurationDto {
    @Expose()
    id!: number;

    @Expose()
    name?: string;

    @Expose()
    sourceType?: string;

    @Expose()
    description?: string;

    @Expose()
    distributorCompanyName?: string;

    @Expose()
    sheetName?: string;

    @Expose()
    codeStoreDistributor?: string;

    @Expose()
    companyId?: number;

    @Expose()
    matriculation?: MatriculationTemplateResponseDto;

    @Expose()
    calculateDate?: string;

    @Exclude()
    createdAt?: Date;

    @Exclude()
    updatedAt?: Date;

    @Exclude()
    initialSheet?: number;

    @Exclude()
    endSheet?: number;

}

export class SelloutConfigurationFiltersResponseDto {
    items!: SelloutConfigurationDto[];
    total!: number;
}


