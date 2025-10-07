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

@Entity("company_positions")
export class CompanyPosition {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({
    name: "salary_base",
    type: "numeric",
    precision: 12,
    scale: 2,
    nullable: true,
  })
  salaryBase!: number;

  @Column({ name: "is_store_size", type: "boolean", default: false })
  isStoreSize!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @ManyToOne(() => Company, { onDelete: "CASCADE", cascade: true, eager: true })
  @JoinColumn({ name: "company_id" })
  company!: Company;
}
