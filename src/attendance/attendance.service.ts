import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

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

  async findStudentForAttendance(attendanceSessionId: number, userId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const attendanceSession = await this.prisma.attendanceSession.findUnique({
      where: {
        id: attendanceSessionId,
      },
      include: {
        sectionSubject: true,
      },
    });

    if (!attendanceSession) {
      throw new NotFoundException('Attendance session not found.');
    }

    const assignment = await this.prisma.teacherAssignment.findFirst({
      where: {
        teacherId: teacher.id,
        sectionSubjectId: attendanceSession.sectionSubjectId,
        schoolYearId: attendanceSession.schoolYearId,
      },
    });

    if (!assignment) {
      throw new ForbiddenException(
        'You are not assigned to this attendance session.',
      );
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        sectionId: attendanceSession.sectionSubject.sectionId,
        schoolYearId: attendanceSession.schoolYearId,
        status: 'ENROLLED',
      },
      include: {
        student: {
          select: {
            id: true,
            studentNumber: true,
            firstName: true,
            middleName: true,
            lastName: true,
            extensionName: true,
          },
        },
      },
      orderBy: {
        student: {
          lastName: 'asc',
        },
      },
    });

    return enrollments.map(({ student }) => student);
  }

  async createAttendance(userId: number, dto: CreateAttendanceDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const attendanceSession = await this.prisma.attendanceSession.findUnique({
      where: {
        id: dto.attendanceSessionId,
      },
      include: {
        sectionSubject: true,
      },
    });

    if (!attendanceSession) {
      throw new NotFoundException('Attendance session not found.');
    }

    const assignment = await this.prisma.teacherAssignment.findFirst({
      where: {
        teacherId: teacher.id,
        sectionSubjectId: attendanceSession.sectionSubjectId,
        schoolYearId: attendanceSession.schoolYearId,
      },
    });

    if (!assignment) {
      throw new ForbiddenException(
        'You are not assigned to this attendance session.',
      );
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        sectionId: attendanceSession.sectionSubject.sectionId,
        schoolYearId: attendanceSession.schoolYearId,
        status: 'ENROLLED',
      },
      select: {
        studentId: true,
      },
    });

    const enrolledStudentIds = new Set(enrollments.map((e) => e.studentId));

    for (const record of dto.records) {
      if (!enrolledStudentIds.has(record.studentId)) {
        throw new BadRequestException(
          `Student ${record.studentId} is not enrolled in this section`,
        );
      }
    }

    const existingAttendance = await this.prisma.attendance.findMany({
      where: {
        attendanceSessionId: dto.attendanceSessionId,
        studentId: {
          in: dto.records.map((r) => r.studentId),
        },
      },
    });

    if (existingAttendance.length > 0) {
      throw new BadRequestException(
        'Attendance has already been recorded for one or more students',
      );
    }

    const attendance = await this.prisma.$transaction(
      dto.records.map((record) =>
        this.prisma.attendance.create({
          data: {
            attendanceSessionId: dto.attendanceSessionId,
            studentId: record.studentId,
            status: record.status,
            remarks: record.remarks,
          },
        }),
      ),
    );

    return {
      message: 'Attendance recorded successfully',
      total: attendance.length,
      attendance,
    };
  }
}
