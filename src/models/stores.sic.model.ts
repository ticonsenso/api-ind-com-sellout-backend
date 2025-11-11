import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';

@Entity('stores_sic')
export class StoresSic {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'store_code', type: 'numeric', unique: true })
    storeCode!: number;

    @Column({ name: 'store_name', type: 'varchar', length: 255 })
    storeName!: string;

    @Column({ name: 'store_address', type: 'varchar', length: 255 })
    storeAddress!: string;

    @Column({ name: 'distributor', type: 'varchar', length: 255 })
    distributor!: string;

    @Column({ name: 'distributor2', type: 'varchar', length: 255 })
    distributor2!: string;

    @Column({ name: 'phone', type: 'varchar', length: 255 })
    phone!: string;

    @Column({ name: 'agency_manager', type: 'varchar', length: 255 })
    agencyManager!: string;

    @Column({ name: 'size', type: 'varchar', length: 255 })
    size!: string;

    @Column({ name: 'ubication', type: 'varchar', length: 255 })
    ubication!: string;

    @Column({ name: 'sales', type: 'int' })
    sales!: number;

    @Column({ name: 'channel', type: 'varchar', length: 255 })
    channel!: string;

    @Column({ name: 'distributor_sap', type: 'varchar', length: 255 })
    distributorSap!: string;

    @Column({ name: 'end_channel', type: 'varchar', length: 255 })
    endChannel!: string;

    @Column({ name: 'supervisor', type: 'varchar', length: 255 })
    supervisor!: string;

    @Column({ name: 'wholesale_region', type: 'varchar', length: 255 })
    wholesaleRegion!: string;

    @Column({ name: 'city', type: 'varchar', length: 255 })
    city!: string;

    @Column({ name: 'region', type: 'varchar', length: 255 })
    region!: string;

    @Column({ name: 'province', type: 'varchar', length: 255 })
    province!: string;

    @Column({ name: 'category', type: 'varchar', length: 255 })
    category!: string;

    @Column({ name: 'zone', type: 'varchar', length: 255, nullable: true })
    zone?: string;

    @Column({ type: 'boolean', default: true })
    status!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date;
}
