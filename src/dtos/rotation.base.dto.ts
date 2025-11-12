import {Expose, Type} from 'class-transformer';
import {StoreResponseDto} from './stores.sic.dto';
import {ProductSicResponseDto} from './product.sic.dto';
import {EmployeeResponseDto} from './employees.dto';
import {IsDateString, IsDecimal, IsInt, IsOptional, IsString,} from 'class-validator';

export class CreateRotationBaseDto {
    @IsString()
    @Expose()
    visitCode!: string;

    @IsString()
    @IsOptional()
    @Expose()
    visitSheetNumber?: string;

    @IsDateString()
    @Expose()
    visitDate!: string;

    @IsInt()
    @Expose()
    visitYear!: number;

    @IsInt()
    @Expose()
    visitMonth!: number;

    @IsString()
    @Expose()
    storeCode!: string;

    @IsInt()
    @Expose()
    id_stores!: number;

    @IsString()
    @Expose()
    productCode!: string;

    @IsInt()
    @Expose()
    id_product_sic!: number;

    @IsDecimal()
    @Expose()
    pvdValue!: number;

    @IsDecimal()
    @Expose()
    selloutUnits!: number;

    @IsInt()
    @Expose()
    selloutMonth!: number;

    @IsString()
    @Expose()
    period!: string;

    @IsInt()
    @Expose()
    lessThan3Months!: number;

    @IsInt()
    @Expose()
    between3And6Months!: number;

    @IsInt()
    @Expose()
    moreThan6Months!: number;

    @IsInt()
    @Expose()
    moreThan2Years!: number;

    @IsInt()
    @Expose()
    totalDisplayed!: number;

    @IsInt()
    @Expose()
    mappingTarget!: number;

    @IsDecimal()
    @Expose()
    unitPrice!: number;

    @IsDecimal()
    @Expose()
    totalUbValue!: number;

    @IsDecimal()
    @Expose()
    unitUb!: number;

    @IsInt()
    @Expose()
    idEmployeePromotor!: number;

    @IsInt()
    @Expose()
    idEmployeeCoordinatorZonal!: number;

    @IsInt()
    @Expose()
    idEmployeePromotorPi!: number;

    @IsString()
    @Expose()
    salesAccount!: string;

    @IsString()
    @Expose()
    displayAccount!: string;

    @IsInt()
    @Expose()
    idEmployeeSupervisor!: number;

    @IsInt()
    @Expose()
    idEmployeePromotorTv!: number;

    @IsInt()
    @Expose()
    moreThan9Months!: number;

    @IsInt()
    @Expose()
    moreThan1Year!: number;

    @IsInt()
    @Expose()
    isConsignment!: number;

    @IsInt()
    @Expose()
    selloutYear!: number;

    @IsInt()
    @Expose()
    selloutMonthNumber!: number;

    @IsDecimal()
    @Expose()
    currentUbValue!: number;

    @IsDecimal()
    @Expose()
    currentPvdValue!: number;

    @IsString()
    @Expose()
    visitType!: string;
}

export class UpdateRotationBaseDto extends CreateRotationBaseDto {
}

export class RotationBaseResponseDto {
    @Expose() id!: number;
    @Expose() visitCode!: string;
    @Expose() visitSheetNumber!: string;
    @Expose() visitDate!: Date;
    @Expose() visitYear!: number;
    @Expose() visitMonth!: number;
    @Expose() storeCode!: string;

    @Expose()
    @Type(() => StoreResponseDto)
    store!: StoreResponseDto;

    @Expose() productCode!: string;

    @Expose()
    @Type(() => ProductSicResponseDto)
    productSic!: ProductSicResponseDto;

    @Expose() pvdValue!: number;
    @Expose() selloutUnits!: number;
    @Expose() selloutMonth!: number;
    @Expose() period!: string;
    @Expose() lessThan3Months!: number;
    @Expose() between3And6Months!: number;
    @Expose() moreThan6Months!: number;
    @Expose() moreThan2Years!: number;
    @Expose() totalDisplayed!: number;
    @Expose() mappingTarget!: number;
    @Expose() unitPrice!: number;
    @Expose() totalUbValue!: number;
    @Expose() unitUb!: number;

    @Expose()
    @Type(() => EmployeeResponseDto)
    employeePromotor!: EmployeeResponseDto;

    @Expose()
    @Type(() => EmployeeResponseDto)
    employeeCoordinatorZonal!: EmployeeResponseDto;

    @Expose()
    @Type(() => EmployeeResponseDto)
    employeePromotorPi!: EmployeeResponseDto;

    @Expose() salesAccount!: string;
    @Expose() displayAccount!: string;

    @Expose()
    @Type(() => EmployeeResponseDto)
    employeeSupervisor!: EmployeeResponseDto;

    @Expose()
    @Type(() => EmployeeResponseDto)
    employeePromotorTv!: EmployeeResponseDto;

    @Expose() moreThan9Months!: number;
    @Expose() moreThan1Year!: number;
    @Expose() isConsignment!: number;
    @Expose() selloutYear!: number;
    @Expose() selloutMonthNumber!: number;
    @Expose() currentUbValue!: number;
    @Expose() currentPvdValue!: number;
    @Expose() visitType!: string;
}
