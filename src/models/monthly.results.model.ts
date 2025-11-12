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

@Entity('monthly_results')
export class MonthlyResult {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column({ name: 'month', type: 'date', nullable: false })
  month!: Date;

  @Column({ name: 'product_line', type: 'text', nullable: false })
  productLine!: string;

  @Column({ name: 'sale_value', type: 'numeric', precision: 12, scale: 2, nullable: false })
  saleValue!: number;

  @Column({ name: 'compliance', type: 'numeric', precision: 5, scale: 2, nullable: true })
  compliance!: number;

  @Column({ name: 'productivity', type: 'numeric', precision: 5, scale: 2, nullable: true })
  productivity!: number;

  @Column({ name: 'bonus_applies', type: 'boolean', default: false })
  bonusApplies!: boolean;

  @Column({ name: 'commission_amount', type: 'numeric', precision: 12, scale: 2, nullable: true })
  commissionAmount!: number;

  @Column({ name: 'observations', type: 'text', nullable: true })
  observations!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
