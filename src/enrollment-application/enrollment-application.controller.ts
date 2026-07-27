import {
  Controller,
  Patch,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { EnrollmentApplicationService } from './enrollment-application.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { AssignReviewerDto } from './dto/assign-reviewer.dto';
import { CreateEnrollmentApplicationDto } from './dto/create-enrollment-application.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReviewEnrollmentApplicationDto } from './dto/review-enrollment-application.dto';

@Controller('enrollment-application')
export class EnrollmentApplicationController {
  constructor(
    private readonly enrollmentApplicationService: EnrollmentApplicationService,
  ) {}

  @Post(':id/assign-reviewer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  assignReviewer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignReviewerDto,
  ) {
    return this.enrollmentApplicationService.assignReviewer(id, dto);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentApplicationService.approve(id);
  }

  @Get()
  findAll() {
    return this.enrollmentApplicationService.findAll();
  }

  @Post()
  createApplication(@Body() dto: CreateEnrollmentApplicationDto) {
    return this.enrollmentApplicationService.createApplication(dto);
  }

  @Get('my-assigned')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  findMyAssignedApplications(@CurrentUser('id') userId: number) {
    return this.enrollmentApplicationService.findMyAssignedApplications(userId);
  }

  @Patch(':id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  reviewApplications(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: ReviewEnrollmentApplicationDto,
  ) {
    return this.enrollmentApplicationService.reviewApplications(
      id,
      userId,
      dto,
    );
  }
}
