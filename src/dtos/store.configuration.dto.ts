import {IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested,} from 'class-validator';
import {Exclude, Expose, Type} from 'class-transformer';
import {
    CreateEmployForMonthDto,
    CreateEmployForMonthDtoIds,
    EmployForMonthResponseDtoList
} from './advisor.configuration.dto';
import {StoreSizeResponseDto} from './store.size.dto';
import {CompanyResponseDto} from './companies.dto';

export class CreateStoreConfigurationDto {
    @IsNotEmpty({ message: 'La región es requerida' })
    @IsString({ message: 'La región debe ser una cadena de texto' })
    regional!: string;

    @IsNotEmpty({ message: 'El nombre de la tienda es requerido' })
    @IsString({ message: 'El nombre de la tienda debe ser una cadena de texto' })
    storeName!: string;

    @IsOptional()
    @IsString({ message: 'El centro de costos debe ser una cadena de texto' })
    ceco?: string;

    @IsOptional()
    @IsString({ message: 'El código debe ser una cadena de texto' })
    code?: string;

    @IsNotEmpty({ message: 'El ID del tamaño de tienda es requerido' })
    @IsString({ message: 'El ID del tamaño de tienda debe ser una cadena de texto' })
    storeSizeName!: string;

    @IsOptional()
    @IsString({ message: 'El ID del tamaño de tienda debe ser una cadena de texto' })
    storeSizeId?: string;

    @IsOptional()
    @IsString({ message: 'El ID de la empresa debe ser una cadena de texto' })
    companyId?: string;

    @IsOptional()
    @IsString({ message: 'Las notas deben ser una cadena de texto' })
    notes?: string;

    @IsOptional()
    @IsDateString()
    registerDate?: Date;
}

export class CreateStoreConfigurationDtoIds {
    @IsNotEmpty({ message: 'La región es requerida' })
    @IsString({ message: 'La región debe ser una cadena de texto' })
    regional!: string;

    @IsNotEmpty({ message: 'El nombre de la tienda es requerido' })
    @IsString({ message: 'El nombre de la tienda debe ser una cadena de texto' })
    store_name!: string;

    @IsOptional()
    @IsString({ message: 'El centro de costos debe ser una cadena de texto' })
    ceco?: string;

    @IsOptional()
    @IsString({ message: 'El código debe ser una cadena de texto' })
    code?: string;

    @IsNotEmpty({ message: 'El ID del tamaño de tienda es requerido' })
    @IsInt({ message: 'El ID del tamaño de tienda debe ser un número' })
    storeSizeId!: number;

    @IsOptional()
    @IsInt({ message: 'El ID de la empresa debe ser un número' })
    companyId?: number;

    @IsOptional()
    @IsString({ message: 'Las notas deben ser una cadena de texto' })
    notes?: string;

    @IsNotEmpty({ message: 'La fecha de registro es requerida' })
    @IsDateString()
    registerDate!: string;
}

export class UpdateStoreConfigurationDto {
    @IsOptional()
    @IsString({ message: 'La región debe ser una cadena de texto' })
    regional?: string;

    @IsOptional()
    @IsString({ message: 'El nombre de la tienda debe ser una cadena de texto' })
    store_name?: string;

    @IsOptional()
    @IsString({ message: 'El centro de costos debe ser una cadena de texto' })
    ceco?: string;

    @IsOptional()
    @IsString({ message: 'El código debe ser una cadena de texto' })
    code?: string;

    @IsOptional()
    @IsString({ message: 'El ID del tamaño de tienda debe ser una cadena de texto' })
    storeSizeName?: string;

    @IsOptional()
    @IsInt({ message: 'El ID del tamaño de tienda debe ser un número' })
    storeSizeId?: number;

    @IsOptional()
    @IsString({ message: 'El ID de la empresa debe ser una cadena de texto' })
    companyId?: string;

    @IsOptional()
    @IsString({ message: 'Las notas deben ser una cadena de texto' })
    notes?: string;

    @IsOptional()
    @IsDateString()
    registerDate?: string;
}

export class StoreConfigurationResponseDto {
    @Expose()
    id!: number;

    @Expose()
    regional!: string;

    @Expose()
    storeName!: string;

    @Expose()
    ceco?: string;

    @Expose()
    code?: string;

    @Expose()
    notes?: string;

    @Expose()
    @Type(() => StoreSizeResponseDto)
    storeSize!: StoreSizeResponseDto;

    @Expose()
    @Type(() => CompanyResponseDto)
    company!: CompanyResponseDto;

    @Exclude()
    registerDate!: Date;

    @Expose()
    budget?: number;


    @Exclude()
    createdAt?: Date;

    @Exclude()
    updatedAt?: Date;

}

export class StoreConfigurationWithEmployeesDto {
    @Expose()
    id!: number;

    @Expose()
    regional!: string;

    @Expose()
    store_name!: string;

    @Expose()
    ceco?: string;

    @Expose()
    code?: string;

    @Expose()
    notes?: string;

    @Expose()
    @Type(() => StoreSizeResponseDto)
    storeSize!: StoreSizeResponseDto;

    @Expose()
    @Type(() => CompanyResponseDto)
    company!: CompanyResponseDto;

    @Expose()
    registerDate!: Date;

    @Expose()
    @Type(() => EmployForMonthResponseDtoList)
    advisorConfiguration!: EmployForMonthResponseDtoList[];
}

export class CreateStoreConfigurationWithEmployeesDto extends CreateStoreConfigurationDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateEmployForMonthDto)
    advisorConfiguration!: CreateEmployForMonthDto[];
}

export class CreateStoreConfigurationWithEmployeesDtoIds extends CreateStoreConfigurationDtoIds {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateEmployForMonthDtoIds)
    advisorConfiguration!: CreateEmployForMonthDtoIds[];
}

export class StoreConfigurationSearchDto {
    @IsOptional()
    @IsString()
    regional?: string;

    @IsOptional()
    @IsString()
    store_name?: string;

    @IsOptional()
    @IsString()
    code?: string;

    @IsOptional()
    @IsString()
    storeSizeName?: string;

    @IsOptional()
    @IsString()
    companyId?: string;
}

export class StoreConfigurationListResponseSearchDto {
    @Expose()
    items!: StoreConfigurationWithEmployeesDto[];

    @Expose()
    total!: number;
}