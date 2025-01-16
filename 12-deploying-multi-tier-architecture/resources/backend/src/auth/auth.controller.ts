import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    return this.authService.login(username, password);
  }

  @Post('register')
  @ApiOkResponse({ type: AuthEntity })
  register(@Body() registerDto: RegisterDto) {
    const { name, username, password } = registerDto;
    return this.authService.register(name, username, password);
  }
}
