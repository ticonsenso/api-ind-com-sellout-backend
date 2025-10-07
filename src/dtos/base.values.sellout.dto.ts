import { Expose } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBaseValuesSelloutDto {
    @IsNotEmpty()
    @IsString()
    @Expose()
    brand!: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    model!: string;

    @IsOptional()
    @IsString()
    @Expose()
    unitBaseUnitary?: string | null;

    @IsOptional()
    @IsString()
    @Expose()
    pvdUnitary?: string | null;
}

export class UpdateBaseValuesSelloutDto {
    @IsNotEmpty()
    @IsString()
    @Expose()
    brand!: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    model!: string;

    @IsOptional()
    @IsString()
    @Expose()
    unitBaseUnitary?: string | null;

    @IsOptional()
    @IsString()
    @Expose()
    pvdUnitary?: string | null;
}

export class BaseValuesSelloutResponseDto {
    @Expose()
    id!: number;

    @Expose()
    brand!: string;

    @Expose()
    model!: string;

    @Expose()
    unitBaseUnitary?: string | null;

    @Expose()
    pvdUnitary?: string | null;
}

export class BaseValuesSelloutFiltersResponseDto {
    items!: BaseValuesSelloutResponseDto[];
    total!: number;
}