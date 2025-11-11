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

@Entity({ name: 'overtime_records' })
export class OvertimeRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column({ type: 'date' })
  month!: Date;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  hours!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  rate!: number;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
