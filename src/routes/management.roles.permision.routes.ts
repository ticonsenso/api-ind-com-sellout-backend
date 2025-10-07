import { Router, RequestHandler } from 'express';
import AppDataSource from '../config/data-source';
import { ManagementRolesPermisionController } from '../controllers/management.roles.permision.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos/permissions.dto';
import { validatorMiddleware } from '../middleware/validator.middleware';
import { CreateRoleDto, UpdateRoleDto } from '../dtos/roles.dto';
const dataSource = AppDataSource;

const router = Router();

const managementRolesPermisionController = new ManagementRolesPermisionController(dataSource);
/**
 * @swagger
 * /api/management/permissions:
 *   post:
 *     summary: Crear un nuevo permiso
 *     tags: [Permisos]
 *     description: Crea un nuevo permiso en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del permiso
 *                 minLength: 3
 *                 maxLength: 255
 *               status:
 *                 type: boolean
 *                 description: Estado del permiso (activo/inactivo)
 *               description:
 *                 type: string
 *                 description: Descripción del permiso
 *               shortDescription:
 *                 type: string
 *                 description: Descripción corta del permiso
 *     responses:
 *       200:
 *         description: Permiso creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 description:
 *                   type: string
 *                 shortDescription:
 *                   type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string 
 */
router.post(
  '/permissions',
  authenticateToken,
  validatorMiddleware(CreatePermissionDto, false) as RequestHandler,
  managementRolesPermisionController.createPermission as RequestHandler,
);
/**
 * @swagger
 * /api/management/permissions:
 *   get:
 *     summary: Obtener todos los permisos
 *     tags: [Permisos]
 *     description: Retorna una lista de todos los permisos disponibles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   status:
 *                     type: boolean
 *                   description:
 *                     type: string
 *                   shortDescription:
 *                     type: string
 *       500:
 *         description: Error del servidor
 */
router.get('/permissions', authenticateToken, managementRolesPermisionController.getAllPermissions as RequestHandler);
/**
 * @swagger
 * /api/management/permissions/{id}:
 *   get:
 *     summary: Obtener un permiso por ID
 *     tags: [Permisos]
 *     description: Retorna un permiso específico según su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del permiso
 *     responses:
 *       200:
 *         description: Permiso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 description:
 *                   type: string
 *                 shortDescription:
 *                   type: string
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/permissions/:id',
  authenticateToken,
  managementRolesPermisionController.getPermissionById as RequestHandler,
);

/**
 * @swagger
 * /api/management/permissions/{id}:
 *   put:
 *     summary: Actualizar un permiso
 *     tags: [Permisos]
 *     description: Actualiza la información de un permiso existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del permiso a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del permiso
 *               status:
 *                 type: boolean
 *                 description: Estado del permiso
 *               description:
 *                 type: string
 *                 description: Descripción del permiso
 *               shortDescription:
 *                 type: string
 *                 description: Descripción corta del permiso
 *     responses:
 *       200:
 *         description: Permiso actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 description:
 *                   type: string
 *                 shortDescription:
 *                   type: string
 *       500:
 *         description: Error del servidor
 */
router.put(
  '/permissions/:id',
  authenticateToken,
  validatorMiddleware(UpdatePermissionDto, false) as RequestHandler,
  managementRolesPermisionController.updatePermission as RequestHandler,
);

/**
 * @swagger
 * /api/management/permissions/{id}:
 *   delete:
 *     summary: Eliminar un permiso
 *     tags: [Permisos]
 *     description: Elimina un permiso existente según su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del permiso a eliminar
 *     responses:
 *       200:
 *         description: Permiso eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error del servidor
 */
router.delete(
  '/permissions/:id',
  authenticateToken,
  managementRolesPermisionController.deletePermission as RequestHandler,
);

//ROLES
/**
 * @swagger
 * /api/management/roles:
 *   post:
 *     summary: Crear un nuevo rol
 *     tags: [Roles]
 *     description: Crea un nuevo rol en el sistema
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
 *                 description: Nombre del rol
 *                 minLength: 3
 *                 maxLength: 255
 *               status:
 *                 type: boolean
 *                 description: Estado del rol
 *     responses:
 *       200:
 *         description: Rol creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       500:
 *         description: Error del servidor
 */
router.post(
  '/roles',
  authenticateToken,
  validatorMiddleware(CreateRoleDto, false) as RequestHandler,
  managementRolesPermisionController.createRole as RequestHandler,
);
/**
 * @swagger
 * /api/management/roles/{id}:
 *   put:
 *     summary: Actualizar un rol
 *     tags: [Roles]
 *     description: Actualiza la información de un rol existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del rol
 *               status:
 *                 type: boolean
 *                 description: Estado del rol
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       500:
 *         description: Error del servidor
 */
router.put(
  '/roles/:id',
  authenticateToken,
  validatorMiddleware(UpdateRoleDto, false) as RequestHandler,
  managementRolesPermisionController.updateRole as RequestHandler,
);
/**
 * @swagger
 * /api/management/roles/{id}:
 *   delete:
 *     summary: Eliminar un rol
 *     tags: [Roles]
 *     description: Elimina un rol existente según su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a eliminar
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error del servidor
 */
router.delete('/roles/:id', authenticateToken, managementRolesPermisionController.deleteRole as RequestHandler);
/**
 * @swagger
 * /api/management/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     description: Retorna una lista de todos los roles disponibles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   status:
 *                     type: boolean
 *                   permissions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         status:
 *                           type: boolean
 *       500:
 *         description: Error del servidor
 */
router.get('/roles', authenticateToken, managementRolesPermisionController.getAllRoles as RequestHandler);
/**
 * @swagger
 * /api/management/roles/{id}:
 *   get:
 *     summary: Obtener un rol por ID
 *     tags: [Roles]
 *     description: Retorna un rol específico según su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a obtener
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       status:
 *                         type: boolean
 *       500:
 *         description: Error del servidor
 */
router.get('/roles/:id', authenticateToken, managementRolesPermisionController.getRoleById as RequestHandler);

/**
 * @swagger
 * /api/management/roles/{id}/permissions:
 *   post:
 *     summary: Asignar permisos a un rol
 *     tags: [Roles]
 *     description: Asigna permisos a un rol específico según su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a asignar permisos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   description: ID del permiso a asignar
 *     responses:
 *       200:
 *         description: Permisos asignados correctamente
 *       500:
 *         description: Error del servidor
 */
router.post(
  '/roles/:idRol/permissions',
  authenticateToken,
  managementRolesPermisionController.asignedPermissionsToRole as RequestHandler,
);

export default router;
