import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DataSource } from "typeorm";

import { StoreManagerCalculationCommissionService } from "../services/store.manager.calculation.commission.service";
export class StoreManagerCalculationCommissionController {

    private storeManagerCalculationCommissionService: StoreManagerCalculationCommissionService;
    constructor(dataSource: DataSource) {
        this.storeManagerCalculationCommissionService = new StoreManagerCalculationCommissionService(dataSource);
        // Store Manager Calculation Commission
        this.getStoreManagerCalculationCommission = this.getStoreManagerCalculationCommission.bind(this);
    }

    async getStoreManagerCalculationCommission(req: Request, res: Response): Promise<void> {
        try {
            const search = req.query.search as string;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;
            const calculateDate = req.query.calculateDate ? new Date(req.query.calculateDate as string) : undefined;
            const result = await this.storeManagerCalculationCommissionService.searchStoreManagerPaginated(
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
