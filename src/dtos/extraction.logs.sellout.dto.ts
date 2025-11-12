import {Expose} from 'class-transformer';
import {IsDate, IsNumber, IsObject, IsOptional, IsString} from 'class-validator';
import {SelloutConfigurationDto} from './sellout.configuration.dto';

export class CreateExtractionLogsSelloutDto {
    @IsOptional()
    @IsNumber()
    selloutConfigurationId?: number;

    @IsOptional()
    @IsDate()
    startTime?: Date;

    @IsOptional()
    @IsDate()
    endTime?: Date;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsNumber()
    recordsExtracted?: number;

    @IsOptional()
    @IsNumber()
    recordsProcessed?: number;

    @IsOptional()
    @IsNumber()
    recordsFailed?: number;

    @IsOptional()
    @IsString()
    errorMessage?: string;

    @IsOptional()
    @IsObject()
    executionDetails?: object;

    @IsOptional()
    @IsNumber()
    executedBy?: number;
}

export class UpdateExtractionLogsSelloutDto {
    @IsOptional()
    @IsNumber()
    selloutConfigurationId?: number;

    @IsOptional()
    @IsDate()
    startTime?: Date;

    @IsOptional()
    @IsDate()
    endTime?: Date;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsNumber()
    recordsExtracted?: number;

    @IsOptional()
    @IsNumber()
    recordsProcessed?: number;

    @IsOptional()
    @IsNumber()
    recordsFailed?: number;

    @IsOptional()
    @IsString()
    errorMessage?: string;

    @IsOptional()
    @IsObject()
    executionDetails?: object;

    @IsOptional()
    @IsNumber()
    executedBy?: number;
}

export class ExtractionLogsSelloutDto {
    @Expose()
    id!: number;

    @Expose()
    selloutConfiguration?: SelloutConfigurationDto;

    @Expose()
    startTime?: Date;

    @Expose()
    endTime?: Date;

    @Expose()
    status?: string;

    @Expose()
    recordsExtracted?: number;

    @Expose()
    recordsProcessed?: number;

    @Expose()
    recordsFailed?: number;

    @Expose()
    errorMessage?: string;

    @Expose()
    executionDetails?: object;

    @Expose()
    executedBy?: number;
}

export class ExtractionLogsSelloutFiltersResponseDto {
    items!: ExtractionLogsSelloutDto[];
    total!: number;
}


