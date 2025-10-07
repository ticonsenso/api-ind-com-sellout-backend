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
import { CompanyPosition } from './company.positions.model';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true })
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => CompanyPosition, { onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true })
  @JoinColumn({ name: 'company_position_id' })
  companyPosition!: CompanyPosition;

  @Column({ type: 'varchar', length: 255, nullable: false })
  code!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ name: 'document_number', type: 'varchar', length: 255, nullable: false })
  documentNumber!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city?: string | null;

  @Column({ name: 'date_initial_contract', type: 'date', nullable: false })
  dateInitialContract!: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'supervisor_id', type: 'varchar', length: 255, nullable: true })
  supervisorId?: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: false })
  salary!: number;

  @Column({ name: 'variable_salary', type: 'numeric', precision: 12, scale: 2, nullable: false })
  variableSalary!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  section?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ceco?: string | null;

  @Column({ name: 'desc_uni_nego', type: 'varchar', length: 255, nullable: true })
  descUniNego?: string | null;

  @Column({ name: 'desc_division', type: 'varchar', length: 255, nullable: true })
  descDivision?: string | null;

  @Column({ name: 'desc_depar', type: 'varchar', length: 255, nullable: true })
  descDepar?: string | null;

  @Column({ name: 'sub_depar', type: 'varchar', length: 255, nullable: true })
  subDepar?: string | null;

  @Column({ type: 'integer', nullable: true })
  month?: number;

  @Column({ type: 'integer', nullable: true })
  year?: number;

  @Column({ name: 'employee_type', type: 'varchar', length: 255, nullable: true })
  employeeType?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
