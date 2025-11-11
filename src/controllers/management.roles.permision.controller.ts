import {Request, Response} from 'express';
import {DataSource} from 'typeorm';
import {PermissionService} from '../services/permissions.service';
import {StatusCodes} from 'http-status-codes';
import {plainToClass} from 'class-transformer';
import {CreatePermissionDto, UpdatePermissionDto} from '../dtos/permissions.dto';
import {CreateRoleDto, UpdateRoleDto} from '../dtos/roles.dto';
import {RoleService} from '../services/roles.service';
import {RolesPermissionsService} from '../services/roles.permissions.service';

export class ManagementRolesPermisionController {
  private permissionService: PermissionService;
  private roleService: RoleService;
  private rolesPermissionsService: RolesPermissionsService;
  constructor(dataSource: DataSource) {
    this.permissionService = new PermissionService(dataSource);
    this.roleService = new RoleService(dataSource);
    this.rolesPermissionsService = new RolesPermissionsService(dataSource);
    this.createPermission = this.createPermission.bind(this);
    this.updatePermission = this.updatePermission.bind(this);
    this.deletePermission = this.deletePermission.bind(this);
    this.getAllPermissions = this.getAllPermissions.bind(this);
    this.getPermissionById = this.getPermissionById.bind(this);
    this.createRole = this.createRole.bind(this);
    this.updateRole = this.updateRole.bind(this);
    this.deleteRole = this.deleteRole.bind(this);
    this.getAllRoles = this.getAllRoles.bind(this);
    this.getRoleById = this.getRoleById.bind(this);
    this.asignedPermissionsToRole = this.asignedPermissionsToRole.bind(this);
  }

  async createPermission(req: Request, res: Response) {
    try {
      const createPermissionDto: CreatePermissionDto = plainToClass(CreatePermissionDto, req.body);
      const permission = await this.permissionService.create(createPermissionDto);
      res.status(StatusCodes.OK).json(permission);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error al crear el permiso',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async updatePermission(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatePermissionDto: UpdatePermissionDto = plainToClass(UpdatePermissionDto, req.body);
      const permission = await this.permissionService.update(Number(id), updatePermissionDto);
      res.status(StatusCodes.OK).json(permission);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error al actualizar el permiso',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async deletePermission(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.permissionService.delete(Number(id));
      res.status(StatusCodes.OK).json({ message: 'Permiso eliminado correctamente' });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error al eliminar el permiso',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getAllPermissions(req: Request, res: Response) {
    try {
      const permissions = await this.permissionService.findAll();
      res.status(StatusCodes.OK).json(permissions);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error al obtener los permisos',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getPermissionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const permission = await this.permissionService.findById(Number(id));
      res.status(StatusCodes.OK).json(permission);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error al obtener el permiso',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  //ROLES
  async createRole(req: Request, res: Response) {
    try {
      const createRoleDto: CreateRoleDto = plainToClass(CreateRoleDto, req.body);
      const role = await this.roleService.create(createRoleDto);
      res.status(StatusCodes.OK).json(role);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error al crear el rol',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateRoleDto: UpdateRoleDto = plainToClass(UpdateRoleDto, req.body);
      const role = await this.roleService.update(Number(id), updateRoleDto);
      res.status(StatusCodes.OK).json(role);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error al actualizar el rol',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.roleService.delete(Number(id));
      res.status(StatusCodes.OK).json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error al eliminar el rol',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getAllRoles(req: Request, res: Response) {
    try {
      const roles = await this.roleService.findAll();
      res.status(StatusCodes.OK).json(roles);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error al obtener los roles',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getRoleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await this.roleService.findById(Number(id));
      res.status(StatusCodes.OK).json(role);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error al obtener el rol',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async asignedPermissionsToRole(req: Request, res: Response) {
    try {
      const { idRol } = req.params;
      const { permissions } = req.body;
      await this.rolesPermissionsService.asignedPermissionsToRole(Number(idRol), permissions);
      res.status(StatusCodes.OK).json({ message: 'Permisos asignados correctamente' });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error al asignar los permisos',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
