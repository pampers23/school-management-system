import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AssessmentWeightService } from './assessment-weight.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { CreateAssessmentWeightDto } from './dto/create-assessment-weight.dto';

@Controller('assessment-weight')
export class AssessmentWeightController {
  constructor(
    private readonly assessmentWeightService: AssessmentWeightService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createAssessmentWeight(@Body() dto: CreateAssessmentWeightDto) {
    return this.assessmentWeightService.createAssessmentWeight(dto);
  }
}
