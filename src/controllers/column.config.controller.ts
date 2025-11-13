import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DataSource } from "typeorm";
import { plainToInstance } from "class-transformer";
import {
  CreateColumnCategoryDto,
  UpdateColumnCategoryDto,
  ColumnCategorySearchDto,
} from "../dtos/column.category.dto";
import {
  CreateColumnKeywordDto,
  UpdateColumnKeywordDto,
  ColumnKeywordSearchDto,
} from "../dtos/column.keyword.dto";
import { ColumnConfigService } from "../services/column.config.service";

export class ColumnConfigController {
  private columnConfigService: ColumnConfigService;

  constructor(dataSource: DataSource) {
    this.columnConfigService = new ColumnConfigService(dataSource);

    // 🧩 Bind de métodos
    this.createCategory = this.createCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.findCategories = this.findCategories.bind(this);

    this.createKeyword = this.createKeyword.bind(this);
    this.updateKeyword = this.updateKeyword.bind(this);
    this.deleteKeyword = this.deleteKeyword.bind(this);
    this.findKeywords = this.findKeywords.bind(this);
  }

  // =========================================================
  // 🟢 MÉTODOS PARA CATEGORY
  // =========================================================

  async createCategory(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateColumnCategoryDto, req.body);
      const result = await this.columnConfigService.createCategory(dto);
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Categoría creada correctamente", result });
    } catch (error: any) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message || "Error desconocido" });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const dto = plainToInstance(UpdateColumnCategoryDto, req.body);
      const result = await this.columnConfigService.updateCategory(id, dto);
      res
        .status(StatusCodes.OK)
        .json({ message: "Categoría actualizada correctamente", result });
    } catch (error: any) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message || "Error desconocido" });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.columnConfigService.deleteCategory(id);
      res
        .status(StatusCodes.OK)
        .json({ message: "Categoría eliminada correctamente" });
    } catch (error: any) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message || "Error desconocido" });
    }
  }

  async findCategories(req: Request, res: Response) {
    try {
      const dto = plainToInstance(ColumnCategorySearchDto, req.body);
      const result = await this.columnConfigService.findCategories(dto);
      res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message || "Error desconocido" });
    }
  }

  // =========================================================
  // 🟣 MÉTODOS PARA KEYWORDS
  // =========================================================

  async createKeyword(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateColumnKeywordDto, req.body);
      const result = await this.columnConfigService.createKeyword(dto);
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Palabra clave creada correctamente", result });
    } catch (error: any) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message || "Error desconocido" });
    }
  }

  async updateKeyword(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const dto = plainToInstance(UpdateColumnKeywordDto, req.body);
      const result = await this.columnConfigService.updateKeyword(id, dto);
      res
        .status(StatusCodes.OK)
        .json({ message: "Palabra clave actualizada correctamente", result });
    } catch (error: any) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message || "Error desconocido" });
    }
  }

  async deleteKeyword(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.columnConfigService.deleteKeyword(id);
      res
        .status(StatusCodes.OK)
        .json({ message: "Palabra clave eliminada correctamente" });
    } catch (error: any) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message || "Error desconocido" });
    }
  }

  async findKeywords(req: Request, res: Response) {
    try {
      const dto = plainToInstance(ColumnKeywordSearchDto, req.body);
      const result = await this.columnConfigService.findKeywords(dto);
      res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message || "Error desconocido" });
    }
  }
}
