import {DataSource as TypeORMDataSource} from "typeorm";
import {BaseRepository} from "./base.respository";
import {GroupedByStore} from "../models/grouped.by.store.model";

export class GroupedByStoreRepository extends BaseRepository<GroupedByStore> {
    constructor(dataSource: TypeORMDataSource) {
        super(GroupedByStore, dataSource);
    }

    async findByStoreCeco(ceco: string): Promise<GroupedByStore[]> {
        return this.repository.find({
            where: [
                { storePrincipal: { ceco: ceco } },
            ],
            relations: ['storePrincipal', 'storeSecondary'],
        });
    }


    async findByStoreId(storeId: number): Promise<GroupedByStore[]> {
        return this.repository.find({
            where: [
                { storePrincipal: { id: storeId } },
            ],
            relations: ['storePrincipal', 'storeSecondary'],
        });
    }

    async findByCeco(ceco: string): Promise<GroupedByStore[]> {
        return this.repository.find({
            where: [
                { storePrincipal: { ceco: ceco } },
            ],
            relations: ['storePrincipal', 'storeSecondary'],
        });
    }

}
