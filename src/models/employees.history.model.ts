import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Company } from './companies.model';
import { CompanyPosition } from './company.positions.model';
import { Employee } from './employees.model';
import { ConsolidatedCommissionCalculation } from './consolidated.commission.calculation.model';

export type CompanyPositionSnapshot = {
    id: number;
    companyId: number;
    name: string;
};


@Entity('employees_history')
export class EmployeesHistory {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employee_id' })
    employee!: Employee;

    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company!: Company;

    @ManyToOne(() => CompanyPosition, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_position_id' })
    companyPosition!: CompanyPosition;

    @Column({ name: 'code', type: 'varchar', length: 255, nullable: false, unique: true })
    code!: string;

    @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
    name!: string;

    @Column({ name: 'document_number', type: 'varchar', length: 255, nullable: false })
    documentNumber!: string;

    @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
    email!: string;

    @Column({ name: 'phone', type: 'varchar', length: 255, nullable: true })
    phone!: string;

    @Column({ name: 'city', type: 'varchar', length: 255, nullable: false })
    city!: string;

    @Column({ name: 'date_initial_contract', type: 'date', nullable: false })
    dateInitialContract!: Date;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;

    @ManyToOne(() => Employee, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'supervisor_id' })
    supervisor!: Employee;

    @Column({ name: 'salary', type: 'numeric', precision: 12, scale: 2, nullable: false })
    salary!: number;

    @Column({ name: 'variable_salary', type: 'numeric', precision: 12, scale: 2, nullable: false })
    variableSalary!: number;

    @Column({ name: 'regional', type: 'varchar', length: 255, nullable: true })
    regional!: string;

    @ManyToOne(() => ConsolidatedCommissionCalculation, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'consolidated_commission_calculation_id' })
    consolidatedCommissionCalculation!: ConsolidatedCommissionCalculation;

    @Column({ name: 'company_position_history', type: 'jsonb', nullable: true })
    companyPositionHistory!: CompanyPositionSnapshot;

}
