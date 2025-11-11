import {DataSource} from 'typeorm';
import {
    BasePptoSelloutFiltersResponseDto,
    BasePptoSelloutResponseDto,
    CreateBasePptoSelloutDto,
    UpdateBasePptoSelloutDto
} from '../dtos/base.ppto.sellout.dto';
import {plainToClass, plainToInstance} from 'class-transformer';
import {BasePptoSelloutRepository} from '../repository/base.ppto.sellout.repository';
import {BasePptoSellout} from '../models/base.ppto.sellout.model';
import {chunkArray} from '../utils/utils';
import {EmployeesRepository} from '../repository/employees.repository';
import {StoresSicRepository} from '../repository/stores.repository';
import {ProductSicRepository} from '../repository/product.sic.repository';
import {WebServicesRepository} from '../repository/web.services.repository';

export class BasePptoSelloutService {
    private basePptoSelloutRepository: BasePptoSelloutRepository;
    private employeeRepository: EmployeesRepository;
    private storeMasterRepository: StoresSicRepository;
    private productSicRepository: ProductSicRepository;
    private webServicesRepository: WebServicesRepository;
    constructor(dataSource: DataSource) {
        this.basePptoSelloutRepository = new BasePptoSelloutRepository(dataSource);
        this.employeeRepository = new EmployeesRepository(dataSource);
        this.storeMasterRepository = new StoresSicRepository(dataSource);
        this.productSicRepository = new ProductSicRepository(dataSource);
        this.webServicesRepository = new WebServicesRepository(dataSource);
    }

    async createBasePptoSellout(basePptoSellout: CreateBasePptoSelloutDto): Promise<CreateBasePptoSelloutDto> {
        const basePptoSelloutSave = plainToClass(BasePptoSellout, basePptoSellout);

        const employeeSupervisor = await this.employeeRepository.findByCode(basePptoSellout.codeSupervisor);
        if (!employeeSupervisor) throw new Error(`El supervisor no existe: ${basePptoSellout.codeSupervisor}`);

        const codeZone = await this.employeeRepository.findByCode(basePptoSellout.codeZone);
        if (!codeZone) throw new Error(`La zona no existe: ${basePptoSellout.codeZone}`);

        const storeSic = await this.storeMasterRepository.findByStoreCodeOnly(Number(basePptoSellout.storeCode));
        if (!storeSic) throw new Error(`El almacén sic no existe: ${basePptoSellout.storeCode}`);

        const employeePromotor = await this.employeeRepository.findByCode(basePptoSellout.promotorCode);
        if (!employeePromotor) throw new Error(`El promotor no existe: ${basePptoSellout.promotorCode}`);

        const employeePromotorPi = await this.employeeRepository.findByCode(basePptoSellout.codePromotorPi!);
        if (!employeePromotorPi) throw new Error(`El promotor pi no existe: ${basePptoSellout.codePromotorPi}`);

        const employeePromotorTv = await this.employeeRepository.findByCode(basePptoSellout.codePromotorTv!);
        if (!employeePromotorTv) throw new Error(`El promotor tv no existe: ${basePptoSellout.codePromotorTv}`);

        const productSic = await this.productSicRepository.findByEquivalentCodeOrId(basePptoSellout.equivalentCode);
        if (!productSic) throw new Error(`El producto sic no existe: ${basePptoSellout.equivalentCode}`);

        const webServices = await this.webServicesRepository.findByMaterialCode(basePptoSellout.equivalentCode);
        if (!webServices) throw new Error(`El producto en web services no existe: ${productSic.jdeCode}`);

        basePptoSelloutSave.employeeSupervisor = employeeSupervisor;
        basePptoSelloutSave.employeeCodeZone = codeZone;
        basePptoSelloutSave.store = storeSic;
        basePptoSelloutSave.employeePromotor = employeePromotor;
        basePptoSelloutSave.employeePromotorPi = employeePromotorPi;
        basePptoSelloutSave.employeePromotorTv = employeePromotorTv;
        basePptoSelloutSave.productSic = productSic;
        basePptoSelloutSave.productType = webServices.materialTypeDescription;

        const savedBasePptoSellout = await this.basePptoSelloutRepository.create(basePptoSelloutSave);
        return plainToClass(CreateBasePptoSelloutDto, savedBasePptoSellout, { excludeExtraneousValues: true });
    }

    async createBasePptoSelloutBatch(configs: CreateBasePptoSelloutDto[]): Promise<{
        inserted: number;
        failed: number;
        errors: { index: number; error: string; data: CreateBasePptoSelloutDto }[];
    }> {
        const chunkSize = 2000;
        const chunks = chunkArray(configs, chunkSize);
        const allErrors: { index: number; error: string; data: CreateBasePptoSelloutDto }[] = [];
        let totalInserted = 0;

        for (const chunk of chunks) {
            const recordsToInsert: BasePptoSellout[] = [];

            for (const [index, dto] of chunk.entries()) {
                try {
                    const created = await this.createBasePptoSellout(dto);
                    recordsToInsert.push(plainToClass(BasePptoSellout, created));
                } catch (err: any) {
                    allErrors.push({
                        index,
                        error: err?.message ?? 'Error desconocido',
                        data: dto,
                    });
                }
            }

            if (recordsToInsert.length > 0) {
                await this.basePptoSelloutRepository.insertBatch(recordsToInsert);
                totalInserted += recordsToInsert.length;
            }
        }

        return {
            inserted: totalInserted,
            failed: allErrors.length,
            errors: allErrors,
        };
    }

    async updateBasePptoSellout(id: number, basePptoSellout: UpdateBasePptoSelloutDto): Promise<BasePptoSelloutResponseDto> {
        const basePptoSelloutSave = plainToClass(BasePptoSellout, basePptoSellout);
        const existingBasePptoSellout = await this.basePptoSelloutRepository.findById(id);
        if (!existingBasePptoSellout) {
            throw new Error(`Base de ppto de sellout con ID ${id} no encontrado`);
        }
        const updatedBasePptoSellout = await this.basePptoSelloutRepository.update(id, basePptoSelloutSave);
        return plainToClass(BasePptoSelloutResponseDto, updatedBasePptoSellout, { excludeExtraneousValues: true });
    }

    async deleteBasePptoSellout(id: number): Promise<void> {
        const basePptoSellout = await this.basePptoSelloutRepository.findById(id);
        if (!basePptoSellout) {
            throw new Error('La base de ppto de sellout no existe.');
        }
        await this.basePptoSelloutRepository.delete(id);
    }

    async getAllBasePptoSellout(): Promise<BasePptoSelloutResponseDto[]> {
        const basePptoSelloutList = await this.basePptoSelloutRepository.findAll();
    
        for (const base of basePptoSelloutList) {
            const supervisor = await this.employeeRepository.findByCode(base.codeSupervisor);
            if (!supervisor) throw new Error(`El supervisor no existe: ${base.codeSupervisor}`);
    
            const zone = await this.employeeRepository.findByCode(base.codeZone);
            if (!zone) throw new Error(`La zona no existe: ${base.codeZone}`);
    
            const store = await this.storeMasterRepository.findByStoreCodeOnly(Number(base.storeCode));
            if (!store) throw new Error(`El almacén sic no existe: ${base.storeCode}`);
    
            const promotor = await this.employeeRepository.findByCode(base.promotorCode);
            if (!promotor) throw new Error(`El promotor no existe: ${base.promotorCode}`);
    
            let promotorPi = null;
            if (base.codePromotorPi) {
                promotorPi = await this.employeeRepository.findByCode(base.codePromotorPi);
                if (!promotorPi) throw new Error(`El promotor PI no existe: ${base.codePromotorPi}`);
            }
    
            let promotorTv = null;
            if (base.codePromotorTv) {
                promotorTv = await this.employeeRepository.findByCode(base.codePromotorTv);
                if (!promotorTv) throw new Error(`El promotor TV no existe: ${base.codePromotorTv}`);
            }
    
            const productSic = await this.productSicRepository.findByEquivalentCodeOrId(base.equivalentCode);
            if (!productSic) throw new Error(`El producto sic no existe: ${base.equivalentCode}`);
    
            const webServices = await this.webServicesRepository.findByMaterialCode(base.equivalentCode);
            if (!webServices) throw new Error(`El producto en web services no existe: ${productSic.jdeCode}`);
    
            base.employeeSupervisor = supervisor;
            base.employeeCodeZone = zone;
            base.store = store;
            base.employeePromotor = promotor;
            if (promotorPi) {
                base.employeePromotorPi = promotorPi;
            }
            if (promotorTv) {
                base.employeePromotorTv = promotorTv;
            }
            base.productSic = productSic;
            base.productType = webServices.materialTypeDescription;
        }
    
        return plainToInstance(BasePptoSelloutResponseDto, basePptoSelloutList, {
            excludeExtraneousValues: true,
        });
    }
    
    
    async getFilteredStoresMaster(
        page: number,
        limit: number,
        search?: string
    ): Promise<BasePptoSelloutFiltersResponseDto> {
        const { items, total } = await this.basePptoSelloutRepository.findByFilters(page, limit, search);
        return {
            items: plainToInstance(BasePptoSelloutResponseDto, items, {
            }),
            total,
        };
    }
}
