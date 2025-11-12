import {plainToInstance} from "class-transformer";
import {DataSource} from "typeorm";
import {CommissionConfigurationResponseDto} from "../dtos/commission.configurations.dto";
import {
    CommissionRuleResponseDto,
    CommissionRuleResponseSearchDto,
    CommissionRuleSearchDto,
    CreateCommissionRuleDto,
    UpdateCommissionRuleDto,
} from "../dtos/commission.rules.dto";
import {ParameterLineResponseDto} from "../dtos/parameter.lines.dto";
import {CommissionRule} from "../models/commission.rules.model";
import {CommissionConfigurationsRepository} from "../repository/commission.configurations.repository";
import {CommissionRulesRepository} from "../repository/commission.rules.repository";
import {ParameterLinesRepository} from "../repository/parameter.lines.repository";
import {StoreSizeRepository} from "../repository/store.size.repository";

export class CommissionRulesService {
  private commissionRuleRepository: CommissionRulesRepository;
  private storeSizesRepository: StoreSizeRepository;
  private parameterLinesRepository: ParameterLinesRepository;
  private commissionConfigurationsRepository: CommissionConfigurationsRepository;
  constructor(dataSource: DataSource) {
    this.commissionRuleRepository = new CommissionRulesRepository(dataSource);
    this.storeSizesRepository = new StoreSizeRepository(dataSource);
    this.parameterLinesRepository = new ParameterLinesRepository(dataSource);
    this.commissionConfigurationsRepository =
      new CommissionConfigurationsRepository(dataSource);
  }

  async createCommissionRule(
    commissionRule: CreateCommissionRuleDto
  ): Promise<CommissionRuleResponseDto> {
    const commissionConfiguration =
      await this.commissionConfigurationsRepository.findById(
        commissionRule.commissionConfigurationId
      );
    if (!commissionConfiguration) {
      throw new Error("La configuración de comisión no existe.");
    }
    const commissionRuleEntity = plainToInstance(
      CommissionRule,
      commissionRule,
      {
        excludePrefixes: ["commissionConfigurationId"],
      }
    );
    if (commissionRule.parameterLinesId) {
      const parameterLine = await this.parameterLinesRepository.findById(
        commissionRule.parameterLinesId
      );
      if (!parameterLine) {
        throw new Error("La línea de parámetro no existe.");
      }
      commissionRuleEntity.parameterLine = parameterLine;
    }

    commissionRuleEntity.commissionConfiguration = commissionConfiguration;
    const savedCommissionRule =
      await this.commissionRuleRepository.create(commissionRuleEntity);
    return plainToInstance(CommissionRuleResponseDto, savedCommissionRule, {
      excludeExtraneousValues: true,
    });
  }

  async updateCommissionRulesBatch(
    updates: UpdateCommissionRuleDto[]
  ): Promise<CommissionRuleResponseDto[]> {
    const responses: CommissionRuleResponseDto[] = [];

    for (const dto of updates) {
      if (!dto.id) throw new Error('El campo "id" es obligatorio para actualizar.');

      const entity = await this.commissionRuleRepository.findById(dto.id);
      if (!entity) throw new Error(`No existe regla de comisión con id ${dto.id}`);

      if (dto.commissionConfigurationId !== undefined) {
        const config = await this.commissionConfigurationsRepository.findById(dto.commissionConfigurationId);
        if (!config) throw new Error(`Configuración ${dto.commissionConfigurationId} no encontrada`);
        entity.commissionConfiguration = config;
      }

      if (dto.parameterLinesId !== undefined) {
        const line = await this.parameterLinesRepository.findById(dto.parameterLinesId);
        if (!line) throw new Error(`Línea de parámetro ${dto.parameterLinesId} no existe`);
        entity.parameterLine = line;
      }

      if (dto.boneExtra !== undefined) entity.boneExtra = dto.boneExtra;
      if (dto.minComplace !== undefined) entity.minComplace = dto.minComplace;
      if (dto.maxComplace !== undefined) entity.maxComplace = dto.maxComplace;
      if (dto.commissionPercentage !== undefined) entity.commissionPercentage = dto.commissionPercentage;

      const saved = await this.commissionRuleRepository.update(entity.id, entity);

      responses.push(
        plainToInstance(CommissionRuleResponseDto, saved, {
          excludeExtraneousValues: true,
        })
      );
    }

    return responses;
  }

  async createCommissionRulesBatch(
    configs: CreateCommissionRuleDto[]
  ): Promise<CommissionRuleResponseDto[]> {
    const entities: CommissionRule[] = [];

    for (const dto of configs) {
      const entity = plainToInstance(CommissionRule, dto, {
        excludePrefixes: ['commissionConfigurationId'],
      });

      // Relaciones
      const config = await this.commissionConfigurationsRepository.findById(
        dto.commissionConfigurationId
      );
      if (!config) throw new Error('Configuración no encontrada');
      entity.commissionConfiguration = config;

      if (dto.parameterLinesId) {
        const line = await this.parameterLinesRepository.findById(dto.parameterLinesId);
        if (!line) throw new Error('Línea de parámetro no existe');
        entity.parameterLine = line;
      }

      entities.push(entity);
    }

    const saved = await this.commissionRuleRepository.save(entities);

    return saved.map((rule) =>
      plainToInstance(CommissionRuleResponseDto, rule, {
        excludeExtraneousValues: true,
      })
    );
  }

  async updateCommissionRule(
    id: number,
    commissionRule: UpdateCommissionRuleDto
  ): Promise<CommissionRuleResponseDto> {
    const commissionRuleEntity =
      await this.commissionRuleRepository.findById(id);
    if (!commissionRuleEntity) {
      throw new Error("La regla de comisión no existe.");
    }

    if (commissionRule.commissionConfigurationId) {
      const commissionConfiguration =
        await this.commissionConfigurationsRepository.findById(
          commissionRule.commissionConfigurationId
        );
      if (!commissionConfiguration) {
        throw new Error("La configuración de comisión no existe.");
      }
      commissionRuleEntity.commissionConfiguration = commissionConfiguration;
    }
    if (commissionRule.parameterLinesId) {
      const parameterLine = await this.parameterLinesRepository.findById(
        commissionRule.parameterLinesId
      );
      if (!parameterLine) {
        throw new Error("La línea de parámetro no existe.");
      }
      commissionRuleEntity.parameterLine = parameterLine;
    }


    commissionRuleEntity.minComplace =
      commissionRule.minComplace ?? commissionRuleEntity.minComplace;
    commissionRuleEntity.maxComplace =
      commissionRule.maxComplace ?? commissionRuleEntity.maxComplace;
    commissionRuleEntity.commissionPercentage =
      commissionRule.commissionPercentage ??
      commissionRuleEntity.commissionPercentage;
    commissionRuleEntity.boneExtra =
      commissionRule.boneExtra ?? commissionRuleEntity.boneExtra;

    const savedCommissionRule = await this.commissionRuleRepository.update(
      id,
      commissionRuleEntity
    );
    return plainToInstance(CommissionRuleResponseDto, savedCommissionRule, {
      excludeExtraneousValues: true,
    });
  }

  async deleteCommissionRule(id: number): Promise<void> {
    const commissionRuleEntity =
      await this.commissionRuleRepository.findById(id);
    if (!commissionRuleEntity) {
      throw new Error("La regla de comisión no existe.");
    }
    await this.commissionRuleRepository.delete(id);
  }

  async searchCommissionRulePaginated(
    searchDto: CommissionRuleSearchDto,
    page: number = 1,
    limit: number = 10
  ): Promise<CommissionRuleResponseSearchDto> {
    const commissionRules = await this.commissionRuleRepository.findByFilters(
      searchDto,
      page,
      limit
    );
    const commissionRulesResponse = commissionRules.items.map(
      (commissionRule) => {
        const commissionRuleResponse = plainToInstance(
          CommissionRuleResponseDto,
          commissionRule,
          {
            excludeExtraneousValues: true,
          }
        );
        const parameterLine = plainToInstance(
          ParameterLineResponseDto,
          commissionRule.parameterLine,
          {
            excludeExtraneousValues: true,
          }
        );

        const commissionConfiguration = plainToInstance(
          CommissionConfigurationResponseDto,
          commissionRule.commissionConfiguration,
          {
            excludeExtraneousValues: true,
          }
        );
        return {
          ...commissionRuleResponse,
          parameterLine,
          commissionConfiguration,
        };
      }
    );
    return plainToInstance(
      CommissionRuleResponseSearchDto,
      {
        items: commissionRulesResponse,
        total: commissionRules.total,
      },
      { excludeExtraneousValues: true }
    );
  }
}
