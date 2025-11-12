import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {StoreConfiguration} from './store.configuration.model';

/**
 * Entidad que representa la configuración de empleados por mes
 */
@Entity('employ_for_month')
export class EmployForMonth {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'mount_name', type: 'varchar', nullable: false })
  mountName!: string;

  @Column({ name: 'month', type: 'int', nullable: false })
  month!: number;

  @Column({ name: 'number_employees', type: 'int', nullable: false })
  numberEmployees!: number;

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

  @ManyToOne(() => StoreConfiguration, (store) => store.id, {
    onDelete: 'CASCADE',
  })

  @JoinColumn({ name: 'store_configuration_id' })
  storeConfiguration!: StoreConfiguration;
}
