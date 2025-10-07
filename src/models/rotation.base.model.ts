import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Employee } from './employees.model';
import { Stores } from './stores.model';
import { ProductSic } from './product_sic.model';

@Entity('rotation_base')
export class RotationBase {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'visit_code', type: 'varchar', length: 255, nullable: false })
    visitCode!: string;

    @Column({ name: 'visit_sheet_number', type: 'varchar', length: 255, nullable: true })
    visitSheetNumber!: string;

    @Column({ name: 'visit_date', type: 'date', nullable: false })
    visitDate!: Date;

    @Column({ name: 'visit_year', type: 'int', nullable: false })
    visitYear!: number;

    @Column({ name: 'visit_month', type: 'int', nullable: false })
    visitMonth!: number;

    @Column({ name: 'store_code', type: 'varchar', length: 255, nullable: false })
    storeCode!: string;

    @ManyToOne(() => Stores, (store) => store.id)
    @JoinColumn({ name: 'id_stores' })
    store!: Stores;

    @Column({ name: 'product_code', type: 'varchar', length: 255, nullable: false })
    productCode!: string;

    @ManyToOne(() => ProductSic, (productSic) => productSic.id)
    @JoinColumn({ name: 'id_product_sic' })
    productSic!: ProductSic;

    @Column({ name: 'pvd_value', type: 'numeric', precision: 15, scale: 2, nullable: false })
    pvdValue!: number;

    @Column({ name: 'sellout_units', type: 'numeric', precision: 15, scale: 2, nullable: false })
    selloutUnits!: number;

    @Column({ name: 'sellout_month', type: 'int', nullable: false })
    selloutMonth!: number;

    @Column({ name: 'period', type: 'varchar', length: 255, nullable: false })
    period!: string;

    @Column({ name: 'less_than_3_months', type: 'int', nullable: false })
    lessThan3Months!: number;

    @Column({ name: 'between_3_and_6_months', type: 'int', nullable: false })
    between3And6Months!: number;

    @Column({ name: 'more_than_6_months', type: 'int', nullable: false })
    moreThan6Months!: number;

    @Column({ name: 'more_than_2_years', type: 'int', nullable: false })
    moreThan2Years!: number;

    @Column({ name: 'total_displayed', type: 'int', nullable: false })
    totalDisplayed!: number;

    @Column({ name: 'mapping_target', type: 'int', nullable: false })
    mappingTarget!: number;

    @Column({ name: 'unit_price', type: 'numeric', precision: 15, scale: 2, nullable: false })
    unitPrice!: number;

    @Column({ name: 'total_ub_value', type: 'numeric', precision: 15, scale: 2, nullable: false })
    totalUbValue!: number;

    @Column({ name: 'unit_ub', type: 'numeric', precision: 15, scale: 2, nullable: false })
    unitUb!: number;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'id_employee_promotor' })
    employeePromotor!: Employee;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'id_employee_coordinator_zonal' })
    employeeCoordinatorZonal!: Employee;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'id_employee_promotor_pi' })
    employeePromotorPi!: Employee;

    @Column({ name: 'sales_account', type: 'varchar', length: 255, nullable: false })
    salesAccount!: string;

    @Column({ name: 'display_account', type: 'varchar', length: 255, nullable: false })
    displayAccount!: string;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'id_employee_supervisor' })
    employeeSupervisor!: Employee;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'id_employee_promotor_tv' })
    employeePromotorTv!: Employee;

    @Column({ name: 'more_than_9_months', type: 'int', nullable: false })
    moreThan9Months!: number;

    @Column({ name: 'more_than_1_year', type: 'int', nullable: false })
    moreThan1Year!: number;

    @Column({ name: 'is_consignment', type: 'int', nullable: false })
    isConsignment!: number;

    @Column({ name: 'sellout_year', type: 'int', nullable: false })
    selloutYear!: number;

    @Column({ name: 'sellout_month_number', type: 'int', nullable: false })
    selloutMonthNumber!: number;

    @Column({ name: 'current_ub_value', type: 'numeric', precision: 15, scale: 2, nullable: false })
    currentUbValue!: number;

    @Column({ name: 'current_pvd_value', type: 'numeric', precision: 15, scale: 2, nullable: false })
    currentPvdValue!: number;

    @Column({ name: 'visit_type', type: 'varchar', length: 255, nullable: false })
    visitType!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
