import {Expose, Type} from 'class-transformer';
import {IsDate, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import {MatriculationTemplateResponseDto} from './matriculation.templates.dto';

export class CreateMatriculationLogDto {
    @IsOptional()
    @IsNumber()
    matriculationId?: number;

    @IsOptional()
    @IsString()
    distributor?: string;

    @IsOptional()
    @IsString()
    storeName?: string;



    @IsNotEmpty()
    @Type(() => String)
    calculateDate!: string;

    @IsNotEmpty()
    @IsNumber()
    rowsCount!: number;

    @IsNotEmpty()
    @IsNumber()
    productCount!: number;

    @IsOptional()
    @IsNumber()
    uploadTotal?: number;

    @IsOptional()   
    @IsNumber()
    uploadCount?: number;
}

export class UpdateMatriculationLogDto extends CreateMatriculationLogDto {
    @IsOptional()
    @IsDate()
    updatedAt?: Date;
}

export class MatriculationLogResponseDto {
    @Expose()
    id!: number;

    @Expose()
    matriculation!: MatriculationTemplateResponseDto;

    @Expose()
    distributor?: string;

    @Expose()
    storeName?: string;

    @Expose()
    rowsCount!: number;

    @Expose()
    productCount!: number;

    @Expose()
    uploadTotal?: number;

    @Expose()
    uploadCount?: number;

    @Expose()
    templateId?: number;

    @Expose()
    user?: string;
  
}

export class MatriculationLogResponseDtoLog {
    @Expose()
    id!: number;

    @Expose()
    distributor?: string;

    @Expose()
    storeName?: string;

    @Expose()
    calculateDate!: string;

    @Expose()
    rowsCount!: number;

    @Expose()
    productCount!: number;  

    @Expose()
    uploadTotal?: number;

    @Expose()
    uploadCount?: number;
}

export class MatriculationLogResponseSearchDto {
    @Expose()
    items!: MatriculationLogResponseDto[];

    @Expose()
    total!: number;
}

export class MatriculationLogSearchDto {
    @IsOptional()
    @IsNumber()
    @Expose()
    matriculationId?: number;

    @IsOptional()
    @Type(() => String)
    @Expose()
    calculateDate?: string;
}
