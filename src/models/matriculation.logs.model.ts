import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {MatriculationTemplate} from './matriculation.templates.model';

@Entity('matriculation_logs')
export class MatriculationLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => MatriculationTemplate, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'matriculation_id' })
    matriculation!: MatriculationTemplate;

    @Column({ name: 'distributor', type: 'varchar', length: 255, nullable: true })
    distributor?: string;

    @Column({ name: 'store_name', type: 'varchar', length: 255, nullable: true })
    storeName?: string; 

    @Column({ name: 'calculate_date', type: 'date', nullable: false })
    calculateDate!: Date;

    @Column({ name: 'rows_count', type: 'int', nullable: false })
    rowsCount!: number;

    @Column({ name: 'product_count', type: 'int', nullable: false })
    productCount!: number;

    @Column({ name: 'upload_total', type: 'int', nullable: true })
    uploadTotal?: number;

    @Column({ name: 'upload_count', type: 'int', nullable: true })
    uploadCount?: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ name: 'user', type: 'varchar', length: 255, nullable: true })
    user?: string;
}
