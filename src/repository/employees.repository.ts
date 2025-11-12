import {DataSource as TypeORMDataSource} from "typeorm";
import {EmployeeSearchDto} from "../dtos/employees.dto";
import {Employee} from "../models/employees.model";
import {BaseRepository} from "./base.respository";
import {CompanyPositionsRepository} from "./company.positions.repository";

export class EmployeesRepository extends BaseRepository<Employee> {
  private companyPositionRepository: CompanyPositionsRepository;
  constructor(dataSource: TypeORMDataSource) {
    super(Employee, dataSource);
    this.companyPositionRepository = new CompanyPositionsRepository(dataSource);
  }

  async findByDocumentNumber(documentNumber: string): Promise<Employee | null> {
    return this.repository.findOne({ where: { documentNumber } });
  }

  async findByCecoAndCompanyPosition(ceco: string, date?: string): Promise<Employee | null> {
    const queryBuilder = this.repository.createQueryBuilder('e')
      .leftJoinAndSelect('e.company', 'company')
      .leftJoinAndSelect('e.companyPosition', 'companyPosition')
      .where('e.ceco = :ceco', { ceco })
      .andWhere('companyPosition.name = :name', { name: 'JEFE DE TIENDA' });

    if (date) {
      const fecha = date?.toString().split('T')[0];
      const year = fecha.split('-')[0];
      const month = fecha.split('-')[1];
      queryBuilder.andWhere('e.year = :year', { year: Number(year) });
      queryBuilder.andWhere('e.month = :month', { month: Number(month) });
    }

    return await queryBuilder.getOne();
  }

  async findByCode(code: string, date?: string): Promise<Employee | null> {
    const queryBuilder = this.repository.createQueryBuilder('e')
      .leftJoinAndSelect('e.company', 'company')
      .leftJoinAndSelect('e.companyPosition', 'companyPosition')
      .where('e.code = :code', { code });

    if (date) {
      const fecha = date?.toString().split('T')[0];
      const year = fecha.split('-')[0];
      const month = fecha.split('-')[1];
      queryBuilder.andWhere('e.year = :year', { year: Number(year) });
      queryBuilder.andWhere('e.month = :month', { month: Number(month) });
    }

    return await queryBuilder.getOne();
  }



  async findByEmployeeNameCompanyAndCompanyPosition(employeeName: string, companyId: number, companyPositionId: number): Promise<Employee | null> {
    return this.repository.findOne({ where: { name: employeeName, company: { id: companyId }, companyPosition: { id: companyPositionId } } });
  }

  async findByFilters(
    searchDto?: EmployeeSearchDto,
    page?: number,
    limit?: number,
    calculateDate?: string
  ): Promise<{ items: Employee[]; total: number }> {
    const { name, companyId, companyPositionId } = searchDto || {};
    const query = this.repository
      .createQueryBuilder("employee")
      .leftJoinAndSelect("employee.company", "company")
      .leftJoinAndSelect("employee.companyPosition", "companyPosition");

    const hasFilters = [name, companyId, companyPositionId].some((param) => param !== undefined);

    if (hasFilters || calculateDate) {
      if (name !== undefined) {
        query.andWhere(
          "(employee.documentNumber ILIKE :search OR employee.name ILIKE :search OR employee.code ILIKE :search)",
          { search: `%${name}%` }
        );
      }

      if (companyId !== undefined) {
        query.andWhere("employee.company = :companyId", {
          companyId: companyId,
        });
      }

      if (companyPositionId !== undefined) {
        query.andWhere("employee.companyPosition = :companyPositionId", {
          companyPositionId: companyPositionId,
        });
      }

    } else if (page && limit) {
      query.orderBy("employee.createdAt", "DESC").take(10);
    }

    if (calculateDate) {
      const [year, month] = calculateDate.split('T')[0].split('-');
      query.andWhere("employee.year = :year", { year });
      query.andWhere("employee.month = :month", { month });
    }
    if (page && limit) {
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }


  async deleteEmployeesByCompanyId(companyId: number): Promise<void> {
    await this.repository.delete({ company: { id: companyId } });
  }

  async deleteEmployeesByCurrentMonth(): Promise<{ affected: number | null | undefined; raw: any }> {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from('employees')
      .where('DATE(created_at) BETWEEN DATE(:firstDay) AND DATE(:lastDay)', {
        firstDay: firstDayOfMonth,
        lastDay: lastDayOfMonth
      })
      .execute();

    return {
      affected: result.affected,
      raw: result.raw
    };
  }

  async findDistinctAllGrouped(companyId?: number): Promise<Record<string, any[]>> {
    const results: { field: string; value: any }[] = [];

    const companyPositions = await this.companyPositionRepository.findAll();

    const fields = [
      { name: 'desc_division', alias: 'area' },
      { name: 'section', alias: 'section' },
      { name: 'desc_depar', alias: 'department' },
      { name: 'sub_depar', alias: 'subDepartment' },
    ];

    for (const f of fields) {
      const qb = this.repository
        .createQueryBuilder('e')
        .select(`TRIM(e.${f.name})`, 'value')
        .distinct(true)
        .where(`e.${f.name} IS NOT NULL AND TRIM(e.${f.name}) <> ''`);

      if (companyId) {
        qb.andWhere('e.company = :companyId', { companyId });
      }

      const values = await qb.getRawMany();
      results.push(...values.map(v => ({ field: f.alias, value: v.value })));
    }

    results.push(...companyPositions.map(cp => ({
      field: 'companyPosition',
      value: { id: cp.id, name: cp.name }
    })));

    const grouped: Record<string, any[]> = {};
    results.forEach(r => {
      if (!grouped[r.field]) grouped[r.field] = [];
      grouped[r.field].push(r.value);
    });

    Object.keys(grouped).forEach(key => {
      const arr = grouped[key];
      if (typeof arr[0] === 'string') {
        grouped[key] = Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
      } else {
        const unique = Array.from(new Map(arr.map(v => [v.id, v])).values());
        grouped[key] = unique.sort((a, b) => a.name.localeCompare(b.name));
      }
    });

    return grouped;
  }


  /**
   * Retrieves grouped employee information by section, division, department, and sub-department for a given company.
   * @param companyId The company ID to filter employees.
   * @param companyPositionId (Optional) The company position ID to filter employees.
   */
  async findGroupedBySectionDivisionDepartmentSubDepartment(
    companyId: number,
    companyPositionId?: number
  ): Promise<
    Array<{
      section: string;
      desc_division: string;
      desc_depar: string;
      sub_depar: string;
    }>
  > {
    const query = this.repository
      .createQueryBuilder('e')
      .select([
        'e.section AS section',
        'e.desc_division AS desc_division',
        'e.desc_depar AS desc_depar',
        'e.sub_depar AS sub_depar',
      ])
      .where('e.company = :companyId', { companyId });

    if (companyPositionId) {
      query.andWhere('e.companyPosition = :companyPositionId', { companyPositionId });
    }

    query.groupBy('e.section')
      .addGroupBy('e.desc_division')
      .addGroupBy('e.desc_depar')
      .addGroupBy('e.sub_depar');

    return await query.getRawMany();
  }

}
