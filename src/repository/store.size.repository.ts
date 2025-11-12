import {DataSource} from "typeorm";
import {StoreSize} from "../models/store.size.model";
import {BaseRepository} from "./base.respository";
import {StoreSizeSearchDto} from "../dtos/store.size.dto";

export class StoreSizeRepository extends BaseRepository<StoreSize> {
  constructor(dataSource: DataSource) {
    super(StoreSize, dataSource);
  }

  async findStoreByName(name: string): Promise<StoreSize | null> {
    return await this.repository.findOne({ where: { name } });
  }

  async findStoreById(id: number): Promise<StoreSize | null> {
    return await this.repository.findOne({ where: { id } });
  }

 
  async findByFilters(
    searchDto: StoreSizeSearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: StoreSize[]; total: number }> {
    const { id, name, companyId } = searchDto;
    const query = this.repository
      .createQueryBuilder('storeSize')
      .leftJoinAndSelect('storeSize.company', 'company');

    const hasFilters = [id, name, companyId].some((param) => param !== undefined);

    if (hasFilters) {
      if (id !== undefined) {
        query.andWhere('storeSize.id = :id', { id });
      }

      if (name !== undefined) {
        query.andWhere('LOWER(storeSize.name) LIKE LOWER(:name)', { name: `%${name}%` });
      }

      if (companyId !== undefined) {
        query.andWhere('storeSize.company.id = :companyId', { companyId });
      }
    } else {
      query.orderBy('storeSize.createdAt', 'DESC').take(10);
    }

    if (hasFilters) {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }

}
