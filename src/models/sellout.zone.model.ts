import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {StoresSic} from './stores.sic.model';

@Entity('sellout_zone')
export class SelloutZone {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @ManyToOne(() => StoresSic, store => store.id, {
        onDelete: 'CASCADE',
    })

    @JoinColumn({ name: 'stores_id' })
    stores!: StoresSic;

    @Column({ name: 'group_name', type: 'varchar', length: 255 })
    groupName!: string;

    @Column({ type: 'boolean', default: true })
    status?: boolean | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date;
}
