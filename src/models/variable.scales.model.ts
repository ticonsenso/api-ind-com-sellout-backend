import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CommissionConfiguration } from "./commission.configurations.model";
import { Company } from "./companies.model";
import { CompanyPosition } from "./company.positions.model";

@Entity({ name: "variable_scales" })
export class VariableScale {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Company, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "company_id" })
  company!: Company;

  @ManyToOne(() => CompanyPosition, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "company_position_id" })
  companyPosition!: CompanyPosition;

  @ManyToOne(() => CommissionConfiguration, {
    onDelete: "CASCADE",
    eager: false,
  })
  @JoinColumn({ name: "commission_configurations_id" })
  commissionConfiguration!: CommissionConfiguration;

  @Column({
    name: "min_score",
    type: "decimal",
    precision: 9,
    scale: 2,
    nullable: false,
  })
  minScore!: number;

  @Column({
    name: "max_score",
    type: "decimal",
    precision: 9,
    scale: 2,
    nullable: false,
  })
  maxScore!: number;

  @Column({
    name: "variable_amount",
    type: "decimal",
    precision: 12,
    scale: 2,
    nullable: false,
  })
  variableAmount!: number;
}
