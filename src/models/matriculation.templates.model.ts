import {MatriculationLog} from "./matriculation.logs.model";
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';

@Entity('matriculation_templates')
export class MatriculationTemplate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'distributor', type: 'varchar', length: 255, nullable: false })
  distributor!: string;

  @Column({ name: 'store_name', type: 'varchar', length: 255, nullable: false })
  storeName?: string;

  @Column({ name: 'status', type: 'boolean', nullable: true, default: true })
  status?: boolean;

  @Column({ name: 'calculate_month', type: 'date', nullable: true })
  calculateMonth?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => MatriculationLog, log => log.matriculation)
  logs?: MatriculationLog[];
}
