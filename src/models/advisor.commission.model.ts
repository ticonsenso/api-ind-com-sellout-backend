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
import { StoreSize } from './store.size.model';

@Entity('advisor_commission')
export class AdvisorCommission {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company!: Company;

    @ManyToOne(() => CompanyPosition)
    @JoinColumn({ name: 'company_position_id' })
    companyPosition!: CompanyPosition;

    @ManyToOne(() => Employee)
    @JoinColumn({ name: 'employee_id' })
    employee!: Employee;

    @ManyToOne(() => StoreSize)
    @JoinColumn({ name: 'store_size_id' })
    storeSize!: StoreSize;

    @Column({ name: 'tax_sale', type: 'decimal', precision: 12, scale: 9 })
    taxSale!: number;

    @Column({ name: 'budget_sale', type: 'decimal', precision: 12, scale: 9 })
    budgetSale!: number;

    @Column({ name: 'compliance_sale', type: 'decimal', precision: 12, scale: 9 })
    complianceSale!: number;

    @Column({ name: 'range_apply_bonus', type: 'decimal', precision: 12, scale: 9 })
    rangeApplyBonus!: number;

    @Column({ name: 'sale_intangible', type: 'decimal', precision: 12, scale: 9 })
    saleIntangible!: number;

    @Column({ name: 'cash_sale', type: 'decimal', precision: 12, scale: 9 })
    cashSale!: number;

    @Column({ name: 'credit_sale', type: 'decimal', precision: 12, scale: 9 })
    creditSale!: number;

    @Column({ name: 'commission_intangible', type: 'decimal', precision: 12, scale: 9 })
    commissionIntangible!: number;

    @Column({ name: 'commission_cash', type: 'decimal', precision: 12, scale: 9 })
    commissionCash!: number;

    @Column({ name: 'commission_credit', type: 'decimal', precision: 12, scale: 9 })
    commissionCredit!: number;

    @Column({ name: 'commission_total', type: 'decimal', precision: 12, scale: 9 })
    commissionTotal!: number;

    @Column({ name: 'observation', type: 'text', nullable: true })
    observation?: string;

    @Column({ name: 'calculate_date', type: 'date' })
    calculateDate!: Date;

    @Column({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;

    @Column({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date;
}
