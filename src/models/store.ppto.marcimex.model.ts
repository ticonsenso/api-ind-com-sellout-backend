import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { StoreConfiguration } from './store.configuration.model';
  
  /**
   * Representa el presupuesto mensual por tienda para Marcimex
   */
  @Entity('store_ppto_marcimex')
  export class StorePptoMarcimex {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({
      type: 'varchar',
      length: 50,
      nullable: false,
    })
    ceco!: string;
  
    @Column({
      type: 'int',
      nullable: false,
    })
    mount!: number;
  
    @Column({
      type: 'int',
      nullable: false,
    })
    year!: number;
  
    @ManyToOne(() => StoreConfiguration, {
      onDelete: 'CASCADE',
      nullable: true,
    })
    @JoinColumn({ name: 'store_configuration_id' })
    storeConfiguration?: StoreConfiguration | null;
  
    @Column({
      name: 'store_ppto',
      type: 'numeric',
      precision: 15,
      scale: 9,
      nullable: false,
    })
    storePpto!: string; // o number si usas transformer
  
    @CreateDateColumn({
      name: 'created_at',
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;
  
    @UpdateDateColumn({
      name: 'updated_at',
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date;
  }
  