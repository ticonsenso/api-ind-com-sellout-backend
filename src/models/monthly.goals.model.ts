import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyPosition } from './company.positions.model';
import { ProductLine } from './product.lines.model';

@Entity('monthly_goals')
export class MonthlyGoal {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CompanyPosition, { onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true })
  @JoinColumn({ name: 'company_position_id' })
  companyPosition!: CompanyPosition;

  @ManyToOne(() => ProductLine, { onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true })
  @JoinColumn({ name: 'product_line_id' })
  productLine!: ProductLine;

  @Column({ name: 'month_start', type: 'date', nullable: false })
  monthStart!: Date;

  @Column({ name: 'month_end', type: 'date', nullable: true })
  monthEnd!: Date;

  @Column({ name: 'goal_value', type: 'numeric', precision: 12, scale: 2, nullable: false })
  goalValue!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
