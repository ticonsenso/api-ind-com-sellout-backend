import {DataSource} from "typeorm";
import {AdvisorCommissionRepository} from '../repository/advisor.commission.repository';
import {
    ConsolidatedCommissionCalculationRepository
} from '../repository/consolidated.commission.calculation.repository';
import {
    StoreManagerCalculationCommissionRepository
} from "../repository/store.manager.calculation.commission.repository";
import {ResponseDataConsensoDto, SearchDataConsensoDto} from "../dtos/search.data.consenso";

export class ConsolidateInformationConsensoService {
    private advisorCommissionRepository: AdvisorCommissionRepository;
    private consolidatedCommissionCalculationRepository: ConsolidatedCommissionCalculationRepository;
    private storeManagerCalculationCommissionRepository: StoreManagerCalculationCommissionRepository;
    constructor(dataSource: DataSource) {
        this.advisorCommissionRepository = new AdvisorCommissionRepository(dataSource);
        this.consolidatedCommissionCalculationRepository = new ConsolidatedCommissionCalculationRepository(dataSource);
        this.storeManagerCalculationCommissionRepository = new StoreManagerCalculationCommissionRepository(dataSource);
    }

    async getDataConsenso(searchDataConsensoDto: SearchDataConsensoDto): Promise<ResponseDataConsensoDto[]> {
        try {
            const [advisorData, consolidateData, managerData] = await Promise.all([
                this.advisorCommissionRepository.getDataComplacieNominaAdvisorCommisions(searchDataConsensoDto),
                this.consolidatedCommissionCalculationRepository.getDataNominaConsolidated(searchDataConsensoDto),
                this.storeManagerCalculationCommissionRepository.getDataNominaStoreManager(searchDataConsensoDto)
            ]);
            return [...advisorData, ...consolidateData, ...managerData];
        } catch (error) {
            console.error('Error al obtener datos de consenso:', error);
            throw error;
        }
    }
}