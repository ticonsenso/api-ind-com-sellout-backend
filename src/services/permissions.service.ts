import {plainToClass} from 'class-transformer';
import {Permission} from '../models/permissions.model';
import {PermissionRepository} from '../repository/permissions.repository';
import {CreatePermissionDto, PermissionResponseDto, UpdatePermissionDto} from '../dtos/permissions.dto';
import {DataSource} from 'typeorm';

export class PermissionService {
  private permissionRepository: PermissionRepository;

  constructor(dataSource: DataSource) {
    this.permissionRepository = new PermissionRepository(dataSource);
  }

  async findAll(): Promise<PermissionResponseDto[]> {
    try {
      const permissions = await this.permissionRepository.findAll();
      return permissions.map((permission) => plainToClass(PermissionResponseDto, permission));
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async findById(id: number): Promise<PermissionResponseDto> {
    try {
      const permission = await this.permissionRepository.findById(id);
      if (!permission) {
        throw new Error(`Permiso con id ${id} no encontrado`);
      }
      return plainToClass(PermissionResponseDto, permission);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<PermissionResponseDto> {
    try {
      const existingPermission = await this.permissionRepository.findByName(createPermissionDto.name);
      if (existingPermission) {
        throw new Error(`Ya existe un permiso con el nombre ${createPermissionDto.name}`);
      }
      const permission = plainToClass(Permission, createPermissionDto);
      const savedPermission = await this.permissionRepository.create(permission);
      return plainToClass(PermissionResponseDto, savedPermission, { excludeExtraneousValues: true });
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<PermissionResponseDto> {
    try {
      const permission = await this.permissionRepository.findById(id);
      if (!permission) {
        throw new Error(`Permiso con id ${id} no encontrado`);
      }

      if (updatePermissionDto.name) {
        const existingPermission = await this.permissionRepository.findByName(updatePermissionDto.name);
        if (existingPermission && existingPermission.id !== id) {
          throw new Error(`Ya existe un permiso con el nombre ${updatePermissionDto.name}`);
        }
      }

      Object.assign(permission, updatePermissionDto);
      const updatedPermission = await this.permissionRepository.update(id, permission);
      return plainToClass(PermissionResponseDto, updatedPermission, { excludeExtraneousValues: true });
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const permission = await this.permissionRepository.findById(id);
      if (!permission) {
        throw new Error(`Permiso con id ${id} no encontrado`);
      }
      await this.permissionRepository.delete(id);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
