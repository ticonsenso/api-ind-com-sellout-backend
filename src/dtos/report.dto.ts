import {Expose} from "class-transformer";
import {IsNumber, IsOptional, IsString} from "class-validator";

export class FilterReportCommissionDto {
    @IsNumber()
    year!: number;
    @IsOptional()
    @IsNumber()
    month?: number;
    @IsOptional()
    @IsNumber()
    companyId?: number;
    @IsOptional()
    @IsNumber()
    companyPositionId?: number;
    @IsOptional()
    @IsString()   
    section?: string;
    @IsOptional()
    @IsString()
    descDivision?: string;
    @IsOptional()
    @IsString()
    descDepar?: string;
    @IsOptional()
    @IsString()
    subDepar?: string;
}

export class TotalMonthlyExpensesDto {
    @Expose()
    advisorComissionTotal!: number;

    @Expose()
    storeManagerTotal!: number;

    @Expose()
    totalComission!: number;
}

export class TotalMonthlyExpensesAllDto{
    @Expose()
    mount!: number;

    @Expose()
    value!: number;
}