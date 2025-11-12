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

@Entity({ name: "extraction_logs" })
export class ExtractionLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: "start_time",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  startTime!: Date;

  @Column({ name: "end_time", type: "timestamp", nullable: true })
  endTime!: Date;

  @Column({ name: "status", default: "IN_PROGRESS" })
  status!: string;

  @Column({ name: "records_extracted", default: 0 })
  recordsExtracted!: number;

  @Column({ name: "records_processed", default: 0 })
  recordsProcessed!: number;

  @Column({ name: "records_failed", default: 0 })
  recordsFailed!: number;

  @Column({ name: "error_message", type: "text", nullable: true })
  errorMessage!: string;

  @Column({ name: "execution_details", type: "jsonb", nullable: true })
  executionDetails!: object;

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
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "executed_by" })
  executor!: User;
}
