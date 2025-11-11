import {DataSource} from 'typeorm';
import {CompanyPositionsRepository} from '../repository/company.positions.repository';
import {
    CompanyPositionResponseDto,
    CompanyPositionResponseSearchDto,
    CompanyPositionSearchDto,
    CreateCompanyPositionDto,
    UpdateCompanyPositionDto,
} from '../dtos/company.positions.dto';
import {plainToClass} from 'class-transformer';
import {CompanyPosition} from '../models/company.positions.model';
import {CompaniesRepository} from '../repository/companies.repository';

export class CompanyPositionsService {
  private companyPositionRepository: CompanyPositionsRepository;
  private companyRepository: CompaniesRepository;

  constructor(dataSource: DataSource) {
    this.companyPositionRepository = new CompanyPositionsRepository(dataSource);
    this.companyRepository = new CompaniesRepository(dataSource);
  }

  async createCompanyPosition(companyPosition: CreateCompanyPositionDto): Promise<CompanyPositionResponseDto> {
    const company = await this.companyRepository.findById(Number(companyPosition.companyId));
    if (!company) {
      throw new Error('La empresa con el id ' + companyPosition.companyId + ' no existe.');
    }
    const companyPositionFind = await this.companyPositionRepository.findByName(companyPosition.name);
    if (companyPositionFind) {
      throw new Error('La posición con el nombre ' + companyPosition.name + ' ya existe.');
    }
    const companyPositionSave = plainToClass(CompanyPosition, companyPosition, { excludePrefixes: ['companyId'] });
    companyPositionSave.company = company;
    const savedCompanyPosition = await this.companyPositionRepository.create(companyPositionSave);
    return plainToClass(CompanyPositionResponseDto, savedCompanyPosition, { excludeExtraneousValues: true });
  }

  async updateCompanyPosition(
    id: number,
    companyPosition: UpdateCompanyPositionDto,
  ): Promise<CompanyPositionResponseDto> {
    const companyPositionFind = await this.companyPositionRepository.findById(id);
    if (!companyPositionFind) {
      throw new Error('La posición con el id ' + id + ' no existe.');
    }
    if (companyPosition.name) {
      companyPositionFind.name = companyPosition.name;
    }
    if (companyPosition.description) {
      companyPositionFind.description = companyPosition.description;
    }
    if (companyPosition.salaryBase) {
      companyPositionFind.salaryBase = companyPosition.salaryBase;
    }
    if (companyPosition.isStoreSize) {
      companyPositionFind.isStoreSize = companyPosition.isStoreSize;
    }
    const updatedCompanyPosition = await this.companyPositionRepository.update(id, companyPositionFind);
    return plainToClass(CompanyPositionResponseDto, updatedCompanyPosition, { excludeExtraneousValues: true });
  }

  async deleteCompanyPosition(id: number): Promise<void> {
    const companyPosition = await this.companyPositionRepository.findById(id);
    if (!companyPosition) {
      throw new Error('La posición con el id ' + id + ' no existe.');
    }
    await this.companyPositionRepository.delete(id);
  }

  async searchCompanyPositionPaginated(
    searchDto: CompanyPositionSearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<CompanyPositionResponseSearchDto> {
    const companyPositions = await this.companyPositionRepository.findByFilters(searchDto, page, limit);
    const companyPositionsResponse = companyPositions.items.map((companyPosition) =>
      plainToClass(CompanyPositionResponseDto, companyPosition, { excludeExtraneousValues: true }),
    );
    return plainToClass(
      CompanyPositionResponseSearchDto,
      {
        items: companyPositionsResponse,
        total: companyPositions.total,
      },
      { excludeExtraneousValues: true },
    );
  }
}
