import {Expose, Type} from 'class-transformer';
import {IsBoolean, IsNumber, IsOptional, IsString, MaxLength} from 'class-validator';
import {MatriculationTemplateResponseDto} from './matriculation.templates.dto';

export class CreateConsolidatedDataStoresDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    distributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    codeStoreDistributor?: string;

    @IsOptional()
    @IsString()
    codeProductDistributor?: string;

    @IsOptional()
    @IsString()
    descriptionDistributor?: string;

    @IsOptional()
    @IsNumber()
    unitsSoldDistributor?: number;

    @IsOptional()
    @IsString()
    saleDate?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    codeProduct?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    codeStore?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    authorizedDistributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    storeName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    productModel?: string;

    @IsOptional()
    @IsString()
    calculateDate?: string;

    @IsOptional()
    @IsNumber()
    matriculationTemplateId?: number;

    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @IsOptional()
    @IsString()
    observation?: string;
}


export class UpdateConsolidatedDataStoresDto {

    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    distributor?: string;

    @IsOptional()
    @IsString()
    codeStoreDistributor?: string;

    @IsOptional()
    @IsString()
    codeProductDistributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    descriptionDistributor?: string;

    @IsOptional()
    @IsNumber()
    unitsSoldDistributor?: number;

    @IsOptional()
    @IsString()
    saleDate?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    codeProduct?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    codeStore?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    authorizedDistributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    storeName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    productModel?: string;

    @IsOptional()
    @IsString()
    calculateDate?: string;

    @IsOptional()
    @IsNumber()
    matriculationTemplateId?: number;

    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @IsOptional()
    @IsString()
    observation?: string;
}

export class UpdateConsolidatedDto {

    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    distributor?: string;

    @IsOptional()
    @IsString()
    codeStoreDistributor?: string;

    @IsOptional()
    @IsString()
    codeProductDistributor?: string;

    @IsOptional()
    @IsString()
    descriptionDistributor?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    codeProduct?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    codeStore?: string;

    @IsOptional()
    @IsBoolean()
    status?: boolean;
}

export class ConsolidatedDataStoresDto {
    @Expose()
    id!: number;

    @Expose()
    distributor?: string;

    @Expose()
    codeStoreDistributor?: string;

    @Expose()
    codeProductDistributor?: string;

    @Expose()
    descriptionDistributor?: string;

    @Expose()
    unitsSoldDistributor?: number;

    @Expose()
    saleDate?: string;

    @Expose()
    codeProduct?: string;

    @Expose()
    codeStore?: string;

    @Expose()
    authorizedDistributor?: string;

    @Expose()
    storeName?: string;

    @Expose()
    productModel?: string;

    @Expose()
    calculateDate?: string;

    @Expose()
    @Type(() => MatriculationTemplateResponseDto)
    matriculationTemplate?: MatriculationTemplateResponseDto;

    @Expose()
    status?: boolean;

    @Expose()
    observation?: string;
}

export class ConsolidatedDataStoresFiltersResponseDto {
    items!: ConsolidatedDataStoresDto[];
    total!: number;
}

export class NullFieldFilters {
    codeProduct?: boolean;
    codeStore?: boolean;
    authorizedDistributor?: boolean;
    storeName?: boolean;
    productModel?: boolean;
};



