import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(ctx: any) {
    const user = ctx.user;
    return this.prisma.task.findMany({
      where: { userId: user.id },
    });
  }

  async findOne(ctx: any, id: number) {
    const user = ctx.user;
    return this.prisma.task.findUniqueOrThrow({
      where: { id, userId: user.id },
      include: { user: true },
    });
  }

  async create(ctx: any, data: CreateTaskDto) {
    const user = ctx.user;
    return this.prisma.task.create({
      data: {
        ...data,
        userId: user.id,
      },
    });
  }

  async update(ctx: any, id: number, data: UpdateTaskDto) {
    const user = ctx.user;

    return this.prisma.task.update({
      where: { id, userId: user.id },
      data,
    });
  }

  async delete(ctx: any, id: number) {
    const user = ctx.user;
    return this.prisma.task.delete({
      where: { id, userId: user.id },
    });
  }
}
