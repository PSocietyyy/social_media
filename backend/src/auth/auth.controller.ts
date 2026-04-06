import { Controller, Post, Body, Get, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterAuthDto } from './dto/register-auth.dto.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles/roles.guard.js';
import { Roles } from './decorators/roles.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginAuthDto) {
    return this.authService.login(body);
  }

  @Post('register')
  @HttpCode(201)
  register(@Body() body: RegisterAuthDto) {
    return this.authService.register(body);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body('refresh_token') token: string) {
    return this.authService.refresh(token);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  logout(@Body('refresh_token') token: string) {
    return this.authService.logout(token);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAllUsers() {
    return this.authService.findAllUsers();
  }
}