import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { Status } from '@prisma/client';
import { JsonWebTokenService } from 'src/jwt/jwt.service';
import { mapperUserToUserResponse } from '@app/common/mapper/userMapper';
import { MessageResponse, TokenPayload, TokenType } from '@app/common';
import { LoginResponseDto } from 'src/employee/dto/login.response.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { LoginDto } from './dto/login.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { TokenPayloadCreateDto } from 'src/jwt/payloadCreate.dto';
import { ChangePasswordDto } from 'src/employee/dto/change-password.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly jsonWebTokenService: JsonWebTokenService,
    private readonly employeeService: EmployeeService,
  ) {}

  async login(login: LoginDto): Promise<LoginResponseDto> {
    // find by Username
    const foundUser = await this.employeeService.findByUsername(login.username);
    // if not found, throw exception
    if (!foundUser) {
      throw new BadRequestException(MessageResponse.USER_NOT_FOUND);
    }
    if (foundUser.status === Status.deactive) {
      throw new BadRequestException(MessageResponse.USER_DEACTIVATED);
    }
    // compare password
    const isPasswordMatch = compareSync(login.password, foundUser.password);
    if (!isPasswordMatch) {
      throw new BadRequestException(MessageResponse.USER_INVALID_PASSWORD);
    }
    const roles = [foundUser.role.role];
    const tokens =
      await this.jsonWebTokenService.signAccessTokenAndRefreshToken(
        foundUser.id,
        foundUser.username,
        roles,
      );
    return {
      info: mapperUserToUserResponse(foundUser),
      tokens,
    };
  }

  async createEmployee(payload: CreateEmployeeDto) {
    // check username
    const existingEmployee = await this.employeeService.findByUsername(
      payload.username,
    );
    // if  found, throw exception
    if (existingEmployee) {
      throw new BadRequestException(MessageResponse.USER_EXISTED);
    }
    // create user
    return this.employeeService.create(payload);
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded =
      await this.jsonWebTokenService.verifyRefreshToken(refreshToken);

    if (!decoded)
      throw new UnauthorizedException(MessageResponse.REFRESH_TOKEN_INVALID);
    const user = await this.employeeService.findOne(decoded.id);
    if (!user) {
      throw new BadRequestException(MessageResponse.USER_NOT_FOUND);
    }
    const newPayloadRefreshToken: TokenPayload = {
      ...decoded,
      iat: new Date().getTime(),
    };
    const newPayloadAccessToken: TokenPayloadCreateDto = {
      username: decoded.username,
      roles: decoded.roles,
      id: decoded.id,
      typeToken: TokenType.ACCESS_TOKEN,
    };
    const [accessToken, newRefreshToken] = await Promise.all([
      this.jsonWebTokenService.signToken(newPayloadAccessToken),
      this.jsonWebTokenService.signTokenFullPayload(newPayloadRefreshToken),
    ]);
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async changePassword(id: number, body: ChangePasswordDto) {
    return this.employeeService.changePassword(id, body);
  }
}
