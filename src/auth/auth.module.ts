import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmployeeService } from 'src/employee/employee.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JsonWebTokenService } from 'src/jwt/jwt.service';
import { RoleService } from 'src/role/role.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    EmployeeService,
    PrismaService,
    JsonWebTokenService,
    RoleService,
  ],
})
export class AuthModule {}
