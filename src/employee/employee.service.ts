import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { hashSync, compareSync } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { users } from '@prisma/client';
@Injectable()
export class EmployeeService {
  constructor(private readonly prismaService: PrismaService) {}

  findByUsername(username: string): Promise<users> {
    return this.prismaService.users.findFirst({
      where: { username },
    });
  }

  async login(login: LoginDto) {
    // find by Username
    const foundUser = await this.findByUsername(login.username);
    // if not found, throw exception
    if (!foundUser) {
      throw new BadRequestException();
    }
    // compare password
    const isPasswordMatch = compareSync(login.password, foundUser.password);
    if (!isPasswordMatch) {
      throw new BadRequestException();
    }
    return foundUser;
  }

  async createEmployee(payload: CreateEmployeeDto) {
    // check username
    const existingEmployee = await this.findByUsername(payload.username);
    // if not found, throw exception
    if (existingEmployee) {
      throw new BadRequestException();
    }
    // create user
    return this.prismaService.users.create({
      data: {
        ...payload,
        password: hashSync(payload.password, 10),
      },
    });
  }
}
