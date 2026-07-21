import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherAssignmentDto } from './dto/create-teacher-assignment.dto';
import { UpdateTeacherAssignmentDto } from './dto/update-teacher-assignment.dto';

@Injectable()
export class TeacherAssignmentService {
  constructor(private prisma: PrismaService) {}

  async assign(dto: CreateTeacherAssignmentDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id: dto.teacherId,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher is not found');
    }

    const sectionSubject = await this.prisma.sectionSubject.findUnique({
      where: {
        id: dto.sectionSubjectId,
      },
    });

    if (!sectionSubject) {
      throw new NotFoundException('A subject in a section is not found');
    }

    const schoolYear = await this.prisma.schoolYear.findUnique({
      where: {
        id: dto.schoolYearId,
      },
    });

    if (!schoolYear) {
      throw new NotFoundException('School Year not found.');
    }

    const existingAssignment = await this.prisma.teacherAssignment.findUnique({
      where: {
        sectionSubjectId_schoolYearId: {
          sectionSubjectId: dto.sectionSubjectId,
          schoolYearId: dto.schoolYearId,
        },
      },
    });

    if (existingAssignment) {
      throw new BadRequestException(
        'A teacher is already assigned to this section subject for this school year,',
      );
    }

    return this.prisma.teacherAssignment.create({
      data: {
        teacherId: dto.teacherId,
        schoolYearId: dto.schoolYearId,
        sectionSubjectId: dto.sectionSubjectId,
      },
      include: {
        teacher: true,
        sectionSubject: {
          include: {
            section: true,
            subject: true,
          },
        },
        schoolYear: true,
      },
    });
  }

  async findAll() {
    return this.prisma.teacherAssignment.findMany({
      include: {
        teacher: true,
        sectionSubject: {
          include: {
            section: true,
            subject: true,
          },
        },
        schoolYear: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const assignment = await this.prisma.teacherAssignment.findUnique({
      where: {
        id,
      },
      include: {
        teacher: true,
        sectionSubject: {
          include: {
            section: true,
            subject: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Teacher assignment not found.');
    }

    return assignment;
  }

  async update(id: number, dto: UpdateTeacherAssignmentDto) {
    const assignment = await this.findOne(id);

    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id: dto.teacherId,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return this.prisma.teacherAssignment.update({
      where: {
        id: assignment.id,
      },
      data: {
        teacherId: dto.teacherId,
      },
      include: {
        teacher: true,
        sectionSubject: {
          include: {
            section: true,
            subject: true,
          },
        },
        schoolYear: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.teacherAssignment.delete({
      where: {
        id,
      },
    });

    return { message: 'Teacher assignment removed successfully' };
  }
}
