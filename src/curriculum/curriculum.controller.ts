import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { AddSubjectDto } from './dto/add-subject.dto';

@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post('add-curriculum')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateCurriculumDto) {
    return this.curriculumService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.curriculumService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.curriculumService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCurriculumDto,
  ) {
    return this.curriculumService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.curriculumService.remove(id);
  }

  @Post(':id/subjects/add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  addSubjects(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddSubjectDto,
  ) {
    return this.curriculumService.addSubjects(id, dto);
  }

  @Get(':id/subjects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getSubjects(@Param('id', ParseIntPipe) id: number) {
    return this.curriculumService.getSubjects(id);
  }

  @Delete(':id/subjects/:subjectId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  removeSubject(
    @Param('id', ParseIntPipe) curriculumId: number,
    @Body('subjectId', ParseIntPipe) subjectId: number,
  ) {
    return this.curriculumService.removeSubject(curriculumId, subjectId);
  }
}
