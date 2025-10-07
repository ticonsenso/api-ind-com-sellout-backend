import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Employee } from './employees.model';
import { Stores } from './stores.model';

@Entity('visit_registry_base')
export class VisitRegistryBase {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'assigned_promoter_code', type: 'varchar', length: 255, nullable: false })
    assignedPromoterCode!: string;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'id_employee_promotor' })
    employeePromotor!: Employee;

    @Column({ name: 'assigned_coordinator_code', type: 'varchar', length: 255, nullable: false })
    assignedCoordinatorCode!: string;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'id_employee_coordinator_zonal' })
    employeeCoordinatorZonal!: Employee;

    @Column({ name: 'visit_month', type: 'varchar', length: 255, nullable: false })
    visitMonth!: string;

    @Column({ name: 'visit_day_of_week', type: 'varchar', length: 255, nullable: false })
    visitDayOfWeek!: string;

    @Column({ name: 'visit_date', type: 'date', nullable: false })
    visitDate!: Date;

    @Column({ name: 'store_code', type: 'varchar', length: 255, nullable: false })
    storeCode!: string;

    @ManyToOne(() => Stores, (store) => store.id)
    @JoinColumn({ name: 'id_stores' })
    store!: Stores;

    @Column({ name: 'planning_status', type: 'varchar', length: 255, nullable: false })
    planningStatus!: string;

    @Column({ name: 'planned_schedule', type: 'time', nullable: false })
    plannedSchedule!: string;

    @Column({ name: 'planned_duration', type: 'interval', nullable: false })
    plannedDuration!: string;

    @Column({ name: 'monthly_frequency', type: 'int', nullable: false })
    monthlyFrequency!: number;

    @Column({ name: 'actual_schedule', type: 'time', nullable: false })
    actualSchedule!: string;

    @Column({ name: 'actual_duration', type: 'interval', nullable: false })
    actualDuration!: string;

    @Column({ name: 'compliance_percentage', type: 'numeric', precision: 5, scale: 2, nullable: false })

    @Column({ name: 'compliance_status', type: 'varchar', length: 255, nullable: false })
    complianceStatus!: string;

    @Column({ name: 'planned_minutes', type: 'int', nullable: false })
    plannedMinutes!: number;

    @Column({ name: 'actual_minutes', type: 'int', nullable: false })
    actualMinutes!: number;

    @Column({ name: 'not_planned', type: 'boolean', nullable: false })
    notPlanned!: boolean;

    @Column({ name: 'promoter_observation', type: 'varchar', length: 255, nullable: false })
    promoterObservation!: string;

    @Column({ name: 'zonal_observation', type: 'varchar', length: 255, nullable: false })
    zonalObservation!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
