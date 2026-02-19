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
import { ReadStream } from "fs";
import { MAX } from "class-validator";

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
        s.codeProduct IS NULL OR s.codeProduct = '' OR
        s.codeStore IS NULL OR s.codeStore = ''
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

  async findByFiltersModStores(
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
        "s.calculate_date AS calculate_date",
        "s.distributor AS distributor",
        "s.code_store_distributor AS code_store_distributor",
        "s.code_product_distributor AS code_product_distributor",
        "s.description_distributor AS description_distributor",
        "s.units_sold_distributor AS units_sold_distributor",
        "s.code_product AS code_product",
        "s.code_store AS code_store",
        "s.sale_date AS sale_date",
        "s.id AS id",
        "s.status AS status",
      ]);

    // === Filtro especifico ===
    qb.andWhere("UPPER(REPLACE(s.code_store, ' ', '')) = 'NOSEVISITA'");

    // === Filtros dinámicos ===
    if (filters?.distributor) {
      qb.andWhere("s.distributor ILIKE :d", { d: `%${filters.distributor}%` });
    }
    if (filters?.codeStoreDistributor) {
      qb.andWhere("s.code_store_distributor ILIKE :csd", {
        csd: `%${filters.codeStoreDistributor}%`,
      });
    }
    if (filters?.codeProductDistributor) {
      qb.andWhere("s.code_product_distributor ILIKE :cpd", {
        cpd: `%${filters.codeProductDistributor}%`,
      });
    }
    if (filters?.descriptionDistributor) {
      qb.andWhere("s.description_distributor ILIKE :desc", {
        desc: `%${filters.descriptionDistributor}%`,
      });
    }

    // === Filtro por año y mes ===
    if (calculateDate) {
      const date = calculateDate.toISOString().split("T")[0];
      qb.andWhere(`s.calculate_date::date = '${date}'`);
    }

    // === Total sin paginar ===
    const totalAll = await qb.getCount();

    // === Paginación ===
    const items = await qb
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany();

    // === Mapeo ===
    const itemsMapped: any = items.map((item: any) => ({
      calculateDate: item.calculate_date,
      distributor: item.distributor,
      codeStoreDistributor: item.code_store_distributor,
      codeProductDistributor: item.code_product_distributor,
      descriptionDistributor: item.description_distributor,
      unitsSoldDistributor: item.units_sold_distributor ? Number(item.units_sold_distributor) : null,
      codeProduct: item.code_product,
      codeStore: item.code_store,
      saleDate: item.sale_date,
      storeName: null,
      productModel: null,
      id: item.id,
      status: item.status,
    }));

    // === Total paginado ===
    const total = itemsMapped.length;

    return { items: itemsMapped, total, totalAll };
  }


  async findByFiltersModProduct(
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
        "s.calculate_date AS calculate_date",
        "s.distributor AS distributor",
        "s.code_store_distributor AS code_store_distributor",
        "s.code_product_distributor AS code_product_distributor",
        "s.description_distributor AS description_distributor",
        "s.units_sold_distributor AS units_sold_distributor",
        "s.code_product AS code_product",
        "s.code_store AS code_store",
        "s.sale_date AS sale_date",
        "s.id AS id",
        "s.status AS status",
      ]);

    // === Filtro especifico ===
    qb.andWhere("UPPER(REPLACE(s.code_product, ' ', '')) = 'OTROS'");

    // === Filtros dinámicos ===
    if (filters?.distributor) {
      qb.andWhere("s.distributor ILIKE :d", { d: `%${filters.distributor}%` });
    }
    if (filters?.codeStoreDistributor) {
      qb.andWhere("s.code_store_distributor ILIKE :csd", {
        csd: `%${filters.codeStoreDistributor}%`,
      });
    }
    if (filters?.codeProductDistributor) {
      qb.andWhere("s.code_product_distributor ILIKE :cpd", {
        cpd: `%${filters.codeProductDistributor}%`,
      });
    }
    if (filters?.descriptionDistributor) {
      qb.andWhere("s.description_distributor ILIKE :desc", {
        desc: `%${filters.descriptionDistributor}%`,
      });
    }

    // === Filtro por año y mes ===
    if (calculateDate) {
      const date = calculateDate.toISOString().split("T")[0];
      qb.andWhere(`s.calculate_date::date = '${date}'`);
    }

    // === Total sin paginar ===
    const totalAll = await qb.getCount();

    // === Paginación ===
    const items = await qb
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany();

    // === Mapeo ===
    const itemsMapped: any = items.map((item: any) => ({
      calculateDate: item.calculate_date,
      distributor: item.distributor,
      codeStoreDistributor: item.code_store_distributor,
      codeProductDistributor: item.code_product_distributor,
      descriptionDistributor: item.description_distributor,
      unitsSoldDistributor: item.units_sold_distributor ? Number(item.units_sold_distributor) : null,
      codeProduct: item.code_product,
      codeStore: item.code_store,
      saleDate: item.sale_date,
      storeName: null,
      productModel: null,
      id: item.id,
      status: item.status,
    }));

    // === Total paginado ===
    const total = itemsMapped.length;

    return { items: itemsMapped, total, totalAll };
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
      // Left Join con Subconsulta para Product SIC
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select("codigo_jde")
            .addSelect("MAX(prod_id)", "prod_id")
            .addSelect("MAX(nombre_sap)", "nombre_sap")
            .addSelect("MAX(linea_negocio_sap)", "linea_negocio")
            .addSelect("MAX(mar_desc_grupo_art)", "categoria")
            .addSelect("MAX(mar_desc_jerarq)", "sub_categoria")
            .addSelect("MAX(mar_modelo_im)", "modelo")
            .addSelect("MAX(nombre_ime)", "nombre_ime")
            .from("db-sellout.product_sic", "ps_inner")
            .groupBy("codigo_jde");
        },
        "ps",
        "ps.codigo_jde = s.codeProduct"
      )
      // Left Join con Subconsulta para Stores SIC
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select("cod_almacen")
            .addSelect("MAX(nombre_almacen)", "nombre_almacen")
            .addSelect("MAX(canal)", "canal")
            .addSelect("MAX(distrib_sap)", "grupo_comercial")
            .addSelect("MAX(grupo_zona)", "grupo_zona")
            .addSelect("MAX(zona)", "zona")
            .addSelect("MAX(categoria)", "categoria_almacen")
            .addSelect("MAX(supervisor)", "supervisor")
            .from("db-sellout.stores_sic", "ss_inner")
            .groupBy("cod_almacen");
        },
        "ss",
        "ss.cod_almacen = s.codeStore"
      )
      .select([
        "s.calculate_date AS calculate_date",
        "s.distributor AS distributor",
        "s.code_store_distributor AS code_store_distributor",
        "s.code_product_distributor AS code_product_distributor",
        "s.description_distributor AS description_distributor",
        "s.units_sold_distributor AS units_sold_distributor",
        "s.code_product AS code_product",
        "s.code_store AS code_store",
        "s.sale_date AS sale_date",
        "ss.nombre_almacen AS store_name",
        "ss.nombre_almacen AS nombre_almacen",
        "ps.nombre_sap AS product_model",
        "s.sale_date AS fecha_venta",
        "s.observation AS observation",
        "ps.linea_negocio",
        "ps.categoria",
        "ps.sub_categoria",
        "ps.modelo",
        "ps.nombre_ime",
        "ps.prod_id AS prod_id",
        "ss.canal",
        "ss.grupo_comercial",
        "ss.grupo_zona",
        "ss.zona",
        "ss.categoria_almacen",
        "ss.supervisor"
      ]);

    // === Filtros dinámicos ===
    if (filters?.distributor) {
      qb.andWhere("s.distributor ILIKE :d", { d: `%${filters.distributor}%` });
    }
    if (filters?.codeStoreDistributor) {
      qb.andWhere("s.code_store_distributor ILIKE :csd", {
        csd: `%${filters.codeStoreDistributor}%`,
      });
    }
    if (filters?.codeProductDistributor) {
      qb.andWhere("s.code_product_distributor ILIKE :cpd", {
        cpd: `%${filters.codeProductDistributor}%`,
      });
    }
    if (filters?.descriptionDistributor) {
      qb.andWhere("s.description_distributor ILIKE :desc", {
        desc: `%${filters.descriptionDistributor}%`,
      });
    }

    // === Filtro por año y mes ===
    if (calculateDate) {
      const date = calculateDate.toISOString().split("T")[0];
      // const [year, month] = date.split("-");
      // qb.andWhere("EXTRACT(YEAR FROM s.calculate_date) = :year", { year });
      // qb.andWhere("EXTRACT(MONTH FROM s.calculate_date) = :month", { month });
      qb.andWhere(`s.calculate_date::date = '${date}'`);
    }

    // === Total sin paginar ===
    const totalAll = await qb.getCount();

    // === Paginación ===
    const items = await qb
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany();

    // === Mapeo ===
    const itemsMapped: any = items.map((item: any) => ({
      calculateDate: item.calculate_date,
      distributor: item.distributor,
      codeStoreDistributor: item.code_store_distributor,
      codeProductDistributor: item.code_product_distributor,
      descriptionDistributor: item.description_distributor,
      unitsSoldDistributor: item.units_sold_distributor ? Number(item.units_sold_distributor) : null,
      codeProduct: item.code_product,
      codeStore: item.code_store,
      saleDate: item.sale_date,
      storeName: item.store_name,
      productModel: item.product_model,
      id: item.id,
      status: item.status,
      fechaVenta: item.fecha_venta,
      observation: item.observation,
      lineaNegocio: item.linea_negocio,
      categoria: item.categoria,
      subCategoria: item.sub_categoria,
      modelo: item.modelo,
      nombreIme: item.nombre_ime,
      prodId: item.prod_id,
      canal: item.canal,
      grupoComercial: item.grupo_comercial,
      nombreAlmacen: item.nombre_almacen,
      grupoZona: item.grupo_zona,
      zona: item.zona,
      categoriaAlmacen: item.categoria_almacen,
      supervisor: item.supervisor
    }));

    // === Total paginado ===
    const total = itemsMapped.length;

    return { items: itemsMapped, total, totalAll };
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
        isNullOrEmpty(item.codeProduct) &&
        !codeProductMap.has(productKey)
      ) {
        codeProductMap.set(productKey, item);
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

  async findByCalculateDateDataAgrupacion(calculateDate: Date): Promise<ReadStream> {
    const date = calculateDate.toISOString().split("T")[0];
    const [year, month] = date.split("-");
    console.log(year, month);

    const qb = this.repository
      .createQueryBuilder("s")
      // 1. LEFT JOIN con Subconsulta para Product SIC (ps)
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select("codigo_jde") // Campo de agrupación (sin MAX)
            .addSelect("MAX(prod_id)", "prod_id")
            .addSelect("MAX(linea_negocio_sap)", "lineanegociosap")
            .addSelect("MAX(mar_desc_grupo_art)", "categoria")
            .addSelect("MAX(mar_desc_jerarq)", "subcategoria")
            .addSelect("MAX(mar_modelo_im)", "marmodeloim")
            .addSelect("MAX(nombre_ime)", "nombreime")
            .addSelect("MAX(nombre_sap)", "nombresap")
            .from("db-sellout.product_sic", "ps_inner")
            .groupBy("codigo_jde");
        },
        "ps",
        "ps.codigo_jde = s.code_product"
      )
      // 2. LEFT JOIN con Subconsulta para Stores SIC (ss)
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select("cod_almacen") // Campo de agrupación (sin MAX)
            .addSelect("MAX(canal)", "canal")
            .addSelect("MAX(distrib_sap)", "grupocomercial")
            .addSelect("MAX(nombre_almacen)", "almacen")
            .addSelect("MAX(grupo_zona)", "grupozona")
            .addSelect("MAX(zona)", "zona")
            .addSelect("MAX(categoria)", "categoriaalmacen") // Alias para evitar colisión
            .addSelect("MAX(supervisor)", "supervisor")
            .from("db-sellout.stores_sic", "ss_inner")
            .groupBy("cod_almacen");
        },
        "ss",
        "ss.cod_almacen = s.code_store"
      )
      // 3. Selección final de columnas
      // Nota: Usamos los nombres de columna de 's' y los alias definidos en 'ps' y 'ss'
      .select([
        // --- Tabla Principal ---
        "s.distributor",
        "s.code_store_distributor",
        "s.code_product_distributor",
        "s.description_distributor",
        "s.units_sold_distributor",
        "s.code_product",
        "s.code_store",
        "s.sale_date",
        "s.calculate_date",
        "s.observation",

        // --- Datos de Producto (Alias definidos en subquery ps) ---
        "ps.lineanegociosap",
        "ps.categoria",
        "ps.subcategoria",
        "ps.marmodeloim",
        "ps.nombreime",
        "ps.prod_id",

        // --- Datos de Tienda (Alias definidos en subquery ss) ---
        "ss.canal",
        "ss.grupocomercial",
        "ss.almacen",
        "ss.grupozona",
        "ss.zona",
        "ss.categoriaalmacen",
        "ss.supervisor",
        // --- Datos de Maestro ---
        "UPPER(REPLACE(REPLACE(REPLACE(CONCAT(s.distributor, s.code_store_distributor), ' ', ''), '\t', ''), '\n', '')) as maestroalmacen",
        "UPPER(REPLACE(REPLACE(REPLACE(CONCAT(s.distributor, s.code_product_distributor, s.description_distributor), ' ', ''), '\t', ''), '\n', '')) as maestroproductos"
      ])
      // 4. Filtros
      .where(`s.calculate_date::date = '${date}'`)
      // 5. Ordenamiento (Usando columnas base para asegurar compatibilidad)
      .orderBy("s.distributor", "ASC")
      .addOrderBy("s.code_store_distributor", "ASC")
      .addOrderBy("s.code_product_distributor", "ASC");
    return qb.stream();
  }

  async findByCalculateDateDataAgrupacionBasic(calculateDate: Date): Promise<ReadStream> {
    const date = calculateDate.toISOString().split("T")[0];
    const qb = this.repository
      .createQueryBuilder("cds")
      .select("cds.calculateDate", "periodo")
      .addSelect("cds.saleDate", "fecha_venta")
      .addSelect("cds.codeProduct", "cod_prod")
      .addSelect("cds.codeStore", "cod_almacen")
      .addSelect("SUM(cds.unitsSoldDistributor)", "cantidad_venta")
      .addSelect((subQuery) => {
        return subQuery
          .select("MAX(ps.prod_id)")
          .from("db-sellout.product_sic", "ps")
          .where("ps.codigo_jde = cds.code_product");
      }, "prod_id")
      .where("cds.calculateDate = :date", { date })
      .groupBy("cds.calculateDate")
      .addGroupBy("cds.saleDate")
      .addGroupBy("cds.codeProduct")
      .addGroupBy("cds.codeStore");
    return qb.stream();
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
    matriculationTemplateId: number,
    calculateDate: string
  ): Promise<any> {
    return await this.repository
      .createQueryBuilder()
      .delete()
      .from("consolidated_data_stores")
      .where("matriculation_template_id = :templateId", {
        templateId: matriculationTemplateId
      })
      .andWhere("calculate_date = :calculateDate", {
        calculateDate: primerDiaDelMesString(calculateDate)
      })
      .execute();
  }

  async syncDataStores(calculateDate: string): Promise<number> {
    const query = `
      UPDATE "db-sellout".consolidated_data_stores cds
      SET code_store = t2.code_store_sic
      FROM "db-sellout".sellout_store_master t2
      WHERE 
        UPPER(REGEXP_REPLACE(CONCAT(cds.distributor, cds.code_store_distributor), '\\s+', '', 'g')) = 
        UPPER(REGEXP_REPLACE(t2.search_store, '\\s+', '', 'g'))
      AND cds.calculate_date = $1
      AND cds.code_store IS DISTINCT FROM t2.code_store_sic;
    `;
    const result = await this.repository.query(query, [calculateDate]);
    return result[1] || 0;
  }

  async syncDataProducts(calculateDate: string): Promise<number> {
    const query = `
      UPDATE "db-sellout".consolidated_data_stores cds
      SET code_product = t2.code_product_sic
      FROM "db-sellout".sellout_product_master t2
      WHERE 
        UPPER(REGEXP_REPLACE(CONCAT(cds.distributor, cds.code_product_distributor, cds.description_distributor), '\\s+', '', 'g')) = 
        UPPER(REGEXP_REPLACE(t2.search_product_store, '\\s+', '', 'g'))
      AND cds.calculate_date = $1
      AND cds.code_product IS DISTINCT FROM t2.code_product_sic;
    `;
    const result = await this.repository.query(query, [calculateDate]);
    return result[1] || 0;
  }
}
