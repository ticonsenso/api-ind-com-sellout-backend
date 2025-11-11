import {plainToInstance} from "class-transformer";
import {DataSource} from "typeorm";
import {CommissionConfigurationResponseDto} from "../dtos/commission.configurations.dto";
import {ParameterLineResponseDto} from "../dtos/parameter.lines.dto";
import {
    CreateProductLineDto,
    ProductLineListResponseDto,
    ProductLineListResponseSearchDto,
    ProductLineResponseDto,
    ProductLineSearchDto,
    UpdateProductLineDto,
} from "../dtos/product.lines.dto";
import {ProductLine} from "../models/product.lines.model";
import {CommissionConfigurationsRepository} from "../repository/commission.configurations.repository";
import {ParameterLinesRepository} from "../repository/parameter.lines.repository";
import {ProductLinesRepository} from "../repository/product.lines.repository";

export class ProductLinesService {
  private productLineRepository: ProductLinesRepository;
  private commissionConfigurationsRepository: CommissionConfigurationsRepository;
  private parameterLinesRepository: ParameterLinesRepository;

  constructor(dataSource: DataSource) {
    this.productLineRepository = new ProductLinesRepository(dataSource);
    this.commissionConfigurationsRepository =
      new CommissionConfigurationsRepository(dataSource);
    this.parameterLinesRepository = new ParameterLinesRepository(dataSource);
  }

  async createProductLine(
    productLine: CreateProductLineDto
  ): Promise<ProductLineResponseDto> {
    const commissionConfiguration =
      await this.commissionConfigurationsRepository.findById(
        productLine.commissionConfigurationId
      );
    if (!commissionConfiguration) {
      throw new Error("La versión de comisión no existe.");
    }
    const parameterLine = await this.parameterLinesRepository.findById(
      productLine.parameterLineId
    );
    if (!parameterLine) {
      throw new Error("La línea de parámetro no existe.");
    }
    const productLineEntity = plainToInstance(ProductLine, productLine, {
      excludePrefixes: ["versionId", "parameterLineId"],
    });
    productLineEntity.commissionConfiguration = commissionConfiguration;
    productLineEntity.parameterLine = parameterLine;
    const savedProductLine =
      await this.productLineRepository.create(productLineEntity);
    return plainToInstance(ProductLineResponseDto, savedProductLine, {
      excludeExtraneousValues: true,
    });
  }

  async updateProductLine(
    id: number,
    productLine: UpdateProductLineDto
  ): Promise<ProductLineResponseDto> {
    const productLineEntity = await this.productLineRepository.findById(id);
    if (!productLineEntity) {
      throw new Error("La línea de producto no existe.");
    }
    if (productLine.parameterLineId) {
      const parameterLine = await this.parameterLinesRepository.findById(
        Number(productLine.parameterLineId)
      );
      if (!parameterLine) {
        throw new Error("La línea de parámetro no existe.");
      }
      productLineEntity.parameterLine = parameterLine;
    }
    if (productLine.commissionConfigurationId) {
      const commissionConfiguration =
        await this.commissionConfigurationsRepository.findById(
          Number(productLine.commissionConfigurationId)
        );
      if (!commissionConfiguration) {
        throw new Error("La versión de comisión no existe.");
      }
      productLineEntity.commissionConfiguration = commissionConfiguration;
    }

    // Actualizar solo los campos proporcionados
    if (productLine.commissionWeight !== undefined)
      productLineEntity.commissionWeight = productLine.commissionWeight;
    if (productLine.goalRotation !== undefined)
      productLineEntity.goalRotation = productLine.goalRotation;
    if (productLine.minSaleValue !== undefined)
      productLineEntity.minSaleValue = productLine.minSaleValue;
    if (productLine.maxSaleValue !== undefined)
      productLineEntity.maxSaleValue = productLine.maxSaleValue;

    const savedProductLine = await this.productLineRepository.update(
      id,
      productLineEntity
    );
    return plainToInstance(ProductLineResponseDto, savedProductLine, {
      excludeExtraneousValues: true,
    });
  }

  async deleteProductLine(id: number): Promise<void> {
    const productLineEntity = await this.productLineRepository.findById(id);
    if (!productLineEntity) {
      throw new Error("La línea de producto no existe.");
    }
    await this.productLineRepository.delete(id);
  }

  async searchProductLinePaginated(
    searchDto: ProductLineSearchDto,
    page: number = 1,
    limit: number = 10
  ): Promise<ProductLineListResponseSearchDto> {
    const productLines = await this.productLineRepository.findByFilters(
      searchDto,
      page,
      limit
    );
    const productLinesResponse = productLines.items.map((productLine) => {
      const productLineResponse = plainToInstance(
        ProductLineListResponseDto,
        productLine,
        {
          excludeExtraneousValues: true,
        }
      );
      const commissionConfiguration = plainToInstance(
        CommissionConfigurationResponseDto,
        productLine.commissionConfiguration,
        {
          excludeExtraneousValues: true,
        }
      );
      const parameterLine = plainToInstance(
        ParameterLineResponseDto,
        productLine.parameterLine,
        {
          excludeExtraneousValues: true,
        }
      );
      return {
        ...productLineResponse,
        commissionConfiguration,
        parameterLine,
      };
    });
    return plainToInstance(
      ProductLineListResponseSearchDto,
      {
        items: productLinesResponse,
        total: productLines.total,
      },
      { excludeExtraneousValues: true }
    );
  }
}
