import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';

@Entity({ name: 'stores_sic', schema: 'db-sellout' })
export class StoresSic {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'cod_almacen', type: 'varchar', length: 255, unique: true })
    codAlmacen!: string;

    @Column({ name: 'nombre_almacen', type: 'varchar', length: 255 })
    nombreAlmacen!: string;

    @Column({ name: 'direccion_almacen', type: 'varchar', length: 255 })
    direccionAlmacen!: string;

    @Column({ name: 'distribuidor', type: 'varchar', length: 255 })
    distribuidor!: string;

    @Column({ name: 'categoria', type: 'varchar', length: 255 })
    categoria!: string;

    @Column({ name: 'ciudad', type: 'varchar', length: 255 })
    ciudad!: string;

    @Column({ name: 'region', type: 'varchar', length: 255 })
    region!: string;

    @Column({ name: 'provincia', type: 'varchar', length: 255 })
    provincia!: string;

    @Column({ name: 'estado', type: 'boolean', default: true, nullable: true })
    estado?: boolean;

    @Column({ name: 'telefono', type: 'varchar', length: 255, nullable: true })
    telefono?: string;

    @Column({ name: 'jefe_agencia', type: 'varchar', length: 255, nullable: true })
    jefeAgencia?: string;

    @Column({ name: 'tamanio', type: 'varchar', length: 255, nullable: true })
    tamanio?: string;

    @Column({ name: 'ubicacion', type: 'varchar', length: 255, nullable: true })
    ubicacion?: string;

    @Column({ name: 'ventas', type: 'int', nullable: true })
    ventas?: number;

    @Column({ name: 'canal', type: 'varchar', length: 255 })
    canal!: string;

    @Column({ name: 'region_mayoreo', type: 'varchar', length: 255, nullable: true })
    regionMayoreo?: string;

    @Column({ name: 'distrib_sap', type: 'varchar', length: 255, nullable: true })
    distribSap?: string;

    @Column({ name: 'grupo_zona', type: 'varchar', length: 255, nullable: true })
    grupoZona?: string;

    @Column({ name: 'supervisor', type: 'varchar', length: 255, nullable: true })
    supervisor?: string;

    @Column({ name: 'zona', type: 'varchar', length: 255, nullable: true })
    zona?: string;

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
