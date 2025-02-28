import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { PrismaModule } from './prisma/prisma.module';
import { JsonWebTokenModule } from './jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { ResourcesModule } from './resources/resources.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    EmployeeModule,
    PrismaModule,
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    JsonWebTokenModule,
    AuthModule,
    RoleModule,
    ResourcesModule,
    PermissionsModule,
  ],
})
export class AppModule {}
