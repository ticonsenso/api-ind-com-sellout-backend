import { Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateSalesRotationConfigurationDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(12)
    month!: number;

    @IsNotEmpty()
    @IsString()
    monthName!: string;

    @IsNotEmpty()
    @IsNumber()
    weight!: number;

    @IsNotEmpty()
    @IsNumber()
    goal!: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsBoolean()
    isHighSeason!: boolean;

    @IsNotEmpty()
    @IsNumber()
    @Expose({ name: 'commissionConfigurationId' })
    commissionConfigurationId!: number;
}

export class UpdateSalesRotationConfigurationDto {

    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsNumber()
    month?: number;

    @IsOptional()
    @IsString()
    monthName?: string;

    @IsOptional()
    @IsNumber()
    weight?: number;

    @IsOptional()
    @IsNumber()
    goal?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isHighSeason?: boolean;

    @IsOptional()
    @IsNumber()
    commissionConfigurationId?: number;
}


export class SalesRotationConfigurationResponseDto {
    @Expose()
    id!: number;

    @Expose()
    month!: number;

    @Expose()
    monthName!: string;

    @Expose()
    weight!: number;

    @Expose()
    goal!: number;

    @Expose()
    description!: string;

    @Expose()
    isHighSeason!: boolean;

    @Expose()
    commissionConfigurationId!: number;
}

export class SalesRotationConfigurationSearchDto {

    @IsOptional()
    @IsString()
    monthName?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isHighSeason?: boolean;

    @IsOptional()
    @IsNumber()
    commissionConfigurationId?: number;
}

export class SalesRotationConfigurationListResponseSearchDto {
    @Expose()
    items!: SalesRotationConfigurationResponseDto[];

    @Expose()
    total!: number;
}