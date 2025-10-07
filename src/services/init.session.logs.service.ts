import { DataSource } from 'typeorm';
import { InitSessionLogsRepository } from '../repository/init.session.logs.repository';
import { CreateInitSessionLogsDto } from '../dtos/init.session.logs.dto';
import { plainToClass } from 'class-transformer';
import { InitSessionLogs } from '../models/init.session.logs.model';

export class InitSessionLogsService {
  private initSessionLogsRepository: InitSessionLogsRepository;

  constructor(dataSource: DataSource) {
    this.initSessionLogsRepository = new InitSessionLogsRepository(dataSource);
  }

  async createLoginLog(createInitSessionLogsDto: CreateInitSessionLogsDto): Promise<void> {
    const initSessionLogs = plainToClass(InitSessionLogs, createInitSessionLogsDto);
    await this.initSessionLogsRepository.create(initSessionLogs);
  }

  async logout(email: string): Promise<void> {
    const initSessionLogs = await this.initSessionLogsRepository.findByEmail(email);
    if (initSessionLogs) {
      initSessionLogs.logoutTime = new Date();
      await this.initSessionLogsRepository.update(initSessionLogs.id, initSessionLogs);
    }
  }
}
