import {DataSource} from 'typeorm';
import {CompaniesRepository} from '../repository/companies.repository';
import {CompanyResponseDto, CompanyResponseSearchDto} from '../dtos/commission.configurations.dto';
import {CompanySearchDto, CreateCompanyDto, UpdateCompanyDto} from '../dtos/companies.dto';
import {Company} from '../models/companies.model';
import {plainToClass} from 'class-transformer';

export class CompaniesService {
  private companyRepository: CompaniesRepository;

  constructor(dataSource: DataSource) {
    this.companyRepository = new CompaniesRepository(dataSource);
  }

  async createCompany(company: CreateCompanyDto): Promise<CompanyResponseDto> {
    const companyFind = await this.companyRepository.findByName(company.name);
    if (companyFind) {
      throw new Error('La empresa con el nombre ' + company.name + ' ya existe.');
    }
    const companySave = plainToClass(Company, company);
    const savedCompany = await this.companyRepository.create(companySave);
    return plainToClass(CompanyResponseDto, savedCompany, { excludeExtraneousValues: true });
  }

  async updateCompany(id: number, company: UpdateCompanyDto): Promise<CompanyResponseDto> {
    const companySave = plainToClass(Company, company);
    const updatedCompany = await this.companyRepository.update(id, companySave);
    return plainToClass(CompanyResponseDto, updatedCompany, { excludeExtraneousValues: true });
  }

  async deleteCompany(id: number): Promise<void> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new Error('La empresa no existe.');
    }
    await this.companyRepository.delete(id);
  }

  async searchCompanyPaginated(
    searchDto: CompanySearchDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<CompanyResponseSearchDto> {
    const companies = await this.companyRepository.findByFilters(searchDto, page, limit);
    const companiesResponse = companies.items.map((company) =>
      plainToClass(CompanyResponseDto, company, { excludeExtraneousValues: true }),
    );
    return plainToClass(
      CompanyResponseSearchDto,
      {
        items: companiesResponse,
        total: companies.total,
      },
      { excludeExtraneousValues: true },
    );
  }
}
