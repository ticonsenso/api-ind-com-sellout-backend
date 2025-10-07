import { Expose, Type, Exclude } from 'class-transformer';
import { CompanyResponseDto } from './companies.dto';
import { CompanyPositionResponseDto } from './company.positions.dto';
import { EmployeeResponseDto } from './employees.dto';
import { ConsolidatedCommissionCalculationResponseDto } from './consolidated.commission.calculation.dto';
import { CompanyPositionSnapshot } from '../models/employees.history.model';

export class EmployeeHistoryResponseDto {
    @Expose()
    id!: number;

    @Expose()
    employeeId!: number;

    @Expose()
    @Type(() => CompanyResponseDto)
    company!: CompanyResponseDto;

    @Expose()
    companyPosition!: CompanyPositionSnapshot;

    @Expose()
    code!: string;

    @Expose()
    name!: string;

    @Expose()
    documentNumber!: string;

    @Expose()
    email!: string;

    @Expose()
    phone!: string;

    @Expose()
    city!: string;

    @Expose()
    dateInitialContract!: Date;

    @Expose()
    isActive!: boolean;

    @Expose()
    @Type(() => EmployeeResponseDto)
    supervisor!: EmployeeResponseDto;

    @Expose()
    salary!: number;

    @Expose()
    variableSalary!: number;

    @Expose()
    regional!: string;

    @Expose()
    employeeType!: string;

    @Expose()
    @Type(() => ConsolidatedCommissionCalculationResponseDto)
    consolidatedCommissionCalculation!: ConsolidatedCommissionCalculationResponseDto;

}

export class CompanyPositionSnapshotDto {
    @Expose()
    id!: number;

    @Expose()
    companyId!: number;

    @Expose()
    name!: string;
}
