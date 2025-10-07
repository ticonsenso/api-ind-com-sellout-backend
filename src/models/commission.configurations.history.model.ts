import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { CommissionConfiguration } from "./commission.configurations.model";
import { ConsolidatedCommissionCalculation } from "./consolidated.commission.calculation.model";
import { Company } from "./companies.model";
import { CompanyPosition } from "./company.positions.model";

@Entity("commission_configurations_history")
export class CommissionConfigurationsHistory {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => CommissionConfiguration, { onDelete: "CASCADE" })
    @JoinColumn({ name: "commission_configurations_id" })
    commissionConfiguration!: CommissionConfiguration;

    @ManyToOne(() => ConsolidatedCommissionCalculation, {
        nullable: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "consolidated_commission_calculation_id" })
    consolidatedCommissionCalculation?: ConsolidatedCommissionCalculation;

    @ManyToOne(() => Company, { onDelete: "CASCADE" })
    @JoinColumn({ name: "company_id" })
    company!: Company;

    @ManyToOne(() => CompanyPosition, { onDelete: "CASCADE" })
    @JoinColumn({ name: "company_position_id" })
    companyPosition!: CompanyPosition;

    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    name!: string;

    @Column({ name: "description", type: "text", nullable: true })
    description!: string;

    @Column({ name: "status", type: "boolean", default: true })
    status!: boolean;

    @Column({ name: "version", type: "varchar", length: 255, nullable: false })
    version!: string;

    @Column({ name: "note_version", type: "text", nullable: true })
    noteVersion!: string;

    @Column({ name: "is_rule_commission", type: "boolean", default: false })
    isRuleCommission!: boolean;

    @Column({ name: "kpi_config", type: "jsonb", nullable: true })
    kpiConfig?: any;

    @Column({ name: "commission_parameters", type: "jsonb", nullable: true })
    commissionParameters?: any;

    @Column({ name: "product_lines", type: "jsonb", nullable: true })
    productLines?: any;

    @Column({ name: "commission_rules", type: "jsonb", nullable: true })
    commissionRules?: any;

    @Column({ name: "sales_rotation_configurations", type: "jsonb", nullable: true })
    salesRotationConfigurations?: any;

    @Column({ name: "variable_scales", type: "jsonb", nullable: true })
    variableScales?: any;
}
