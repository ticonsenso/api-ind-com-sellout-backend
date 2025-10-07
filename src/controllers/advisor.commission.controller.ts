import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DataSource } from "typeorm";

import { AdvisorCommissionService } from "../services/advisor.commision.service";
export class AdvisorCommissionController {

    private advisorCommissionService: AdvisorCommissionService;
    constructor(dataSource: DataSource) {
        this.advisorCommissionService = new AdvisorCommissionService(dataSource);
        // Advisor commission
        this.getAdvisorCommission = this.getAdvisorCommission.bind(this);
    }

    async getAdvisorCommission(req: Request, res: Response): Promise<void> {
        try {
            const search = req.query.search as string;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;
            const calculateDate = req.query.calculateDate ? new Date(req.query.calculateDate as string) : undefined;
            const result = await this.advisorCommissionService.searchAdvisorCommissionPaginated(
                search,
                page,
                limit,
                calculateDate
            );

            res.status(StatusCodes.OK).json(result);
        } catch (error: any) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
    }


}
