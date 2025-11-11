import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn,} from 'typeorm';

@Unique('uq_product_sic_jde_code', ['jdeCode'])
@Entity('product_sic')
export class ProductSic {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'id_product_sic', type: 'int', nullable: true })
    idProductSic!: number | null;

    @Column({ name: 'jde_code', type: 'varchar', length: 255 })
    jdeCode!: string;

    @Column({ name: 'jde_name', type: 'varchar', length: 255 })
    jdeName!: string;

    @Column({ name: 'ime_name', type: 'varchar', length: 255 })
    imeName!: string;

    @Column({ name: 'sap_code', type: 'varchar', length: 255 })
    sapCode!: string;

    @Column({ name: 'sap_name', type: 'varchar', length: 255 })
    sapName!: string;

    @Column({ name: 'company_line', type: 'varchar', length: 255 })
    companyLine!: string;

    @Column({ name: 'category', type: 'varchar', length: 255 })
    category!: string;

    @Column({ name: 'sub_category', type: 'varchar', length: 255 })
    subCategory!: string;

    @Column({ name: 'mar_model_lm', type: 'varchar', length: 255 })
    marModelLm!: string;

    @Column({ name: 'model', type: 'varchar', length: 255, nullable: true })
    model?: string | null;

    @Column({ name: 'design_line', type: 'varchar', length: 255 })
    designLine!: string;

    @Column({ name: 'brand', type: 'varchar', length: 255 })
    brand!: string;

    @Column({ name: 'discontinued', type: 'boolean', default: false })
    discontinued!: boolean;

    @Column({ name: 'status', type: 'boolean', default: true })
    status!: boolean;

    @Column({ name: 'sheet_visit', type: 'varchar', length: 255 })
    sheetVisit!: string;

    @Column({ name: 'equivalent_pro_id', type: 'varchar', length: 255 })
    equivalentProId!: string;

    @Column({ name: 'equivalent', type: 'varchar', length: 255 })
    equivalent!: string;

    @Column({ name: 'validity', type: 'varchar', length: 255, nullable: true })
    validity?: string | null;

    @Column({ name: 'repeated_numbers', type: 'varchar', length: 255, nullable: true })
    repeatedNumbers?: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date;
}
