import { DataSource } from "typeorm";
import { Employee } from "../models/employees.model";
import { EmployeesRepository } from "../repository/employees.repository";

export class ExtractedFilterDataService {
  private employeeRepository: EmployeesRepository;

  constructor(private dataSource: DataSource) {
    this.employeeRepository = new EmployeesRepository(dataSource);
  }

  async saveEmployee(employee: Employee): Promise<number> {
    const savedEmployee = await this.employeeRepository.create(employee);
    return savedEmployee.id;
  }
}
