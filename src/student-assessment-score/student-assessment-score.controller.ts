import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { StudentAssessmentScoreService } from './student-assessment-score.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { CreateAssessmentScoreDto } from './dto/create-student-assessment-score.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('student-assessment-score')
export class StudentAssessmentScoreController {
  constructor(
    private readonly studentAssessmentScoreService: StudentAssessmentScoreService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  createAssessmentScore(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateAssessmentScoreDto,
  ) {
    return this.studentAssessmentScoreService.createAssessmentScore(
      userId,
      dto,
    );
  }
}
