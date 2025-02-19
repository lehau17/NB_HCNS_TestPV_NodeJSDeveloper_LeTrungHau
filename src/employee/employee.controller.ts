import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeService } from './employee.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { MessageDeco } from '@app/common/decorator';
import { MessageResponse } from '@app/common/constraint';

@Controller('employees')
@ApiTags('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('/register')
  @MessageDeco(MessageResponse.USER_CREATED)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateEmployeeDto) {
    return this.employeeService.createEmployee(body);
  }

  @Post('login')
  @MessageDeco(MessageResponse.USER_LOGIN_SUCCESS)
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto) {
    return this.employeeService.login(body);
  }
}
