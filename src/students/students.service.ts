import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async createFromApplication(applicationId: number) {
    const application = await this.prisma.enrollmentApplication.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        student: true,
        schoolYear: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Enrollment application not found.');
    }

    if (application.status !== 'APPROVED') {
      throw new BadRequestException(
        'Only approved enrollment applications can be converted to a student.',
      );
    }

    const year = new Date().getFullYear();

    const lastStudent = await this.prisma.student.findFirst({
      where: {
        studentNumber: {
          startsWith: `${year}-`,
        },
      },
      orderBy: {
        studentNumber: 'desc',
      },
    });

    let nextNumber = 1;

    if (lastStudent) {
      const lastNumber = parseInt(lastStudent.studentNumber.split('-')[1], 10);
      nextNumber = lastNumber + 1;
    }

    const studentNumber = `${year}-${String(nextNumber).padStart(4, '0')}`;

    const temporaryPassword = this.generateTemporaryPassword();

    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: studentNumber,
          password: hashedPassword,
          role: 'STUDENT',
          mustChangePassword: true,
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          studentNumber,
          firstName: application.firstName,
          middleName: application.middleName,
          lastName: application.lastName,
          extensionName: application.extensionName,
          enrollmentApplication: {
            connect: {
              id: application.id,
            },
          },
        },
      });

      return { student, user };
    });

    return {
      message: 'Student account created successfully.',
      student: {
        id: result.student.id,
        studentNumber: result.student.studentNumber,
        firstName: result.student.firstName,
        middleName: result.student.middleName,
        lastName: result.student.lastName,
        extensionName: result.student.extensionName,
      },
      account: {
        username: result.user.username,
        temporaryPassword,
        mustChangePassword: result.user.mustChangePassword,
      },
    };
  }

  private generateTemporaryPassword(): string {
    return `Student@${Math.floor(100000 + Math.random() * 900000)}`;
  }
}
