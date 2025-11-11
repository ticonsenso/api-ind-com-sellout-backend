import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('web_services')
export class WebServices {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'material_code', type: 'varchar', length: 255, nullable: false })
    materialCode!: string;

    @Column({ name: 'ean_code', type: 'varchar', length: 255, nullable: false })
    eanCode!: string;

    @Column({ name: 'material_status', type: 'varchar', length: 255, nullable: false })
    materialStatus!: string;

    @Column({ name: 'product_weight', type: 'numeric', precision: 10, scale: 2, nullable: false })
    productWeight!: number;

    @Column({ name: 'weight_unit', type: 'varchar', length: 255, nullable: false })
    weightUnit!: string;

    @Column({ name: 'product_name', type: 'varchar', length: 255, nullable: false })
    productName!: string;

    @Column({ name: 'material_type_code', type: 'varchar', length: 255, nullable: false })
    materialTypeCode!: string;

    @Column({ name: 'material_type_description', type: 'varchar', length: 255, nullable: false })
    materialTypeDescription!: string;

    @Column({ name: 'sales_org', type: 'varchar', length: 255, nullable: false })
    salesOrg!: string;

    @Column({ name: 'business_line', type: 'varchar', length: 255, nullable: false })
    businessLine!: string;

    @Column({ name: 'category', type: 'varchar', length: 255, nullable: false })
    category!: string;

    @Column({ name: 'subcategory', type: 'varchar', length: 255, nullable: false })
    subcategory!: string;

    @Column({ name: 'color', type: 'varchar', length: 255, nullable: false })
    color!: string;

    @Column({ name: 'design_line', type: 'varchar', length: 255, nullable: false })
    designLine!: string;

    @Column({ name: 'brand', type: 'varchar', length: 255, nullable: false })
    brand!: string;

    @Column({ name: 'segment', type: 'varchar', length: 255, nullable: false })
    segment!: string;

    @Column({ name: 'size', type: 'varchar', length: 255, nullable: false })
    size!: string;

    @Column({ name: 'model_im', type: 'varchar', length: 255, nullable: false })
    modelIm!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
