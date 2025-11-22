import cors from "cors";
import express, {Application} from "express";
import passport from "passport";
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import {env} from "./config/env";
import swaggerSpec from "./docs/swaggerConfig";
import comissionsConfigRoutes from "./routes/comissions.config.routes";
import configureEtlRoutes from "./routes/configure.etl.routes";
import healthRoutes from "./routes/health.routes";
import loginRoutes from "./routes/login.routes";
import rolesAndPermissionsRoutes from "./routes/management.roles.permision.routes";
import userRoutes from "./routes/user.routes";
import commissionCalculationRoutes from "./routes/commission.calculation.routes";
import statisticsRoutes from "./routes/statistics.routes";
import storeConfigurationRoutes from "./routes/store.configuration.routes";
import advisorCommissionRoutes from "./routes/advisor.commission.routes";
import selloutMastersRoutes from "./routes/sellout.masters.routes";
import selloutConfigurationRoutes from "./routes/sellout.configuration.routes";
import consolidatedDataStoresRoutes from "./routes/consolidated.data.stores.routes";
import storesRoutes from "./routes/stores.routes";
import baseSelloutRoutes from "./routes/base.sellout.routes";
import matriculationRoutes from "./routes/matriculation.routes";
import exportDataRoutes from "./routes/export.data.routes";
import storeManagerCalculationCommissionRoutes from "./routes/store.manager.calculation.routes";
import columnConfigRoutes from "./routes/column.config.routes";
import morgan from "morgan";
import zlib from "zlib";

const app: Application = express();
app.use(express.raw({ type: "application/gzip", limit: "10mb" }));
// Configurar CORS para permitir solicitudes específicas
const basePath = env.BASE_PATH;

app.use(
  cors({
    origin: "*", // Permitir todas las solicitudes
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
// Middlewares
//app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Swagger también bajo el basePath
app.use(`${basePath}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Agrupar rutas bajo el prefijo
app.use(`${basePath}/api/management`, rolesAndPermissionsRoutes, userRoutes);
app.use(`${basePath}/api/comissions/config`, comissionsConfigRoutes);
app.use(`${basePath}/api/configure/etl`, configureEtlRoutes);
app.use(`${basePath}/`, loginRoutes);
app.use(`${basePath}/api/commission/calculation`, commissionCalculationRoutes);
app.use(`${basePath}/api/statistics`, statisticsRoutes);
app.use(`${basePath}/api/store`, storeConfigurationRoutes);
app.use(`${basePath}/api/store/manager`, storeManagerCalculationCommissionRoutes);

app.use(`${basePath}/api/commission/advisor`, advisorCommissionRoutes);
app.use(`${basePath}/api/sellout/masters`, selloutMastersRoutes);
app.use(`${basePath}/api/sellout`, selloutConfigurationRoutes);
app.use(`${basePath}/api/sellout/consolidated`, consolidatedDataStoresRoutes);
app.use(`${basePath}/api/stores`, storesRoutes);
app.use(`${basePath}/api/base/sellout`, baseSelloutRoutes);
app.use(`${basePath}/api/matriculation`, matriculationRoutes);
app.use(`${basePath}/api/export/data`, exportDataRoutes);
app.use(`${basePath}/api/column-config`, columnConfigRoutes);

// Health check endpoint
app.use(`${basePath}`, healthRoutes);

export default app;
