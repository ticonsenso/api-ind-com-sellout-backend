import { plainToClass } from "class-transformer";
import { DataSource } from "typeorm";
import { CompanyResponseDto } from "../dtos/companies.dto";
import { PermissionResponseDto } from "../dtos/permissions.dto";
import { RoleResponseDto } from "../dtos/roles.dto";
import {
  CreateUserDto,
  FilterUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "../dtos/users.dto";
import { User } from "../models/users.model";
import { CompaniesRepository } from "../repository/companies.repository";
import { RolePermissionRepository } from "../repository/roles.permissions.repository";
import { UserRepository } from "../repository/users.repository";
import { UserRoleRepository } from "../repository/users.roles.repository";
export class UserService {
  private userRepository: UserRepository;
  private userRolesRepository: UserRoleRepository;
  private rolesPermissionsRepository: RolePermissionRepository;
  private companyRepository: CompaniesRepository;
  constructor(dataSource: DataSource) {
    this.userRepository = new UserRepository(dataSource);
    this.userRolesRepository = new UserRoleRepository(dataSource);
    this.rolesPermissionsRepository = new RolePermissionRepository(dataSource);
    this.companyRepository = new CompaniesRepository(dataSource);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    const usersResponse: UserResponseDto[] = await Promise.all(
      users.map(async (user) => {
        const userRoles = await this.userRolesRepository.findByUserId(user.id);
        const rolesWithPermissions = userRoles.map(async (role) => {
          const permissions =
            await this.rolesPermissionsRepository.findByRoleId(role.role.id);

          const roleResponse = plainToClass(RoleResponseDto, role.role, {
            excludePrefixes: ["createdAt", "updatedAt"],
          });
          roleResponse.permissions = permissions.map((permission) =>
            plainToClass(PermissionResponseDto, permission.permission, {
              excludePrefixes: ["createdAt", "updatedAt"],
            })
          );
          return roleResponse;
        });
        const company = user.company?.id
          ? await this.companyRepository.findById(user.company.id)
          : null;
        const userResponse = plainToClass(UserResponseDto, user, {
          excludeExtraneousValues: true,
        });
        userResponse.roles = await Promise.all(rolesWithPermissions);
        userResponse.company = company!;
        return userResponse;
      })
    );
    return usersResponse;
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const roles = await this.userRolesRepository.findByUserId(user.id);
    const company = user.company?.id
      ? await this.companyRepository.findById(user.company.id)
      : null;
    const userResponse = plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    userResponse.company = company!;
    const rolesWithPermissions = await Promise.all(
      roles.map(async (role) => {
        const permissions = await this.rolesPermissionsRepository.findByRoleId(
          role.role.id
        );
        const roleResponse = plainToClass(RoleResponseDto, role.role, {
          excludeExtraneousValues: true,
        });
        roleResponse.permissions = permissions.map((permission) =>
          plainToClass(PermissionResponseDto, permission.permission, {
            excludeExtraneousValues: true,
          })
        );
        return roleResponse;
      })
    );
    userResponse.roles = rolesWithPermissions;
    return userResponse;
  }

  async findByFilters(filters: FilterUserDto): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findByFilters(filters);
    const usersResponse = await Promise.all(users.map(async (user) => {
      const userResponse = plainToClass(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
      if (user.company) {
        const company = plainToClass(CompanyResponseDto, user.company, {
          excludeExtraneousValues: true,
        });
        userResponse.company = company;
      }
      const roles = await this.userRolesRepository.findByUserId(user.id);
      const rolesWithPermissions = await Promise.all(
        roles.map(async (role) => {
          const permissions = await this.rolesPermissionsRepository.findByRoleId(
            role.role.id
          );
          const roleResponse = plainToClass(RoleResponseDto, role.role, {
            excludeExtraneousValues: true,
          });
          roleResponse.permissions = permissions.map((permission) =>
            plainToClass(PermissionResponseDto, permission.permission, {
              excludeExtraneousValues: true,
            })
          );
          return roleResponse;
        })
      );
      userResponse.roles = rolesWithPermissions;
      return userResponse;
    }));
    return usersResponse;
  }



  async createUserLogin(createUserDto: CreateUserDto): Promise<void> {
    const existingUserByDniAndEmail =
      await this.userRepository.findByDniAndEmail(
        createUserDto.dni,
        createUserDto.email
      );
    if (!existingUserByDniAndEmail) {
      const userEntity = plainToClass(User, createUserDto);
      await this.userRepository.create(userEntity);
    }
  }

  async createUserLoginActiveDirectory(
    createUserDto: CreateUserDto[]
  ): Promise<{ count: number; errorCount: number }> {
    let count = 0;
    let errorCount = 0;
    for (const user of createUserDto) {
      try {
        const existingUserByDniAndEmail =
          await this.userRepository.findByDniAndEmail(user.dni, user.email);
        if (!existingUserByDniAndEmail) {
          const userEntity = plainToClass(User, user);
          await this.userRepository.create(userEntity);
          count++;
        }
      } catch (error) {
        errorCount++;
      }
    }
    return { count, errorCount };
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUserByDni = await this.userRepository.findByDni(
      createUserDto.dni
    );
    if (existingUserByDni) {
      throw new Error("Ya existe un usuario con este DNI");
    }

    const existingUserByEmail = await this.userRepository.findByEmail(
      createUserDto.email
    );
    if (existingUserByEmail) {
      throw new Error("Ya existe un usuario con este correo electrónico");
    }

    const userEntity = plainToClass(User, createUserDto);
    const savedUser = await this.userRepository.create(userEntity);
    return plainToClass(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (updateUserDto.dni) {
      const existingUserByDni = await this.userRepository.findByDni(
        updateUserDto.dni
      );
      if (existingUserByDni && existingUserByDni.id !== id) {
        throw new Error("Ya existe un usuario con este DNI");
      }
    }

    if (updateUserDto.email) {
      const existingUserByEmail = await this.userRepository.findByEmail(
        updateUserDto.email
      );
      if (existingUserByEmail && existingUserByEmail.id !== id) {
        throw new Error("Ya existe un usuario con este correo electrónico");
      }
    }

    const updatedUser = await this.userRepository.update(id, updateUserDto);
    return plainToClass(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async updateCompany(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (dto.companyId !== undefined && dto.companyId !== null) {
      const companyExists = await this.companyRepository.findById(dto.companyId);
      if (!companyExists) {
        throw new Error('La empresa indicada no existe');
      }
    }
    const company = plainToClass(CompanyResponseDto, dto.companyId, {
      excludeExtraneousValues: true,
    });
    const updatedUser = await this.userRepository.updateCompany(id, dto.companyId ?? null);
    return plainToClass(UserResponseDto, { ...updatedUser, company }, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    await this.userRepository.delete(id);
  }
}
