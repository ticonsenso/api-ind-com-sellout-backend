import {DataSource} from 'typeorm';
import {RolePermissionRepository} from '../repository/roles.permissions.repository';
import {RolePermission} from '../models/roles.permissions.model';
import {RoleRepository} from '../repository/roles.repository';
import {PermissionRepository} from '../repository/permissions.repository';

export class RolesPermissionsService {
  private rolePermissionRepository: RolePermissionRepository;
  private roleRepository: RoleRepository;
  private permissionRepository: PermissionRepository;

  constructor(dataSource: DataSource) {
    this.rolePermissionRepository = new RolePermissionRepository(dataSource);
    this.roleRepository = new RoleRepository(dataSource);
    this.permissionRepository = new PermissionRepository(dataSource);
  }

  async asignedPermissionsToRole(roleId: number, permissions: number[]): Promise<boolean> {
    try {
      const role = await this.roleRepository.findById(roleId);
      if (!role) {
        throw new Error(`Rol con id ${roleId} no encontrado`);
      }
      await this.rolePermissionRepository.deleteByRoleId(roleId);
      await Promise.all(
        permissions.map(async (permissionId) => {
          const rolePermission: RolePermission = new RolePermission();
          rolePermission.role = role;
          const permission = await this.permissionRepository.findById(permissionId);
          if (permission) {
            rolePermission.permission = permission;
            await this.rolePermissionRepository.create(rolePermission);
          }
        }),
      );
      return true;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
