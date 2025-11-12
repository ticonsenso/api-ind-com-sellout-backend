import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {Company} from "./companies.model";

@Entity("store_size")
export class StoreSize {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Company, (company) => company.id, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "company_id" })
  company!: Company;

  @Column()
  name!: string;

  @Column({
    name: "bonus",
    type: "numeric",
    precision: 12,
    scale: 2,
  })
  bonus!: number;

  @Column({
    name: "time",
    type: "numeric",
    precision: 12,
    scale: 2,
  })
  time!: number;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;


}
