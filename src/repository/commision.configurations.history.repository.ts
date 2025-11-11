import {DataSource as TypeORMDataSource} from "typeorm";
import {BaseRepository} from "./base.respository";
import {CommissionConfigurationsHistory} from "../models/commission.configurations.history.model";

export class CommissionConfigurationsHistoryRepository extends BaseRepository<CommissionConfigurationsHistory> {
    constructor(dataSource: TypeORMDataSource) {
        super(CommissionConfigurationsHistory, dataSource);
    }

    async findByCompanyAndPosition(companyId: number, companyPositionId: number): Promise<CommissionConfigurationsHistory | null> {
        const commissionConfigurationHistory = await this.repository.findOne({
            where: { company: { id: companyId }, companyPosition: { id: companyPositionId } }
        });
        return commissionConfigurationHistory;
    }
}
