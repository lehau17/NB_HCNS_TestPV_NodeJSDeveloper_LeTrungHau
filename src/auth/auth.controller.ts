import {
  Body,
  Controller,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { MessageDeco, MessageResponse, PublicApi } from '@app/common';
import { LoginDto } from './dto/login.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { hasUncaughtExceptionCaptureCallback } from 'process';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @PublicApi()
  @MessageDeco(MessageResponse.USER_CREATED)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateEmployeeDto) {
    return this.authService.createEmployee(body);
  }

  @Post('login')
  @PublicApi()
  @MessageDeco(MessageResponse.USER_LOGIN_SUCCESS)
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('refresh-token')
  @PublicApi()
  @MessageDeco(MessageResponse.REFRESH_TOKEN_SUCESS)
  @ApiOperation({ summary: 'Refresh access token' }) // Mô tả API
  @ApiHeader({
    name: 'x-refresh-token',
    description: 'Refresh token for authentication',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  refreshToken(@Headers() refresToken: Record<string, string>) {
    const refreshToken = refresToken['x-refresh-token'];
    if (!refreshToken || refreshToken === '')
      throw new UnauthorizedException(MessageResponse.REFRESH_TOKEN_INVALID);

    return this.authService.refreshToken(refreshToken);
  }
}
