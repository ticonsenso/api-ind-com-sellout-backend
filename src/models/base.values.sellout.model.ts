import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('base_values_sellout')
export class BaseValuesSellout {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    brand!: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    model!: string;

    @Column({ name: 'unit_base_unitary', type: 'varchar', length: 255, nullable: true })
    unitBaseUnitary?: string | null;

    @Column({ name: 'pvd_unitary', type: 'varchar', length: 255, nullable: true })
    pvdUnitary?: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
