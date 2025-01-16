import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TaskEntity } from './entities/task.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Context } from 'src/decorators/context.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiOkResponse({ type: [TaskEntity] })
  async findAllTasks(@Context() ctx: any) {
    const tasks = await this.tasksService.findAll(ctx);
    return tasks.map((task) => new TaskEntity(task));
  }

  @Get(':id')
  @ApiOkResponse({ type: TaskEntity })
  async findTaskById(
    @Context() ctx: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const task = await this.tasksService.findOne(ctx, id);
    return new TaskEntity(task);
  }

  @Post()
  @ApiCreatedResponse({ type: TaskEntity })
  async createTask(@Context() ctx: any, @Body() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.create(ctx, createTaskDto);
    return new TaskEntity(task);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TaskEntity })
  async updateTask(
    @Context() ctx: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.tasksService.update(ctx, id, updateTaskDto);
    return new TaskEntity(task);
  }

  @Delete(':id')
  @ApiOkResponse({ type: TaskEntity })
  async deleteTask(@Context() ctx: any, @Param('id', ParseIntPipe) id: number) {
    const task = await this.tasksService.delete(ctx, id);
    return new TaskEntity(task);
  }
}
