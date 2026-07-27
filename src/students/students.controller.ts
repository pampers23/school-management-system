import {
  Controller,
  Post,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService) {}

  @Post('from-application/:applicationId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createFromApplication(
    @Param('applicationId', ParseIntPipe) applicationId: number,
  ) {
    return this.studentService.createFromApplication(applicationId);
  }
}
