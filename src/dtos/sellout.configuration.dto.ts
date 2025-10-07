import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { MatriculationTemplateResponseDto } from './matriculation.templates.dto';

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

}

export class SelloutConfigurationFiltersResponseDto {
    items!: SelloutConfigurationDto[];
    total!: number;
}


