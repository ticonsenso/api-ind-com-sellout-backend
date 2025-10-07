import {
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsDateString,
    IsOptional,
    IsString,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { StoreConfigurationResponseDto } from './store.configuration.dto';

export class CreateEmployForMonthDto {
    @IsNotEmpty({ message: 'El nombre del mes es requerido' })
    @IsString({ message: 'Debe ser un string' })
    mountName!: string;

    @IsNotEmpty({ message: 'El mes es requerido' })
    @IsNumber({}, { message: 'Debe ser un número' })
    month!: number;

    @IsNotEmpty({ message: 'El número de empleados es requerido' })
    @IsNumber({}, { message: 'Debe ser un número' })
    @IsPositive({ message: 'Debe ser un número positivo' })
    numberEmployees!: number;

    @IsNotEmpty({ message: 'El ID de configuración de tienda es requerido' })
    @IsNumber({}, { message: 'Debe ser un número' })
    storeConfigurationId!: number;
}

export class CreateEmployForMonthDtoIds {
    @IsNotEmpty({ message: 'El nombre del mes es requerido' })
    @IsString({ message: 'Debe ser un string' })
    mountName!: string;

    @IsNotEmpty({ message: 'El mes es requerido' })
    @IsNumber({}, { message: 'Debe ser un número' })
    month!: number;

    @IsNotEmpty({ message: 'El número de empleados es requerido' })
    @IsNumber({}, { message: 'Debe ser un número' })
    @IsPositive({ message: 'Debe ser un número positivo' })
    numberEmployees!: number;

}


export class UpdateEmployForMonthDto {
    @IsOptional()
    @IsString({ message: 'Debe ser un string' })
    mountName?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Debe ser un número' })
    month?: number;

    @IsOptional()
    @IsNumber({}, { message: 'Debe ser un número' })
    @IsPositive({ message: 'Debe ser un número positivo' })
    numberEmployees?: number;

    @IsOptional()
    @IsNumber({}, { message: 'Debe ser un número' })
    @IsPositive({ message: 'Debe ser un número positivo' })
    storeConfigurationId?: number;
}

export class EmployForMonthResponseDto {
    @Expose()
    id!: number;

    @Expose()
    mountName!: string;

    @Expose()
    month!: number;

    @Expose()
    numberEmployees!: number;

    @Expose()
    createdAt!: Date;

    @Expose()
    updatedAt!: Date;

    @Expose()
    @Type(() => StoreConfigurationResponseDto)
    storeConfiguration!: StoreConfigurationResponseDto;
}

export class EmployForMonthResponseDtoList {
    @Expose()
    id!: number;

    @Expose()
    mountName!: string;

    @Expose()
    month!: number;

    @Expose()
    numberEmployees!: number;


}