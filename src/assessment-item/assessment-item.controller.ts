import {
  Controller,
  Post,
  UseGuards,
  Body,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AssessmentItemService } from './assessment-item.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { CreateAssessmentItemDto } from './dto/create-assessment-item.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('assessment-item')
export class AssessmentItemController {
  constructor(private readonly assessmentItemService: AssessmentItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  createAssessmentItem(@Body() dto: CreateAssessmentItemDto) {
    return this.assessmentItemService.createAssessmentItem(dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  deleteAssessmentItem(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.assessmentItemService.deleteAssessmentItem(userId, id);
  }
}
