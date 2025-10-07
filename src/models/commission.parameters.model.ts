import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommissionConfiguration } from './commission.configurations.model';
import { ParameterCategory } from './parameter.categories.model';

@Entity({ name: 'commission_parameters' })
export class CommissionParameter {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CommissionConfiguration, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'commission_configurations_id' })
  commissionConfiguration!: CommissionConfiguration;

  @ManyToOne(() => ParameterCategory, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'category_id' })
  category!: ParameterCategory;

  @Column({ type: 'varchar', length: 255, nullable: false })
  value!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({ name: 'months_condition', type: 'integer', nullable: true })
  monthsCondition!: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
