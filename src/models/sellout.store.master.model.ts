import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity('sellout_store_master')
export class SelloutStoreMaster {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    distributor?: string | null;

    @Column({ name: 'store_distributor', type: 'varchar', length: 255 })
    storeDistributor?: string | null;

    @Column({ name: 'search_store', type: 'varchar', length: 255, unique: true })
    searchStore?: string | null;

    @Column({ name: 'code_store_sic', type: 'varchar', length: 255 })
    codeStoreSic?: string | null;

    @Column({ type: 'boolean', default: true })
    status!: boolean;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;


}
