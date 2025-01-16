import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthEntity } from './entities/auth.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async login(username: string, password: string): Promise<AuthEntity> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('No user found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }

  async register(
    name: string,
    username: string,
    password: string,
  ): Promise<AuthEntity> {
    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.userService.create({
      name,
      username,
      password,
    });

    return {
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }
}
