import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEnrollmentDto) {
    const student = await this.prisma.student.findUnique({
      where: {
        id: dto.studentId,
      },
      include: {
        enrollmentApplication: true,
      },
    });

    if (!student?.enrollmentApplication) {
      throw new NotFoundException(
        'Student does not have an enrollment application.',
      );
    }

    const schoolYear = await this.prisma.schoolYear.findUnique({
      where: {
        id: dto.schoolYearId,
      },
    });

    if (!schoolYear) {
      throw new NotFoundException('School year not found.');
    }

    const section = await this.prisma.section.findUnique({
      where: {
        id: dto.sectionId,
      },
      include: {
        curriculum: true,
      },
    });

    if (!section) {
      throw new NotFoundException('Section not found.');
    }

    if (!section.isActive) {
      throw new BadRequestException(
        'Cannot enroll a student in an inactive section.',
      );
    }

    const studentGradeLevel = student.enrollmentApplication.gradeLevel;

    const sectionGradeLevel = section.curriculum.gradeLevel;

    if (studentGradeLevel !== sectionGradeLevel) {
      throw new BadRequestException(
        `Student is Grade ${studentGradeLevel} and cannot enroll in a Grade ${sectionGradeLevel} section`,
      );
    }

    if (section.curriculum.schoolYearId !== dto.schoolYearId) {
      throw new BadRequestException(
        'The selected section does not belong to the selected school year',
      );
    }

    const enrolledStudents = await this.prisma.enrollment.count({
      where: {
        sectionId: dto.sectionId,
        schoolYearId: dto.schoolYearId,
        status: 'ENROLLED',
      },
    });

    if (enrolledStudents >= section.capacity) {
      throw new BadRequestException('Section is already full.');
    }

    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_schoolYearId: {
          studentId: dto.studentId,
          schoolYearId: dto.schoolYearId,
        },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException(
        'Student is already enrolled for this school year.',
      );
    }

    return this.prisma.enrollment.create({
      data: {
        studentId: dto.studentId,
        schoolYearId: dto.schoolYearId,
        sectionId: dto.sectionId,
        status: 'ENROLLED',
        enrolledAt: new Date(),
      },
      include: {
        student: true,
        schoolYear: true,
        section: true,
      },
    });
  }
}
