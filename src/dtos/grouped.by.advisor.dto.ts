import {Exclude, Expose, Type} from 'class-transformer';
import {IsArray, IsInt, IsOptional,} from 'class-validator';
import {StoreConfigurationResponseDto} from './store.configuration.dto'; // Asegúrate de que este exista

export class CreateGroupedByAdvisorDto {
    @IsOptional()
    @IsInt()
    storePrincipal?: number;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    storeSecondaryIds?: number[];
}

export class UpdateGroupedByAdvisorDto extends CreateGroupedByAdvisorDto { }

export class GroupedByAdvisorResponseDto {
    @Exclude()
    id!: number;

    @Expose()
    @Type(() => StoreConfigurationResponseDto)
    storePrincipal?: StoreConfigurationResponseDto | null;

    @Expose()
    @Type(() => StoreConfigurationResponseDto)
    storeSecondary?: StoreConfigurationResponseDto | null;

    @Expose()
    @IsInt()
    totalAdvisor!: number;

    @Exclude()
    createdAt?: Date;

    @Exclude()
    updatedAt?: Date;
}
