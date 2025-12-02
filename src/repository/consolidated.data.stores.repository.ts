import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { ConsolidatedDataStoresDto, NullFieldFilters } from "../dtos/consolidated.data.stores.dto";
import { ConsolidatedDataStores } from "../models/consolidated.data.stores.model";
import { BaseRepository } from "./base.respository";
import {
  Brackets,
  DataSource as TypeORMDataSource,
  SelectQueryBuilder,
  UpdateResult,
} from "typeorm";
import { primerDiaDelMesString } from "../utils/utils";

export class ConsolidatedDataStoresRepository extends BaseRepository<ConsolidatedDataStores> {
  constructor(dataSource: TypeORMDataSource) {
    super(ConsolidatedDataStores, dataSource);
  }

  async findBySearchProduct(
    searchStore: string
  ): Promise<ConsolidatedDataStores[]> {
    return this.repository
      .createQueryBuilder("c")
      .where(
        `
        REPLACE(c.distributor, ' ', '') || 
        REPLACE(c.codeStoreDistributor, ' ', '') = :searchStore
      `,
        { searchStore }
      )
      .getMany();
  }

  async findBySearchStore(
    searchStore: string
  ): Promise<ConsolidatedDataStores[]> {
    return this.repository
      .createQueryBuilder("c")
      .where(
        `
        REPLACE(c.distributor, ' ', '') || 
        REPLACE(c.codeProductDistributor, ' ', '') || 
        REPLACE(c.descriptionDistributor, ' ', '') = :searchStore
      `,
        { searchStore }
      )
      .getMany();
  }

  async findBySearchProductWhichCalculeDate(
    searchStore: string,
    calculeDate: string
  ): Promise<ConsolidatedDataStores[]> {
    return this.repository
      .createQueryBuilder("c")
      .where(
        `
      REPLACE(c.distributor, ' ', '') ||
      REPLACE(c.codeStoreDistributor, ' ', '') = :searchStore
    `,
        { searchStore }
      )
      .andWhere(`c.calculeDate = :calculeDate`, { calculeDate })
      .getMany();
  }

  async findBySearchStoreWhichCalculeDate(
    searchStore: string,
    calculeDate: string
  ): Promise<ConsolidatedDataStores[]> {
    return this.repository
      .createQueryBuilder("c")
      .where(
        `
      REPLACE(c.distributor, ' ', '') || 
      REPLACE(c.codeProductDistributor, ' ', '') || 
      REPLACE(c.descriptionDistributor, ' ', '') = :searchStore
    `,
        { searchStore }
      )
      .andWhere(`c.calculeDate = :calculeDate`, { calculeDate })
      .getMany();
  }

  async findMonthlyStoresFields(monthDate: string) {
    console.log("monthDate", monthDate);
    return this.repository
      .createQueryBuilder("data")
      .select([
        "data.distributor AS distributor",
        "data.code_store_distributor AS code_store_distributor",
        "COUNT(*) AS nulls_fields",
      ])
      .where(
        `(
        data.code_store IS NULL OR data.code_store = '' OR
        data.authorized_distributor IS NULL OR data.authorized_distributor = '' OR
        data.store_name IS NULL OR data.store_name = ''
      )`
      )
      .andWhere("data.status = true")
      .andWhere(
        `TO_CHAR(data.calculate_date, 'YYYY-MM') = TO_CHAR(:monthDate::date, 'YYYY-MM')`,
        {
          monthDate,
        }
      )
      .groupBy("data.distributor")
      .addGroupBy("data.code_store_distributor")
      .orderBy("nulls_fields", "DESC")
      .getRawMany();
  }

  async findMonthlyStoresFieldsWithOutDate() {
    return this.repository
      .createQueryBuilder("data")
      .select([
        "data.distributor AS distributor",
        "data.code_store_distributor AS code_store_distributor",
        "COUNT(*) AS nulls_fields",
      ])
      .where(
        `(
        data.code_store IS NULL OR data.code_store = '' OR
        data.authorized_distributor IS NULL OR data.authorized_distributor = '' OR
        data.store_name IS NULL OR data.store_name = ''
      )`
      )
      .andWhere("data.status = true")
      .groupBy("data.distributor")
      .addGroupBy("data.code_store_distributor")
      .orderBy("nulls_fields", "DESC")
      .getRawMany();
  }

  async updateFieldsByDistributorAndCode(
    distributor: string,
    codeStoreDistributor: string,
    updateValues: QueryDeepPartialEntity<ConsolidatedDataStores>
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(ConsolidatedDataStores)
      .set(updateValues)
      .where("distributor = :distributor", { distributor })
      .andWhere('"code_store_distributor" = :codeStoreDistributor', {
        codeStoreDistributor,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where("code_store IS NULL OR code_store = ''")
            .orWhere(
              "authorized_distributor IS NULL OR authorized_distributor = ''"
            )
            .orWhere("store_name IS NULL OR store_name = ''");
        })
      )
      .execute();
  }

  async findMonthlyProductsFields(monthDate: string) {
    return this.repository
      .createQueryBuilder("data")
      .select([
        "data.distributor AS distributor",
        "data.code_product_distributor AS code_product_distributor",
        "data.description_distributor AS description_distributor",
        "COUNT(*) AS nulls_fields",
      ])
      .where(
        `(
        data.code_product IS NULL OR data.code_product = '' OR
        data.product_model IS NULL OR data.product_model = ''
      )`
      )
      .andWhere("data.status = true")
      .andWhere(
        `TO_CHAR(data.calculate_date, 'YYYY-MM') = TO_CHAR(:monthDate::date, 'YYYY-MM')`,
        {
          monthDate,
        }
      )
      .groupBy("data.distributor")
      .addGroupBy("data.code_product_distributor")
      .addGroupBy("data.description_distributor")
      .orderBy("nulls_fields", "DESC")
      .getRawMany();
  }

  async findMonthlyProductsFieldsWithOutDate() {
    return this.repository
      .createQueryBuilder("data")
      .select([
        "data.distributor AS distributor",
        "data.code_product_distributor AS code_product_distributor",
        "data.description_distributor AS description_distributor",
        "COUNT(*) AS nulls_fields",
      ])
      .where(
        `(
        data.code_product IS NULL OR data.code_product = '' OR
        data.product_model IS NULL OR data.product_model = ''
      )`
      )
      .andWhere("data.status = true")
      .groupBy("data.distributor")
      .addGroupBy("data.code_product_distributor")
      .addGroupBy("data.description_distributor")
      .orderBy("nulls_fields", "DESC")
      .getRawMany();
  }

  async updateFieldsByProductAndModel(
    distributor: string,
    codeProductDistributor: string,
    descriptionDistributor: string,
    updateValues: QueryDeepPartialEntity<ConsolidatedDataStores>
  ): Promise<UpdateResult> {
    const query = this.repository
      .createQueryBuilder()
      .update(ConsolidatedDataStores)
      .set(updateValues)
      .where("distributor = :distributor", { distributor })
      .andWhere("code_product_distributor = :codeProductDistributor", {
        codeProductDistributor,
      })
      .andWhere("description_distributor = :descriptionDistributor", {
        descriptionDistributor,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where("code_product IS NULL OR code_product = ''").orWhere(
            "product_model IS NULL OR product_model = ''"
          );
        })
      );

    console.log("Update SQL:", query.getSql());
    console.log("Parameters:", query.getParameters());

    return await query.execute();
  }

  async deleteAllByMatriculationId(
    matriculationId: number,
    calculateDate: Date
  ): Promise<void> {
    const date = new Date(calculateDate).toISOString().split("T")[0];
    const year = date.split("-")[0];
    const month = date.split("-")[1];

    const find = await this.repository
      .createQueryBuilder("s")
      .leftJoin("s.matriculationTemplate", "mt")
      .where("mt.id = :matriculationId", { matriculationId })
      .andWhere("EXTRACT(YEAR FROM s.calculateDate) = :year", { year })
      .andWhere("EXTRACT(MONTH FROM s.calculateDate) = :month", { month })
      .getMany();

    await this.repository.remove(find);
  }

  async findByYearAndMonth(
    year: number,
    month: number
  ): Promise<ConsolidatedDataStores[]> {
    return this.repository
      .createQueryBuilder("s")
      .where("s.status = true")
      .andWhere(
        "EXTRACT(YEAR FROM s.calculateDate) = :year AND EXTRACT(MONTH FROM s.calculateDate) = :month",
        { year, month }
      )
      .andWhere(
        `
      (
        s.codeStoreDistributor IS NULL OR s.codeStoreDistributor = '' OR
        s.authorizedDistributor IS NULL OR s.authorizedDistributor = '' OR
        s.storeName IS NULL OR s.storeName = '' OR
        s.productModel IS NULL OR s.productModel = ''
      )
    `
      )
      .orderBy("s.id", "DESC")
      .getMany();
  }

  async findAllWithMissingFieldsStore(): Promise<ConsolidatedDataStores[]> {
    return this.repository
      .createQueryBuilder("s")
      .where("s.status = true")
      .andWhere(
        `
        (
          s.codeStore IS NULL OR s.codeStore = '' OR
          s.authorizedDistributor IS NULL OR s.authorizedDistributor = '' OR
          s.storeName IS NULL OR s.storeName = ''
        )
      `
      )
      .orderBy("s.id", "DESC")
      .getMany();
  }

  async findAllWithMissingFieldsProduct(): Promise<ConsolidatedDataStores[]> {
    return this.repository
      .createQueryBuilder("s")
      .where("s.status = true")
      .andWhere(
        `
        (
          s.codeProduct IS NULL OR s.codeProduct = '' OR
          s.productModel IS NULL OR s.productModel = ''
        )
      `
      )
      .orderBy("s.id", "DESC")
      .getMany();
  }

  async findByDistributorData(
    distributor: string,
    codeProductDistributor: string,
    codeStoreDistributor: string,
    descriptionDistributor: string,
    saleDate: Date
  ): Promise<ConsolidatedDataStores | null> {
    return this.repository.findOne({
      where: {
        distributor,
        codeProductDistributor,
        codeStoreDistributor,
        descriptionDistributor,
        saleDate,
      },
    });
  }

  async findByDistributorStoreDuplicated(
    distributor: string,
    codeStoreDistributor: string
  ): Promise<ConsolidatedDataStores[]> {
    return this.repository
      .createQueryBuilder("data")
      .where("data.status = true")
      .andWhere("data.distributor = :distributor", { distributor })
      .andWhere("data.codeStoreDistributor = :codeStoreDistributor", {
        codeStoreDistributor,
      })
      .andWhere(
        `
        (
          data.authorizedDistributor IS NULL OR data.authorizedDistributor = '' OR
          data.storeName IS NULL OR data.storeName = ''
        )
      `
      )
      .getMany();
  }

  async findByDistributorProductDuplicated(
    distributor: string,
    codeProductDistributor: string,
    descriptionDistributor: string
  ): Promise<ConsolidatedDataStores[]> {
    return this.repository
      .createQueryBuilder("data")
      .where("data.status = true")
      .andWhere("data.distributor = :distributor", { distributor })
      .andWhere("data.codeProductDistributor = :codeProductDistributor", {
        codeProductDistributor,
      })
      .andWhere("data.descriptionDistributor = :descriptionDistributor", {
        descriptionDistributor,
      })
      .andWhere(
        `
        (
          data.productModel IS NULL OR data.productModel = ''
        )
      `
      )
      .getMany();
  }

  async findByFilters(
    page: number | 1,
    limit: number | 10,
    search?: string,
    nullFields?: NullFieldFilters,
    calculateDate?: Date
  ): Promise<{
    items: ConsolidatedDataStores[];
    total: number;
    totalAll: number;
  }> {
    const baseQb = this.repository
      .createQueryBuilder("s")
      .orderBy("s.id", "ASC");

    const applyFilters = (qb: SelectQueryBuilder<ConsolidatedDataStores>) => {
      if (search?.trim()) {
        qb.andWhere(
          new Brackets((qb1) => {
            qb1
              .where("s.distributor ILIKE :search", { search: `%${search}%` })
              .orWhere("s.codeStoreDistributor ILIKE :search", {
                search: `%${search}%`,
              })
              .orWhere("s.codeProductDistributor ILIKE :search", {
                search: `%${search}%`,
              })
              .orWhere("s.descriptionDistributor ILIKE :search", {
                search: `%${search}%`,
              })
              .orWhere("CAST(s.saleDate AS TEXT) ILIKE :search", {
                search: `%${search}%`,
              })
              .orWhere("s.codeProduct ILIKE :search", { search: `%${search}%` })
              .orWhere("s.codeStore ILIKE :search", { search: `%${search}%` });
          })
        );
      }

      if (nullFields && Object.keys(nullFields).length > 0) {
        qb.andWhere("s.status = true");
        qb.andWhere(
          new Brackets((qb2) => {
            const fields = [
              "codeProduct",
              "codeStore",
              "authorizedDistributor",
              "storeName",
              "productModel",
            ];

            fields.forEach((field) => {
              const isNull = nullFields[field as keyof typeof nullFields];

              if (isNull === true) {
                qb2.orWhere(`s.${field} IS NULL OR s.${field} = ''`);
              } else if (isNull === false) {
                qb2.orWhere(`s.${field} IS NOT NULL AND s.${field} != ''`);
              }
            });
          })
        );
      }

      if (calculateDate) {
        const date = calculateDate?.toISOString().split("T")[0];
        const year = date.split("-")[0];
        const month = date.split("-")[1];

        qb.andWhere("EXTRACT(YEAR FROM s.calculateDate) = :year", { year });
        qb.andWhere("EXTRACT(MONTH FROM s.calculateDate) = :month", { month });
      }
    };

    const filteredQb = baseQb.clone();
    applyFilters(filteredQb);

    filteredQb.skip((page - 1) * limit).take(limit);

    const [items, total] = await filteredQb.getManyAndCount();

    const totalAll = await this.repository.count();

    return { items, total, totalAll };
  }

  async findByFiltersMod(
    page: number = 1,
    limit: number = 10,
    filters?: {
      distributor?: string;
      codeStoreDistributor?: string;
      codeProductDistributor?: string;
      descriptionDistributor?: string;
    },
    calculateDate?: Date
  ): Promise<{
    items: ConsolidatedDataStoresDto[];
    total: number;
    totalAll: number;
  }> {
    const qb = this.repository
      .createQueryBuilder("s")
      .select([
        "s.distributor",
        "s.codeStoreDistributor",
        "s.codeProductDistributor",
        "s.descriptionDistributor",
        "SUM(s.unitsSoldDistributor) as unitsSoldDistributor",
        "s.codeProduct",
        "s.codeStore",
        "s.storeName",
        "s.productModel",
        "s.calculateDate",
      ])
      .groupBy("s.distributor")
      .addGroupBy("s.codeStoreDistributor")
      .addGroupBy("s.codeProductDistributor")
      .addGroupBy("s.descriptionDistributor")
      .addGroupBy("s.codeProduct")
      .addGroupBy("s.codeStore")
      .addGroupBy("s.storeName")
      .addGroupBy("s.productModel")
      .addGroupBy("s.calculateDate")
      .orderBy("s.distributor", "ASC")
      .addOrderBy("s.codeStoreDistributor", "ASC")
      .addOrderBy("s.codeProductDistributor", "ASC")
      .addOrderBy("s.descriptionDistributor", "ASC")
      .addOrderBy("s.codeProduct", "ASC")
      .addOrderBy("s.codeStore", "ASC");

    // === Filtros dinámicos individualizados ===
    if (filters?.distributor) {
      qb.andWhere("s.distributor ILIKE :d", { d: `%${filters.distributor}%` });
    }
    if (filters?.codeStoreDistributor) {
      qb.andWhere("s.codeStoreDistributor ILIKE :csd", {
        csd: `%${filters.codeStoreDistributor}%`,
      });
    }
    if (filters?.codeProductDistributor) {
      qb.andWhere("s.codeProductDistributor ILIKE :cpd", {
        cpd: `%${filters.codeProductDistributor}%`,
      });
    }
    if (filters?.descriptionDistributor) {
      qb.andWhere("s.descriptionDistributor ILIKE :desc", {
        desc: `%${filters.descriptionDistributor}%`,
      });
    }

    // === Filtro por año y mes ===
    if (calculateDate) {
      const date = calculateDate.toISOString().split("T")[0];
      const [year, month] = date.split("-");

      qb.andWhere("EXTRACT(YEAR FROM s.calculateDate) = :year", { year });
      qb.andWhere("EXTRACT(MONTH FROM s.calculateDate) = :month", { month });
    }

    // === Total sin paginar ===
    const totalAll = await qb.getCount();

    // === Paginación ===
    const items = await qb
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany();
    console.log(items);
    const itemsMapped: any = items.map((item: any) => ({
      id: item.id,
      distributor: item.s_distributor,
      codeStoreDistributor: item.s_code_store_distributor,
      codeProductDistributor: item.s_code_product_distributor,
      descriptionDistributor: item.s_description_distributor,
      unitsSoldDistributor: item.unitssolddistributor ? Number(item.unitssolddistributor) : null,
      saleDate: item.s_sale_date,
      codeProduct: item.s_code_product,
      codeStore: item.s_code_store,
      authorizedDistributor: item.s_authorized_distributor,
      storeName: item.s_store_name,
      productModel: item.s_product_model,
      calculateDate: item.s_calculate_date,
      matriculationTemplate: item.matriculationTemplate,
      status: item.status,
    }));

    // === Total paginado ===
    const total = itemsMapped.length;

    return { items: itemsMapped, total, totalAll };
  }

  async findByCalculateDateData(
    calculateDate: Date
  ): Promise<ConsolidatedDataStores[]> {
    const qb = this.repository.createQueryBuilder("s").orderBy("s.id", "ASC");

    const date = calculateDate?.toISOString().split("T")[0];
    const year = date.split("-")[0];
    const month = date.split("-")[1];

    qb.andWhere("EXTRACT(YEAR FROM s.calculateDate) = :year", { year });
    qb.andWhere("EXTRACT(MONTH FROM s.calculateDate) = :month", { month });

    const items = await qb.getMany();

    const uniqueMap = new Map<
      string,
      ConsolidatedDataStores & { unitsSoldDistributor: number }
    >();

    for (const item of items) {
      const key = `${item.distributor}-${item.codeStoreDistributor}-${item.codeProductDistributor}-${item.descriptionDistributor}`;

      if (uniqueMap.has(key)) {
        uniqueMap.get(key)!.unitsSoldDistributor! += 1;
      } else {
        uniqueMap.set(key, {
          ...item,
          unitsSoldDistributor: 1,
        });
      }
    }

    return Array.from(uniqueMap.values());
  }

  async findConsolidatedNullFieldsUnique(
    nullFields?: NullFieldFilters,
    calculateDate?: Date
  ): Promise<{
    items: Array<
      | { distributor: string; codeStoreDistributor: string }
      | {
          distributor: string;
          codeProductDistributor: string;
          descriptionDistributor: string;
        }
    >;
    total: number;
  }> {
    const date = calculateDate?.toISOString().split("T")[0];
    const year = date?.split("-")[0];
    const month = date?.split("-")[1];

    const allData = await this.findByYearAndMonth(Number(year), Number(month));

    const isNullOrEmpty = (value: any) => value === null || value === "";

    const isTrue = (value: any) => value === true;

    const uniqueMap = new Map<string, ConsolidatedDataStores>();

    for (const item of allData) {
      if (
        nullFields?.codeStore &&
        isNullOrEmpty(item.codeStore) &&
        isTrue(item.status)
      ) {
        const key = `${item.distributor}-${item.codeStoreDistributor}`;
        if (!uniqueMap.has(key)) uniqueMap.set(key, item);
      }

      if (
        nullFields?.codeProduct &&
        isNullOrEmpty(item.codeProduct) &&
        isTrue(item.status)
      ) {
        const key = `${item.distributor}-${item.codeProductDistributor}-${item.descriptionDistributor}`;
        if (!uniqueMap.has(key)) uniqueMap.set(key, item);
      }
    }

    const allValues = Array.from(uniqueMap.values());

    const mappedItems = allValues.map((item) => {
      if (nullFields?.codeStore) {
        return {
          id: item.id,
          distributor: item.distributor ?? "",
          codeStoreDistributor: item.codeStoreDistributor ?? "",
          codeStore: item.codeStore ?? "",
        };
      } else {
        return {
          id: item.id,
          distributor: item.distributor ?? "",
          codeProductDistributor: item.codeProductDistributor ?? "",
          descriptionDistributor: item.descriptionDistributor ?? "",
          codeProduct: item.codeProduct ?? "",
        };
      }
    });

    const total = mappedItems.length;

    return {
      items: mappedItems,
      total,
    };
  }

  async findDetailNullFields(calculateDate?: Date): Promise<any> {
    const date = calculateDate?.toISOString().split("T")[0];
    const year = date?.split("-")[0];
    const month = date?.split("-")[1];

    const allData = await this.findByYearAndMonth(Number(year), Number(month));

    const isNullOrEmpty = (value: any) =>
      value === null ||
      value === "" ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "");

    // Map por campo
    const codeStoreMap = new Map<string, ConsolidatedDataStores>();
    const authorizedDistributorMap = new Map<string, ConsolidatedDataStores>();
    const storeNameMap = new Map<string, ConsolidatedDataStores>();

    const codeProductMap = new Map<string, ConsolidatedDataStores>();
    const productModelMap = new Map<string, ConsolidatedDataStores>();

    for (const item of allData) {
      const storeKey = `store-${item.distributor}-${item.codeStoreDistributor}`;
      const productKey = `product-${item.distributor}-${item.codeProductDistributor}-${item.descriptionDistributor}`;

      if (isNullOrEmpty(item.codeStore) && !codeStoreMap.has(storeKey)) {
        codeStoreMap.set(storeKey, item);
      }

      if (
        isNullOrEmpty(item.authorizedDistributor) &&
        !authorizedDistributorMap.has(storeKey)
      ) {
        authorizedDistributorMap.set(storeKey, item);
      }

      if (isNullOrEmpty(item.storeName) && !storeNameMap.has(storeKey)) {
        storeNameMap.set(storeKey, item);
      }

      if (isNullOrEmpty(item.codeProduct) && !codeProductMap.has(productKey)) {
        codeProductMap.set(productKey, item);
      }

      if (
        isNullOrEmpty(item.productModel) &&
        !productModelMap.has(productKey)
      ) {
        productModelMap.set(productKey, item);
      }
    }

    // Conteo por campo único
    const countNullsInUniqueData = {
      codeStore: codeStoreMap.size,
      authorizedDistributor: authorizedDistributorMap.size,
      storeName: storeNameMap.size,
      codeProduct: codeProductMap.size,
      productModel: productModelMap.size,
    };

    // Conteo total
    const countNullsInAllData = {
      codeProductTotal: allData.filter((item) =>
        isNullOrEmpty(item.codeProduct)
      ).length,
      codeStoreTotal: allData.filter((item) => isNullOrEmpty(item.codeStore))
        .length,
    };

    return {
      ...countNullsInUniqueData,
      ...countNullsInAllData,
    };
  }
  //**
  // Vamos a generar tres metodos para obtener los totales de registros
  // findByCalculateDateDataSinAgrupacion,
  //**

  async findByCalculateDateDataSinAgrupacion(
    calculateDate: Date
  ): Promise<ConsolidatedDataStores[]> {
    const qb = this.repository.createQueryBuilder("cds");

    const date = calculateDate.toISOString().split("T")[0];
    const [year, month] = date.split("-");

    return await qb
      .where("EXTRACT(YEAR FROM cds.calculate_date) = :year", { year })
      .andWhere("EXTRACT(MONTH FROM cds.calculate_date) = :month", { month })
      .orderBy("cds.id", "ASC")
      .getMany();
  }

  async findByCalculateDateDataAgraupacionParcial(
    calculateDate: Date
  ): Promise<any[]> {
    const date = calculateDate.toISOString().split("T")[0];
    const [year, month] = date.split("-");

    return await this.repository
      .createQueryBuilder("s")
      .select("s.distributor", "distributor")
      .addSelect("s.code_store_distributor", "codeStoreDistributor")
      .addSelect("s.code_product_distributor", "codeProductDistributor")
      .addSelect("s.description_distributor", "descriptionDistributor")
      .addSelect("SUM(s.units_sold_distributor)", "unitsSoldDistributor")
      .where("EXTRACT(YEAR FROM s.calculate_date) = :year", { year })
      .andWhere("EXTRACT(MONTH FROM s.calculate_date) = :month", { month })
      .groupBy("s.distributor")
      .addGroupBy("s.code_store_distributor")
      .addGroupBy("s.code_product_distributor")
      .addGroupBy("s.description_distributor")
      .orderBy("s.distributor", "ASC")
      .addOrderBy("s.code_store_distributor", "ASC")
      .addOrderBy("s.code_product_distributor", "ASC")
      .addOrderBy("s.description_distributor", "ASC")
      .getRawMany();
  }

  async findByCalculateDateDataAgrupacion(calculateDate: Date): Promise<any[]> {
    const date = calculateDate.toISOString().split("T")[0];
    const [year, month] = date.split("-");

    return await this.repository
      .createQueryBuilder("s")
      .select("s.distributor", "distributor")
      .addSelect("s.code_store_distributor", "codeStoreDistributor")
      .addSelect("s.code_product_distributor", "codeProductDistributor")
      .addSelect("s.description_distributor", "descriptionDistributor")
      .addSelect("SUM(s.units_sold_distributor)", "unitsSoldDistributor")
      .addSelect("s.code_product", "codeProduct")
      .addSelect("s.code_store", "codeStore")
      .addSelect("s.store_name", "storeName")
      .addSelect("s.product_model", "productModel")
      .addSelect("s.calculate_date", "calculateDate")
      .where("EXTRACT(YEAR FROM s.calculate_date) = :year", { year })
      .andWhere("EXTRACT(MONTH FROM s.calculate_date) = :month", { month })
      .groupBy("s.distributor")
      .addGroupBy("s.code_store_distributor")
      .addGroupBy("s.code_product_distributor")
      .addGroupBy("s.description_distributor")
      .addGroupBy("s.code_product")
      .addGroupBy("s.code_store")
      .addGroupBy("s.store_name")
      .addGroupBy("s.product_model")
      .addGroupBy("s.calculate_date")
      .orderBy("s.distributor", "ASC")
      .addOrderBy("s.code_store_distributor", "ASC")
      .addOrderBy("s.code_product_distributor", "ASC")
      .addOrderBy("s.description_distributor", "ASC")
      .addOrderBy("s.code_product", "ASC")
      .addOrderBy("s.code_store", "ASC")
      .getRawMany();
  }

    async deleteDataByDistributorAndCodeStoreDistributor(
    distributor: string,
    codeStoreDistributor: string,
    calculateDate: string
  ): Promise<any> {
    return await this.repository
      .createQueryBuilder()
      .delete()
      .from("consolidated_data_stores")
      .where("distributor = :distributor", { distributor })
      .andWhere("code_store_distributor = :code", {
        code: codeStoreDistributor,
      })
      .andWhere("calculate_date = :calculateDate", { calculateDate: primerDiaDelMesString(calculateDate) })
      .execute();
  }

    async deleteDataByDistributor(
    distributor: string,
    calculateDate: string
  ): Promise<any> {
    return await this.repository
      .createQueryBuilder()
      .delete()
      .from("consolidated_data_stores")
      .where("distributor = :distributor", { distributor })
      .andWhere("calculate_date = :calculateDate", { calculateDate: primerDiaDelMesString(calculateDate) })
      .execute();
  }
}
