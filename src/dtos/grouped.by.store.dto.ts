import { Expose, Type } from 'class-transformer';
import {
    IsArray,
    IsInt,
    IsOptional,
} from 'class-validator';

import { StoreConfigurationResponseDto } from './store.configuration.dto'; // Asegúrate de que este exista

export class CreateGroupedByStoreDto {
    @IsOptional()
    @IsInt()
    storePrincipal?: number;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    storeSecondaryIds?: number[];
}

export class UpdateGroupedByStoreDto extends CreateGroupedByStoreDto { }

export class GroupedByStoreResponseDto {
    @Expose()
    id!: number;

    @Expose()
    @Type(() => StoreConfigurationResponseDto)
    storePrincipal?: StoreConfigurationResponseDto | null;

    @Expose()
    @Type(() => StoreConfigurationResponseDto)
    storeSecondary?: StoreConfigurationResponseDto | null;

    @Expose()
    budget!: number;

}
