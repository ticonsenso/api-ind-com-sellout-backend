import {Expose} from 'class-transformer';

export class CommissionConfigurationsHistoryDto {
    @Expose()
    id!: number;

    @Expose()
    commissionConfigurationsId!: number;

    @Expose()
    consolidatedCommissionCalculationId?: number;

    @Expose()
    companyId!: number;

    @Expose()
    companyPositionId!: number;

    @Expose()
    name!: string;

    @Expose()
    description?: string;

    @Expose()
    status!: boolean;

    @Expose()
    version!: string;

    @Expose()
    noteVersion?: string;

    @Expose()
    isRuleCommission!: boolean;

    @Expose()
    kpiConfig?: Record<string, any>;

    @Expose()
    commissionParameters?: Record<string, any>;

    @Expose()
    productLines?: Record<string, any>;

    @Expose()
    commissionRules?: Record<string, any>;

    @Expose()
    salesRotationConfigurations?: Record<string, any>;

    @Expose()
    variableScales?: Record<string, any>;
}
