import { Controller, Get, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FindManyEmployeeDto } from './dto/findMany.dto';
import {
  MessageDeco,
  MessageResponse,
  PublicApi,
  TokenPayload,
  User,
} from '@app/common';

@Controller('employees')
@ApiTags('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @PublicApi()
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @ApiQuery({ name: 'fullname', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    default: 'id',
    enum: ['fullname', 'created_at', 'updated_at', 'id'],
  })
  @ApiQuery({ name: 'orderType', required: false, enum: ['ASC', 'DESC'] })
  @MessageDeco(MessageResponse.USER_FIND_MANY)
  findMany(@Query() query: FindManyEmployeeDto) {
    return this.employeeService.findMany(query);
  }

  @Get('/me')
  @ApiBearerAuth()
  @MessageDeco(MessageResponse.USER_INFO)
  getMe(@User() { id }: TokenPayload) {
    return this.employeeService.findOne(id);
  }
}
