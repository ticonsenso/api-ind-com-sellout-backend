import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Employee} from './employees.model';
import {StoresSic} from './stores.sic.model';
import {ProductSic} from './product_sic.model';

@Entity('base_ppto_sellout')
export class BasePptoSellout {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'code_supervisor', type: 'varchar', length: 255, nullable: false })
    codeSupervisor!: string;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'id_employee_supervisor' })
    employeeSupervisor!: Employee;

    @Column({ name: 'code_zone', type: 'varchar', length: 255, nullable: false })
    codeZone!: string;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'id_employee_code_zone' })
    employeeCodeZone!: Employee;

    @Column({ name: 'store_code', type: 'varchar', length: 255, nullable: false })
    storeCode!: string;

    @ManyToOne(() => StoresSic, (store) => store.id)
    @JoinColumn({ name: 'id_stores' })
    store!: StoresSic;

    @Column({ name: 'promotor_code', type: 'varchar', length: 255, nullable: false })
    promotorCode!: string;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'id_employee_promotor' })
    employeePromotor!: Employee;

    @Column({ name: 'code_promotor_pi', type: 'varchar', length: 255, nullable: true })
    codePromotorPi?: string | null;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'id_employee_promotor_pi' })
    employeePromotorPi!: Employee;

    @Column({ name: 'code_promotor_tv', type: 'varchar', length: 255, nullable: true })
    codePromotorTv?: string | null;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'id_employee_promotor_tv' })
    employeePromotorTv!: Employee;

    @Column({ name: 'equivalent_code', type: 'varchar', length: 255, nullable: false })
    equivalentCode!: string;

    @ManyToOne(() => ProductSic, (productSic) => productSic.id)
    @JoinColumn({ name: 'id_product_sic' })
    productSic!: ProductSic;

    @Column({ name: 'product_type', type: 'varchar', length: 255, nullable: false })
    productType!: string;

    @Column({ name: 'units', type: 'numeric', precision: 15, scale: 2, nullable: false })
    units!: number;

    @Column({ name: 'unit_base', type: 'numeric', precision: 15, scale: 2, nullable: false })
    unitBase!: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
