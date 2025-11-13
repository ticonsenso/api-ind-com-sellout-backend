import { Expose } from "class-transformer";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ColumnCategory } from "./column.category.model";

@Entity("column_keyword")
export class ColumnKeyword {
  @PrimaryGeneratedColumn()
  id!: number;

  @Expose()
  @Column({ name: "keyword", type: "varchar", length: 255, nullable: false })
  keyword!: string;  

  @Expose()
  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  // Relación con ColumnCategory
  @ManyToOne(() => ColumnCategory, (category) => category.keywords, {
    onDelete: "CASCADE", eager: true 
  })
  @JoinColumn({ name: "category_id" })
  category!: ColumnCategory;
}
