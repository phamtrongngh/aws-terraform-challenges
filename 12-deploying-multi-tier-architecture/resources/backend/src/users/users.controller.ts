import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Context } from 'src/decorators/context.decorator';

@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({ type: UserEntity })
  async find(@Context() ctx: any) {
    const user = await this.usersService.findOne(ctx.user.id);
    return new UserEntity(user);
  }

  @Patch('me')
  @ApiOkResponse({ type: UserEntity })
  async update(@Context() ctx: any, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(ctx.user.id, updateUserDto);
    return new UserEntity(user);
  }
}
