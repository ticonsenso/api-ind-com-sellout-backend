import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../config/env";

const baseUrl =
  env.NODE_ENV === "production"
    ? "https://sellout.indurama.com"
    : env.NODE_ENV === "qa"
      ? "https://const.mentetec.com"
      : "http://localhost:3008";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API SELLOUT (Consenso)",
      version: "1.1.9",
      description: "Proyecto de manejo de datos sellout",
    },

    servers: [
      {
        url: baseUrl + env.BASE_PATH,
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Ruta a los archivos donde defines las rutas de tu API
};

console.log("esta", env.NODE_ENV, baseUrl + " " + env.BASE_PATH);

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
