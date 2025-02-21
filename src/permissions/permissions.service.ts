import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { MessageResponse } from '@app/common';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePermissionDto) {
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
}
