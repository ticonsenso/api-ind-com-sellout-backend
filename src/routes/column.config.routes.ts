import { RequestHandler, Router } from "express";
import AppDataSource from "../config/data-source";
import { ColumnConfigController } from "../controllers/column.config.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validatorMiddleware } from "../middleware/validator.middleware";
import {
  CreateColumnCategoryDto,
  UpdateColumnCategoryDto,
  ColumnCategorySearchDto,
} from "../dtos/column.category.dto";
import {
  CreateColumnKeywordDto,
  UpdateColumnKeywordDto,
  ColumnKeywordSearchDto,
} from "../dtos/column.keyword.dto";

const router = Router();
const controller = new ColumnConfigController(AppDataSource);

//
// ================================================================
// 🟢 CATEGORY ROUTES
// ================================================================
//

/**
 * @swagger
 * /api/column-config/categories:
 *   post:
 *     tags:
 *       - Column Config - Categorías
 *     summary: Crear una nueva categoría de columnas
 *     description: Crea una categoría para agrupar palabras clave de columnas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Información de cliente"
 *                 description: Nombre de la categoría
 *               description:
 *                 type: string
 *                 example: "Columnas relacionadas con datos del cliente"
 *                 description: Descripción opcional de la categoría
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post(
  "/categories",
  authenticateToken,
  validatorMiddleware(CreateColumnCategoryDto, false) as RequestHandler,
  controller.createCategory
);

/**
 * @swagger
 * /api/column-config/categories/{id}:
 *   put:
 *     tags:
 *       - Column Config - Categorías
 *     summary: Actualizar una categoría existente
 *     description: Modifica los datos de una categoría de columnas existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Datos del producto"
 *               description:
 *                 type: string
 *                 example: "Columnas asociadas con productos"
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *       404:
 *         description: Categoría no encontrada
 */
router.put(
  "/categories/:id",
  authenticateToken,
  validatorMiddleware(UpdateColumnCategoryDto, false) as RequestHandler,
  controller.updateCategory
);

/**
 * @swagger
 * /api/column-config/categories/{id}:
 *   delete:
 *     tags:
 *       - Column Config - Categorías
 *     summary: Eliminar una categoría de columnas
 *     description: Elimina una categoría y sus palabras clave asociadas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *       404:
 *         description: Categoría no encontrada
 */
router.delete(
  "/categories/:id",
  authenticateToken,
  controller.deleteCategory
);

/**
 * @swagger
 * /api/column-config/categories/search:
 *   post:
 *     tags:
 *       - Column Config - Categorías
 *     summary: Buscar categorías de columnas
 *     description: Obtiene una lista de categorías filtradas por nombre
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "cliente"
 *     responses:
 *       200:
 *         description: Búsqueda completada correctamente
 */
router.post(
  "/categories/search",
  authenticateToken,
  controller.findCategories
);

//
// ================================================================
// 🟣 KEYWORDS ROUTES
// ================================================================
//

/**
 * @swagger
 * /api/column-config/keywords:
 *   post:
 *     tags:
 *       - Column Config - Palabras Clave
 *     summary: Crear una nueva palabra clave
 *     description: Registra una palabra clave asociada a una categoría
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keyword
 *               - categoryId
 *             properties:
 *               keyword:
 *                 type: string
 *                 example: "fecha de venta"
 *                 description: Palabra clave asociada
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *                 description: ID de la categoría a la que pertenece
 *     responses:
 *       201:
 *         description: Palabra clave creada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post(
  "/keywords",
  authenticateToken,
  validatorMiddleware(CreateColumnKeywordDto, false) as RequestHandler,
  controller.createKeyword
);

/**
 * @swagger
 * /api/column-config/keywords/{id}:
 *   put:
 *     tags:
 *       - Column Config - Palabras Clave
 *     summary: Actualizar una palabra clave existente
 *     description: Permite modificar los datos de una palabra clave existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 example: "precio unitario"
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Palabra clave actualizada correctamente
 *       404:
 *         description: Palabra clave no encontrada
 */
router.put(
  "/keywords/:id",
  authenticateToken,
  validatorMiddleware(UpdateColumnKeywordDto, false) as RequestHandler,
  controller.updateKeyword
);

/**
 * @swagger
 * /api/column-config/keywords/{id}:
 *   delete:
 *     tags:
 *       - Column Config - Palabras Clave
 *     summary: Eliminar una palabra clave
 *     description: Elimina una palabra clave del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Palabra clave eliminada correctamente
 *       404:
 *         description: Palabra clave no encontrada
 */
router.delete(
  "/keywords/:id",
  authenticateToken,
  controller.deleteKeyword
);

/**
 * @swagger
 * /api/column-config/keywords/search:
 *   post:
 *     tags:
 *       - Column Config - Palabras Clave
 *     summary: Buscar palabras clave
 *     description: Filtra las palabras clave por texto o categoría
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 example: "producto"
 *                 description: Palabra clave a buscar
 *     responses:
 *       200:
 *         description: Palabras clave encontradas correctamente
 */
router.post(
  "/keywords/search",
  authenticateToken,
  controller.findKeywords
);

export default router;
