import { Controller, Post, Body, Get, UseGuards, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { RolesGuard } from './guards/roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtUser } from '../type';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @CurrentUser('id') userId: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, dto);
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  adminOnly() {
    return {
      message: 'Welcome Admin!',
    };
  }

  @Get('teacher')
  @Roles(Role.TEACHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  teacherOnly() {
    return {
      message: 'Welcome Teacher!',
    };
  }

  @Get('student')
  @Roles(Role.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  studentOnly() {
    return {
      message: 'Welcome Teacher!',
    };
  }

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  whoAmI(@CurrentUser() user: JwtUser) {
    return user;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: JwtUser) {
    return { user };
  }
}
