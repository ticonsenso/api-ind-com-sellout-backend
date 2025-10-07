import { DataSource as TypeORMDataSource } from "typeorm";
import { BaseRepository } from "./base.respository";
import { WebServices } from "../models/web.services.model";


export class WebServicesRepository extends BaseRepository<WebServices> {
    constructor(dataSource: TypeORMDataSource) {
        super(WebServices, dataSource);
    }

    async findByMaterialCode(materialCode: string): Promise<WebServices | null> {
        return this.repository.findOne({
            where: {
                materialCode: materialCode,
            },
        });
    }
}
