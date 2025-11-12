import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';
import {SelloutConfiguration} from './sellout.configuration.model';
import {User} from './users.model';
import {ExtractionLogsSellout} from './extraction.logs.sellout.model';

@Entity('extracted_data_sellout')
export class ExtractedDataSellout {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => SelloutConfiguration, (selloutConfiguration) => selloutConfiguration.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager: true,
    })
    @JoinColumn({ name: "sellout_configuration_id" })
    selloutConfiguration!: SelloutConfiguration;

    @ManyToOne(() => ExtractionLogsSellout, (extractionLogsSellout) => extractionLogsSellout.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager: true,
    })
    @JoinColumn({ name: "extraction_log_id" })
    extractionLogsSellout!: ExtractionLogsSellout;

    @Column({ name: 'extraction_date', type: 'timestamp' })
    extractionDate?: Date;

    @Column({ name: 'data_content', type: 'jsonb' })
    dataContent?: object | null;

    @Column({ name: 'record_count', type: 'int' })
    recordCount?: number;

    @Column({ name: 'is_processed', type: 'boolean' })
    isProcessed?: boolean;

    @Column({ name: 'processed_date', type: 'timestamp' })
    processedDate?: Date;

    @ManyToOne(() => User, (user) => user.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager: true,
    })
    @JoinColumn({ name: "processed_by" })
    processedBy!: User;

    @Column({ name: 'processing_details', type: 'jsonb' })
    processingDetails?: object | null;

    @Column({ name: 'data_name', type: 'varchar', length: 255 })
    dataName?: string | null;

    @Column({ name: 'calculate_date', type: 'date' })
    calculateDate?: Date;

    @ManyToOne(() => User, (user) => user.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager: true,
    })
    @JoinColumn({ name: "created_by" })
    createdBy!: User;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

}
