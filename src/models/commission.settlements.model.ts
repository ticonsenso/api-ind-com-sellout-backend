import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {Employee} from './employees.model';
import {SettlementPeriod} from './settlement.periods.model';

@Entity('commission_settlements')
export class CommissionSettlement {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @ManyToOne(() => SettlementPeriod, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'period_id' })
  period!: SettlementPeriod;

  @Column({ name: 'total_commission', type: 'numeric', precision: 12, scale: 2, nullable: false })
  totalCommission!: number;

  @Column({ name: 'total_bonus', type: 'numeric', precision: 12, scale: 2, default: 0 })
  totalBonus!: number;

  @Column({ name: 'total_deductions', type: 'numeric', precision: 12, scale: 2, default: 0 })
  totalDeductions!: number;

  @Column({ name: 'final_amount', type: 'numeric', precision: 12, scale: 2, nullable: false })
  finalAmount!: number;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status!: string;

  @Column({ name: 'approved_by', type: 'varchar', length: 255, nullable: true })
  approvedBy!: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
