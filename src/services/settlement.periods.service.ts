import {DataSource} from 'typeorm';
import {SettlementPeriodsRepository} from '../repository/settlement.periods.repository';
import {
    CreateSettlementPeriodDto,
    SettlementPeriodResponseDto,
    SettlementPeriodResponseSearchDto,
    SettlementPeriodSearchDto,
    UpdateSettlementPeriodDto,
} from '../dtos/settlement.periods.dto';
import {SettlementPeriod} from '../models/settlement.periods.model';
import {plainToInstance} from 'class-transformer';
import {CompaniesRepository} from '../repository/companies.repository';

export class SettlementPeriodsService {
  private settlementPeriodRepository: SettlementPeriodsRepository;
  private companyRepository: CompaniesRepository;

  constructor(dataSource: DataSource) {
    this.settlementPeriodRepository = new SettlementPeriodsRepository(dataSource);
    this.companyRepository = new CompaniesRepository(dataSource);
  }

  async createSettlementPeriod(settlementPeriod: CreateSettlementPeriodDto): Promise<SettlementPeriodResponseDto> {
    const company = await this.companyRepository.findById(settlementPeriod.companyId);
    if (!company) {
      throw new Error('Empresa no encontrada al crear período de liquidación');
    }

    const settlementPeriodEntity = plainToInstance(SettlementPeriod, settlementPeriod, {
      excludePrefixes: ['companyId'],
    });
    settlementPeriodEntity.company = company;

    const savedSettlementPeriod = await this.settlementPeriodRepository.create(settlementPeriodEntity);
    return plainToInstance(SettlementPeriodResponseDto, savedSettlementPeriod, { excludeExtraneousValues: true });
  }

  async updateSettlementPeriod(
    id: number,
    settlementPeriod: UpdateSettlementPeriodDto,
  ): Promise<SettlementPeriodResponseDto> {
    const settlementPeriodSaved = await this.settlementPeriodRepository.findById(id);
    if (!settlementPeriodSaved) {
      throw new Error('Período de liquidación no encontrado al actualizar');
    }
    const company = await this.companyRepository.findById(Number(settlementPeriod.companyId));
    if (!company) {
      throw new Error('Empresa no encontrada al actualizar período de liquidación');
    }
    const settlementPeriodToUpdate = new SettlementPeriod();
    settlementPeriodToUpdate.id = id;
    settlementPeriodToUpdate.startDate = settlementPeriod.startDate || settlementPeriodSaved.startDate;
    settlementPeriodToUpdate.endDate = settlementPeriod.endDate || settlementPeriodSaved.endDate;
    settlementPeriodToUpdate.status = settlementPeriod.status || settlementPeriodSaved.status;
    settlementPeriodToUpdate.company = company;
    const savedSettlementPeriod = await this.settlementPeriodRepository.update(id, settlementPeriodToUpdate);
    return plainToInstance(SettlementPeriodResponseDto, savedSettlementPeriod, { excludeExtraneousValues: true });
  }

  async deleteSettlementPeriod(id: number): Promise<void> {
    const settlementPeriodSaved = await this.settlementPeriodRepository.findById(id);
    if (!settlementPeriodSaved) {
      throw new Error('Período de liquidación no encontrado al eliminar');
    }
    await this.settlementPeriodRepository.delete(id);
  }

  async searchSettlementPeriodPaginated(
    searchDto: SettlementPeriodSearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<SettlementPeriodResponseSearchDto> {
    const settlementPeriods = await this.settlementPeriodRepository.findByFilters(searchDto, page, limit);
    const settlementPeriodsResponse = settlementPeriods.items.map((settlementPeriod) =>
      plainToInstance(SettlementPeriodResponseDto, settlementPeriod, { excludeExtraneousValues: true }),
    );

    return plainToInstance(
      SettlementPeriodResponseSearchDto,
      {
        items: settlementPeriodsResponse,
        total: settlementPeriods.total,
      },
      { excludeExtraneousValues: true },
    );
  }
}
