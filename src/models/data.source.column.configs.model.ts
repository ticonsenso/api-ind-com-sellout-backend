import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {DataSource} from "./data.sources.model";
import {User} from "./users.model";

@Entity({ name: "data_source_column_configs" })
export class DataSourceColumnConfig {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "column_name", nullable: true })
  columnName!: string;

  @Column({ name: "column_index", nullable: true })
  columnIndex!: number;

  @Column({ name: "column_letter", length: 10, nullable: true })
  columnLetter!: string;

  @Column({ name: "data_type", length: 50 })
  dataType!: string;

  @Column({ name: "format_pattern", length: 100, nullable: true })
  formatPattern!: string;

  @Column({ name: "is_required", default: false })
  isRequired!: boolean;

  @Column({ name: "default_value", type: "text", nullable: true })
  defaultValue!: string;

  @Column({ name: "mapping_to_field", length: 255, nullable: true })
  mappingToField!: string;

  @Column({ name: "header_row", default: 1 })
  headerRow!: number;

  @Column({ name: "start_row", default: 2 })
  startRow!: number;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  @Column({ name: "created_by", nullable: true })
  createdBy!: number;

  @Column({ name: "updated_by", nullable: true })
  updatedBy!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @ManyToOne(() => DataSource, (dataSource) => dataSource.id, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "data_source_id" })
  dataSource!: DataSource;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "created_by" })
  creator!: User;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "updated_by" })
  updater!: User;
}
