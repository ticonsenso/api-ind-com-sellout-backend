import { DataSource } from 'typeorm';
import { UserService } from '../services/users.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToClass } from 'class-transformer';
import { CreateUserDto, UpdateUserDto, FilterUserDto } from '../dtos/users.dto';
import { UsersRolesService } from '../services/users.roles.service';
import { decodeToken } from '../middleware/auth.middleware';

export class UserController {
  private userService: UserService;
  private userRolesService: UsersRolesService;
  constructor(dataSource: DataSource) {
    this.userService = new UserService(dataSource);
    this.userRolesService = new UsersRolesService(dataSource);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.updateCompany = this.updateCompany.bind(this);
    this.delete = this.delete.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.findByFilters = this.findByFilters.bind(this);
    this.asignRoleToUser = this.asignRoleToUser.bind(this);
    this.getRolesByDni = this.getRolesByDni.bind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const createUserDto: CreateUserDto = plainToClass(CreateUserDto, req.body);
      const user = await this.userService.create(createUserDto);
      res.status(StatusCodes.CREATED).json({ message: 'Usuario creado correctamente', user });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateUserDto: UpdateUserDto = plainToClass(UpdateUserDto, req.body);
      const user = await this.userService.update(Number(id), updateUserDto);
      res.status(StatusCodes.OK).json({ message: 'Usuario actualizado correctamente', user });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
  }

  async updateCompany(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateUserDto: UpdateUserDto = plainToClass(UpdateUserDto, req.body);
      const user = await this.userService.updateCompany(Number(id), updateUserDto);
      res.status(StatusCodes.OK).json({ message: 'Usuario actualizado correctamente', user });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }


  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.userService.delete(Number(id));
      res.status(StatusCodes.OK).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const users = await this.userService.findAll();
      res.status(StatusCodes.OK).json(users);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(Number(id));
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
  }

  async findByFilters(req: Request, res: Response) {
    try {
      const filters: FilterUserDto = plainToClass(FilterUserDto, req.body);
      const users = await this.userService.findByFilters(filters);
      res.status(StatusCodes.OK).json(users);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
  }

  async asignRoleToUser(req: Request, res: Response) {
    try {
      const { idUser } = req.params;
      const { roleIds } = req.body;
      const user = await this.userRolesService.asignRoleToUser(Number(idUser), roleIds);
      res.status(StatusCodes.OK).json({ message: 'Roles asignados correctamente al usuario' });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
  }

  async getRolesByDni(req: Request, res: Response) {
    try {
      const token = req.header('Authorization')?.split(' ')[1];
      if (!token) {
        throw new Error('Token no proporcionado');
      }
      const usuario = decodeToken(token);
      const dni = usuario.cedula;
      const roles = await this.userRolesService.getRolesByDni(dni);
      res.status(StatusCodes.OK).json(roles);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
  }
}
