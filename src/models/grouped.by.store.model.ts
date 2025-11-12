import {CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
import {StoreConfiguration} from './store.configuration.model';

@Entity('grouped_by_store')
export class GroupedByStore {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => StoreConfiguration, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'store_principal_id' })
    storePrincipal?: StoreConfiguration | null;

    @ManyToOne(() => StoreConfiguration, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'store_secondary_id' })
    storeSecondary?: StoreConfiguration | null;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date;
}
