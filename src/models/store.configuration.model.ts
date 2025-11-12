import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {StoreSize} from './store.size.model';
import {Company} from './companies.model';
import {EmployForMonth} from './advisor.configuration.model';

/**
 * Entidad que representa la configuración de una tienda
 */
@Entity('store_configuration')
export class StoreConfiguration {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'regional',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  regional!: string;

  @Column({
    name: 'store_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  storeName!: string;

  @Column({
    name: 'ceco',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  ceco?: string;

  @Column({
    name: 'code',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  code?: string;

  @ManyToOne(() => StoreSize, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_size_id' })
  storeSize!: StoreSize;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company?: Company | null;

  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  notes?: string;

  @Column({
    type: 'date',
    name: 'register_date',
    nullable: false,
  })
  registerDate!: Date;

  @OneToMany(() => EmployForMonth, (employ) => employ.storeConfiguration, { eager: false })
  advisorConfiguration!: EmployForMonth[];

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
