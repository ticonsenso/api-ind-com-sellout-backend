import { DataSource } from 'typeorm';
import { UserRepository } from '../repository/users.repository';
import { RoleRepository } from '../repository/roles.repository';
import { UserRoleRepository } from '../repository/users.roles.repository';
import { UserRole } from '../models/users.roles.model';
import { RoleResponseDto } from '../dtos/roles.dto';
import { Permission } from '../models/permissions.model';
import { RolePermissionRepository } from '../repository/roles.permissions.repository';
import { PermissionResponseDto } from '../dtos/permissions.dto';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from '../dtos/users.dto';
import { CompaniesRepository } from '../repository/companies.repository';
import { CompanyResponseDto } from '../dtos/companies.dto';
export class UsersRolesService {
  private userRepository: UserRepository;
  private roleRepository: RoleRepository;
  private userRoleRepository: UserRoleRepository;
  private rolePermissionRepository: RolePermissionRepository;
  private companyRepository: CompaniesRepository;
  constructor(dataSource: DataSource) {
    this.userRepository = new UserRepository(dataSource);
    this.roleRepository = new RoleRepository(dataSource);
    this.userRoleRepository = new UserRoleRepository(dataSource);
    this.rolePermissionRepository = new RolePermissionRepository(dataSource);
    this.companyRepository = new CompaniesRepository(dataSource);
  }

  async asignRoleToUser(userId: number, roleIds: number[]): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      await this.userRoleRepository.deleteRolesByUserId(userId);
      await Promise.all(
        roleIds.map(async (rolid: number) => {
          const role = await this.roleRepository.findById(rolid);
          if (role) {
            const userRole: UserRole = new UserRole();
            userRole.user = user;
            userRole.role = role;
            await this.userRoleRepository.create(userRole);
          }
        }),
      );
      return true;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getRolesByDni(dni: string): Promise<RoleResponseDto[]> {
    const userRoles = await this.userRoleRepository.findByDni(dni);
    if (!userRoles || userRoles.length === 0) {
      throw new Error('Usuario no cuenta con roles asignados.');
    }
    const roles = await Promise.all(
      userRoles.map(async (userRole) => {
        const permissions = await this.rolePermissionRepository.findByRoleId(userRole.role.id);
        const user = await this.userRepository.findById(userRole.user.id);
        const company = plainToClass(CompanyResponseDto, user?.company);

        return {
          user: plainToClass(UserResponseDto, { ...userRole.user, company: company }, { excludeExtraneousValues: true }),
          id: userRole.role.id,
          name: userRole.role.name,
          status: userRole.role.status,
          permissions: permissions.map((permission) =>
            plainToClass(PermissionResponseDto, permission.permission, { excludeExtraneousValues: true }),
          ),
        };
      }),
    );
    return roles;
  }
}
