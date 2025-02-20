import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageResponse } from '@app/common';
import { Paging, PagingBuilder } from '@app/common/types/paging';
import { Prisma, roles, Status } from '@prisma/client';
import { FindManyEmployeeDto } from 'src/employee/dto/findMany.dto';
import { FindManyRoleDto } from './dto/find-many.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    // check unique

    const foundRole = await this.prismaService.roles.findFirst({
      where: {
        role: createRoleDto.role.toUpperCase(),
      },
    });
    if (foundRole) throw new BadRequestException(MessageResponse.ROLE_IS_EXIST);
    return this.prismaService.roles.create({
      data: { ...createRoleDto, role: createRoleDto.role.toUpperCase() },
    });
  }

  async findMany({
    limit = 20,
    page = 1,
    cursor,
    isActive,
    role = '',
    orderBy = 'id',
    orderType = 'DESC',
  }: FindManyRoleDto): Promise<Paging<roles>> {
    limit = Number(limit);
    page = Number(page);
    cursor = Number(cursor);
    let status: Status = Status.deactive;
    if (isActive) {
      if (isActive === true) {
        status = Status.active;
      } else {
        status = Status.deactive;
      }
    } else {
      status = undefined;
    }
    const options: Prisma.rolesFindManyArgs = {
      take: limit,
      skip: cursor ? 1 : (page - 1) * limit,
      where: {
        id: cursor ? { gte: cursor } : undefined,
        status: status,
        role: {
          contains: role,
        },
      },
      orderBy: [
        {
          [orderBy]: orderType.toLowerCase(),
        },
      ],
    };

    const [foundUser, total] = await Promise.all([
      this.prismaService.roles.findMany(options),
      this.prismaService.roles.count({
        where: {
          status,
          role: {
            contains: role,
          },
        },
      }),
    ]);

    return new PagingBuilder<roles>()
      .setLimit(limit)
      .setPage(page)
      .setTotal(total)
      .setData(foundUser)
      .setNextPage(total / page <= limit ? null : page + 1)
      .setPrevPage(page === 1 ? null : page - 1)
      .build();
  }

  findByName(name: string) {
    return this.prismaService.roles.findFirst({ where: { role: name } });
  }

  findOne(id: number) {
    return this.prismaService.roles.findFirst({
      where: { id },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const foundRole = await this.findOne(id);
    if (!foundRole)
      throw new BadRequestException(MessageResponse.ROLE_NOT_EXIST);
    return this.prismaService.roles.update({
      where: { id },
      data: { ...updateRoleDto },
    });
  }

  async softDelete(id: number) {
    const foundRole = await this.findOne(id);
    if (!foundRole)
      throw new BadRequestException(MessageResponse.ROLE_NOT_EXIST);
    return this.prismaService.roles.update({
      where: {
        id: id,
      },
      data: {
        status: 'deactive',
      },
    });
  }
}
