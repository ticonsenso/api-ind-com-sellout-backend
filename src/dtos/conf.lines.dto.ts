import { IsString, IsNotEmpty, IsOptional, MaxLength, IsInt, IsNumber } from 'class-validator';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConfigLineDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    lineName!: string;
}

export class ConfigLineListDto {
    @IsArray()
    @ValidateNested({ each: true }) // Valida cada elemento del array
    @Type(() => CreateConfigLineDto) // Necesario para que sepa qué clase es cada item
    lines!: CreateConfigLineDto[];
}

export class UpdateConfigLineDto {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    lineName?: string;
}

export class FilterConfigLineDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    lineName?: string;
}

export class SearchConfigLineDto extends FilterConfigLineDto {

    @IsOptional()
    @Type(() => Number) // <--- Esto fuerza la conversión a número
    @IsNumber()
    page?: number;

    @IsOptional()
    @Type(() => Number) // <--- Esto fuerza la conversión a número
    @IsNumber()
    limit?: number;

    @IsOptional()
    @Type(() => String)
    @IsString()
    sortBy?: string;

    @IsOptional()
    @Type(() => String)
    sortOrder?: 'ASC' | 'DESC';
}

export class ConfigLineResponseSearchDto {
    data!: any[];
    total!: number;
}
