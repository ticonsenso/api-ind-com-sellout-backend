import { DataSource as TypeORMDataSource } from "typeorm";
import { BaseRepository } from "./base.respository";
import { ConfigLine } from "../models/conf.lines.model";
import { SearchConfigLineDto } from "../dtos/conf.lines.dto";

export class ConfigLinesRepository extends BaseRepository<ConfigLine> {
    constructor(dataSource: TypeORMDataSource) {
        super(ConfigLine, dataSource);
    }

    async findPaginated(searchDto: SearchConfigLineDto): Promise<{ data: ConfigLine[]; total: number }> {
        // 1. Forzamos la conversión a Number y aplicamos valores por defecto de seguridad
        const page = Math.max(1, Number(searchDto.page) || 1);
        const limit = Math.max(1, Number(searchDto.limit) || 10);
        const { name, lineName, sortBy = 'id' } = searchDto;
        let { sortOrder } = searchDto;

        if (!name && !lineName && !sortOrder) {
            sortOrder = 'DESC';
        } else if (!sortOrder) {
            sortOrder = 'ASC';
        }

        const queryBuilder = this.repository.createQueryBuilder('configLine');

        if (name) {
            queryBuilder.andWhere('configLine.name ILIKE :name', { name: `%${name}%` });
        }

        if (lineName) {
            queryBuilder.andWhere('configLine.lineName ILIKE :lineName', { lineName: `%${lineName}%` });
        }

        // 2. Cálculo seguro del offset
        const skip = (page - 1) * limit;

        // 3. Aplicamos los valores asegurándonos de que no sean NaN
        queryBuilder.skip(skip).take(limit);

        queryBuilder.orderBy(`configLine.${sortBy}`, sortOrder as 'ASC' | 'DESC');

        const [data, total] = await queryBuilder.getManyAndCount();
        return { data, total };
    }
    async findByNameAndNameLine(name: string, lineName: string): Promise<ConfigLine | null> {
        return (await this.repository.findOne({ where: { name, lineName } as any })) || null;
    }
}
