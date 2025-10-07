import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { SelloutConfiguration } from './sellout.configuration.model';
import { User } from './users.model';

@Entity('sellout_configuration_column_configs')
export class SelloutConfigurationColumnConfigs {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => SelloutConfiguration, (selloutConfiguration) => selloutConfiguration.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager: true,
    })
    @JoinColumn({ name: "sellout_configuration_id" })
    selloutConfiguration!: SelloutConfiguration;

    @Column({ name: 'column_name', type: 'varchar', length: 255 })
    columnName?: string | null;

    @Column({ name: 'column_index', type: 'int' })
    columnIndex?: number;

    @Column({ name: 'column_letter', type: 'varchar', length: 255 })
    columnLetter?: string | null;

    @Column({ name: 'data_type', type: 'varchar', length: 255 })
    dataType?: string | null;

    @Column({ name: 'is_required', type: 'boolean' })
    isRequired?: boolean;

    @Column({ name: 'mapping_to_field', type: 'varchar', length: 255 })
    mappingToField?: string | null;

    @Column({ name: 'header_row', type: 'int' })
    headerRow?: number;

    @Column({ name: 'start_row', type: 'int' })
    startRow?: number;

    @Column({ name: 'is_active', type: 'boolean' })
    isActive?: boolean;

    @Column({ name: 'has_negative_value', type: 'boolean' })
    hasNegativeValue?: boolean;

    @ManyToOne(() => User, (user) => user.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager: true,
    })
    @JoinColumn({ name: "created_by" })
    createdBy!: User;

    @ManyToOne(() => User, (user) => user.id, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        eager: true,
    })
    @JoinColumn({ name: "updated_by" })
    updatedBy!: User;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

}
