import {RequestHandler, Router} from 'express';
import {UserController} from '../controllers/user.controller';
import AppDataSource from '../config/data-source';
import {authenticateToken} from '../middleware/auth.middleware';
import {validatorMiddleware} from '../middleware/validator.middleware';
import {CreateUserDto, UpdateUserDto} from '../dtos/users.dto';

const router = Router();
const userController = new UserController(AppDataSource);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Token de autenticación JWT con  formato "Bearer {token}"
 *
 * security:
 *   - bearerAuth: []
 *
 */

/**
 * @swagger
 * /api/management/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     description: Crea un nuevo usuario en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dni
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               dni:
 *                 type: string
 *                 description: DNI del usuario
 *                 minLength: 5
 *                 maxLength: 255
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *                 minLength: 3
 *                 maxLength: 255
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               phone:
 *                 type: string
 *                 description: Teléfono del usuario
 *                 minLength: 7
 *                 maxLength: 255
 *               status:
 *                 type: boolean
 *                 description: Estado del usuario (activo/inactivo)
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       500:
 *         description: Error del servidor
 */
router.post(
  '/users',
  authenticateToken,
  validatorMiddleware(CreateUserDto, false) as RequestHandler,
  userController.create as RequestHandler,
);

/**
 * @swagger
 * /api/management/users/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     description: Actualiza la información de un usuario existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *                 description: DNI del usuario
 *                 minLength: 5
 *                 maxLength: 255
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *                 minLength: 3
 *                 maxLength: 255
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               phone:
 *                 type: string
 *                 description: Teléfono del usuario
 *                 minLength: 7
 *                 maxLength: 255
 *               status:
 *                 type: boolean
 *                 description: Estado del usuario (activo/inactivo)
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       500:
 *         description: Error del servidor
 */
router.put(
  '/users/:id',
  authenticateToken,
  validatorMiddleware(UpdateUserDto, false) as RequestHandler,
  userController.update as RequestHandler,
);

/** 
 * @swagger
 * /api/management/users/{id}/company:
 *   put:
 *     summary: Actualizar la compañía de un usuario
 *     tags: [Usuarios]
 *     description: Actualiza la compañía de un usuario existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id 
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object   
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID de la compañía
 *     responses:
 *       200: 
 *         description: Compañía actualizada exitosamente
 *       500:
 *         description: Error del servidor
 */
router.put('/users/:id/company', authenticateToken, userController.updateCompany as RequestHandler);


/**
 * @swagger
 * /api/management/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     description: Elimina un usuario del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       500:
 *         description: Error del servidor
 */
router.delete('/users/:id', authenticateToken, userController.delete as RequestHandler);

/**
 * @swagger
 * /api/management/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     description: Retorna una lista de todos los usuarios registrados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   dni:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   status:
 *                     type: boolean
 *                   company:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *       500:
 *         description: Error del servidor
 */
router.get('/users', authenticateToken, userController.findAll as RequestHandler);

/**
 * @swagger
 * /api/management/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     description: Retorna un usuario específico según su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 dni:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 company:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *       500:
 *         description: Error del servidor
 */
router.get('/users/:id', authenticateToken, userController.findById as RequestHandler);

/**
 * @swagger
 * /api/management/users/filters:
 *   post:
 *     summary: Buscar usuarios por filtros
 *     tags: [Usuarios]
 *     description: Retorna usuarios que coincidan con los filtros especificados
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *                 description: DNI del usuario
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               status:
 *                 type: boolean
 *                 description: Estado del usuario (activo/inactivo)
 *               companyId:
 *                 type: integer
 *                 default: null
 *                 description: ID de la compañía
 *     responses:
 *       200:
 *         description: Lista de usuarios filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   dni:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   status:
 *                     type: boolean
 *                   company:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *       500:
 *         description: Error del servidor
 */
router.post('/users/filters', authenticateToken, userController.findByFilters as RequestHandler);

/**
 * @swagger
 * /api/management/users/{idUser}/roles:
 *   post:
 *     summary: Asignar roles a un usuario
 *     tags: [Usuarios]
 *     description: Asigna roles a un usuario específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs de los roles a asignar
 *     responses:
 *       200:
 *         description: Roles asignados correctamente
 *       500:
 *         description: Error del servidor
 */
router.post('/users/:idUser/roles', authenticateToken, userController.asignRoleToUser as RequestHandler);

/**
 * @swagger
 * /api/management/users/roles/login:
 *   get:
 *     summary: Obtener roles de un usuario por DNI
 *     tags: [Usuarios]
 *     description: Retorna los roles de un usuario según su token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 *       500:
 *         description: Error del servidor
 */
router.get('/users/roles/login', authenticateToken, userController.getRolesByDni as RequestHandler);
export default router;
