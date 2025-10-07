import { DataSource } from "typeorm";
import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { StatusCodes } from "http-status-codes";
import { SearchDataConsensoDto } from "../dtos/search.data.consenso";
import { ConsolidateInformationConsensoService } from "../services/consolidate.information.consenso.service";

export class ConsolidateInformationConsenso {
    private consolidateInformationConsensoService: ConsolidateInformationConsensoService;
    constructor(dataSourceRepository: DataSource) {
        this.consolidateInformationConsensoService = new ConsolidateInformationConsensoService(dataSourceRepository);
        this.searchDataSource = this.searchDataSource.bind(this);
    }

    async searchDataSource(req: Request, res: Response) {
        try {
            const searchDto = plainToClass(SearchDataConsensoDto, req.body);
            if(searchDto.anio == undefined) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Año es requerido."
                });
            }
            if(searchDto.mes == undefined) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Mes es requerido."
                });
            }
            if(searchDto.anio && (searchDto.anio < 2000 || searchDto.anio > 2100)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Año inválido. Debe estar entre 2000 y 2100."
                });
            }
            if(searchDto.mes < 1 || searchDto.mes > 12) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Mes inválido. Debe estar entre 1 y 12."
                });
            }
            const dataSources =
            await this.consolidateInformationConsensoService.getDataConsenso(
                searchDto
            );
            res.status(StatusCodes.OK).json(dataSources);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }
}