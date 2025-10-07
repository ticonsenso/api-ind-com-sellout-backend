import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MonthlyResult } from './monthly.results.model';

@Entity('strategic_product_metrics')
export class StrategicProductMetric {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => MonthlyResult, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'monthly_result_id' })
  monthlyResult!: MonthlyResult;

  @Column({ name: 'kpi_name', type: 'varchar', length: 255, nullable: false })
  kpiName!: string;

  @Column({ name: 'weight', type: 'numeric', precision: 5, scale: 2, nullable: false })
  weight!: number;

  @Column({ name: 'goal_value', type: 'numeric', precision: 12, scale: 2, nullable: true })
  goalValue!: number;

  @Column({ name: 'actual_value', type: 'numeric', precision: 12, scale: 2, nullable: true })
  actualValue!: number;

  @Column({ name: 'compliance', type: 'numeric', precision: 5, scale: 2, nullable: true })
  compliance!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
