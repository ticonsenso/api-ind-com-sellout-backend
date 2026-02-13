import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn, } from 'typeorm';

@Unique('uq_product_sic_id_producto_sic', ['idProductoSic'])
@Entity({ name: 'product_sic', schema: 'db-sellout' })
export class ProductSic {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'idProductoSic', type: 'varchar', length: 255, unique: true })
    idProductoSic!: string;

    @Column({ name: 'codigo_jde', type: 'varchar', length: 255 })
    codigoJde!: string;

    @Column({ name: 'num_repetidos', type: 'varchar', length: 255, nullable: true })
    numRepetidos?: string | null;

    @Column({ name: 'nombre_ime', type: 'varchar', length: 255 })
    nombreIme!: string;

    @Column({ name: 'codigo_sap', type: 'varchar', length: 255 })
    codigoSap!: string;

    @Column({ name: 'nombre_sap', type: 'varchar', length: 255 })
    nombreSap!: string;

    @Column({ name: 'linea_negocio_sap', type: 'varchar', length: 255 })
    lineaNegocioSap!: string;

    @Column({ name: 'mar_desc_grupo_art', type: 'varchar', length: 255 })
    marDescGrupoArt!: string;

    @Column({ name: 'mar_desc_jerarq', type: 'varchar', length: 255 })
    marDescJerarq!: string;

    @Column({ name: 'mar_modelo_im', type: 'varchar', length: 255 })
    marModeloIm!: string;

    @Column({ name: 'linea_disenio_sap', type: 'varchar', length: 255 })
    lineaDisenioSap!: string;

    @Column({ name: 'marca_sap', type: 'varchar', length: 255 })
    marcaSap!: string;

    @Column({ name: 'color_sap', type: 'varchar', length: 255, nullable: true })
    colorSap?: string | null;

    @Column({ name: 'descontinuado', type: 'boolean', default: false, nullable: true })
    descontinuado?: boolean;

    @Column({ name: 'estado', type: 'boolean', default: true, nullable: true })
    estado?: boolean;

    @Column({ name: 'hojas_vis', type: 'varchar', length: 255 })
    hojasVis!: string;

    @Column({ name: 'pro_id_equivalencia', type: 'varchar', length: 255 })
    proIdEquivalencia!: string;

    @Column({ name: 'equivalencia', type: 'varchar', length: 255 })
    equivalencia!: string;

    @Column({ name: 'vigencia', type: 'varchar', length: 255, nullable: true })
    vigencia?: string | null;

    @Column({ name: 'prod_id', type: 'varchar', length: 255, nullable: true })
    prodId?: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
    createdAt?: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        onUpdate: 'CURRENT_TIMESTAMP',
        nullable: true,
    })
    updatedAt?: Date;
}
