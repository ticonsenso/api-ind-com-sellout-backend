import { Between, DataSource } from "typeorm";
import { MatriculationLog } from "../models/matriculation.logs.model";
import { BaseRepository } from "./base.respository";
import { primerDiaDelMesString } from "../utils/utils";

export class MatriculationLogsRepository extends BaseRepository<MatriculationLog> {
  constructor(dataSource: DataSource) {
    super(MatriculationLog, dataSource);
  }

  async findByMatriculationIdAndCalculateDate(
    matriculationId: number,
    calculateDate: string,
    distributor: string,
    storeName: string
  ): Promise<MatriculationLog | null> {
    return this.repository.findOne({
      where: {
        matriculation: { id: matriculationId },
        calculateDate: calculateDate as unknown as Date,
        distributor,
        storeName,
      },
    });
  }

  async deleteAllByMatriculationId(
    matriculationId: number,
    calculateDate: Date
  ): Promise<void> {
    const date = new Date(calculateDate).toISOString().split("T")[0];
    const year = date.split("-")[0];
    const month = date.split("-")[1];

    const find = await this.repository
      .createQueryBuilder("l")
      .leftJoin("l.matriculation", "m")
      .where("m.id = :matriculationId", { matriculationId })
      .andWhere("EXTRACT(YEAR FROM l.calculateDate) = :year", { year })
      .andWhere("EXTRACT(MONTH FROM l.calculateDate) = :month", { month })
      .getMany();

    await this.repository.remove(find);
  }

  async findByMatriculationNameAndCalculateDate(
    distributor: string,
    storeName: string
  ): Promise<MatriculationLog | null> {
    return await this.repository.findOne({
      where: {
        matriculation: { distributor, storeName },
      },
      order: {
        calculateDate: "DESC",
      },
    });
  }

  async findTemplatesWithUploadStatusByMonth(
    dateString: string
  ): Promise<any[]> {
    const date = new Date(dateString);
    const year = date.toISOString().split("T")[0].split("-")[0];
    const month = date.toISOString().split("T")[0].split("-")[1];
    const qb = this.dataSource
      .createQueryBuilder()
      .select([
        "t.id AS id",
        "t.distributor AS distributor",
        "t.store_name AS storeName",
        "t.status AS status",
        "t.created_at AS createdAt",
        "MAX(l.calculate_date) AS calculateDate",
        "SUM(l.rows_count) AS rowsCount",
        "SUM(l.product_count) AS productCount",
      ])
      .addSelect(
        `CASE 
                WHEN COUNT(l.id) FILTER (
                    WHERE EXTRACT(YEAR FROM l.calculate_date) = :year
                    AND EXTRACT(MONTH FROM l.calculate_date) = :month
                ) > 0 THEN true
                ELSE false
            END`,
        "isUploaded"
      )
      .from("matriculation_templates", "t")
      .leftJoin("matriculation_logs", "l", "l.matriculation_id = t.id")
      .groupBy(
        "t.id, t.distributor, t.store_name, t.status, t.created_at, t.updated_at"
      )
      .having(
        `t.status = true 
              OR (
                  t.status = false
                  AND COUNT(l.id) > 0
                  AND COUNT(l.id) FILTER (
                      WHERE EXTRACT(YEAR FROM l.calculate_date) = :year
                      AND EXTRACT(MONTH FROM l.calculate_date) = :month
                  ) = 0
              )`,
        { year, month }
      );

    return await qb.getRawMany();
  }

  async findByCalculateDate(
    calculateDate: string
  ): Promise<MatriculationLog[]> {
    const date = new Date(calculateDate).toISOString().split("T")[0];
    const year = Number(date.split("-")[0]);
    const month = Number(date.split("-")[1]);

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    return this.repository
      .createQueryBuilder("log")
      .leftJoinAndSelect("log.matriculation", "matriculation")
      .where("log.calculateDate >= :start", { start })
      .andWhere("log.calculateDate < :end", { end })
      .getMany();
  }

  async findByCalculateDateOne(
    calculateDate: string,
    matriculationId: number
  ): Promise<MatriculationLog[] | null> {
    return this.repository.find({
      where: {
        calculateDate: calculateDate as unknown as Date,
        matriculation: { id: matriculationId },
      },
      relations: { matriculation: true },
    });
  }

  async findByCalculateDateOnActualMonth(
    calculateDate: string
  ): Promise<MatriculationLog[]> {
    const date = new Date(calculateDate);
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return this.repository.find({
      where: { calculateDate: Between(firstDayOfMonth, lastDayOfMonth) },
      relations: { matriculation: true },
    });
  }

  async findByCalculateDateOnActualMonthOne(
    calculateDate: string
  ): Promise<MatriculationLog | null> {
    const date = calculateDate.toString().split("T")[0];
    const year = date.split("-")[0];
    const month = date.split("-")[1];

    const firstDayOfMonth = new Date(Number(year), Number(month) - 1, 1);
    const lastDayOfMonth = new Date(Number(year), Number(month), 0);

    return this.repository.findOne({
      where: { calculateDate: Between(firstDayOfMonth, lastDayOfMonth) },
      relations: { matriculation: true },
    });
  }

  async deleteDataByDistributor(
    distributor: string,
    calculateDate: string
  ): Promise<any> {
    return await this.repository
      .createQueryBuilder()
      .delete()
      .from("matriculation_logs")
      .where("distributor = :distributor", { distributor })
      .andWhere("calculate_date = :calculateDate", { calculateDate: primerDiaDelMesString(calculateDate) })
      .execute();
  }

  async deleteDataByDistributorAndStoreName(
    distributor: string,
    storeName: string,
    calculateDate: string
  ): Promise<any> {
    return await this.repository
      .createQueryBuilder()
      .delete()
      .from("matriculation_logs")
      .where("distributor = :distributor", { distributor })
      .andWhere("store_name = :code", {
        code: storeName,
      })
      .andWhere("calculate_date = :calculateDate", { calculateDate: primerDiaDelMesString(calculateDate) })
      .execute();
  }

  async findByMatriculationIdAndDate(
    matriculationId: number,
    calculateDate: string
  ): Promise<MatriculationLog | null> {
    return await this.repository.findOne({
      where: {
        matriculation: { id: matriculationId },
        calculateDate: calculateDate as unknown as Date,
      },
      relations: { matriculation: true },
    });
  }


}
