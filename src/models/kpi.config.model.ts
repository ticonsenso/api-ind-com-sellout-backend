import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './companies.model';
import { CompanyPosition } from './company.positions.model';
import { CommissionConfiguration } from './commission.configurations.model';

@Entity({ name: 'kpi_config' })
export class KpiConfig {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => CompanyPosition, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'company_position_id' })
  companyPosition!: CompanyPosition;

  @ManyToOne(() => CommissionConfiguration, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'commission_configurations_id' })
  commissionConfiguration!: CommissionConfiguration;

  @Column({ name: 'kpi_name', type: 'varchar', length: 50, nullable: false })
  kpiName!: string;

  @Column({ type: 'int', nullable: true })
  weight!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  meta!: number;

  @Column({ name: 'meta_tb', type: 'decimal', precision: 10, scale: 2, nullable: true })
  metaTb!: number;

  @Column({ name: 'meta_ta', type: 'decimal', precision: 10, scale: 2, nullable: true })
  metaTa!: number;
}
