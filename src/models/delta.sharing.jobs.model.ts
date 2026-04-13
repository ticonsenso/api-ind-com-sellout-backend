import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'sco_adm_delta_jobs', schema: 'db-sellout' })
export class DeltaSharingJob {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'job_id', type: 'varchar', length: 50, unique: true })
    jobId!: string;

    @Column({ name: 'entity_name', type: 'varchar', length: 100 })
    entityName!: string;

    @Column({ name: 'status', type: 'varchar', length: 20 })
    status!: string; // 'EJECUTANDO', 'COMPLETADO', 'ERROR'

    @Column({ name: 'total_records', type: 'int', default: 0 })
    totalRecords!: number;

    @Column({ name: 'processed_records', type: 'int', default: 0 })
    processedRecords!: number;

    @Column({ name: 'error_message', type: 'text', nullable: true })
    errorMessage?: string | null;

    @Column({ name: 'start_time', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    startTime!: Date;

    @Column({ name: 'end_time', type: 'timestamp', nullable: true })
    endTime?: Date | null;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
