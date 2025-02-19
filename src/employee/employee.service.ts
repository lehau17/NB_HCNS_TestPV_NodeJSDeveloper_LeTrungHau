import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { hashSync, compareSync } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { users } from '@prisma/client';
import { UserResponseDto } from './dto/login.response.dto';
import { JsonWebTokenService } from 'src/jwt/jwt.service';
@Injectable()
export class EmployeeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jsonWebTokenService: JsonWebTokenService,
  ) {}

  findByUsername(username: string): Promise<users> {
    return this.prismaService.users.findFirst({
      where: { username },
    });
  }

  async login(login: LoginDto): Promise<UserResponseDto> {
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
    const roles = ['USER'];
    const tokens =
      await this.jsonWebTokenService.signAccessTokenAndRefreshToken(
        foundUser.id,
        foundUser.username,
        roles,
      );
    return {
      info: foundUser,
      tokens,
    };
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
