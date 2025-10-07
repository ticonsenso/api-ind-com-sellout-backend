import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DataSource } from "./data.sources.model";
import { ExtractionLog } from "./extraction.logs.model";
import { User } from "./users.model";

@Entity({ name: "extracted_data" })
export class ExtractedData {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: "extraction_date",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  extractionDate!: Date;

  @Column({ name: "data_content", type: "jsonb" })
  dataContent!: object;

  @Column({ name: "record_count", default: 0 })
  recordCount!: number;

  @Column({ name: "is_processed", default: false })
  isProcessed!: boolean;

  @Column({ name: "processed_date", type: "timestamp", nullable: true })
  processedDate!: Date;

  @Column({ name: "processing_details", type: "jsonb", nullable: true })
  processingDetails!: object;

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

  @ManyToOne(() => ExtractionLog, (extractionLog) => extractionLog.id, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "extraction_log_id" })
  extractionLog!: ExtractionLog;

  @Column({ name: "data_name", type: "varchar", nullable: true })
  dataName!: string;

  @Column({ name: "calculate_date", type: "date", nullable: true })
  calculateDate!: Date;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "processed_by" })
  processor!: User;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "created_by" })
  creator!: User;
}
