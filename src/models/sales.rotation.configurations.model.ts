import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { CommissionConfiguration } from './commission.configurations.model';

@Entity({ name: 'sales_rotation_configurations' })
export class SalesRotationConfiguration {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int' })
    month!: number;

    @Column({ name: 'month_name', type: 'varchar', length: 50 })
    monthName!: string;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    goal!: number;

    @Column({ type: 'numeric', precision: 5, scale: 2 })
    weight!: number;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ name: 'is_high_season', type: 'boolean', default: false })
    isHighSeason!: boolean;

    @ManyToOne(() => CommissionConfiguration, (config) => config.id, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'commission_configurations_id' })
    commissionConfiguration!: CommissionConfiguration;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
