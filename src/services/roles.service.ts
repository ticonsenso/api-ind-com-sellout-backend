import { plainToClass } from 'class-transformer';
import { Role } from '../models/roles.model';
import { RoleRepository } from '../repository/roles.repository';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto, FilterRoleDto } from '../dtos/roles.dto';
import { DataSource } from 'typeorm';
import { RolePermissionRepository } from '../repository/roles.permissions.repository';
import { PermissionResponseDto } from '../dtos/permissions.dto';

export class RoleService {
  private roleRepository: RoleRepository;
  private rolePermissionRepository: RolePermissionRepository;

  constructor(dataSource: DataSource) {
    this.roleRepository = new RoleRepository(dataSource);
    this.rolePermissionRepository = new RolePermissionRepository(dataSource);
  }

  async findAll(filters?: FilterRoleDto): Promise<RoleResponseDto[]> {
    let roles: Role[];

    if (filters) {
      const query = this.roleRepository.findByFilters(filters);
      roles = await query;
    } else {
      roles = await this.roleRepository.findAll();
    }
    const rolesResponse = roles.map((role) => plainToClass(RoleResponseDto, role, { excludeExtraneousValues: true }));
    const rolesWithPermissions = await Promise.all(
      rolesResponse.map(async (role) => {
        const permissions = await this.rolePermissionRepository.findByRoleId(role.id);
        role.permissions = permissions.map((permission) =>
          plainToClass(PermissionResponseDto, permission.permission, { excludeExtraneousValues: true }),
        );
        return role;
      }),
    );
    return rolesWithPermissions;
  }

  async findById(id: number): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new Error(`Rol con ID ${id} no encontrado`);
    }
    const permissions = await this.rolePermissionRepository.findByRoleId(role.id);
    const roleResponse = plainToClass(RoleResponseDto, role, { excludeExtraneousValues: true });
    roleResponse.permissions = permissions.map((permission) =>
      plainToClass(PermissionResponseDto, permission.permission, { excludeExtraneousValues: true }),
    );
    return roleResponse;
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const existingRole = await this.roleRepository.repository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new Error(`Ya existe un rol con el nombre ${createRoleDto.name}`);
    }

    const roleEntity = plainToClass(Role, createRoleDto);
    const savedRole = await this.roleRepository.create(roleEntity);

    return plainToClass(RoleResponseDto, savedRole, { excludeExtraneousValues: true });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const existingRole = await this.roleRepository.findById(id);

    if (!existingRole) {
      throw new Error(`Rol con ID ${id} no encontrado`);
    }

    if (updateRoleDto.name) {
      const duplicateName = await this.roleRepository.repository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (duplicateName && duplicateName.id !== id) {
        throw new Error(`Ya existe un rol con el nombre ${updateRoleDto.name}`);
      }
    }

    const updatedRole = await this.roleRepository.update(id, updateRoleDto);
    return plainToClass(RoleResponseDto, updatedRole, { excludeExtraneousValues: true });
  }

  async delete(id: number): Promise<void> {
    const existingRole = await this.roleRepository.findById(id);

    if (!existingRole) {
      throw new Error(`Rol con ID ${id} no encontrado`);
    }

    await this.roleRepository.delete(id);
  }
}
