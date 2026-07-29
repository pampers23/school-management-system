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

  async create(userId: number, dto: CreateEnrollmentDto) {
    const student = await this.prisma.student.findUnique({
      where: {
        userId,
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
          studentId: student.id,
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
        studentId: student.id,
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

  async findAll() {
    return this.prisma.enrollment.findMany({
      include: {
        student: true,
        schoolYear: true,
        section: {
          include: {
            curriculum: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        id,
      },
      include: {
        student: true,
        schoolYear: true,
        section: {
          include: {
            curriculum: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found.');
    }

    return enrollment;
  }

  async findMyEnrollments(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found.');
    }

    return this.prisma.enrollment.findMany({
      where: {
        studentId,
      },
      include: {
        schoolYear: true,
        section: {
          include: {
            curriculum: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async cancel(id: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        id,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found.');
    }

    return this.prisma.enrollment.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
      },
      include: {
        student: true,
        schoolYear: true,
        section: true,
      },
    });
  }

  async findByUserId(userId: number) {
    const student = await this.prisma.student.findUnique({
      where: {
        userId,
      },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found.');
    }

    return this.prisma.enrollment.findMany({
      where: {
        studentId: student.id,
      },
      include: {
        schoolYear: true,
        section: {
          include: {
            curriculum: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
