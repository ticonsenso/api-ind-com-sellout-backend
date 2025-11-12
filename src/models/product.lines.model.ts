import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {CommissionConfiguration} from './commission.configurations.model';
import {ParameterLine} from './parameter.lines.model';

@Entity('product_lines')
export class ProductLine {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CommissionConfiguration, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'commission_configurations_id' })
  commissionConfiguration!: CommissionConfiguration;

  @ManyToOne(() => ParameterLine, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'parameter_line_id' })
  parameterLine!: ParameterLine;

  @Column({ name: 'commission_weight', type: 'numeric', precision: 9, scale: 2, nullable: false })
  commissionWeight!: number;

  @Column({ name: 'goal_rotation', type: 'numeric', precision: 9, scale: 2, nullable: false })
  goalRotation!: number;

  @Column({ name: 'min_sale_value', type: 'numeric', precision: 12, scale: 2, nullable: true })
  minSaleValue!: number;

  @Column({ name: 'max_sale_value', type: 'numeric', precision: 12, scale: 2, nullable: true })
  maxSaleValue!: number;

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
