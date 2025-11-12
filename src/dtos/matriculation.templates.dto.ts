import {Exclude, Expose, Type} from 'class-transformer';
import {IsBoolean, IsOptional, IsString} from 'class-validator';
import {MatriculationLogResponseDto} from './matriculation.logs.dto';

export class CreateMatriculationTemplateDto {

    @IsOptional()
    @IsString()
    distributor?: string;

    @IsOptional()
    @IsString()
    storeName?: string;

    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @IsOptional()
    @IsString()
    calculateMonth?: string;
}

export class UpdateMatriculationTemplateDto extends CreateMatriculationTemplateDto {
}

export class MatriculationTemplateResponseDto {
    @Expose()
    id!: number;

    @Expose()
    distributor?: string;

    @Expose()
    storeName?: string;

    @Expose()
    status?: boolean;

    @Expose()
    calculateMonth?: Date;

    @Expose()
    createdAt!: Date;

    @Exclude()
    updatedAt?: Date;

}

export class MatriculationTemplateResponseWithLogsDto {
    @Expose()
    id!: number;

    @Expose()
    distributor?: string;

    @Expose()
    storeName?: string;

    @Expose()
    status?: boolean;

    @Expose()
    calculateMonth?: Date;

    @Expose()
    createdAt!: Date;

    @Expose()
    calculateDate!: Date;

    @Expose()
    isUploaded?: boolean;

    @Expose()
    rowCountTotal?: number;

    @Expose()
    productCountTotal?: number;

    @Expose()
    @Type(() => MatriculationLogResponseDto)
    logs!: MatriculationLogResponseDto[];

}

export class MatriculationTemplateResponseSearchDto {
    @Expose()
    items!: MatriculationTemplateResponseDto[];

    @Expose()
    total!: number;
}

