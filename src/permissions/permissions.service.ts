import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { MessageResponse } from '@app/common';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePermissionDto) {
    // check role and permissions
    const [role, resource] = await Promise.all([
      this.prisma.roles.findFirst({ where: { id: data.role_id } }),
      this.prisma.resources.findFirst({ where: { id: data.resource_id } }),
    ]);
    if (!role || role.status === 'deactive')
      throw new BadRequestException(MessageResponse.ROLE_NOT_EXIST);
    if (!resource || resource.status === 'deactive')
      throw new BadRequestException(MessageResponse.RESOURCE_NOT_EXIST);
    const foundResource = await this.prisma.permissions.findFirst({
      where: {
        role_id: data.role_id,
        resource_id: data.resource_id,
        permission: data.permission,
      },
    });
    if (foundResource)
      throw new BadRequestException(MessageResponse.PERMISSION_EXIST);
    return this.prisma.permissions.create({ data });
  }

  async findAll() {
    return this.prisma.permissions.findMany({
      include: { role: true, resource: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.permissions.findUnique({
      where: { id },
      include: { role: true, resource: true },
    });
  }

  async remove(id: number) {
    const foundPermission = await this.prisma.permissions.findFirst({
      where: { id },
    });
    if (!foundPermission)
      throw new BadRequestException(MessageResponse.PERMISSION_NOT_EXIST);
    return this.prisma.permissions.delete({ where: { id } });
  }

  async update(id: number, data: UpdatePermissionDto) {
    const [foundPermission, role, resource] = await Promise.all([
      this.prisma.permissions.findUnique({
        where: { id },
      }),
      this.prisma.roles.findFirst({ where: { id: data.role_id } }),
      this.prisma.resources.findFirst({ where: { id: data.resource_id } }),
    ]);

    if (!foundPermission)
      throw new BadRequestException(MessageResponse.PERMISSION_NOT_EXIST);
    if (!role || role.status === 'deactive')
      throw new BadRequestException(MessageResponse.ROLE_NOT_EXIST);
    if (!resource || resource.status === 'deactive')
      throw new BadRequestException(MessageResponse.RESOURCE_NOT_EXIST);

    return this.prisma.permissions.update({
      where: { id },
      data,
    });
  }
}
