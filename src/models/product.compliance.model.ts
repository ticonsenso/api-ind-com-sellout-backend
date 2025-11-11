import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {Company} from "./companies.model";
import {Employee} from "./employees.model";
import {ParameterLine} from "./parameter.lines.model";

@Entity({ name: "product_compliance" })
export class ProductCompliance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "sale_value", type: "numeric", precision: 12, scale: 2 })
  saleValue!: number;

  @Column({ name: "budget_value", type: "numeric", precision: 12, scale: 2 })
  budgetValue!: number;

  @Column({
    name: "compliance_percentage",
    type: "numeric",
    precision: 9,
    scale: 2,
  })
  compliancePercentage!: number;

  @Column({
    name: "compliance_percentage_max",
    type: "numeric",
    precision: 9,
    scale: 2,
  })
  compliancePercentageMax!: number;

  @Column({ name: "weight", type: "numeric", precision: 9, scale: 2 })
  weight!: number;

  @Column({
    name: "value_base_variable",
    type: "numeric",
    precision: 12,
    scale: 2,
  })
  valueBaseVariable!: number;

  @Column({ name: "variable_amount", type: "numeric", precision: 12, scale: 2 })
  variableAmount!: number;

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
  })
  updatedAt!: Date;

  @ManyToOne(() => Company)
  @JoinColumn({ name: "company_id" })
  company!: Company;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: "employee_id" })
  employee!: Employee;

  @ManyToOne(() => ParameterLine)
  @JoinColumn({ name: "parameter_line_id" })
  parameterLine!: ParameterLine;
}
