import {DataSource as TypeORMDataSource} from "typeorm";
import {BaseRepository} from "./base.respository";
import {GroupedByAdvisor} from "../models/grouped.by.advisor.model";

export class GroupedByAdvisorRepository extends BaseRepository<GroupedByAdvisor> {
    constructor(dataSource: TypeORMDataSource) {
        super(GroupedByAdvisor, dataSource);
    }

    async findByStoreId(storeId: number): Promise<GroupedByAdvisor[]> {
        return this.repository.find({
            where: [
                { storePrincipal: { id: storeId } },
            ],
            relations: ['storePrincipal', 'storeSecondary'],
        });
    }
}
