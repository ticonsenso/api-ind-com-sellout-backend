import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Company } from "./companies.model";
import { CompanyPosition } from "./company.positions.model";

@Entity("commission_configurations")
export class CommissionConfiguration {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Company, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "company_id" })
  company!: Company;

  @ManyToOne(() => CompanyPosition, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "company_position_id" })
  companyPosition!: CompanyPosition;

  @Column({ name: "is_rule_commission", type: "boolean", default: false })
  isRuleCommission!: boolean;

  @Column({ type: "varchar", length: 255, nullable: false })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "boolean", default: true })
  status!: boolean;

  @Column({ type: "varchar", length: 255, nullable: false })
  version!: string;

  @Column({ name: "note_version", type: "text", nullable: true })
  noteVersion!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
