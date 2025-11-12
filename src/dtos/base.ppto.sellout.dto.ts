import {Expose, Type} from 'class-transformer';
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {
    EmployeePromotorPiResponseDto,
    EmployeePromotorResponseDto,
    EmployeePromotorTvResponseDto,
    EmployeeSupervisorResponseDto,
    EmployeeZoneResponseDto
} from './employees.dto';
import {StoreResponseDto} from './stores.sic.dto';
import {ProductSicResponsePptoDto} from './product.sic.dto';

export class CreateBasePptoSelloutDto {
    @IsNotEmpty()
    @IsString()
    @Expose()
    codeSupervisor!: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    codeZone!: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    storeCode!: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    promotorCode!: string;

    @IsString()
    @Expose()
    codePromotorPi?: string | null;

    @IsString()
    @Expose()
    codePromotorTv?: string | null;

    @IsNotEmpty()
    @IsString()
    @Expose()
    equivalentCode!: string;

    @IsNotEmpty()
    @IsNumber()
    @Expose()
    units!: number;

    @IsNotEmpty()
    @IsNumber()
    @Expose()
    unitBase!: number;
}

export class UpdateBasePptoSelloutDto {
    @IsNotEmpty()
    @IsString()
    @Expose()
    codeSupervisor!: string;


    @IsNotEmpty()
    @IsString()
    @Expose()
    codeZone!: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    storeCode!: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    promotorCode!: string;

    @IsString()
    @Expose()
    codePromotorPi?: string | null;

    @IsString()
    @Expose()
    codePromotorTv?: string | null;

    @IsNotEmpty()
    @IsString()
    @Expose()
    equivalentCode!: string;

    @IsNotEmpty()
    @IsNumber()
    @Expose()
    units!: number;

    @IsNotEmpty()
    @IsNumber()
    @Expose()
    unitBase!: number;
}

export class BasePptoSelloutResponseDto {
    @Expose()
    id!: number;

    @Expose()
    @Type(() => EmployeeSupervisorResponseDto)
    supervisor!: EmployeeSupervisorResponseDto;

    @Expose()
    @Type(() => EmployeeZoneResponseDto)
    zone!: EmployeeZoneResponseDto;

    @Expose()
    @Type(() => StoreResponseDto)
    store!: StoreResponseDto;

    @Expose()
    @Type(() => EmployeePromotorResponseDto)
    promotor!: EmployeePromotorResponseDto;

    @Expose()
    @Type(() => EmployeePromotorPiResponseDto)
    promotorPi!: EmployeePromotorPiResponseDto;

    @Expose()
    @Type(() => EmployeePromotorTvResponseDto)
    promotorTv!: EmployeePromotorTvResponseDto;

    @Expose()
    @Type(() => ProductSicResponsePptoDto)
    productSic!: ProductSicResponsePptoDto;

    @Expose()
    units!: number;

    @Expose()
    unitBase!: number;
}

export class BasePptoSelloutFiltersResponseDto {
    items!: BasePptoSelloutResponseDto[];
    total!: number;
}

