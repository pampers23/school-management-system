import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { GradingPeriodsService } from './grading-periods.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { CreateGradingPeriodDto } from './dto/create-grading-period.dto';

@Controller('grading-periods')
export class GradingPeriodsController {
  constructor(private readonly gradingPeriodService: GradingPeriodsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateGradingPeriodDto) {
    return this.gradingPeriodService.create(dto);
  }
}
