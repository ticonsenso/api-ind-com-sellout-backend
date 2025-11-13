import { Expose } from "class-transformer";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { ColumnKeyword } from "./column.keyword.model";

@Entity("column_category")
export class ColumnCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Expose()
  @Column({
    name: "name",
    type: "varchar",
    length: 100,
    unique: true,
    nullable: false,
  })
  name!: string;

  @Expose()
  @Column({ name: "description", type: "text", nullable: true })
  description?: string | null;

  @Expose()
  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  // Relación con ColumnKeyword
  @OneToMany(() => ColumnKeyword, (keyword) => keyword.category)
  keywords!: ColumnKeyword[];
}
