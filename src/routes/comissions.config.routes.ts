import { RequestHandler, Router } from "express";
import AppDataSource from "../config/data-source";
import { ComissionsConfigController } from "../controllers/comissions.config.controller";
import {
  CommissionConfigurationSearchDto,
  CompanySearchDto,
  CreateCommissionConfigurationDto,
  UpdateCommissionConfigurationDto,
} from "../dtos/commission.configurations.dto";
import {
  CommissionParameterSearchDto,
  CreateCommissionParameterDto,
  UpdateCommissionParameterDto,
} from "../dtos/commission.parameters.dto";
import {
  CommissionRuleSearchDto,
  CreateCommissionRuleDto,
  UpdateCommissionRuleDto,
} from "../dtos/commission.rules.dto";
import { CreateCompanyDto, UpdateCompanyDto } from "../dtos/companies.dto";
import {
  CompanyPositionSearchDto,
  CreateCompanyPositionDto,
  UpdateCompanyPositionDto,
} from "../dtos/company.positions.dto";
import {
  CreateEmployeeDto,
  EmployeeSearchDto,
  UpdateEmployeeDto,
} from "../dtos/employees.dto";
import {
  CreateKpiConfigDto,
  SearchKpiConfigDto,
  UpdateKpiConfigDto,
} from "../dtos/kpi.config.dto";
import {
  CreateMonthlyGoalDto,
  MonthlyGoalSearchDto,
  UpdateMonthlyGoalDto,
} from "../dtos/monthly.goals.dto";
import {
  CreateMonthlyResultDto,
  MonthlyResultSearchDto,
  UpdateMonthlyResultDto,
} from "../dtos/monthly.results.dto";
import {
  CreateParameterCategoryDto,
  ParameterCategorySearchDto,
  UpdateParameterCategoryDto,
} from "../dtos/parameter.categories.dto";
import {
  CreateParameterLineDto,
  CreateParameterLineSearchDto,
  UpdateParameterLineDto,
} from "../dtos/parameter.lines.dto";
import {
  CreateProductLineDto,
  ProductLineSearchDto,
  UpdateProductLineDto,
} from "../dtos/product.lines.dto";
import { SearchSeasonDto } from "../dtos/season.dto";
import {
  CreateSettlementPeriodDto,
  SettlementPeriodSearchDto,
  UpdateSettlementPeriodDto,
} from "../dtos/settlement.periods.dto";
import {
  CreateStoreSizeDto,
  StoreSizeSearchDto,
  UpdateStoreSizeDto,
} from "../dtos/store.size.dto";
import {
  CreateVariableScaleDto,
  UpdateVariableScaleDto,
  VariableScaleSearchDto,
} from "../dtos/variable.scales.dto";
import { authenticateToken } from "../middleware/auth.middleware";
import { validatorMiddleware } from "../middleware/validator.middleware";
import { CreateSalesRotationConfigurationDto, UpdateSalesRotationConfigurationDto } from "../dtos/sales.rotation.configurations.dto";

const router = Router();

const comissionsConfigController = new ComissionsConfigController(
  AppDataSource
);

/**
 * @swagger
 * /api/comissions/config/companies:
 *   post:
 *     summary: Crear una nueva empresa
 *     tags: [Empresas]
 *     description: Crea una nueva empresa en el sistema
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
 *                 description: Nombre de la empresa
 *               description:
 *                 type: string
 *                 description: Descripción de la empresa
 *           example:
 *             name: "Empresa ABC"
 *             description: "Descripción de la empresa ABC"
 *     responses:
 *       201:
 *         description: Empresa creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/companies",
  authenticateToken,
  validatorMiddleware(CreateCompanyDto, false) as RequestHandler,
  comissionsConfigController.createCompany
);
/**
 * @swagger
 * /api/comissions/config/companies/{id}:
 *   put:
 *     summary: Actualizar una empresa existente
 *     tags: [Empresas]
 *     description: Actualiza los datos de una empresa específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre actualizado de la empresa
 *               description:
 *                 type: string
 *                 description: Descripción actualizada de la empresa
 *           example:
 *             name: "Empresa ABC Actualizada"
 *             description: "Nueva descripción de la empresa ABC"
 *     responses:
 *       200:
 *         description: Empresa actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/companies/:id",
  authenticateToken,
  validatorMiddleware(UpdateCompanyDto, false) as RequestHandler,
  comissionsConfigController.updateCompany
);

/**
 * @swagger
 * /api/comissions/config/companies/{id}:
 *   delete:
 *     summary: Eliminar una empresa
 *     tags: [Empresas]
 *     description: Elimina una empresa específica del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa a eliminar
 *     responses:
 *       200:
 *         description: Empresa eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/companies/:id",
  authenticateToken,
  comissionsConfigController.deleteCompany
);

/**
 * @swagger
 * /api/comissions/config/companies/search:
 *   post:
 *     summary: Buscar empresas
 *     tags: [Empresas]
 *     description: Busca empresas en el sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para la paginación (opcional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados por página (opcional)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la empresa (opcional)
 *               description:
 *                 type: string
 *                 description: Descripción de la empresa (opcional)
 *           example:
 *             name: ''
 *             description: ''
 *     responses:
 *       200:
 *         description: Empresas encontradas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
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
 *                 total:
 *                   type: integer
 *                   description: Total de registros encontrados
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/companies/search",
  authenticateToken,
  comissionsConfigController.searchCompany
);
//Company Positions
/**
 * @swagger
 * /api/comissions/config/company-positions:
 *   post:
 *     tags:
 *       - Cargo Empresa
 *     summary: Crear un nuevo cargo en la empresa
 *     description: Crea un nuevo cargo asociado a una empresa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - name
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa
 *               name:
 *                 type: string
 *                 description: Nombre del cargo
 *               description:
 *                 type: string
 *                 description: Descripción del cargo (opcional)
 *               salaryBase:
 *                 type: number
 *                 format: decimal
 *                 description: Salario base del cargo (opcional)
 *               isStoreSize:
 *                 type: boolean
 *                 description: Indica si el cargo es un tamaño de tienda (opcional)
 *           example:
 *             companyId: 1
 *             name: "Gerente de Ventas"
 *             description: "Responsable del equipo de ventas"
 *             salaryBase: 2500.00
 *             isStoreSize: false
 *     responses:
 *       200:
 *         description: Cargo creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 companyPosition:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     salaryBase:
 *                       type: number
 *                     company:
 *                       type: object
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/company-positions",
  authenticateToken,
  validatorMiddleware(CreateCompanyPositionDto, false) as RequestHandler,
  comissionsConfigController.createCompanyPosition
);

/**
 * @swagger
 * /api/comissions/config/company-positions/{id}:
 *   put:
 *     tags:
 *       - Cargo Empresa
 *     summary: Actualizar un cargo existente
 *     description: Actualiza la información de un cargo existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cargo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa (opcional)
 *               name:
 *                 type: string
 *                 description: Nombre del cargo (opcional)
 *               description:
 *                 type: string
 *                 description: Descripción del cargo (opcional)
 *               salaryBase:
 *                 type: number
 *                 format: decimal
 *                 description: Salario base del cargo (opcional)
 *               isStoreSize:
 *                 type: boolean
 *                 description: Indica si el cargo es un tamaño de tienda (opcional)
 *           example:
 *             name: "Director de Ventas"
 *             description: "Responsable de la dirección de ventas"
 *             salaryBase: 3000.00
 *             isStoreSize: false
 *     responses:
 *       200:
 *         description: Cargo actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 companyPosition:
 *                   type: object
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/company-positions/:id",
  authenticateToken,
  validatorMiddleware(UpdateCompanyPositionDto, false) as RequestHandler,
  comissionsConfigController.updateCompanyPosition
);

/**
 * @swagger
 * /api/comissions/config/company-positions/{id}:
 *   delete:
 *     tags:
 *       - Cargo Empresa
 *     summary: Eliminar un cargo
 *     description: Elimina un cargo existente por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cargo a eliminar
 *     responses:
 *       200:
 *         description: Cargo eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/company-positions/:id",
  authenticateToken,
  comissionsConfigController.deleteCompanyPosition
);

/**
 * @swagger
 * /api/comissions/config/company-positions/search:
 *   post:
 *     tags:
 *       - Cargo Empresa
 *     summary: Buscar cargos
 *     description: Busca cargos según los filtros proporcionados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa (opcional)
 *               name:
 *                 type: string
 *                 description: Nombre del cargo (opcional)
 *               description:
 *                 type: string
 *                 description: Descripción del cargo (opcional)
 *               isStoreSize:
 *                 type: boolean
 *                 description: Indica si el cargo es un tamaño de tienda (opcional)
 *           example:
 *             companyId: 1
 *             name: "Gerente"
 *             description: "Descripción del cargo"
 *             isStoreSize: false
 *     responses:
 *       200:
 *         description: Cargos encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       company:
 *                         type: object
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       salaryBase:
 *                         type: number
 *                 total:
 *                   type: integer
 *                   description: Total de registros encontrados
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/company-positions/search",
  authenticateToken,
  validatorMiddleware(CompanyPositionSearchDto, false) as RequestHandler,
  comissionsConfigController.searchCompanyPosition
);

// Employees
/**
 * @swagger
 * /api/comissions/config/employees:
 *   post:
 *     tags:
 *       - Empleados
 *     summary: Crear un nuevo empleado
 *     description: Crea un nuevo empleado en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - companyPositionId
 *               - code
 *               - name
 *               - documentNumber
 *               - city
 *               - dateInitialContract
 *               - salary
 *               - variableSalary
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa
 *               companyPositionId:
 *                 type: integer
 *                 description: ID del cargo
 *               code:
 *                 type: string
 *                 description: Código del empleado
 *               name:
 *                 type: string
 *                 description: Nombre del empleado
 *               documentNumber:
 *                 type: string
 *                 description: Número de documento del empleado
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del empleado (opcional)
 *               phone:
 *                 type: string
 *                 description: Teléfono del empleado (opcional)
 *               city:
 *                 type: string
 *                 description: Ciudad del empleado
 *               dateInitialContract:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del contrato
 *               isActive:
 *                 type: boolean
 *                 description: Estado del empleado (opcional)
 *               supervisorId:
 *                 type: integer
 *                 description: ID del supervisor (opcional)
 *               salary:
 *                 type: number
 *                 description: Salario base del empleado
 *               variableSalary:
 *                 type: number
 *                 description: Salario variable del empleado
 *               section:
 *                 type: string
 *                 description: Sección del empleado (opcional)
 *               ceco:
 *                 type: string
 *                 description: Seco del empleado (opcional)
 *               descUniNego:
 *                 type: string
 *                 description: Unidad de Negocio del empleado (opcional)
 *               descDivision:
 *                 type: string
 *                 description: Área del empleado (opcional)
 *               descDepar:
 *                 type: string
 *                 description: Departamento del empleado (opcional)
 *               subDepar:
 *                 type: string
 *                 description: Subdepartamento del empleado (opcional)
 *               employeeType:
 *                 type: string
 *                 description: Tipo de empleado (opcional)
 *               month:
 *                 type: integer
 *                 description: Mes de la configuración (opcional)
 *               year:
 *                 type: integer
 *                 description: Año de la configuración (opcional)
 *           example:
 *             companyId: 1
 *             companyPositionId: 2
 *             code: "EMP001"
 *             name: "Juan Pérez"
 *             documentNumber: "12345678"
 *             email: "juan.perez@example.com"
 *             phone: "123456789"
 *             city: "Madrid"
 *             dateInitialContract: "2023-01-01"
 *             isActive: true
 *             supervisorId: 3
 *             salary: 2000
 *             variableSalary: 500
 *             section: "Sección 1"
 *             ceco: "Seco 1"
 *             descUniNego: "Unidad de Negocio 1"
 *             descDivision: "Área 1"
 *             descDepar: "Departamento 1"
 *             subDepar: "Subdepartamento 1"
 *             employeeType: "Tipo de empleado 1"
 *             month: 3
 *             year: 2023
 *     responses:
 *       200:
 *         description: Empleado creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 employee:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     code:
 *                       type: string
 *                     documentNumber:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     city:
 *                       type: string
 *                     dateInitialContract:
 *                       type: string
 *                       format: date
 *                     isActive:
 *                       type: boolean
 *                     salary:
 *                       type: number
 *                     variableSalary:
 *                       type: number
 *                     section:
 *                       type: string
 *                     descUniNego:
 *                       type: string
 *                     descDivision:
 *                       type: string
 *                     descDepar:
 *                       type: string
 *                     subDepar:
 *                       type: string
 *                     ceco:
 *                       type: string
 *                     employeeType:
 *                       type: string
 *                     company:
 *                       type: object
 *                     companyPosition:
 *                       type: object
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/employees",
  authenticateToken,
  validatorMiddleware(CreateEmployeeDto, false) as RequestHandler,
  comissionsConfigController.createEmployee
);

/**
 * @swagger
 * /api/comissions/config/employees/{id}:
 *   put:
 *     tags:
 *       - Empleados
 *     summary: Actualizar un empleado existente
 *     description: Actualiza la información de un empleado existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyPositionId:
 *                 type: integer
 *                 description: ID del cargo (opcional)
 *               code:
 *                 type: string
 *                 description: Código del empleado (opcional)
 *               name:
 *                 type: string
 *                 description: Nombre del empleado (opcional)
 *               documentNumber:
 *                 type: string
 *                 description: Número de documento del empleado (opcional)
 *               email:
 *                 type: string
 *                 description: Correo electrónico del empleado (opcional)
 *               phone:
 *                 type: string
 *                 description: Teléfono del empleado (opcional)
 *               city:
 *                 type: string
 *                 description: Ciudad del empleado (opcional)
 *               dateInitialContract:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del contrato (opcional)
 *               isActive:
 *                 type: boolean
 *                 description: Estado del empleado (opcional)
 *               supervisorId:
 *                 type: integer
 *                 description: ID del supervisor (opcional)
 *               salary:
 *                 type: number
 *                 description: Salario del empleado (opcional)
 *               variableSalary:
 *                 type: number
 *                 description: Salario variable del empleado (opcional)
 *               section:
 *                 type: string
 *                 description: Unidad de Negocio del empleado (opcional)
 *               ceco:
 *                 type: string
 *                 description: Seco del empleado (opcional)
 *               descUniNego:
 *                 type: string
 *                 description: Área del empleado (opcional)
 *               descDivision:
 *                 type: string
 *                 description: Departamento del empleado (opcional)
 *               descDepar:
 *                 type: string
 *                 description: Departamento del empleado (opcional)
 *               subDepar:
 *                 type: string
 *                 description: Subdepartamento del empleado (opcional)
 *               employeeType:
 *                 type: string
 *                 description: Tipo de empleado (opcional)
 *               month:
 *                 type: integer
 *                 description: Mes de la configuración (opcional)
 *               year:
 *                 type: integer
 *                 description: Año de la configuración (opcional)
 *           example:
 *             companyPositionId: 3
 *             code: "EMP002"
 *             name: "Juan Pérez Rodríguez"
 *             documentNumber: "12345678X"
 *             email: "juan.perez@example.com"
 *             phone: "612345678"
 *             city: "Barcelona"
 *             dateInitialContract: "2023-02-01"
 *             isActive: true
 *             supervisorId: 4
 *             salary: 2500
 *             variableSalary: 500
 *             section: "Sección 1"
 *             ceco: "Ceco 1"
 *             descUniNego: "Unidad de Negocio 1"
 *             descDivision: "Área 1"
 *             descDepar: "Departamento 1"
 *             subDepar: "Subdepartamento 1"
 *             employeeType: "Tipo de empleado 1"
 *             month: 3
 *             year: 2023
 *     responses:
 *       200:
 *         description: Empleado actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 employee:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     code:
 *                       type: string
 *                     documentNumber:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     city:
 *                       type: string
 *                     dateInitialContract:
 *                       type: string
 *                       format: date
 *                     isActive:
 *                       type: boolean
 *                     salary:
 *                       type: number
 *                     variableSalary:
 *                       type: number
 *                     section:
 *                       type: string
 *                     ceco:
 *                       type: string
 *                     descUniNego:
 *                       type: string
 *                     descDivision:
 *                       type: string
 *                     descDepar:
 *                       type: string
 *                     subDepar:
 *                       type: string
 *                     employeeType:
 *                       type: string
 *                     companyPosition:
 *                       type: object
 *                     month:
 *                       type: integer
 *                     year:
 *                       type: integer
 *       401:             
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/employees/:id",
  authenticateToken,
  validatorMiddleware(UpdateEmployeeDto, false) as RequestHandler,
  comissionsConfigController.updateEmployee
);

/**
 * @swagger
 * /api/comissions/config/employees/{id}:
 *   delete:
 *     tags:
 *       - Empleados
 *     summary: Eliminar un empleado
 *     description: Elimina un empleado existente del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado a eliminar
 *     responses:
 *       200:
 *         description: Empleado eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/employees/:id",
  authenticateToken,
  comissionsConfigController.deleteEmployee
);

/**   
 * @swagger
 * /api/comissions/config/employees/delete-by-company-id/{id}:
 *   delete:
 *     tags:
 *       - Empleados  
 *     summary: Eliminar empleados por ID de empresa
 *     description: Elimina todos los empleados de una empresa específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path   
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses: 
 *       200:
 *         description: Empleados eliminados correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor    
 */
router.delete(
  "/employees/delete-by-company-id/:id",
  authenticateToken,
  comissionsConfigController.deleteEmployeesByCompanyId
);


/**
 * @swagger
 * /api/comissions/config/employees/search:
 *   post:
 *     tags:
 *       - Empleados
 *     summary: Buscar empleados
 *     description: Busca empleados según los filtros proporcionados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: calculateDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para calcular los resultados (opcional)
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del empleado (opcional)
 *               companyId:
 *                 type: number
 *                 description: ID de la empresa (opcional)
 *               companyPositionId:
 *                 type: number
 *                 description: ID del cargo (opcional)
 *           example:
 *             name: "Juan"
 *             code: "EMP001"
 *             city: "Madrid"
 *             companyId: 1
 *             companyPositionId: 1
 *             
 *     responses:
 *       200:
 *         description: Empleados encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       company:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       companyPosition:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       code:
 *                         type: string
 *                       documentNumber:
 *                         type: string
 *                       name:
 *                         type: string
 *                       city:
 *                         type: string
 *                       dateInitialContract:
 *                         type: string
 *                         format: date
 *                       isActive:
 *                         type: boolean
 *                       supervisor:
 *                         type: object
 *  
 *                 total:
 *                   type: integer
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/employees/search",
  authenticateToken,
  validatorMiddleware(EmployeeSearchDto, false) as RequestHandler,
  comissionsConfigController.searchEmployee
);

/**
 * @swagger
 * /api/comissions/config/employees/filters/details:
 *   get:
 *     tags:
 *       - Empleados
 *     summary: Obtener detalles de filtros para empleados
 *     description: Obtiene detalles específicos para filtros de empleados (section, division, department, subDepartment).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *       - in: query
 *         name: companyPositionId
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID del cargo de la empresa
 *     responses:
 *       200:
 *         description: Detalles de filtros obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 section:
 *                   type: array
 *                   items:
 *                     type: string
 *                 division:
 *                   type: array
 *                   items:
 *                     type: string
 *                 department:
 *                   type: array
 *                   items:
 *                     type: string
 *                 subDepartment:
 *                   type: array
 *                   items:
 *                     type: string
 *             example:
 *               section: ["Ventas", "Producción"]
 *               division: ["Norte", "Sur"]
 *               department: ["Logística", "RRHH"]
 *               subDepartment: ["Interno", "Externo"]
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/employees/filters/details",
  authenticateToken,
  comissionsConfigController.findEmployeeFilters
);

/**
 * @swagger
 * /api/comissions/config/employees/filters:
 *   get:
 *     tags:
 *       - Empleados
 *     summary: Obtener valores únicos por columna  
 *     description: Obtiene valores únicos de una columna específica de los empleados, para area, section, sub_section, department, sub_department
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses:
 *       200:
 *         description: Valores únicos obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/employees/filters",
  authenticateToken,
  comissionsConfigController.findDistinctByIndex
);

// Commissions Configurations
/**
 * @swagger
 * /api/comissions/config/parameters:
 *   post:
 *     tags:
 *       - Configuraciones de Comisiones
 *     summary: Crear una nueva configuración de comisión
 *     description: Crea una nueva configuración de comisión en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - companyPositionId
 *               - name
 *               - isRuleCommission
 *               - version
 *               - noteVersion
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa
 *               companyPositionId:
 *                 type: integer
 *                 description: ID del cargo de la empresa
 *               name:
 *                 type: string
 *                 description: Nombre de la configuración
 *               description:
 *                 type: string
 *                 description: Descripción de la configuración (opcional)
 *               status:
 *                 type: boolean
 *                 description: Estado de la configuración (opcional, por defecto true)
 *               isRuleCommission:
 *                 type: boolean
 *                 description: Indica si la configuración es una regla de comisión (opcional, por defecto false)
 *               version:
 *                 type: string
 *                 description: Versión de la configuración (opcional)
 *               noteVersion:
 *                 type: string
 *                 description: Nota de la versión de la configuración (opcional)
 *           example:
 *             companyId: 1
 *             companyPositionId: 2
 *             name: "Comisión por ventas"
 *             description: "Configuración para comisiones por ventas mensuales"
 *             status: true
 *             isRuleCommission: true
 *             version: "1.0"
 *             noteVersion: "Nota de la versión 1.0"
 *     responses:
 *       200:
 *         description: Configuración de comisión creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 company:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: boolean
 *                     isRuleCommission:
 *                       type: boolean
 *                 companyPosition:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: boolean
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 isRuleCommission:
 *                   type: boolean
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
  "/parameters",
  authenticateToken,
  validatorMiddleware(
    CreateCommissionConfigurationDto,
    false
  ) as RequestHandler,
  comissionsConfigController.createCommissionConfiguration
);

/**
 * @swagger
 * /api/comissions/config/parameters/{id}:
 *   put:
 *     tags:
 *       - Configuraciones de Comisiones
 *     summary: Actualizar una configuración de comisión existente
 *     description: Actualiza la información de una configuración de comisión existente por su ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la configuración a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa (opcional)
 *               companyPositionId:
 *                 type: integer
 *                 description: ID del cargo de la empresa (opcional)
 *               name:
 *                 type: string
 *                 description: Nombre de la configuración (opcional)
 *               description:
 *                 type: string
 *                 description: Descripción de la configuración (opcional)
 *               status:
 *                 type: boolean
 *                 description: Estado de la configuración (opcional)
 *               isRuleCommission:
 *                 type: boolean
 *                 description: Indica si la configuración es una regla de comisión (opcional)
 *               version:
 *                 type: string
 *                 description: Versión de la configuración (opcional)
 *               noteVersion:
 *                 type: string
 *                 description: Nota de la versión de la configuración (opcional)
 *           example:
 *             name: "Comisión por ventas actualizada"
 *             description: "Configuración actualizada para comisiones por ventas"
 *             status: false
 *             isRuleCommission: true
 *             companyId: 1
 *             companyPositionId: 2
 *             version: "1.0"
 *             noteVersion: "Nota de la versión 1.0"
 *     responses:
 *       200:
 *         description: Configuración de comisión actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 company:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: boolean
 *                     isRuleCommission:
 *                       type: boolean
 *                 companyPosition:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: boolean
 *                     isRuleCommission:
 *                       type: boolean
 *                     version:
 *                       type: string
 *                     noteVersion:
 *                       type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 isRuleCommission:
 *                   type: boolean
 *       400:
 *         description: Datos de entrada inválidos o ID no encontrado.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.put(
  "/parameters/:id",
  authenticateToken,
  validatorMiddleware(
    UpdateCommissionConfigurationDto,
    false
  ) as RequestHandler,
  comissionsConfigController.updateCommissionConfiguration
);

/**
 * @swagger
 * /api/comissions/config/parameters/{id}:
 *   delete:
 *     tags:
 *       - Configuraciones de Comisiones
 *     summary: Eliminar una configuración de comisión
 *     description: Elimina una configuración de comisión existente por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la configuración a eliminar
 *     responses:
 *       200:
 *         description: Configuración de comisión eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Configuración de comisión eliminada correctamente.
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Configuración de comisión no encontrada.
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/parameters/:id",
  authenticateToken,
  comissionsConfigController.deleteCommissionConfiguration
);

/**
 * @swagger
 * /api/comissions/config/parameters/search:
 *   post:
 *     tags:
 *       - Configuraciones de Comisiones
 *     summary: Buscar configuraciones de comisiones con paginación
 *     description: Busca configuraciones de comisiones según los criterios proporcionados y devuelve resultados paginados.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Límite de resultados por página
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID de la configuración (opcional)
 *               name:
 *                 type: string
 *                 description: Nombre de la configuración (opcional, búsqueda parcial)
 *               status:
 *                 type: boolean
 *                 description: Estado de la configuración (opcional)
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa asociada (opcional)
 *               companyPositionId:
 *                 type: integer
 *                 description: ID del cargo asociado (opcional)
 *               version:
 *                 type: string
 *                 description: Versión de la configuración (opcional)
 *               noteVersion:
 *                 type: string
 *                 description: Nota de la versión de la configuración (opcional)
 *           example:
 *             name: "Ventas"
 *             status: true
 *             companyId: 1
 *             companyPositionId: 2
 *             id: 1
 *     responses:
 *       200:
 *         description: Configuraciones de comisiones encontradas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       company:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           status:
 *                             type: boolean
 *                       companyPosition:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           status:
 *                             type: boolean
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       version:
 *                         type: string
 *                       noteVersion:
 *                         type: string
 *                 total:
 *                   type: integer
 *                   description: Total de registros encontrados que coinciden con la búsqueda
 *       400:
 *         description: Datos de entrada inválidos (e.g., tipo de dato incorrecto en query params o body).
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.post(
  "/parameters/search",
  authenticateToken,
  validatorMiddleware(
    CommissionConfigurationSearchDto,
    false
  ) as RequestHandler,
  comissionsConfigController.searchCommissionConfiguration
);

// Categoria de parametro
/**
 * @swagger
 * /api/comissions/config/parameter-categories:
 *   post:
 *     tags:
 *       - Categorías de Parámetros
 *     summary: Crear una nueva categoría de parámetro
 *     description: Crea una nueva categoría de parámetro en el sistema
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
 *                 description: Nombre de la categoría de parámetro
 *               description:
 *                 type: string
 *                 description: Descripción de la categoría de parámetro (opcional)
 *           example:
 *             name: "Categoría de Prueba"
 *             description: "Descripción de la categoría de prueba"
 *     responses:
 *       200:
 *         description: Categoría de parámetro creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 parameterCategory:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/parameter-categories",
  authenticateToken,
  validatorMiddleware(CreateParameterCategoryDto, false) as RequestHandler,
  comissionsConfigController.createParameterCategory
);

/**
 * @swagger
 * /api/comissions/config/parameter-categories/{id}:
 *   put:
 *     tags:
 *       - Categorías de Parámetros
 *     summary: Actualizar una categoría de parámetro
 *     description: Actualiza una categoría de parámetro existente por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría de parámetro a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre de la categoría de parámetro
 *               description:
 *                 type: string
 *                 description: Nueva descripción de la categoría de parámetro (opcional)
 *           example:
 *             name: "Categoría Actualizada"
 *             description: "Nueva descripción de la categoría"
 *     responses:
 *       200:
 *         description: Categoría de parámetro actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 parameterCategory:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/parameter-categories/:id",
  authenticateToken,
  validatorMiddleware(UpdateParameterCategoryDto, false) as RequestHandler,
  comissionsConfigController.updateParameterCategory
);

/**
 * @swagger
 * /api/comissions/config/parameter-categories/{id}:
 *   delete:
 *     tags:
 *       - Categorías de Parámetros
 *     summary: Eliminar una categoría de parámetro
 *     description: Elimina una categoría de parámetro existente por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría de parámetro a eliminar
 *     responses:
 *       200:
 *         description: Categoría de parámetro eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/parameter-categories/:id",
  authenticateToken,
  comissionsConfigController.deleteParameterCategory
);

/**
 * @swagger
 * /api/comissions/config/parameter-categories/search:
 *   post:
 *     tags:
 *       - Categorías de Parámetros
 *     summary: Buscar categorías de parámetros
 *     description: Busca categorías de parámetros según los criterios proporcionados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Límite de resultados por página
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría (opcional)
 *               description:
 *                 type: string
 *                 description: Descripción de la categoría (opcional)
 *           example:
 *             name: "Categoría"
 *     responses:
 *       200:
 *         description: Categorías de parámetros encontradas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                 total:
 *                   type: integer
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/parameter-categories/search",
  authenticateToken,
  validatorMiddleware(ParameterCategorySearchDto, false) as RequestHandler,
  comissionsConfigController.searchParameterCategory
);

// Parametros de comision
/**
 * @swagger
 * /api/comissions/config/parameters/commission:
 *   post:
 *     tags:
 *       - Parámetros de Comisión
 *     summary: Crear un nuevo parámetro de comisión
 *     description: Crea un nuevo parámetro de comisión en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commissionConfigurationId
 *               - categoryId
 *               - value
 *             properties:
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de comisión
 *               categoryId:
 *                 type: integer
 *                 description: ID de la categoría de parámetro
 *               value:
 *                 type: string
 *                 description: Valor del parámetro
 *               description:
 *                 type: string
 *                 description: Descripción del parámetro (opcional)
 *               status:
 *                 type: boolean
 *                 description: Estado del parámetro (opcional)
 *               monthsCondition:
 *                 type: integer
 *                 description: Condición de meses (opcional)
 *           example:
 *             commissionConfigurationId: 1
 *             categoryId: 1
 *             value: "0.05"
 *             description: "Tasa de comisión estándar"
 *             status: true
 *             monthsCondition: 12
 *     responses:
 *       200:
 *         description: Parámetro de comisión creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 commissionParameter:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     value:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: boolean
 *                     monthsCondition:
 *                       type: integer
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/parameters/commission",
  authenticateToken,
  validatorMiddleware(CreateCommissionParameterDto, false) as RequestHandler,
  comissionsConfigController.createCommissionParameter
);

/**
 * @swagger
 * /api/comissions/config/parameters/commission/{id}:
 *   put:
 *     tags:
 *       - Parámetros de Comisión
 *     summary: Actualizar un parámetro de comisión
 *     description: Actualiza un parámetro de comisión existente por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del parámetro de comisión a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de comisión (opcional)
 *               categoryId:
 *                 type: integer
 *                 description: ID de la categoría de parámetro (opcional)
 *               value:
 *                 type: string
 *                 description: Valor del parámetro (opcional)
 *               description:
 *                 type: string
 *                 description: Descripción del parámetro (opcional)
 *               status:
 *                 type: boolean
 *                 description: Estado del parámetro (opcional)
 *               monthsCondition:
 *                 type: integer
 *                 description: Condición de meses (opcional)
 *           example:
 *             commissionConfigurationId: 1
 *             categoryId: 1
 *             value: "0.07"
 *             description: "Tasa de comisión actualizada"
 *             status: true
 *             monthsCondition: 12
 *     responses:
 *       200:
 *         description: Parámetro de comisión actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 commissionParameter:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     value:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: boolean
 *                     monthsCondition:
 *                       type: integer
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/parameters/commission/:id",
  authenticateToken,
  validatorMiddleware(UpdateCommissionParameterDto, false) as RequestHandler,
  comissionsConfigController.updateCommissionParameter
);

/**
 * @swagger
 * /api/comissions/config/parameters/commission/{id}:
 *   delete:
 *     tags:
 *       - Parámetros de Comisión
 *     summary: Eliminar un parámetro de comisión
 *     description: Elimina un parámetro de comisión existente por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del parámetro de comisión a eliminar
 *     responses:
 *       200:
 *         description: Parámetro de comisión eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/parameters/commission/:id",
  authenticateToken,
  comissionsConfigController.deleteCommissionParameter
);

/**
 * @swagger
 * /api/comissions/config/parameters/commission/search:
 *   post:
 *     tags:
 *       - Parámetros de Comisión
 *     summary: Buscar parámetros de comisión
 *     description: Busca parámetros de comisión según los criterios especificados con paginación.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Límite de resultados por página.
 *     requestBody:
 *       required: false
 *       description: Criterios de búsqueda opcionales para filtrar los parámetros de comisión.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: Filtrar por ID de la configuración de comisión.
 *                 example: 1
 *               categoryId:
 *                 type: integer
 *                 description: Filtrar por ID de la categoría de parámetro.
 *                 example: 2
 *               value:
 *                 type: string
 *                 description: Filtrar por valor del parámetro (búsqueda parcial).
 *                 example: "Specific Value"
 *               description:
 *                 type: string
 *                 description: Filtrar por descripción del parámetro (búsqueda parcial).
 *                 example: "Parameter Description"
 *               status:
 *                 type: boolean
 *                 description: Filtrar por estado del parámetro.
 *                 example: true
 *           example:
 *             status: true
 *             categoryId: 3
 *             commissionConfigurationId: 1
 *             value: "Specific Value"
 *             description: "Parameter Description"
 *     responses:
 *       200:
 *         description: Parámetros de comisión encontrados exitosamente. Devuelve una lista paginada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   description: Lista de parámetros de comisión encontrados.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID único del parámetro de comisión.
 *                       commissionConfiguration:
 *                         type: object
 *                         description: Detalles de la configuración de comisión asociada.
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string # Asumiendo que tiene un nombre
 *                       categoryId:
 *                         type: object
 *                         description: Detalles de la categoría del parámetro asociada.
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string # Asumiendo que tiene un nombre
 *                       value:
 *                         type: string
 *                         description: Valor del parámetro.
 *                       description:
 *                         type: string
 *                         description: Descripción opcional del parámetro.
 *                       status:
 *                         type: boolean
 *                         description: Estado del parámetro (activo/inactivo).
 *                       monthsCondition:
 *                         type: integer
 *                         description: Condición de meses.
 *                 total:
 *                   type: integer
 *                   description: Número total de parámetros de comisión que coinciden con los criterios de búsqueda.
 *       400:
 *         description: Datos de entrada inválidos (e.g., tipo de dato incorrecto en el body o query params).
 *       401:
 *         description: No autorizado. Token JWT inválido o ausente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post(
  "/parameters/commission/search",
  authenticateToken,
  validatorMiddleware(CommissionParameterSearchDto, false) as RequestHandler, // Valida el body
  comissionsConfigController.searchCommissionParameter
);

// Reglas de comision
/**
 * @swagger
 * /api/comissions/config/rules/commission:
 *   post:
 *     summary: Crear una nueva regla de comisión
 *     tags: [Reglas de Comisión]
 *     description: Crea una nueva regla de comisión en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commissionConfigurationId
 *               - minComplace
 *               - maxComplace
 *               - commissionPercentage
 *               - boneExtra
 *             properties:
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de comisión
 *               minComplace:
 *                 type: number
 *                 format: float
 *                 description: Valor mínimo de cumplimiento
 *               maxComplace:
 *                 type: number
 *                 format: float
 *                 description: Valor máximo de cumplimiento
 *               commissionPercentage:
 *                 type: number
 *                 format: float
 *                 description: Porcentaje de comisión
 *               boneExtra:
 *                 type: number
 *                 format: float
 *                 description: Bono extra
 *               parameterLinesId:
 *                 type: integer
 *                 description: ID de la línea de parámetro (opcional)
 *           example:
 *             commissionConfigurationId: 1
 *             minComplace: 10
 *             maxComplace: 20
 *             commissionPercentage: 5
 *             boneExtra: 100
 *             parameterLinesId: 1
 *     responses:
 *       200:
 *         description: Regla de comisión creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Regla de comisión creada correctamente"
 *                 commissionRule:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     commissionConfiguration:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                     minComplace:
 *                       type: number
 *                       format: float
 *                     maxComplace:
 *                       type: number
 *                       format: float
 *                     commissionPercentage:
 *                       type: number
 *                       format: float
 *                     boneExtra:
 *                       type: number
 *                       format: float
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     productLine:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/rules/commission",
  authenticateToken,
  validatorMiddleware(CreateCommissionRuleDto, false) as RequestHandler,
  comissionsConfigController.createCommissionRule
);

/**
 * @swagger
 * /api/comissions/config/rules/commission/batch:
 *   post:
 *     summary: Crear múltiples reglas de comisión
 *     tags: [Reglas de Comisión]
 *     description: Crea múltiples reglas de comisión en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - commissionConfigurationId
 *                 - minComplace
 *                 - maxComplace
 *                 - commissionPercentage
 *                 - boneExtra
 *               properties:
 *                 commissionConfigurationId:
 *                   type: integer
 *                   description: ID de la configuración de comisión
 *                 minComplace:
 *                   type: number
 *                   format: float
 *                 maxComplace:
 *                   type: number
 *                   format: float
 *                 commissionPercentage:
 *                   type: number
 *                   format: float
 *                 boneExtra:
 *                   type: number
 *                   format: float
 *                 parameterLinesId:
 *                   type: integer
 *                   description: ID de la línea de parámetro (opcional)
 *           example:
 *             - commissionConfigurationId: 1
 *               minComplace: 10
 *               maxComplace: 20
 *               commissionPercentage: 5
 *               boneExtra: 100
 *               parameterLinesId: 1
 *     responses:
 *       200:
 *         description: Reglas creadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reglas de comisión creadas correctamente"
 *                 commissionRules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       commissionConfiguration:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       minComplace:
 *                         type: number
 *                       maxComplace:
 *                         type: number
 *                       commissionPercentage:
 *                         type: number
 *                       boneExtra:
 *                         type: number
 *                       productLine:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  '/rules/commission/batch',
  authenticateToken,
  comissionsConfigController.createCommissionRulesBatch
);

/**
 * @swagger
 * /api/comissions/config/rules/commission/batch:
 *   put:
 *     summary: Actualizar múltiples reglas de comisión
 *     tags: [Reglas de Comisión]
 *     description: Actualizar múltiples reglas de comisión en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - id
 *                 - commissionConfigurationId
 *                 - minComplace
 *                 - maxComplace
 *                 - commissionPercentage
 *                 - boneExtra
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de la regla de comisión
 *                 commissionConfigurationId:
 *                   type: integer
 *                   description: ID de la configuración de comisión
 *                 minComplace:
 *                   type: number
 *                   format: float
 *                 maxComplace:
 *                   type: number
 *                   format: float
 *                 commissionPercentage:
 *                   type: number
 *                   format: float
 *                 boneExtra:
 *                   type: number
 *                   format: float
 *                 parameterLinesId:
 *                   type: integer
 *                   description: ID de la línea de parámetro (opcional)
 *           example:
 *             - id: 1
 *               commissionConfigurationId: 1
 *               minComplace: 10
 *               maxComplace: 20
 *               commissionPercentage: 5
 *               boneExtra: 100
 *               parameterLinesId: 1
 *     responses:
 *       200:
 *         description: Reglas de comisión actualizadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reglas de comisión actualizadas correctamente"
 *                 commissionRules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       commissionConfiguration:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       minComplace:
 *                         type: number
 *                       maxComplace:
 *                         type: number
 *                       commissionPercentage:
 *                         type: number
 *                       boneExtra:
 *                         type: number
 *                       productLine:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.put(
  '/rules/commission/batch',
  authenticateToken,
  comissionsConfigController.updateCommissionRulesBatch
);

/**
 * @swagger
 * /api/comissions/config/rules/commission/{id}:
 *   put:
 *     summary: Actualizar una regla de comisión
 *     tags: [Reglas de Comisión]
 *     description: Actualiza una regla de comisión existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la regla de comisión a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de comisión (opcional)
 *               minComplace:
 *                 type: number
 *                 format: float
 *                 description: Valor mínimo de cumplimiento (opcional)
 *               maxComplace:
 *                 type: number
 *                 format: float
 *                 description: Valor máximo de cumplimiento (opcional)
 *               commissionPercentage:
 *                 type: number
 *                 format: float
 *                 description: Porcentaje de comisión (opcional)
 *               boneExtra:
 *                 type: number
 *                 format: float
 *                 description: Bono extra (opcional)
 *               parameterLinesId:
 *                 type: integer
 *                 description: ID de la línea de parámetro (opcional)
 *           example:
 *             commissionConfigurationId: 2
 *             minComplace: 80
 *             maxComplace: 100
 *             commissionPercentage: 7.5
 *             boneExtra: 150
 *             parameterLinesId: 1
 *     responses:
 *       200:
 *         description: Regla de comisión actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Regla de comisión actualizada correctamente"
 *                 commissionRule:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     commissionConfiguration:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                     minComplace:
 *                       type: number
 *                       format: float
 *                     maxComplace:
 *                       type: number
 *                       format: float
 *                     commissionPercentage:
 *                       type: number
 *                       format: float
 *                     boneExtra:
 *                       type: number
 *                       format: float
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     parameterLine:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Regla de comisión no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/rules/commission/:id",
  authenticateToken,
  validatorMiddleware(UpdateCommissionRuleDto, false) as RequestHandler,
  comissionsConfigController.updateCommissionRule
);

/**
 * @swagger
 * /api/comissions/config/rules/commission/{id}:
 *   delete:
 *     summary: Eliminar una regla de comisión
 *     tags: [Reglas de Comisión]
 *     description: Elimina una regla de comisión existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la regla de comisión a eliminar
 *     responses:
 *       200:
 *         description: Regla de comisión eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Regla de comisión eliminada correctamente"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Regla de comisión no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/rules/commission/:id",
  authenticateToken,
  comissionsConfigController.deleteCommissionRule
);

/**
 * @swagger
 * /api/comissions/config/rules/commission/search:
 *   post:
 *     summary: Buscar reglas de comisión
 *     tags: [Reglas de Comisión]
 *     description: Busca reglas de comisión según los criterios especificados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de comisión (opcional)
 *               minComplace:
 *                 type: number
 *                 format: float
 *                 description: Valor mínimo de cumplimiento (opcional)
 *               maxComplace:
 *                 type: number
 *                 format: float
 *                 description: Valor máximo de cumplimiento (opcional)
 *               commissionPercentage:
 *                 type: number
 *                 format: float
 *                 description: Porcentaje de comisión (opcional)
 *               boneExtra:
 *                 type: number
 *                 format: float
 *                 description: Bono extra (opcional)
 *               parameterLinesId:
 *                 type: integer
 *                 description: ID de la línea de parámetro (opcional)
 *           example:
 *             commissionConfigurationId: 1
 *             minComplace: 50
 *             maxComplace: 100
 *             commissionPercentage: 5
 *             boneExtra: 2
 *             parameterLinesId: 1
 *     responses:
 *       200:
 *         description: Reglas de comisión encontradas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       commissionConfiguration:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       minComplace:
 *                         type: number
 *                         format: float
 *                       maxComplace:
 *                         type: number
 *                         format: float
 *                       commissionPercentage:
 *                         type: number
 *                         format: float
 *                       boneExtra:
 *                         type: number
 *                         format: float
 *                       parameterLine:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                 total:
 *                   type: integer
 *                   description: Número total de reglas de comisión encontradas
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/rules/commission/search",
  authenticateToken,
  validatorMiddleware(CommissionRuleSearchDto, false) as RequestHandler,
  comissionsConfigController.searchCommissionRule
);

// Lineas de producto
/**
 * @swagger
 * /api/comissions/config/product-lines/commission:
 *   post:
 *     summary: Crear una nueva línea de producto
 *     tags: [Líneas de Producto]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commissionConfigurationId
 *               - parameterLineId
 *               - commissionWeight
 *               - goalRotation
 *               - minSaleValue
 *               - maxSaleValue
 *             properties:
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de comisión
 *               parameterLineId:
 *                 type: integer
 *                 description: ID de la línea de parámetro
 *               commissionWeight:
 *                 type: number
 *                 minimum: 0
 *                 description: Peso de comisión
 *               goalRotation:
 *                 type: number
 *                 minimum: 0
 *                 description: Meta de rotación
 *               minSaleValue:
 *                 type: number
 *                 minimum: 0
 *                 description: Valor mínimo de venta
 *               maxSaleValue:
 *                 type: number
 *                 minimum: 0
 *                 description: Valor máximo de venta
 *             example:
 *               commissionConfigurationId: 1
 *               parameterLineId: 1
 *               commissionWeight: 10
 *               goalRotation: 10
 *               minSaleValue: 1000
 *               maxSaleValue: 10000
 *     responses:
 *       200:
 *         description: Línea de producto creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 productLine:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     commissionConfiguration:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                     parameterLine:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                     commissionWeight:
 *                       type: number
 *                     goalRotation:
 *                       type: number
 *                     minSaleValue:
 *                       type: number
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/product-lines/commission",
  authenticateToken,
  validatorMiddleware(CreateProductLineDto, false) as RequestHandler,
  comissionsConfigController.createProductLine
);

/**
 * @swagger
 * /api/comissions/config/product-lines/commission/{id}:
 *   put:
 *     summary: Actualizar una línea de producto existente
 *     tags: [Líneas de Producto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la línea de producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de comisión (Opcional)
 *               parameterLineId:
 *                 type: integer
 *                 description: ID de la línea de parámetro (Opcional)
 *               commissionWeight:
 *                 type: number
 *                 minimum: 0
 *                 description: Peso de comisión (Opcional)
 *               goalRotation:
 *                 type: number
 *                 minimum: 0
 *                 description: Meta de rotación (Opcional)
 *               minSaleValue:
 *                 type: number
 *                 minimum: 0
 *                 description: Valor mínimo de venta (Opcional)
 *               maxSaleValue:
 *                 type: number
 *                 minimum: 0
 *                 description: Valor máximo de venta (Opcional)
 *             example:
 *               commissionConfigurationId: 1
 *               parameterLineId: 1
 *               commissionWeight: 10
 *               goalRotation: 10
 *               minSaleValue: 1000
 *               maxSaleValue: 10000
 *     responses:
 *       200:
 *         description: Línea de producto actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 productLine:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     commissionConfiguration:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                     parameterLine:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                     commissionWeight:
 *                       type: number
 *                     goalRotation:
 *                       type: number
 *                     minSaleValue:
 *                       type: number
 *                     maxSaleValue:
 *                       type: number
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/product-lines/commission/:id",
  authenticateToken,
  validatorMiddleware(UpdateProductLineDto, true) as RequestHandler, // skipMissingProperties set to true for partial updates
  comissionsConfigController.updateProductLine
);

/**
 * @swagger
 * /api/comissions/config/product-lines/commission/{id}:
 *   delete:
 *     summary: Eliminar una línea de producto
 *     tags: [Líneas de Producto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la línea de producto a eliminar
 *     responses:
 *       200:
 *         description: Línea de producto eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/product-lines/commission/:id",
  authenticateToken,
  comissionsConfigController.deleteProductLine
);

/**
 * @swagger
 * /api/comissions/config/product-lines/commission/search:
 *   post:
 *     summary: Buscar líneas de producto
 *     tags: [Líneas de Producto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Límite de resultados por página
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de comisión
 *               parameterLineId:
 *                 type: integer
 *                 description: ID de la línea de parámetro
 *               commissionWeight:
 *                 type: number
 *                 description: Peso de comisión
 *               goalRotation:
 *                 type: number
 *                 description: Meta de rotación
 *               minSaleValue:
 *                 type: number
 *                 description: Valor mínimo de venta
 *               maxSaleValue:
 *                 type: number
 *                 description: Valor máximo de venta
 *     responses:
 *       200:
 *         description: Líneas de producto encontradas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       commissionConfiguration:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       parameterLine:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       commissionWeight:
 *                         type: number
 *                       goalRotation:
 *                         type: number
 *                       minSaleValue:
 *                         type: number
 *                       maxSaleValue:
 *                         type: number
 *                 total:
 *                   type: integer
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/product-lines/commission/search",
  authenticateToken,
  validatorMiddleware(ProductLineSearchDto, false) as RequestHandler,
  comissionsConfigController.searchProductLine
);
// Meta mensual
/**
 * @swagger
 * /api/comissions/config/monthly-goals:
 *   post:
 *     tags:
 *       - Metas Mensuales
 *     summary: Crear una nueva meta mensual
 *     description: Crea una nueva meta mensual para un cargo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyPositionId
 *               - productLineId
 *               - monthStart
 *               - goalValue
 *             properties:
 *               companyPositionId:
 *                 type: integer
 *                 description: ID del cargo
 *               productLineId:
 *                 type: integer
 *                 description: ID de la línea de producto
 *               monthStart:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio de la meta
 *               monthEnd:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin de la meta
 *               goalValue:
 *                 type: number
 *                 description: Valor de la meta
 *     responses:
 *       200:
 *         description: Meta mensual creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 companyPosition:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 productLine:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 monthStart:
 *                   type: string
 *                   format: date
 *                 monthEnd:
 *                   type: string
 *                   format: date
 *                 goalValue:
 *                   type: number
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/monthly-goals",
  authenticateToken,
  validatorMiddleware(CreateMonthlyGoalDto, false) as RequestHandler,
  comissionsConfigController.createMonthlyGoal
);

/**
 * @swagger
 * /api/comissions/config/monthly-goals/{id}:
 *   put:
 *     tags:
 *       - Metas Mensuales
 *     summary: Actualizar una meta mensual
 *     description: Actualiza una meta mensual existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la meta mensual
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyPositionId:
 *                 type: integer
 *                 description: ID del cargo
 *               productLineId:
 *                 type: integer
 *                 description: ID de la línea de producto
 *               monthStart:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio de la meta
 *               monthEnd:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin de la meta
 *               goalValue:
 *                 type: number
 *                 description: Valor de la meta
 *     responses:
 *       200:
 *         description: Meta mensual actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 companyPosition:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 productLine:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 monthStart:
 *                   type: string
 *                   format: date
 *                 monthEnd:
 *                   type: string
 *                   format: date
 *                 goalValue:
 *                   type: number
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/monthly-goals/:id",
  authenticateToken,
  validatorMiddleware(UpdateMonthlyGoalDto, false) as RequestHandler,
  comissionsConfigController.updateMonthlyGoal
);

/**
 * @swagger
 * /api/comissions/config/monthly-goals/{id}:
 *   delete:
 *     tags:
 *       - Metas Mensuales
 *     summary: Eliminar una meta mensual
 *     description: Elimina una meta mensual existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la meta mensual
 *     responses:
 *       200:
 *         description: Meta mensual eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/monthly-goals/:id",
  authenticateToken,
  comissionsConfigController.deleteMonthlyGoal
);

/**
 * @swagger
 * /api/comissions/config/monthly-goals/search:
 *   post:
 *     tags:
 *       - Metas Mensuales
 *     summary: Buscar metas mensuales
 *     description: Busca metas mensuales según los criterios especificados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Límite de resultados por página
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyPositionId:
 *                 type: integer
 *                 description: ID del cargo
 *               productLineId:
 *                 type: integer
 *                 description: ID de la línea de producto
 *               monthStart:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio de la meta
 *               monthEnd:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin de la meta
 *     responses:
 *       200:
 *         description: Metas mensuales encontradas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       companyPosition:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       productLine:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       monthStart:
 *                         type: string
 *                         format: date
 *                       monthEnd:
 *                         type: string
 *                         format: date
 *                       goalValue:
 *                         type: number
 *                 total:
 *                   type: integer
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/monthly-goals/search",
  authenticateToken,
  validatorMiddleware(MonthlyGoalSearchDto, false) as RequestHandler,
  comissionsConfigController.searchMonthlyGoal
);

// Resultados Mensuales
/**
 * @swagger
 * /api/comissions/config/monthly-results:
 *   post:
 *     tags:
 *       - Resultados Mensuales
 *     summary: Crear un nuevo resultado mensual
 *     description: Crea un nuevo resultado mensual para un empleado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - productLine
 *               - month
 *               - saleValue
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: ID del empleado
 *               productLine:
 *                 type: string
 *                 description: Línea de producto
 *               month:
 *                 type: string
 *                 format: date
 *                 description: Mes del resultado
 *               saleValue:
 *                 type: number
 *                 description: Valor de venta
 *               compliance:
 *                 type: number
 *                 description: Cumplimiento
 *               productivity:
 *                 type: number
 *                 description: Productividad
 *               bonusApplies:
 *                 type: boolean
 *                 description: Indica si aplica bono
 *               commissionAmount:
 *                 type: number
 *                 description: Monto de comisión
 *               observations:
 *                 type: string
 *                 description: Observaciones
 *           example:
 *             employeeId: 1
 *             productLine: "Línea A"
 *             month: "2024-03-01"
 *             saleValue: 5000
 *             compliance: 95
 *             productivity: 90
 *             bonusApplies: true
 *             commissionAmount: 500
 *             observations: "Buen desempeño"
 *     responses:
 *       201:
 *         description: Resultado mensual creado correctamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 */
router.post(
  "/monthly-results",
  authenticateToken,
  validatorMiddleware(CreateMonthlyResultDto, false) as RequestHandler,
  comissionsConfigController.createMonthlyResult
);

/**
 * @swagger
 * /api/comissions/config/monthly-results/{id}:
 *   put:
 *     tags:
 *       - Resultados Mensuales
 *     summary: Actualizar un resultado mensual
 *     description: Actualiza un resultado mensual existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del resultado mensual
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: number
 *                 description: ID del empleado
 *               month:
 *                 type: string
 *                 format: date
 *                 description: Mes del resultado
 *               productLine:
 *                 type: string
 *                 description: Línea de producto
 *               saleValue:
 *                 type: number
 *                 description: Valor de venta
 *               compliance:
 *                 type: number
 *                 description: Cumplimiento
 *               productivity:
 *                 type: number
 *                 description: Productividad
 *               bonusApplies:
 *                 type: boolean
 *                 description: Indica si aplica bono
 *               commissionAmount:
 *                 type: number
 *                 description: Monto de comisión
 *               observations:
 *                 type: string
 *                 description: Observaciones
 *           example:
 *             employeeId: 1
 *             month: "2024-03-01"
 *             productLine: "Línea A"
 *             saleValue: 6000
 *             compliance: 98
 *             productivity: 92
 *             bonusApplies: true
 *             commissionAmount: 600
 *             observations: "Actualización de desempeño"
 *     responses:
 *       200:
 *         description: Resultado mensual actualizado correctamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 */
router.put(
  "/monthly-results/:id",
  authenticateToken,
  validatorMiddleware(UpdateMonthlyResultDto, false) as RequestHandler,
  comissionsConfigController.updateMonthlyResult
);

/**
 * @swagger
 * /api/comissions/config/monthly-results/{id}:
 *   delete:
 *     tags:
 *       - Resultados Mensuales
 *     summary: Eliminar un resultado mensual
 *     description: Elimina un resultado mensual existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del resultado mensual
 *     responses:
 *       204:
 *         description: Resultado mensual eliminado correctamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 */
router.delete(
  "/monthly-results/:id",
  authenticateToken,
  comissionsConfigController.deleteMonthlyResult
);

/**
 * @swagger
 * /api/comissions/config/monthly-results/search:
 *   post:
 *     tags:
 *       - Resultados Mensuales
 *     summary: Buscar resultados mensuales
 *     description: Busca resultados mensuales según los criterios especificados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados por página
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: ID del empleado
 *               month:
 *                 type: string
 *                 format: date
 *                 description: Mes del resultado
 *               productLine:
 *                 type: string
 *                 description: Línea de producto
 *               minSaleValue:
 *                 type: number
 *                 description: Valor mínimo de venta
 *               maxSaleValue:
 *                 type: number
 *                 description: Valor máximo de venta
 *               bonusApplies:
 *                 type: boolean
 *                 description: Indica si aplica bono
 *           example:
 *             employeeId: 1
 *             month: "2024-03-01"
 *             productLine: "Línea A"
 *     responses:
 *       200:
 *         description: Resultados mensuales encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       employee:
 *                         type: object
 *                       productLine:
 *                         type: string
 *                       month:
 *                         type: string
 *                         format: date
 *                       saleValue:
 *                         type: number
 *                       compliance:
 *                         type: number
 *                       productivity:
 *                         type: number
 *                       bonusApplies:
 *                         type: boolean
 *                       commissionAmount:
 *                         type: number
 *                       observations:
 *                         type: string
 *                 total:
 *                   type: integer
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 */
router.post(
  "/monthly-results/search",
  authenticateToken,
  validatorMiddleware(MonthlyResultSearchDto, false) as RequestHandler,
  comissionsConfigController.searchMonthlyResults
);

// Periodos de liquidacion
/**
 * @swagger
 * /api/comissions/config/settlement-periods:
 *   post:
 *     tags:
 *       - Períodos de Liquidación
 *     summary: Crear un nuevo período de liquidación
 *     description: Crea un nuevo período de liquidación en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - startDate
 *               - endDate
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del período
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del período
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, CLOSED, PENDING]
 *                 description: Estado del período de liquidación
 *           example:
 *             companyId: 1
 *             startDate: "2024-01-01"
 *             endDate: "2024-03-31"
 *             status: "ACTIVE"
 *     responses:
 *       200:
 *         description: Período de liquidación creado correctamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 */
router.post(
  "/settlement-periods",
  authenticateToken,
  validatorMiddleware(CreateSettlementPeriodDto, false) as RequestHandler,
  comissionsConfigController.createSettlementPeriod
);

/**
 * @swagger
 * /api/comissions/config/settlement-periods/{id}:
 *   put:
 *     tags:
 *       - Períodos de Liquidación
 *     summary: Actualizar un período de liquidación
 *     description: Actualiza un período de liquidación existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del período de liquidación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del período
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del período
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, CLOSED, PENDING]
 *                 description: Estado del período de liquidación
 *           example:
 *             companyId: 1
 *             startDate: "2024-01-01"
 *             endDate: "2024-03-31"
 *             status: "CLOSED"
 *     responses:
 *       200:
 *         description: Período de liquidación actualizado correctamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 */
router.put(
  "/settlement-periods/:id",
  authenticateToken,
  validatorMiddleware(UpdateSettlementPeriodDto, false) as RequestHandler,
  comissionsConfigController.updateSettlementPeriod
);

/**
 * @swagger
 * /api/comissions/config/settlement-periods/{id}:
 *   delete:
 *     tags:
 *       - Períodos de Liquidación
 *     summary: Eliminar un período de liquidación
 *     description: Elimina un período de liquidación existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del período de liquidación a eliminar
 *     responses:
 *       200:
 *         description: Período de liquidación eliminado correctamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 */
router.delete(
  "/settlement-periods/:id",
  authenticateToken,
  comissionsConfigController.deleteSettlementPeriod
);

/**
 * @swagger
 * /api/comissions/config/settlement-periods/search:
 *   post:
 *     tags:
 *       - Períodos de Liquidación
 *     summary: Buscar períodos de liquidación
 *     description: Busca períodos de liquidación según los criterios especificados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de elementos por página
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del período
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del período
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, CLOSED, PENDING]
 *                 description: Estado del período de liquidación
 *           example:
 *             companyId: 1
 *             status: "ACTIVE"
 *     responses:
 *       200:
 *         description: Períodos de liquidación encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       company:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       endDate:
 *                         type: string
 *                         format: date
 *                       status:
 *                         type: string
 *                 total:
 *                   type: integer
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 */
router.post(
  "/settlement-periods/search",
  authenticateToken,
  validatorMiddleware(SettlementPeriodSearchDto, false) as RequestHandler,
  comissionsConfigController.searchSettlementPeriod
);

// Parameter Lines
/**
 * @swagger
 * /api/comissions/config/parameter-lines:
 *   post:
 *     summary: Crear una nueva línea de parámetro
 *     tags: [Líneas de Parámetros]
 *     description: Crea una nueva línea de parámetro en el sistema
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
 *                 description: Nombre de la línea de parámetro
 *               description:
 *                 type: string
 *                 description: Descripción de la línea de parámetro
 *               groupProductLine:
 *                 type: string
 *                 description: Grupo de línea de producto asociado
 *           example:
 *             name: "Línea Premium"
 *             description: "Línea de productos premium"
 *             groupProductLine: "Grupo A"
 *     responses:
 *       201:
 *         description: Línea de parámetro creada exitosamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 */
router.post(
  "/parameter-lines",
  authenticateToken,
  validatorMiddleware(CreateParameterLineDto, false) as RequestHandler,
  comissionsConfigController.createParameterLine
);

/**
 * @swagger
 * /api/comissions/config/parameter-lines/{id}:
 *   put:
 *     summary: Actualizar una línea de parámetro existente
 *     tags: [Líneas de Parámetros]
 *     description: Actualiza los datos de una línea de parámetro existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la línea de parámetro a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la línea de parámetro
 *               description:
 *                 type: string
 *                 description: Descripción de la línea de parámetro
 *               groupProductLine:
 *                 type: string
 *                 description: Grupo de línea de producto asociado
 *           example:
 *             name: "Línea Premium Actualizada"
 *             description: "Descripción actualizada"
 *             groupProductLine: "Grupo B"
 *     responses:
 *       200:
 *         description: Línea de parámetro actualizada exitosamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Línea de parámetro no encontrada
 */
router.put(
  "/parameter-lines/:id",
  authenticateToken,
  validatorMiddleware(UpdateParameterLineDto, false) as RequestHandler,
  comissionsConfigController.updateParameterLine
);

/**
 * @swagger
 * /api/comissions/config/parameter-lines/{id}:
 *   delete:
 *     summary: Eliminar una línea de parámetro
 *     tags: [Líneas de Parámetros]
 *     description: Elimina una línea de parámetro existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la línea de parámetro a eliminar
 *     responses:
 *       200:
 *         description: Línea de parámetro eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Línea de parámetro no encontrada
 */
router.delete(
  "/parameter-lines/:id",
  authenticateToken,
  comissionsConfigController.deleteParameterLine
);

/**
 * @swagger
 * /api/comissions/config/parameter-lines/search:
 *   post:
 *     summary: Buscar líneas de parámetros
 *     tags: [Líneas de Parámetros]
 *     description: Busca líneas de parámetros según los criterios especificados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de elementos por página
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la línea de parámetro
 *               description:
 *                 type: string
 *                 description: Descripción de la línea de parámetro
 *               groupProductLine:
 *                 type: string
 *                 description: Grupo de línea de producto asociado
 *           example:
 *             name: "Premium"
 *             groupProductLine: "Grupo A"
 *     responses:
 *       200:
 *         description: Líneas de parámetros encontradas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       groupProductLine:
 *                         type: string
 *                 total:
 *                   type: integer
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 */
router.post(
  "/parameter-lines/search",
  authenticateToken,
  validatorMiddleware(CreateParameterLineSearchDto, false) as RequestHandler,
  comissionsConfigController.searchParameterLine
);

// Temporadas
/**
 * @swagger
 * /api/comissions/config/seasons:
 *   post:
 *     tags:
 *       - Temporadas
 *     summary: Crear una nueva temporada
 *     description: Crea una nueva temporada en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - name
 *               - isHighSeason
 *             properties:
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *                 description: Mes de la temporada
 *               name:
 *                 type: string
 *                 description: Nombre de la temporada
 *               description:
 *                 type: string
 *                 description: Descripción de la temporada
 *               isHighSeason:
 *                 type: boolean
 *                 description: Indica si es temporada alta
 *     responses:
 *       200:
 *         description: Temporada creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     month:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     isHighSeason:
 *                       type: boolean
 *       400:
 *         description: Error en la solicitud
 */
router.post(
  "/seasons",
  authenticateToken,
  comissionsConfigController.createSeason
);

/**
 * @swagger
 * /api/comissions/config/seasons/{id}:
 *   put:
 *     tags:
 *       - Temporadas
 *     summary: Actualizar una temporada existente
 *     description: Actualiza los datos de una temporada específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la temporada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *                 description: Mes de la temporada
 *               name:
 *                 type: string
 *                 description: Nombre de la temporada
 *               description:
 *                 type: string
 *                 description: Descripción de la temporada
 *               isHighSeason:
 *                 type: boolean
 *                 description: Indica si es temporada alta
 *     responses:
 *       200:
 *         description: Temporada actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     month:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     isHighSeason:
 *                       type: boolean
 *       400:
 *         description: Error en la solicitud
 */
router.put(
  "/seasons/:id",
  authenticateToken,
  comissionsConfigController.updateSeason
);

/**
 * @swagger
 * /api/comissions/config/seasons/{id}:
 *   delete:
 *     tags:
 *       - Temporadas
 *     summary: Eliminar una temporada
 *     description: Elimina una temporada específica del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la temporada a eliminar
 *     responses:
 *       200:
 *         description: Temporada eliminada correctamente
 *       400:
 *         description: Error en la solicitud
 */
router.delete(
  "/seasons/:id",
  authenticateToken,
  comissionsConfigController.deleteSeason
);

/**
 * @swagger
 * /api/comissions/config/seasons/search:
 *   post:
 *     tags:
 *       - Temporadas
 *     summary: Buscar temporadas
 *     description: Busca temporadas con paginación según los criterios especificados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados por página
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *                 description: Mes de la temporada
 *               name:
 *                 type: string
 *                 description: Nombre de la temporada
 *               description:
 *                 type: string
 *                 description: Descripción de la temporada
 *               isHighSeason:
 *                 type: boolean
 *                 description: Indica si es temporada alta
 *     responses:
 *       200:
 *         description: Búsqueda realizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       month:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       isHighSeason:
 *                         type: boolean
 *       400:
 *         description: Error en la solicitud
 */
router.post(
  "/seasons/search",
  authenticateToken,
  validatorMiddleware(SearchSeasonDto, false) as RequestHandler,
  comissionsConfigController.searchSeason
);

// KPI Config

/**
 * @swagger
 * /api/comissions/config/kpi-config:
 *   post:
 *     tags:
 *       - KPI Configuration
 *     summary: Create a new KPI configuration
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - companyPositionId
 *               - kpiName
 *               - weight
 *               - commissionConfigurationId
 *             properties:
 *               companyId:
 *                 type: integer
 *               companyPositionId:
 *                 type: integer
 *               kpiName:
 *                 type: string
 *               weight:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               meta:
 *                 type: number
 *               metaTb:
 *                 type: number
 *               metaTa:
 *                 type: number
 *               commissionConfigurationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: KPI configuration created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/kpi-config",
  authenticateToken,
  validatorMiddleware(CreateKpiConfigDto, false) as RequestHandler,
  comissionsConfigController.createKpiConfig
);

/**
 * @swagger
 * /api/comissions/config/kpi-config/{id}:
 *   put:
 *     tags:
 *       - KPI Configuration
 *     summary: Update a KPI configuration
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               companyId:
 *                 type: integer
 *               companyPositionId:
 *                 type: integer
 *               kpiName:
 *                 type: string
 *               weight:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               meta:
 *                 type: number
 *               metaTb:
 *                 type: number
 *               metaTa:
 *                 type: number
 *               commissionConfigurationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: KPI configuration updated successfully
 *       400:
 *         description: Bad request
 */
router.put(
  "/kpi-config/:id",
  authenticateToken,
  validatorMiddleware(UpdateKpiConfigDto, false) as RequestHandler,
  comissionsConfigController.updateKpiConfig
);

/**
 * @swagger
 * /api/comissions/kpi-config/{id}:
 *   delete:
 *     tags:
 *       - KPI Configuration
 *     summary: Delete a KPI configuration
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: KPI configuration deleted successfully
 *       400:
 *         description: Bad request
 */
router.delete(
  "/kpi-config/:id",
  authenticateToken,
  comissionsConfigController.deleteKpiConfig
);
/**
 * @swagger
 * /api/comissions/config/kpi-config/search:
 *   post:
 *     tags:
 *       - KPI Configuration
 *     summary: Search KPI configurations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - companyPositionId
 *               - kpiName
 *               - commissionConfigurationId
 *             properties:
 *               companyId:
 *                 type: integer
 *               companyPositionId:
 *                 type: integer
 *               kpiName:
 *                 type: string
 *               commissionConfigurationId:
 *                 type: integer
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Search results returned successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/kpi-config/search",
  authenticateToken,
  validatorMiddleware(SearchKpiConfigDto, false) as RequestHandler,
  comissionsConfigController.searchKpiConfig
);

// Variable Scale
/**
 * @swagger
 * /api/comissions/config/variable-scale:
 *   post:
 *     tags:
 *       - Variable Scale
 *     summary: Create a new variable scale
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - companyPositionId
 *               - commissionConfigurationId
 *               - minScore
 *               - maxScore
 *               - variableAmount
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID of the company
 *               companyPositionId:
 *                 type: integer
 *                 description: ID of the company position
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: ID of the commission configuration
 *               minScore:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 9999999.99
 *                 description: Minimum score with up to 2 decimal places
 *               maxScore:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 9999999.99
 *                 description: Maximum score with up to 2 decimal places
 *               variableAmount:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 9999999.99
 *                 description: Variable amount with up to 2 decimal places
 *     responses:
 *       200:
 *         description: Variable scale created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/variable-scale",
  authenticateToken,
  validatorMiddleware(CreateVariableScaleDto, false) as RequestHandler,
  comissionsConfigController.createVariableScale
);

/**
 * @swagger
 * /api/comissions/config/variable-scale/{id}:
 *   put:
 *     tags:
 *       - Variable Scale
 *     summary: Update a variable scale
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               companyId:
 *                 type: integer
 *                 description: ID of the company
 *               companyPositionId:
 *                 type: integer
 *                 description: ID of the company position
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: ID of the commission configuration
 *               minScore:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 9999999.99
 *                 description: Minimum score with up to 2 decimal places
 *               maxScore:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 9999999.99
 *                 description: Maximum score with up to 2 decimal places
 *               variableAmount:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 9999999.99
 *                 description: Variable amount with up to 2 decimal places
 *     responses:
 *       200:
 *         description: Variable scale updated successfully
 *       400:
 *         description: Bad request
 */
router.put(
  "/variable-scale/:id",
  authenticateToken,
  validatorMiddleware(UpdateVariableScaleDto, false) as RequestHandler,
  comissionsConfigController.updateVariableScale
);

/**
 * @swagger
 * /api/comissions/config/variable-scale/{id}:
 *   delete:
 *     tags:
 *       - Variable Scale
 *     summary: Delete a variable scale
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Variable scale deleted successfully
 *       400:
 *         description: Bad request
 */
router.delete(
  "/variable-scale/:id",
  authenticateToken,
  comissionsConfigController.deleteVariableScale
);

/**
 * @swagger
 * /api/comissions/config/variable-scale/search:
 *   post:
 *     tags:
 *       - Variable Scale
 *     summary: Search variable scales
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: integer
 *                 description: ID of the company to filter by
 *               companyPositionId:
 *                 type: integer
 *                 description: ID of the company position to filter by
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: ID of the commission configuration to filter by
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Search results returned successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/variable-scale/search",
  authenticateToken,
  validatorMiddleware(VariableScaleSearchDto, false) as RequestHandler,
  comissionsConfigController.searchVariableScalePaginated
);

// Store Size
/**
 * @swagger
 * /api/comissions/config/store-size:
 *   post:
 *     tags:
 *       - Tamaño de tienda
 *     summary: Crear un nuevo tamaño de tienda
 *     description: Crea una nueva configuración de tamaño de tienda con los parámetros especificados
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
 *               - bonus
 *               - time
 *               - companyId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the store size
 *                 example: "Tienda Grande"
 *               bonus:
 *                 type: number
 *                 format: float
 *                 description: Bonus
 *                 example: 1000000
 *               time:
 *                 type: number
 *                 format: float
 *                 description: Time
 *                 example: 1
 *               companyId:
 *                 type: integer
 *                 description: ID of the company
 *                 example: 1
 *     responses:
 *       200:
 *         description: Store size created successfully
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized - invalid token
 */
router.post(
  "/store-size",
  authenticateToken,
  validatorMiddleware(CreateStoreSizeDto, false) as RequestHandler,
  comissionsConfigController.createStoreSize
);

/**
 * @swagger
 * /api/comissions/config/store-size/{id}:
 *   put:
 *     tags:
 *       - Tamaño de tienda
 *     summary: Actualizar un tamaño de tienda
 *     description: Actualiza una configuración de tamaño de tienda existente por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tamaño de tienda a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the store size
 *               bonus:
 *                 type: number
 *                 format: float
 *                 description: Bonus
 *                 example: 500000
 *               time:
 *                 type: number
 *                 format: float
 *                 description: Time
 *                 example: 1
 *               companyId:
 *                 type: integer
 *                 description: ID of the company
 *                 example: 1
 *     responses:
 *       200:
 *         description: Store size updated successfully
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized - invalid token
 *       404:
 *         description: Store size not found
 */
router.put(
  "/store-size/:id",
  authenticateToken,
  validatorMiddleware(UpdateStoreSizeDto, false) as RequestHandler,
  comissionsConfigController.updateStoreSize
);

/**
 * @swagger
 * /api/comissions/config/store-size/{id}:
 *   delete:
 *     tags:
 *       - Tamaño de tienda
 *     summary: Eliminar un tamaño de tienda
 *     description: Elimina una configuración de tamaño de tienda por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tamaño de tienda a eliminar
 *     responses:
 *       200:
 *         description: Tamaño de tienda eliminado correctamente
 *       401:
 *         description: No autorizado - token inválido
 *       404:
 *         description: Tamaño de tienda no encontrado
 */
router.delete(
  "/store-size/:id",
  authenticateToken,
  comissionsConfigController.deleteStoreSize
);

/**
 * @swagger
 * /api/comissions/config/store-size/search:
 *   post:
 *     tags:
 *       - Tamaño de tienda
 *     summary: Buscar tamaños de tienda
 *     description: Busca tamaños de tienda con paginación según los criterios especificados
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID del tamaño de tienda a filtrar por
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Nombre del tamaño de tienda a filtrar por
 *               companyId:
 *                 type: integer
 *                 description: ID de la empresa a filtrar por
 *                 example: 1
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Search results returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       bonus:
 *                         type: number
 *                       time:
 *                         type: number
 *                       company:
 *                         type: object
 *                 total:
 *                   type: integer
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized - invalid token
 */
router.post(
  "/store-size/search",
  authenticateToken,
  validatorMiddleware(StoreSizeSearchDto, false) as RequestHandler,
  comissionsConfigController.searchStoreSizePaginated
);

// Rotacion de ventas
/**
 * @swagger
 * /api/comissions/config/sales-rotation:
 *   post:
 *     tags:
 *       - Rotación de ventas   
 *     summary: Crear una nueva configuración de rotación de ventas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - monthName
 *               - weight
 *               - goal
 *               - isHighSeason
 *               - commissionConfigurationId
 *             properties:
 *               month:
 *                 type: integer
 *                 description: Nombre del mes  
 *               monthName:
 *                 type: string
 *                 description: Nombre del mes en español
 *               weight:
 *                 type: number
 *                 description: Peso de la rotación de ventas
 *               goal:
 *                 type: number
 *                 description: Meta de la rotación de ventas
 *               description:
 *                 type: string
 *                 description: Descripción de la rotación de ventas
 *               isHighSeason:
 *                 type: boolean
 *                 description: Indica si es temporada alta 
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de comisiones
 *     responses:
 *       200:
 *         description: Configuración de rotación de ventas creada correctamente  
 *       400: 
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized - invalid token
 */
router.post(
  "/sales-rotation",
  authenticateToken,
  validatorMiddleware(CreateSalesRotationConfigurationDto, false) as RequestHandler,
  comissionsConfigController.createSalesRotationConfiguration
);

/**
 * @swagger
 * /api/comissions/config/sales-rotation/configurations:
 *   post:
 *     tags:
 *       - Rotación de ventas
 *     summary: Crear nuevas configuraciones de rotación de ventas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - month
 *                 - monthName
 *                 - weight
 *                 - goal
 *                 - isHighSeason
 *                 - commissionConfigurationId
 *               properties:
 *                 month:
 *                   type: integer
 *                   description: Número del mes
 *                 monthName:
 *                   type: string
 *                   description: Nombre del mes en español
 *                 weight:
 *                   type: number
 *                   description: Peso de la rotación de ventas
 *                 goal:
 *                   type: number
 *                   description: Meta de la rotación de ventas
 *                 description:
 *                   type: string
 *                   description: Descripción de la rotación de ventas
 *                 isHighSeason:
 *                   type: boolean
 *                   description: Indica si es temporada alta 
 *                 commissionConfigurationId:
 *                   type: integer
 *                   description: ID de la configuración de comisiones
 *     responses:
 *       200:
 *         description: Configuraciones creadas correctamente  
 *       400: 
 *         description: Bad request - errores de validación
 *       401:
 *         description: Unauthorized - token inválido
 */
router.post(
  "/sales-rotation/configurations",
  authenticateToken,
  comissionsConfigController.createSalesRotationConfigurations
);

/**   
 * @swagger
 * /api/comissions/config/sales-rotation/configurations:
 *   put:
 *     tags:
 *       - Rotación de ventas 
 *     summary: Actualizar configuraciones de rotación de ventas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:  
 *                 - id
 *                 - month
 *                 - monthName
 *                 - weight
 *                 - goal
 *                 - isHighSeason
 *                 - commissionConfigurationId  
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de la configuración de rotación de ventas
 *                 month:
 *                   type: integer
 *                   description: Número del mes
 *                 monthName:
 *                   type: string
 *                   description: Nombre del mes en español
 *                 weight:
 *                   type: number
 *                   description: Peso de la rotación de ventas   
 *                 goal:  
 *                   type: number
 *                   description: Meta de la rotación de ventas
 *                 description:
 *                   type: string
 *                   description: Descripción de la rotación de ventas  
 *                 isHighSeason:  
 *                   type: boolean
 *                   description: Indica si es temporada alta
 *                 commissionConfigurationId:
 *                   type: integer
 *                   description: ID de la configuración de comisiones
 *     responses: 
 *       200:
 *         description: Configuraciones actualizadas correctamente
 *       400:
 *         description: Bad request - errores de validación
 *       401:
 *         description: Unauthorized - token inválido 
 */
router.put(
  "/sales-rotation/configurations",
  authenticateToken,
  comissionsConfigController.updateSalesRotationConfigurations
);

/**
 * @swagger
 * /api/comissions/config/sales-rotation/{id}:
 *   put:
 *     tags:
 *       - Rotación de ventas
 *     summary: Actualizar una configuración de rotación de ventas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
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
 *               month:
 *                 type: integer
 *                 description: Nombre del mes
 *                 example: 1
 *               monthName:
 *                 type: string
 *                 description: Nombre del mes en español
 *               weight:
 *                 type: number
 *                 description: Peso de la rotación de ventas
 *               goal:
 *                 type: number
 *                 description: Meta de la rotación de ventas
 *               description:
 *                 type: string
 *                 description: Descripción de la rotación de ventas
 *                 example: "Rotación de ventas"
 *               isHighSeason:
 *                 type: boolean
 *                 description: Indica si es temporada alta
 *               commissionConfigurationId: 
 *                 type: integer
 *                 description: ID de la configuración de comisiones
 *     responses:
 *       200:
 *         description: Configuración de rotación de ventas actualizada correctamente
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized - invalid token
 */
router.put(
  "/sales-rotation/:id",
  authenticateToken,
  validatorMiddleware(UpdateSalesRotationConfigurationDto, false) as RequestHandler,
  comissionsConfigController.updateSalesRotationConfiguration
);



/**
 * @swagger
 * /api/comissions/config/sales-rotation/{id}:
 *   delete:
 *     tags:
 *       - Rotación de ventas
 *     summary: Eliminar una configuración de rotación de ventas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path 
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Configuración de rotación de ventas eliminada correctamente 
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized - invalid token
 */
router.delete(
  "/sales-rotation/:id",
  authenticateToken,
  comissionsConfigController.deleteSalesRotationConfiguration
);

/** 
 * @swagger
 * /api/comissions/config/sales-rotation/{id}/delete-all:
 *   delete:
 *     tags:
 *       - Rotación de ventas
 *     summary: Eliminar todas las configuraciones de rotación de ventas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Configuraciones de rotación de ventas eliminadas correctamente  
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized - invalid token
 */
router.delete(
  "/sales-rotation/:id/delete-all",
  authenticateToken,
  comissionsConfigController.deleteAllSalesRotationConfigurations
);


/**
 * @swagger
 * /api/comissions/config/sales-rotation/search:
 *   post:
 *     tags:
 *       - Rotación de ventas
 *     summary: Buscar configuraciones de rotación de ventas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monthName:
 *                 type: string
 *                 description: Nombre del mes en español
 *               description:
 *                 type: string
 *                 description: Descripción de la rotación de ventas
 *               isHighSeason:
 *                 type: boolean
 *                 description: Indica si es temporada alta
 *               commissionConfigurationId:
 *                 type: integer
 *                 description: ID de la configuración de comisiones
 *     responses:
 *       200:
 *         description: Configuraciones de rotación de ventas encontradas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       month:
 *                         type: string
 *                       monthName:
 *                         type: string
 *                       weight:
 *                         type: number
 *                       goal:
 *                         type: number
 *                       description:
 *                         type: string
 *                       isHighSeason:
 *                         type: boolean
 *                       commissionConfigurationId:
 *                         type: integer
 *                 total:
 *                   type: integer
 *       400:
 *         description: Bad request - validation errors
 */
router.post(
  "/sales-rotation/search",
  authenticateToken,
  comissionsConfigController.searchSalesRotationConfiguration
);


export default router;