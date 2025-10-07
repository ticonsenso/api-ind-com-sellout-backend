import { DataSource as TypeORMDataSource } from "typeorm";
import { BaseRepository } from "./base.respository";
import { EmployeesHistory } from "../models/employees.history.model";

export class EmployeesHistoryRepository extends BaseRepository<EmployeesHistory> {
    constructor(dataSource: TypeORMDataSource) {
        super(EmployeesHistory, dataSource);
    }


    async findByConsolidatedCommissionCalculation(
        consolidatedCommissionCalculationId: number
    ): Promise<EmployeesHistory | null> {
        return this.repository
            .createQueryBuilder('eh')
            .leftJoinAndSelect('eh.employee', 'employee')
            .leftJoinAndSelect('eh.supervisor', 'supervisor') 
            .leftJoinAndSelect('eh.companyPosition', 'position')
            .leftJoinAndSelect('position.company', 'company')
            .leftJoinAndSelect('eh.consolidatedCommissionCalculation', 'ccc')
            .where('ccc.id = :consolidatedCommissionCalculationId', { consolidatedCommissionCalculationId })
            .getOne();
    }


    async deleteByDateRange(startDate: Date, endDate: Date): Promise<{ affected: number | null | undefined; raw: any }> {
        const subQuery = this.dataSource
            .createQueryBuilder()
            .select('id')
            .from('consolidated_commission_calculation', 'ccc')
            .where('ccc.calculate_date BETWEEN :startDate AND :endDate', {
                startDate,
                endDate
            });

        const result = await this.repository
            .createQueryBuilder()
            .delete()
            .from(EmployeesHistory)
            .where(`consolidated_commission_calculation_id IN (${subQuery.getQuery()})`)
            .setParameters({ startDate, endDate })
            .execute();

        return {
            affected: result.affected,
            raw: result.raw
        };
    }



}
