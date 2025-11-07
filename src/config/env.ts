import dotenv from "dotenv";
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : process.env.NODE_ENV === "qa"
    ? ".env.qa"
    : ".env.development";
dotenv.config({ path: envFile });

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3008"),
  BASE_URL: process.env.BASE_URL || "https://cmi.consensocorp.com",

  // Database configuration
  DB_USER: process.env.DB_USER || "jpsolanoc",
  DB_HOST: process.env.DB_HOST || "82.165.47.88",
  DB_NAME: process.env.DB_NAME || "consenso",
  DB_PASSWORD: process.env.DB_PASSWORD || "holatuten123.",
  DB_PORT: parseInt(process.env.DB_PORT || "5432"),
  DB_DEFAULT_SCHEMA: process.env.DB_DEFAULT_SCHEMA || "db-sellout",

  // En producción, es posible que DATABASE_URL venga de las variables de entorno del contenedor
  DATABASE_URL:
    process.env.DATABASE_URL ||
    `postgres://${process.env.DB_USER || "jpsolanoc"}:${process.env.DB_PASSWORD || "82.165.47.88"}@${process.env.DB_HOST || "82.165.47.88"}:${process.env.DB_PORT || "5432"}/${process.env.DB_NAME || "consenso"}?schema=${process.env.DB_DEFAULT_SCHEMA || "db_sellout"}`,

  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || "consenso_2025$$",
  BASE_PATH: process.env.BASE_PATH || "",
};
