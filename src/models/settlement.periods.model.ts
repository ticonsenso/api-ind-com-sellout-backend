import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './companies.model';

@Entity('settlement_periods')
export class SettlementPeriod {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @Column({ name: 'start_date', type: 'date', nullable: false })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'date', nullable: false })
  endDate!: Date;

  @Column({ type: 'varchar', length: 50, default: 'OPEN' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
