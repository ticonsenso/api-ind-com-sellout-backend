import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {StoreConfiguration} from './store.configuration.model';
import {Employee} from './employees.model';

@Entity('store_manager_calculation_commission')
export class StoreManagerCalculationCommission {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Employee, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'employee_id' })
    employee?: Employee | null;

    @ManyToOne(() => StoreConfiguration, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'store_configuration_id' })
    storeConfiguration?: StoreConfiguration | null;

    @Column({
        name: 'fiscal_sale',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    fiscalSale!: number;

    @Column({
        name: 'ppto_sale',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    pptoSale!: string;

    @Column({
        name: 'sales_compliance_percent',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    })
    salesCompliancePercent!: number;

    @Column({
        name: 'range_compliance',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    })
    rangeCompliance!: number;

    @Column({
        name: 'sales_commission',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    salesCommission!: number;

    @Column({
        name: 'direct_profit',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    directProfit!: number;

    @Column({
        name: 'direct_profit_pto',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    directProfitPto!: number;

    @Column({
        name: 'profit_compliance',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    })
    profitCompliance!: number;

    @Column({
        name: 'profit_commission_percent',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    })
    profitCommissionPercent!: number;

    @Column({
        name: 'profit_commission',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    profitCommission!: number;

    @Column({
        name: 'performance_commission',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    performanceCommission!: number;

    @Column({
        name: 'average_sales_with_performance',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    averageSalesWithPerformance!: number;

    @Column({
        name: 'performance_compliance_percent',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    })
    performanceCompliancePercent!: number;

    @Column({
        name: 'total_payroll_amount',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    totalPayrollAmount!: number;

    @Column({
        name: 'calculate_date',
        type: 'date',
    })
    calculateDate!: Date;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date;

    @Column({
        name: 'fiscal_sale_calculate',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    fiscalSaleCalculate!: number;

    @Column({
        name: 'range_compliance_apl',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    rangeComplianceApl!: number;

    @Column({
        name: 'profit_compliance_apl',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    profitComplianceApl!: number;

    @Column({
        name: 'direct_profit_calculate',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    directProfitCalculate!: number;

}
