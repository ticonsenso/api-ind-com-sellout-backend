import app from "./app";
import { env } from "./config/env";
import { initializeDataSource } from "./config/data-source";

const PORT = env.PORT || 3008;
const HOST =
  env.NODE_ENV === "production" || env.NODE_ENV === "qa"
    ? "0.0.0.0"
    : "localhost";

const startServer = async () => {
  try {
    await initializeDataSource();
    app.listen(Number(PORT), HOST, () => {
      console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor debido a un error en el Data Source:", error);
    process.exit(1);
  }
};

startServer();
