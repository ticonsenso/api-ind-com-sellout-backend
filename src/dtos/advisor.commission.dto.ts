import {IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString,} from 'class-validator';
import {Expose, Type} from 'class-transformer';

import {CompanyResponseDto} from './companies.dto';
import {CompanyPositionResponseDto} from './company.positions.dto';
import {EmployeeResponseDto} from './employees.dto';
import {StoreSizeResponseDto} from './store.size.dto';

export class CreateAdvisorCommissionDto {
    @IsNotEmpty({ message: 'El ID de la empresa es requerido' })
    @IsNumber()
    companyId!: number;

    @IsNotEmpty({ message: 'El nombre del cargo es requerido' })
    @IsString()
    companyPositionName!: string;

    @IsNotEmpty({ message: 'El nombre del empleado es requerido' })
    @IsString()
    employeeName!: string;

    @IsNotEmpty({ message: 'El nombre del tamaño de la tienda es requerido' })
    @IsString()
    storeSizeName!: string;

    @IsNotEmpty() @IsNumber() taxSale!: number;            // venta fiscal
    @IsNotEmpty() @IsNumber() budgetSale!: number;         // meta de venta
    @IsNotEmpty() @IsNumber() complianceSale!: number;     // cumplimiento de venta
    @IsNotEmpty() @IsNumber() rangeApplyBonus!: number;    // rango de aplicación de bono
    @IsNotEmpty() @IsNumber() saleIntangible!: number;     // venta intangible
    @IsNotEmpty() @IsNumber() cashSale!: number;           // venta en efectivo
    @IsNotEmpty() @IsNumber() creditSale!: number;         // venta a crédito

    @IsNotEmpty() @IsNumber() commissionIntangible!: number;
    @IsNotEmpty() @IsNumber() commissionCash!: number;
    @IsNotEmpty() @IsNumber() commissionCredit!: number;
    @IsNotEmpty() @IsNumber() commissionTotal!: number;

    @IsOptional() @IsString() observation?: string;

    @IsNotEmpty({ message: 'La fecha de cálculo es requerida' })
    @IsDateString({}, { message: 'Debe ser una fecha válida (ISO)' })
    calculateDate!: string;  // YYYY‑MM‑DD
}

export class UpdateAdvisorCommissionDto {
    @IsOptional() @IsNumber() companyId?: number;
    @IsOptional() @IsNumber() companyPositionId?: number;
    @IsOptional() @IsNumber() employeeId?: number;
    @IsOptional() @IsNumber() storeSizeId?: number;
    @IsOptional() @IsNumber() taxSale?: number;
    @IsOptional() @IsNumber() budgetSale?: number;
    @IsOptional() @IsNumber() cumplianceSale?: number;
    @IsOptional() @IsNumber() rangeApplyBonus?: number;
    @IsOptional() @IsNumber() saleIntangible?: number;
    @IsOptional() @IsNumber() cashSale?: number;
    @IsOptional() @IsNumber() creditSale?: number;

    @IsOptional() @IsNumber() commissionIntangible?: number;
    @IsOptional() @IsNumber() commissionCash?: number;
    @IsOptional() @IsNumber() commissionCredit?: number;
    @IsOptional() @IsNumber() commissionTotal?: number;

    @IsOptional() @IsString() observation?: string;
    @IsOptional() @IsDateString() calculateDate?: string;
}

export class AdvisorCommissionResponseDto {
    @Expose() id!: number;

    @Expose() @Type(() => CompanyResponseDto) company!: CompanyResponseDto;
    @Expose() @Type(() => CompanyPositionResponseDto) companyPosition!: CompanyPositionResponseDto;
    @Expose() @Type(() => EmployeeResponseDto) employee!: EmployeeResponseDto;
    @Expose() @Type(() => StoreSizeResponseDto) storeSize!: StoreSizeResponseDto;

    @Expose() taxSale!: string;
    @Expose() budgetSale!: string;
    @Expose() complianceSale!: string;
    @Expose() rangeApplyBonus!: string;
    @Expose() saleIntangible!: string;
    @Expose() cashSale!: string;
    @Expose() creditSale!: string;

    @Expose() commissionIntangible!: string;
    @Expose() commissionCash!: string;
    @Expose() commissionCredit!: string;
    @Expose() commissionTotal!: string;

    @Expose() observation?: string;
    @Expose() calculateDate!: string;

    @Expose() createdAt!: Date;
    @Expose() updatedAt!: Date;
}

export class AdvisorCommissionSearchDto {
    @IsOptional()
    @IsString()
    documentNumber?: string;

    @IsOptional()
    @IsString()
    employeeName?: string;
}

export class AdvisorCommissionListResponseSearchDto {
    @Expose()
    items!: AdvisorCommissionResponseDto[];

    @Expose()
    total!: number;
}