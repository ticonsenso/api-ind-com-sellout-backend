import {plainToClass, plainToInstance} from "class-transformer";
import {DataSource} from "typeorm";
import {
    CreateEmployeeDto,
    EmployeeResponseDto,
    EmployeeResponseSearchDto,
    EmployeeSearchDto,
    UpdateEmployeeDto,
} from "../dtos/employees.dto";
import {Employee} from '../models/employees.model';
import {CompaniesRepository} from "../repository/companies.repository";
import {CompanyPositionsRepository} from "../repository/company.positions.repository";
import {EmployeesRepository} from "../repository/employees.repository";

export class EmployeesService {
  private employeeRepository: EmployeesRepository;
  private companyRepository: CompaniesRepository;
  private companyPositionRepository: CompanyPositionsRepository;

  constructor(dataSource: DataSource) {
    this.employeeRepository = new EmployeesRepository(dataSource);
    this.companyRepository = new CompaniesRepository(dataSource);
    this.companyPositionRepository = new CompanyPositionsRepository(dataSource);
  }

  async createEmployee(
    employee: CreateEmployeeDto
  ): Promise<EmployeeResponseDto> {
    const company = await this.companyRepository.findById(employee.companyId);
    if (!company) {
      throw new Error("Empresa no encontrada al crear empleado");
    }
    const companyPosition = await this.companyPositionRepository.findById(
      employee.companyPositionId
    );
    if (!companyPosition) {
      throw new Error("Cargo no encontrado al crear empleado");
    }
    const employeeEntity = plainToInstance(Employee, employee, {
      excludePrefixes: ["companyId", "companyPositionId"],
    });
    employeeEntity.company = company;
    employeeEntity.companyPosition = companyPosition;
    const savedEmployee = await this.employeeRepository.create(employeeEntity);
    return plainToInstance(EmployeeResponseDto, savedEmployee, {
      excludeExtraneousValues: true,
    });
  }

  async updateEmployee(
    id: number,
    employee: UpdateEmployeeDto
  ): Promise<EmployeeResponseDto> {
    const employeeSaved = await this.employeeRepository.findById(id);
    if (!employeeSaved) {
      throw new Error("Empleado no encontrado al actualizar");
    }

    // Crear una copia del empleado existente para actualizar
    const employeeToUpdate = { ...employeeSaved };

    // Actualizar dinámicamente todas las propiedades que vienen en el DTO
    for (const [key, value] of Object.entries(employee)) {
      if (value !== undefined) {
        // Manejar casos especiales
        if (key === "companyPositionId" && value) {
          const companyPosition = await this.companyPositionRepository.findById(
            Number(value)
          );
          if (!companyPosition) {
            throw new Error("Cargo no encontrado al actualizar empleado");
          }
          employeeToUpdate.companyPosition = companyPosition;
        } else if (key === "supervisorId" && value) {
          employeeToUpdate.supervisorId = value;
        } else {
          // Para el resto de propiedades, actualizar directamente
          (employeeToUpdate as any)[key] = value;
        }
      }
    }

    // Mantener la compañía original
    employeeToUpdate.company = employeeSaved.company;

    const savedEmployee = await this.employeeRepository.update(
      id,
      employeeToUpdate
    );
    return plainToInstance(EmployeeResponseDto, savedEmployee, {
      excludeExtraneousValues: true,
    });
  }

  async deleteEmployee(id: number): Promise<void> {
    const employeeSaved = await this.employeeRepository.findById(id);
    if (!employeeSaved) {
      throw new Error("Empleado no encontrado al eliminar");
    }
    await this.employeeRepository.delete(id);
  }

  //Se procesan los datos de los empleados
  async processEmployeeData(employees: any): Promise<{
    recordCount: number;
    smsErrors: string[];
  }> {
    let recordCount = 0;
    let smsErrors: string[] = [];
    let year: string | null = null;
    let month: string | null = null;

    if (employees[0].calculateDate) {
      const date = employees[0].calculateDate?.toString().split('T')[0];
      year = date?.split('-')[0];
      month = date?.split('-')[1];
    }

    for (const employee of employees) {
      try {
        const docNumber = String(employee.documentNumber).padStart(10, '0');
        employee.documentNumber = docNumber;
        const employEdit = await this.employeeRepository.findByCode(employee.code.trim(), employees[0].calculateDate);
        const company = await this.companyRepository.findById(employee.companyId);
        const position = await this.companyPositionRepository.findByNameAndCompanyId(
          employee.companyPosition,
          employee.companyId,
        );
        if (!position) {
          smsErrors.push(
            `No existe el cargo ${employee.companyPosition} para la empresa ${company?.name}.`,
          );
          continue;
        }
        if (employEdit) {
          Object.assign(employEdit, {
            code: employee.code,
            name: employee.name,
            documentNumber: docNumber,
            email: employee.email,
            phone: employee.phone ?? '',
            city: employee.city ?? null,
            isActive: employee.isActive,
            dateInitialContract: employee.dateInitialContract,
            salary: (!employee.salary || employee.salary === "null") ? 0 : Number(employee.salary),
            variableSalary: (!employee.variableSalary || employee.variableSalary === "null") ? 0 : Number(employee.variableSalary),
            ceco: employee.ceco ?? null,
            descUniNego: employee.descUniNego ?? null,
            section: employee.section ?? null,
            descDivision: employee.descDivision ?? null,
            descDepar: employee.descDepar ?? null,
            subDepar: employee.subDepar ?? null,
            month: month ?? null,
            year: year ?? null,
            employeeType: employee.employeeType ?? null,
            company,
            companyPosition: position ?? employEdit.companyPosition,
          });

          if (employee.supervisorCode) {
            employEdit.supervisorId = employee.supervisorCode;
          }
          await this.employeeRepository.update(employEdit.id, employEdit);
        } else {
          const employeeData = plainToClass(Employee, {
            ...employee,
            salary: (!employee.salary || employee.salary === "null") ? 0 : Number(employee.salary),
            variableSalary: (!employee.variableSalary || employee.variableSalary === "null") ? 0 : Number(employee.variableSalary),
            documentNumber: docNumber,
            ceco: employee.ceco ?? null,
            section: employee.section ?? null,
            descUniNego: employee.descUniNego ?? null,
            descDivision: employee.descDivision ?? null,
            descDepar: employee.descDepar ?? null,
            subDepar: employee.subDepar ?? null,
            employeeType: employee.employeeType ?? null,
            month: month ?? null,
            year: year ?? null,
          }, {
            excludePrefixes: ['companyPositionId', 'companyId', 'supervisorCode'],
          });

          if (company) employeeData.company = company;
          if (position) employeeData.companyPosition = position;

          if (employee.supervisorCode) {
            employeeData.supervisorId = employee.supervisorCode;
          }
          await this.employeeRepository.create(employeeData);
        }
      } catch (error) {
        smsErrors.push(
          "Error al procesar el empleado. " + employee.code + " " + error
        );
        continue;
      }
      recordCount++;
    }

    return { recordCount, smsErrors };
  }

  async searchEmployeePaginated(
    searchDto?: EmployeeSearchDto,
    page?: number,
    limit?: number,
    calculateDate?: string
  ): Promise<EmployeeResponseSearchDto> {
    const employees = await this.employeeRepository.findByFilters(
      searchDto,
      page,
      limit,
      calculateDate
    );
    const employeesResponse = await Promise.all(employees.items.map(async (employee) => {
      const employeeDto = plainToInstance(EmployeeResponseDto, employee, {
        excludeExtraneousValues: true,
      });
      const supervisor = await this.employeeRepository.findByCode(employee.supervisorId ?? '');
      employeeDto.supervisorName = supervisor?.name ?? null;
      return employeeDto;
    }));

    return plainToInstance(
      EmployeeResponseSearchDto,
      {
        items: employeesResponse,
        total: employees.total,
      },
      { excludeExtraneousValues: true }
    );
  }

  async deleteEmployeesByCompanyId(companyId: number): Promise<void> {
    await this.employeeRepository.deleteEmployeesByCompanyId(companyId);
  }

  async findDistinctAll(companyId: number): Promise<Record<string, string[]>> {
    return await this.employeeRepository.findDistinctAllGrouped(companyId);
  }

  async findFilter(companyId: number, companyPositionId: number): Promise<{ section: string[]; division: string[]; department: string[]; subDepartment: string[]; }> {
    const result = await this.employeeRepository.findGroupedBySectionDivisionDepartmentSubDepartment(companyId, companyPositionId);
    const section = result.map(item => item.section).filter((value, index, self) => value && self.indexOf(value) === index);
    const division = result.map(item => item.desc_division).filter((value, index, self) => value && self.indexOf(value) === index);
    const department = result.map(item => item.desc_depar).filter((value, index, self) => value && self.indexOf(value) === index);
    const subDepartment = result.map(item => item.sub_depar).filter((value, index, self) => value && self.indexOf(value) === index);
    return { section, division, department, subDepartment };
  }
}
