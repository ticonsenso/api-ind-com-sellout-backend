import { Column, Entity, PrimaryGeneratedColumn, } from 'typeorm';

@Entity('sellout_product_master')
export class SelloutProductMaster {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    distributor?: string | null;

    @Column({ name: 'product_distributor', type: 'varchar', length: 255 })
    productDistributor?: string | null;

    @Column({ name: 'product_store', type: 'varchar', length: 255 })
    productStore?: string | null;

    @Column({ name: 'search_product_store', type: 'varchar', length: 255, unique: true })
    searchProductStore?: string | null;

    @Column({ name: 'code_product_sic', type: 'varchar', length: 255 })
    codeProductSic?: string | null;

    @Column({ name: 'status', type: 'boolean', default: true })
    status!: boolean;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

}
