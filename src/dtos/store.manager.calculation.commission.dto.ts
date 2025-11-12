import {Exclude, Expose, Type} from 'class-transformer';
import {IsNumber, IsOptional, IsString} from 'class-validator';
import {StoreConfigurationResponseDto} from './store.configuration.dto';
import {EmployeeResponseDto} from './employees.dto';

export class CreateStoreManagerCalculationCommissionDto {
    @IsOptional()
    @IsString()
    ceco?: string;

    @IsOptional()
    @IsNumber()
    code?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    sale?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    pptoSale?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    directProfit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    directProfitPpto?: number;

    @IsOptional()
    @IsString()
    calculateDate?: string;
}

export class UpdateStoreManagerCalculationCommissionDto extends CreateStoreManagerCalculationCommissionDto {
}

export class StoreManagerCalculationCommissionResponseDto {
    @Expose()
    id!: number;

    @Expose()
    fiscalSale!: number;

    @Expose()
    pptoSale!: number;

    @Expose()
    rangeCompliance!: number;

    @Expose()
    salesCompliancePercent!: number;

    @Expose()
    salesCommission!: number;

    @Expose()
    directProfit!: number;

    @Expose()
    directProfitPto!: number;

    @Expose()
    profitCompliance!: number;

    @Expose()
    profitCommissionPercent!: number;

    @Expose()
    profitCommission!: number;

    @Expose()
    performanceCommission!: number;

    @Expose()
    averageSalesWithPerformance!: number;

    @Expose()
    performanceCompliancePercent!: number;

    @Expose()
    totalPayrollAmount!: number;

    @Expose()
    calculateDate!: string;

    @Expose()
    @Type(() => EmployeeResponseDto)
    employee?: EmployeeResponseDto | null;

    @Expose()
    @Type(() => StoreConfigurationResponseDto)
    storeConfiguration?: StoreConfigurationResponseDto | null;

    @Exclude()
    createdAt?: Date;

    @Exclude()
    updatedAt?: Date;

    @Expose()
    fiscalSaleCalculate!: number;

    @Expose()
    rangeComplianceApl!: number;

    @Expose()
    profitComplianceApl!: number;

    @Expose()
    directProfitCalculate!: number;
}

export class StoreManagerCalculationCommissionPaginatedResponseDto {
    @Expose()
    @Type(() => StoreManagerCalculationCommissionResponseDto)
    items!: StoreManagerCalculationCommissionResponseDto[];

    @Expose()
    total!: number;
}

