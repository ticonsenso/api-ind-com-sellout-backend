import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Company } from "./companies.model";
import { CompanyPosition } from "./company.positions.model";
import { Employee } from "./employees.model";

@Entity({ name: "consolidated_commission_calculation" })
export class ConsolidatedCommissionCalculation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: "company_id" })
  company!: Company;

  @ManyToOne(() => CompanyPosition)
  @JoinColumn({ name: "company_position_id" })
  companyPosition!: CompanyPosition;

  @ManyToOne(() => Employee, (employee) => employee.id)
  @JoinColumn({ name: "employee_id" })
  employee!: Employee;

  @Column({
    name: "total_commission_product_line",
    type: "decimal",
    precision: 12,
    scale: 2,
  })
  totalCommissionProductLine!: number;

  @Column({
    name: "total_commission_product_estategic",
    type: "decimal",
    precision: 12,
    scale: 2,
  })
  totalCommissionProductEstategic!: number;

  @Column({
    name: "total_hours_extra",
    type: "decimal",
    precision: 12,
    scale: 2,
  })
  totalHoursExtra!: number;

  @Column({ name: "total_nomina", type: "decimal", precision: 12, scale: 2 })
  totalNomina!: number;

  @Column({ name: "pct_nomina", type: "decimal", precision: 9, scale: 2 })
  pctNomina!: number;

  @Column({ name: "observation", type: "text", nullable: true })
  observation!: string;

  @Column({ name: "calculate_date", type: "date" })
  calculateDate!: Date;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @Column({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
