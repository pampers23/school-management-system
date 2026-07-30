import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  createAttendanceSession(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateAttendanceSessionDto,
  ) {
    return this.attendanceService.createAttendanceSession(userId, dto);
  }
}
