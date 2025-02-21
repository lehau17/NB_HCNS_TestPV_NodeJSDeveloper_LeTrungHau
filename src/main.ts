import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalInterceptor } from '@app/common/interceptor/Globa.interceptor';
import { GlobalExceptionFilter } from '@app/common/filter/exception.filter';
import { AccessTokenGuard } from '@app/common/guard/accessToken.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RoleGuard } from '@app/common/guard/role.guard';
import { GlobalRateLimiter } from '@app/common/guard/rateLimiter.global';
import { BlackListGuard } from '@app/common/guard/blacklist.guard';
import { CheckRoleGuard } from '@app/common/guard/checkRole.guard';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // use global guard
  app.useGlobalGuards(
    new GlobalRateLimiter(new ConfigService()),
    new AccessTokenGuard(
      new JwtService(),
      new ConfigService(),
      new Reflector(),
    ),
    new BlackListGuard(new Reflector()),
    new CheckRoleGuard(new Reflector(), new PrismaService()),
    new RoleGuard(new Reflector()),
  );

  // use global interceptor
  app.useGlobalInterceptors(new GlobalInterceptor(new Reflector()));
  // use global filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // validation data global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Employee API')
    .setDescription('API quản lý nhân viên')
    .setVersion('1.0')
    .addBearerAuth() // Thêm xác thực nếu cần
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
