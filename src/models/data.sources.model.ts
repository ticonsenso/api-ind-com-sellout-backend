import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,} from "typeorm";
import {SourceType} from "../enums/source.type.enum";

/**
 * Entidad que representa las fuentes de datos en el sistema
 */
@Entity("data_sources")
export class DataSource {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({
    type: "varchar",
    length: 50,
    name: "source_type",
    nullable: false,
  })
  sourceType!: SourceType;

  @Column({
    type: "jsonb",
    name: "connection_info",
    nullable: true,
  })
  connectionInfo!: Record<string, any>;

  @Column({
    type: "jsonb",
    name: "config_params",
    nullable: true,
  })
  configParams!: Record<string, any>;

  @Column({ name: "sheet_name", length: 255, nullable: true })
  sheetName!: string;

  @Column({
    type: "boolean",
    name: "auto_extract",
    default: false,
  })
  autoExtract!: boolean;

  @Column({
    type: "varchar",
    length: 50,
    name: "extraction_frequency",
    nullable: true,
  })
  extractionFrequency!: string;

  @Column({
    type: "timestamp",
    name: "last_extraction_date",
    nullable: true,
  })
  lastExtractionDate!: Date;

  @Column({
    type: "timestamp",
    name: "next_scheduled_extraction",
    nullable: true,
  })
  nextScheduledExtraction!: Date;

  @Column({
    type: "varchar",
    length: 50,
    name: "extraction_status",
    default: "PENDING",
  })
  extractionStatus!: string;

  @Column({
    type: "boolean",
    name: "is_active",
    default: true,
  })
  isActive!: boolean;

  @Column({
    type: "int",
    name: "company_id",
    nullable: true,
  })
  companyId!: number;

  @Column({
    type: "int",
    name: "created_by",
    nullable: true,
  })
  createdBy!: number;

  @Column({
    type: "int",
    name: "updated_by",
    nullable: true,
  })
  updatedBy!: number;

  @Column({
    type: "int",
    name: "day_extraction",
    nullable: true,
  })
  dayExtraction!: number; // Día del mes: 1, 2, 3, ..., o NULL si no aplica

  @Column({
    type: "time",
    name: "hour_extraction",
    nullable: true,
  })
  hourExtraction!: Date; // Hora tipo 10:40, o NULL si no aplica

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
