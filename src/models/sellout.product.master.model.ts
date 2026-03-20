import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('sellout_product_master')
@Unique(['searchProductStore', 'periodo'])
export class SelloutProductMaster {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    distributor?: string | null;

    @Column({ name: 'product_distributor', type: 'varchar', length: 255 })
    productDistributor?: string | null;

    @Column({ name: 'product_store', type: 'varchar', length: 255 })
    productStore?: string | null;

    @Column({ name: 'search_product_store', type: 'varchar', length: 255 })
    searchProductStore?: string | null;

    @Column({ name: 'code_product_sic', type: 'varchar', length: 255 })
    codeProductSic?: string | null;

    @Column({ name: 'status', type: 'boolean', default: true })
    status!: boolean;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

    @Column({ name: 'periodo', type: 'date', default: () => 'CURRENT_DATE' })
    periodo!: Date;

}
