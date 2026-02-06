import app from "./app";
import { env } from "./config/env";

const PORT = env.PORT || 3008;
const HOST =
  env.NODE_ENV === "production" || env.NODE_ENV === "qa"
    ? "0.0.0.0"
    : "localhost";

app.listen(Number(PORT), HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
  console.log(`Documentación corriendo en http://${HOST}:${PORT}/api-docs/`);
  console.log(`Documentación corriendo Prod en http://${HOST}:${PORT}/api-ind-com-sellout-backend/api-docs/`);
});
