import {RequestHandler, Router} from "express";
import AppDataSource from "../config/data-source";
import {AuthController} from "../controllers/auth.controller";

const router = Router();

const authController = new AuthController(AppDataSource);

/**
 * @swagger
 * /api/auth/saml/login:
 *   get:
 *     summary: Inicia el proceso de autenticación SAML
 *     description: Redirige al usuario al proveedor de identidad (IdP) para iniciar el proceso de autenticación SAML
 *     tags:
 *       - Autenticación
 *     responses:
 *       302:
 *         description: Redirección al IdP para autenticación
 *       500:
 *         description: Error al crear la URL de inicio de sesión
 */
router.get(
  "/api/auth/saml/login",
  authController.initiateSamlLogin as RequestHandler
);

/**
 * @swagger
 * /saml/acs:
 *   post:
 *     summary: Maneja la respuesta de autenticación SAML - Despliegue de producción
 *     description: Procesa la respuesta del IdP, extrae los atributos del usuario y genera un token JWT
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               SAMLResponse:
 *                 type: string
 *                 description: Respuesta SAML codificada en base64
 *     responses:
 *       302:
 *         description: Redirección al frontend con el token JWT
 *       400:
 *         description: Error en la respuesta SAML o atributos de usuario faltantes
 */
router.post("/saml/acs", authController.handleSamlCallback as RequestHandler);

/**
 * @swagger
 * /api/auth/saml/logout:
 *   get:
 *     summary: Inicia el proceso de cierre de sesión SAML
 *     description: Redirige al usuario al IdP para cerrar la sesión
 *     tags:
 *       - Autenticación
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Identificador del usuario en el IdP
 *     responses:
 *       302:
 *         description: Redirección al IdP para cierre de sesión
 *       500:
 *         description: Error al crear la URL de cierre de sesión
 */
router.get(
  "/api/auth/saml/logout",
  authController.initiateSamlLogout as RequestHandler
);

/**
 * @swagger
 * /saml/logout:
 *   post:
 *     summary: Maneja la respuesta de cierre de sesión SAML
 *     description: Procesa la respuesta del IdP después del cierre de sesión
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               SAMLResponse:
 *                 type: string
 *                 description: Respuesta SAML de cierre de sesión codificada en base64
 *     responses:
 *       302:
 *         description: Redirección al frontend tras el cierre de sesión
 *       400:
 *         description: Error en la respuesta SAML
 */
router.post(
  "saml/logout",
  authController.handleSamlLogoutResponse as RequestHandler
);

/**
 * @swagger
 * /api/auth/token:
 *   get:
 *     summary: Genera un token JWT para el usuario de desarrollo
 *     description: Genera un token JWT para el usuario de desarrollo
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Token JWT generado
 *       500:
 *         description: Error al generar el token
 */
router.get(
  "/api/auth/token",
  authController.generateTokenDev as unknown as RequestHandler
);

/**
 * @swagger
 * /api/auth/metadata:
 *   get:
 *     summary: Obtiene los metadatos SAML del proveedor de servicios
 *     description: Genera y devuelve los metadatos SAML firmados para la configuración del IdP
 *     tags:
 *       - Autenticación
 *     parameters:
 *       - in: query
 *         name: baseURL
 *         schema:
 *           type: string
 *         required: true
 *         description: URL base para generar los metadatos
 *         example: https://compensaciones.consensocorp.com
 *     responses:
 *       200:
 *         description: Metadatos SAML en formato XML
 *         content:
 *           application/xml:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get(
  "/api/auth/metadata",
  authController.getSAMLMetadata as RequestHandler
);

export default router;
