import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';
import {SelloutConfiguration} from './sellout.configuration.model';
import {User} from './users.model';

@Entity('extraction_logs_sellout')
export class ExtractionLogsSellout {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => SelloutConfiguration, (selloutConfiguration) => selloutConfiguration.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager: true,
    })
    @JoinColumn({ name: "sellout_configuration_id" })
    selloutConfiguration!: SelloutConfiguration;

    @Column({ name: 'start_time', type: 'timestamp' })
    startTime?: Date;

    @Column({ name: 'end_time', type: 'timestamp' })
    endTime?: Date;

    @Column({ name: 'status', type: 'varchar', length: 255 })
    status?: string | null;

    @Column({ name: 'records_extracted', type: 'int' })
    recordsExtracted?: number;

    @Column({ name: 'records_processed', type: 'int' })
    recordsProcessed?: number;

    @Column({ name: 'records_failed', type: 'int' })
    recordsFailed?: number;

    @Column({ name: 'error_message', type: 'text' })
    errorMessage?: string | null;

    @Column({ name: 'execution_details', type: 'jsonb' })
    executionDetails?: object | null;

    @ManyToOne(() => User, (user) => user.id, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager: true,
    })
    @JoinColumn({ name: "executed_by" })
    executor!: User;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

}
