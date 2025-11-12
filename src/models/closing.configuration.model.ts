import {Expose} from 'class-transformer';
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';

@Entity('closing_configuration')
export class ClosingConfiguration {
    @PrimaryGeneratedColumn()
    id!: number;

    @Expose()
    @Column({ name: 'closing_date', type: 'date', nullable: false })
    closingDate!: Date;

    @Expose()
    @Column({ name: 'month', type: 'date', nullable: false })
    month!: Date;
    
    @Expose()
    @Column({ name: 'start_date', type: 'date', nullable: false })
    startDate!: Date;

    @Expose()
    @Column({ name: 'description', type: 'text', nullable: true })
    description?: string | null;

    @Expose()
    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Expose()
    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date;
}
