import { Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNumber, IsObject, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { SelloutConfigurationDto } from './sellout.configuration.dto';
import { ExtractionLogsSelloutDto } from './extraction.logs.sellout.dto';
import { CreateMatriculationLogDto, MatriculationLogResponseDto } from './matriculation.logs.dto';
import { MatriculationLog } from '../models/matriculation.logs.model';

export class CreateExtractedDataSelloutDto {
    @IsOptional()
    @IsNumber()
    selloutConfigurationId?: number;

    @IsOptional()
    @IsNumber()
    extractionLogId?: number;

    @IsOptional()
    @IsDate()
    extractionDate?: Date;

    @IsOptional()
    @IsObject()
    dataContent?: object;

    @IsOptional()
    @IsNumber()
    recordCount?: number;

    @IsOptional()
    @IsBoolean()
    isProcessed?: boolean;

    @IsOptional()
    @IsDate()
    processedDate?: Date;

    @IsOptional()
    @IsNumber()
    processedBy?: number;

    @IsOptional()
    @IsObject()
    processingDetails?: object;

    @IsOptional()
    @IsString()
    dataName?: string;

    @IsOptional()
    calculateDate?: string;



    @IsOptional()
    @IsNumber()
    createdBy?: number;

    @IsOptional()
    @IsNumber()
    productCount?: number;

    @IsOptional()
    @IsNumber()
    uploadTotal?: number;

    @IsOptional()
    @IsNumber()
    uploadCount?: number;

    @IsOptional()
    @IsNumber()
    matriculationId?: number;

    @IsOptional()
    @IsArray()
    @Type(() => MatriculationLog)
    matriculationLogs?: MatriculationLog[];

}

export class UpdateExtractedDataSelloutDto {
    @IsOptional()
    @IsNumber()
    selloutConfigurationId?: number;

    @IsOptional()
    @IsNumber()
    extractionLogId?: number;

    @IsOptional()
    @IsDate()
    extractionDate?: Date;

    @IsOptional()
    @IsObject()
    dataContent?: object;

    @IsOptional()
    @IsNumber()
    recordCount?: number;

    @IsOptional()
    @IsBoolean()
    isProcessed?: boolean;

    @IsOptional()
    @IsDate()
    processedDate?: Date;

    @IsOptional()
    @IsNumber()
    processedBy?: number;

    @IsOptional()
    @IsObject()
    processingDetails?: object;

    @IsOptional()
    @IsString()
    dataName?: string;

    @IsOptional()
    @IsString()
    calculateDate?: string;

    @IsOptional()
    @IsNumber()
    createdBy?: number;

    @IsOptional()
    @IsNumber()
    templateId?: number;

    @IsOptional()
    @IsString()
    distributor?: string;

    @IsOptional()
    @IsString()
    storeName?: string;

    @IsOptional()
    @IsObject()
    matriculationLog?: CreateMatriculationLogDto;
}

export class ExtractedDataSelloutDto {
    @Expose()
    id!: number;

    @Expose()
    selloutConfiguration?: SelloutConfigurationDto;

    @Expose()
    extractionLog?: ExtractionLogsSelloutDto;

    @Expose()
    extractionDate?: Date;

    @Expose()
    recordCount?: number;

    @Expose()
    isProcessed?: boolean;

    @Expose()
    processedDate?: Date;

    @Expose()
    processedBy?: number;

    @Expose()
    processingDetails?: object;

    @Expose()
    dataName?: string;

    @Expose()
    calculateDate?: string;



    @Expose()
    status?: boolean;

    @Expose()
    createdBy?: number;

    @Expose()
    productCount?: number;

    @Expose()
    uploadTotal?: number;

    @Expose()
    uploadCount?: number;

    @Expose()
    distributor?: string;

    @Expose()
    storeName?: string;

    @Expose()
    templateId?: number;

    @Expose()
    matriculationLog?: MatriculationLogResponseDto;

}

export class ExtractedDataSelloutFiltersResponseDto {
    items!: ExtractedDataSelloutDto[];
    total!: number;
}


