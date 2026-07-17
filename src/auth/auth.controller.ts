import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { RolesGuard } from './guards/roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtUser } from '../type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('me')
  // me(@Req() req: Request & { user: { id: number } }) {
  //   return this.authService.me(req.user.id);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword() {
    return this.authService.changePassword();
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
