import path from "path";
import { DataSource, EntityManager } from "typeorm";
import { env } from "./env";

export let statusConeccion = { status: false, message: "" };

const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  schema: env.DB_DEFAULT_SCHEMA,
  synchronize: false,
  logging: false, // Enable logging for both environments to debug entity loading
  entities: [
    env.NODE_ENV === "production" || env.NODE_ENV === "qa"
      ? path.join(__dirname, "../models/**/*.model.{js,ts}")
      : path.join(__dirname, "../models/**/*.model.{ts,js}"),
  ],
  migrations: [
    env.NODE_ENV === "production" || env.NODE_ENV === "qa"
      ? path.join(__dirname, "../migration/**/*.{js,ts}")
      : path.join(__dirname, "../migration/**/*.{ts,js}"),
  ],
  subscribers: [
    env.NODE_ENV === "production" || env.NODE_ENV === "qa"
      ? path.join(__dirname, "../subscriber/**/*.{js,ts}")
      : path.join(__dirname, "../subscriber/**/*.{ts,js}"),
  ],
});

// Verificar la conexión
export const initializeDataSource = async () => {
  try {
    await AppDataSource.initialize();
    const message = `Conexión a la base de datos (${env.NODE_ENV}), host: ${env.DB_HOST} establecida correctamente`;
    console.log(message);
    statusConeccion = { status: true, message: message };
  } catch (error) {
    console.error(
      `Error al conectar a la base de datos (${env.NODE_ENV}):`,
      error
    );
    console.error(
      "Ruta de entidades:",
      env.NODE_ENV === "production" || env.NODE_ENV === "qa"
        ? path.join(__dirname, "../models/**/*.model.{js,ts}")
        : path.join(__dirname, "../models/**/*.model.{ts,js}")
    );
    const message = `Error al conectar a la base de datos (${env.NODE_ENV}), host: ${env.DB_HOST}`;
    console.error(message);
    statusConeccion = { status: false, message: message };
  }
};

export async function resetSequences(
  manager: EntityManager,
  tables: [string, string][],
) {
  for (const [table, idColumn] of tables) {
    const sequenceName = `${table}_${idColumn}_seq`;
    const [{ max_id }] = await manager.query(
      `SELECT COALESCE(MAX(${idColumn}), 0) AS max_id FROM ${table}`
    );
    await manager.query(`SELECT setval('${sequenceName}', ${max_id})`);
  }
}

initializeDataSource();
export default AppDataSource;