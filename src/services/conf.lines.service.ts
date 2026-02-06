import { ConfigLinesRepository } from "../repository/conf.lines.repository";
import { ConfigLine } from "../models/conf.lines.model";
import { ConfigLineListDto, CreateConfigLineDto, SearchConfigLineDto, UpdateConfigLineDto } from "../dtos/conf.lines.dto";
import { DataSource } from "typeorm";
import { plainToClass } from "class-transformer";

export class ConfigLinesService {
    private readonly configLinesRepository: ConfigLinesRepository;

    constructor(dataSource: DataSource) {
        this.configLinesRepository = new ConfigLinesRepository(dataSource);
    }

    async create(createConfigLineDto: CreateConfigLineDto): Promise<ConfigLine> {
        const confLineEntity = plainToClass(ConfigLine, createConfigLineDto);
        return this.configLinesRepository.create(confLineEntity);
    }

    async createOrUpdateAll(createConfigLineDtos: ConfigLineListDto): Promise<String> {
        let created = 0;
        let updated = 0;
        let errors = 0;
        for (const createConfigLineDto of createConfigLineDtos.lines) {
            try {
                const configLine = await this.configLinesRepository.findByNameAndNameLine(createConfigLineDto.name, createConfigLineDto.lineName);
                if (configLine) {
                    await this.configLinesRepository.update(configLine.id, createConfigLineDto);
                    updated++;
                } else {
                    await this.configLinesRepository.create(createConfigLineDto);
                    created++;
                }
            } catch (error) {
                errors++;
            }
        }
        return "Se han creado " + created + " líneas de configuración." + " Se han actualizado " + updated + " líneas de configuración." + " Se han producido " + errors + " errores.";
    }

    async findAll(): Promise<ConfigLine[]> {
        return this.configLinesRepository.findAll();
    }

    async findById(id: number): Promise<ConfigLine | null> {
        const configLine = await this.configLinesRepository.findById(id);
        if (!configLine) {
            throw new Error('La línea de configuración con el id ' + id + ' no existe.');
        }
        return configLine;
    }

    async update(id: number, updateConfigLineDto: UpdateConfigLineDto): Promise<ConfigLine | null> {
        const configLine = await this.configLinesRepository.findById(id);
        if (!configLine) {
            throw new Error('La línea de configuración con el id ' + id + ' no existe.');
        }
        const confLineUpdateEntity = plainToClass(ConfigLine, updateConfigLineDto);
        return this.configLinesRepository.update(id, { ...configLine, ...confLineUpdateEntity });
    }

    async findPaginated(searchDto: SearchConfigLineDto): Promise<{ data: ConfigLine[]; total: number }> {
        return this.configLinesRepository.findPaginated(searchDto);
    }

    async delete(id: number): Promise<boolean> {
        const configLine = await this.configLinesRepository.findById(id);
        if (!configLine) {
            throw new Error('La línea de configuración con el id ' + id + ' no existe.');
        }
        return this.configLinesRepository.deleteAndReturn(id);
    }
}