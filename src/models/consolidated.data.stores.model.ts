import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';
import {MatriculationTemplate} from './matriculation.templates.model';

@Entity({ name: 'consolidated_data_stores', schema: 'db-sellout' })
export class ConsolidatedDataStores {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'distributor', type: 'varchar', length: 255 })
    distributor?: string | null;

    @Column({ name: 'code_store_distributor', type: 'varchar', length: 255 })
    codeStoreDistributor?: string | null;

    @Column({ name: 'code_product_distributor', type: 'text'})
    codeProductDistributor?: string | null;

    @Column({ name: 'description_distributor', type: 'text' })
    descriptionDistributor?: string | null;

    @Column({ name: 'units_sold_distributor', type: 'numeric', precision: 12, scale: 2 })
    unitsSoldDistributor?: number;

    @Column({ name: 'sale_date', type: 'date' })
    saleDate?: Date;

    @Column({ name: 'code_product', type: 'varchar', length: 255 })
    codeProduct?: string | null;

    @Column({ name: 'code_store', type: 'varchar', length: 255 })
    codeStore?: string | null;

    @Column({ name: 'authorized_distributor', type: 'varchar', length: 255 })
    authorizedDistributor?: string | null;

    @Column({ name: 'store_name', type: 'varchar', length: 255 })
    storeName?: string | null;

    @Column({ name: 'product_model', type: 'varchar', length: 255 })
    productModel?: string | null;

    @Column({ name: 'calculate_date', type: 'date' })
    calculateDate?: Date;
    
    @ManyToOne(() => MatriculationTemplate, { onDelete: "CASCADE", cascade: true, eager: true })
    @JoinColumn({ name: "matriculation_template_id" })
    matriculationTemplate?: MatriculationTemplate;

    @Column({ name: 'status', type: 'boolean', default: true })
    status?: boolean;

    @Column({ name: 'updated_by', type: 'int' })
    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

    @Column({ name: 'observation', type: 'text', nullable: true })
    observation?: string | null;
}

