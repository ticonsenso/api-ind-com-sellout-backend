import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,

} from 'typeorm';
import { MatriculationTemplate } from './matriculation.templates.model';

@Entity('sellout_configuration')
export class SelloutConfiguration {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'name', type: 'varchar', length: 255 })
    name?: string | null;

    @Column({ name: 'source_type', type: 'varchar', length: 255 })
    sourceType?: string | null;

    @Column({ type: 'varchar', length: 255 })
    description?: string | null;

    @Column({ name: 'distributor_company_name', type: 'varchar', length: 255 })
    distributorCompanyName?: string | null;

    @Column({ name: 'sheet_name', type: 'varchar', length: 255 })
    sheetName?: string | null;

    @Column({ name: 'code_store_distributor', type: 'varchar', length: 255 })
    codeStoreDistributor?: string | null;

    @Column({ name: 'company_id', type: 'int' })
    companyId?: number | null;

    @ManyToOne(() => MatriculationTemplate, { onDelete: "CASCADE", cascade: true, eager: true })
    @JoinColumn({ name: "matriculation_id" })
    matriculation?: MatriculationTemplate;

    @Column({ name: 'matriculation_id', type: 'int' })
    matriculationId?: number | null;

    @Column({
        name: 'calculate_date',
        type: 'date',
    })
    calculateDate?: Date | null;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

}
