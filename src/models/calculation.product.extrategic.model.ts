import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './companies.model';
import { CompanyPosition } from './company.positions.model';
import { Employee } from './employees.model';
import { KpiConfig } from './kpi.config.model';
import e from 'express';
@Entity('calculation_product_extrategic')
export class CalculationProductExtrategic {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company!: Company;

    @ManyToOne(() => CompanyPosition)
    @JoinColumn({ name: 'company_position_id' })
    companyPosition!: CompanyPosition;

    @ManyToOne(() => Employee , {eager: true})
    @JoinColumn({ name: 'employee_id' })
    employee!: Employee;

    @ManyToOne(() => KpiConfig)
    @JoinColumn({ name: 'kpi_config_id' })
    kpiConfig!: KpiConfig;

    @Column({ name: 'city' })
    city!: string;

    @Column({ name: 'regional', nullable: true })
    regional!: string;

    @Column({ name: 'calculate_date' })
    calculateDate!: Date;

    @Column({ name: 'ub_real', type: 'decimal', precision: 12, scale: 2 })
    ubReal!: number;

    @Column({ name: 'budget_value', type: 'decimal', precision: 12, scale: 2 })
    budgetValue!: number;

    @Column({ name: 'strategic_compliance_pct', type: 'decimal', precision: 9, scale: 2 })
    strategicCompliancePct!: number;

    @Column({ name: 'exhibition', type: 'decimal', precision: 12, scale: 2 })
    exhibition!: number;

    @Column({ name: 'total_exhibition', type: 'decimal', precision: 12, scale: 2 })
    totalExhibition!: number;

    @Column({ name: 'exhibition_pct', type: 'decimal', precision: 9, scale: 2 })
    exhibitionPct!: number;

    @Column({ name: 'units_sold', type: 'decimal', precision: 12, scale: 2 })
    unitsSold!: number;

    @Column({ name: 'units_exhibited', type: 'decimal', precision: 12, scale: 2 })
    unitsExhibited!: number;

    @Column({ name: 'rotation_pct', type: 'decimal', precision: 9, scale: 2 })
    rotationPct!: number;

    @Column({ name: 'productivity_pct', type: 'decimal', precision: 9, scale: 2 })
    productivityPct!: number;

    @Column({ name: 'applies_bonus', default: false })
    appliesBonus!: boolean;

    @Column({ name: 'value_product_extrategic', type: 'decimal', precision: 12, scale: 2 })
    valueProductExtrategic!: number;

    @Column({ name: 'observation', nullable: true })
    observation!: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
