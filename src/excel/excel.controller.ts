import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  ParseIntPipe,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ExcelService } from './excel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  @UseInterceptors(FileInterceptor('file'))
  importQuarterGrades(
    @UploadedFile() file: Express.Multer.File,
    @Body('sectionSubjectId') sectionSubjectId: number,
    @Body('gradingPeriodId') gradingPeriodId: number,
  ) {
    if (!sectionSubjectId || !gradingPeriodId) {
      throw new BadRequestException(
        'Sectoin Subject ID and Grading Period ID are required',
      );
    }
    return this.excelService.importQuarterGrades(
      file,
      Number(sectionSubjectId),
      Number(gradingPeriodId),
    );
  }

  @Get('debug/enrollment/:sectionSubjectId')
  async debugEnrollment(
    @Param('sectionSubjectId', ParseIntPipe) sectionSubjectId: number,
  ) {
    return this.excelService.debugEnrollment(sectionSubjectId);
  }

  @Patch('debug/enrollment/:enrollmentId/activate')
  async activateEnrollment(
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
  ) {
    return this.excelService.activateEnrollment(enrollmentId);
  }

  @Get(
    'grades/section-subject/:sectionSubjectId/grading-period/:gradingPeriodId',
  )
  async getGrades(
    @Param('sectionSubjectId', ParseIntPipe) sectionSubjectId: number,
    @Param('gradingPeriodId', ParseIntPipe) gradingPeriodId: number,
  ) {
    return this.excelService.getGrades(sectionSubjectId, gradingPeriodId);
  }

  @Get('student/:studentId/quarter/:gradingPeriodId')
  async getStudentQuarterlyAverage(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('gradingPeriodId', ParseIntPipe) gradingPeriodId: number,
  ) {
    return this.excelService.getStudentQuarterlyAverage(
      studentId,
      gradingPeriodId,
    );
  }
}
