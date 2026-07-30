import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async createAttendanceSession(
    userId: number,
    dto: CreateAttendanceSessionDto,
  ) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found.');
    }

    const sectionSubject = await this.prisma.sectionSubject.findUnique({
      where: {
        id: dto.sectionSubjectId,
      },
    });

    if (!sectionSubject) {
      throw new NotFoundException('Section subject not found');
    }

    const schoolYear = await this.prisma.schoolYear.findUnique({
      where: {
        id: dto.schoolYearId,
      },
    });

    if (!schoolYear) {
      throw new NotFoundException('School year not found.');
    }

    if (!schoolYear.isCurrent) {
      throw new BadRequestException(
        'Attendance sessions can only be created for the current school year.',
      );
    }

    const assignment = await this.prisma.teacherAssignment.findFirst({
      where: {
        teacherId: teacher.id,
        sectionSubjectId: dto.sectionSubjectId,
        schoolYearId: dto.schoolYearId,
      },
    });

    if (!assignment) {
      throw new ForbiddenException(
        'You are not assigned to this section subject.',
      );
    }

    const attendanceDate = new Date(dto.attendanceDate);

    attendanceDate.setHours(0, 0, 0, 0);

    const existingSession = await this.prisma.attendanceSession.findFirst({
      where: {
        sectionSubjectId: dto.sectionSubjectId,
        attendanceDate,
      },
    });

    if (existingSession) {
      throw new BadRequestException(
        'Attendance session already exists for this date.',
      );
    }

    return this.prisma.attendanceSession.create({
      data: {
        sectionSubjectId: dto.sectionSubjectId,
        schoolYearId: dto.schoolYearId,
        attendanceDate,
        createdByTeacherId: teacher.id,
      },
      include: {
        sectionSubject: {
          include: {
            subject: true,
            section: true,
          },
        },
        schoolYear: true,
        createdByTeacher: {
          select: {
            employeeId: true,
            firstName: true,
            middleName: true,
            lastName: true,
            extensionName: true,
          },
        },
      },
    });
  }
}
