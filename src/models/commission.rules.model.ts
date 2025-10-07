import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CommissionConfiguration } from "./commission.configurations.model";
import { ParameterLine } from "./parameter.lines.model";

@Entity("commission_rules")
export class CommissionRule {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CommissionConfiguration, { onDelete: "CASCADE" })
  @JoinColumn({ name: "commission_configurations_id" })
  commissionConfiguration!: CommissionConfiguration;

  @ManyToOne(() => ParameterLine, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "parameter_lines_id" })
  parameterLine!: ParameterLine;

  @Column({
    name: "min_complace",
    type: "numeric",
    precision: 9,
    scale: 2,
    nullable: false,
  })
  minComplace!: number;

  @Column({
    name: "max_complace",
    type: "numeric",
    precision: 9,
    scale: 2,
    nullable: false,
  })
  maxComplace!: number;

  @Column({
    name: "commission_percentage",
    type: "numeric",
    precision: 9,
    scale: 2,
    nullable: false,
  })
  commissionPercentage!: number;

  @Column({
    name: "bone_extra",
    type: "numeric",
    precision: 9,
    scale: 2,
    nullable: false,
  })
  boneExtra!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
