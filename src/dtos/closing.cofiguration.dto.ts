import {Expose} from 'class-transformer';
import {IsOptional, IsString} from 'class-validator';

export class CreateClosingConfigurationDto {

    @IsOptional()
    @IsString()
    closingDate?: string;

    @IsOptional()
    @IsString()
    startDate?: string;

    @IsOptional()
    @IsString()
    month?: string;

    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateClosingConfigurationDto extends CreateClosingConfigurationDto {
}

export class ClosingConfigurationResponseDto {
    @Expose()
    id!: number;

    @Expose()
    closingDate!: string;

    @Expose()
    startDate!: string;

    @Expose()
    month!: string;

    @Expose()
    description?: string;
}

export class ClosingConfigurationResponseSearchDto {
    @Expose()
    items!: ClosingConfigurationResponseDto[];

    @Expose()
    total!: number;
}

export class ClosingConfigurationSearchDto {
    @IsOptional()
    @IsString()
    @Expose()
    closingDate?: string;
}
