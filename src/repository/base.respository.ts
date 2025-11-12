import {DataSource, DeepPartial, EntityTarget, ObjectLiteral, Repository} from 'typeorm';
import {chunkArray} from '../utils/utils';

export class BaseRepository<T extends ObjectLiteral> {
  public repository: Repository<T>;
  public readonly dataSource: DataSource;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
    this.dataSource = dataSource;
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async insert(data: DeepPartial<T>[]): Promise<T[]> {
    return this.repository.save(data);
  }

  async findById(id: number): Promise<T | null> {
    return (await this.repository.findOne({ where: { id } as any })) || null;
  }

  async findByCode(code: string): Promise<T | null> {
    return (await this.repository.findOne({ where: { code } as any })) || null;
  }

  async upsertBatch(data: DeepPartial<T>[], keys: (keyof T)[], chunkSize = 2000): Promise<void> {
    const chunks = chunkArray(data, chunkSize);
    for (const chunk of chunks) {
      await this.repository.upsert(chunk as any, { conflictPaths: keys as string[] });
    }
  }

  async insertBatch(data: DeepPartial<T>[], chunkSize = 2000): Promise<void> {
    const chunks = chunkArray(data, chunkSize);
    for (const chunk of chunks) {
      await this.repository.insert(chunk as any);
    }
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async save(data: DeepPartial<T>[]): Promise<T[]> {
    const entities = this.repository.create(data);
    return await this.repository.save(entities);
  }

  async saveAll(data: DeepPartial<T> | DeepPartial<T>[]): Promise<T | T[]> {
    if (Array.isArray(data)) {
      const entities = this.repository.create(data);
      return await this.repository.save(entities);
    } else {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    }
  }

  async update(id: number, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    return (await this.findById(id)) as T;
  }

  async saveOne(data: DeepPartial<T>): Promise<T> {
    return await this.repository.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.repository.delete({ user: { id: userId } as any });
  }
}
