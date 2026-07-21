import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../../generated/prisma/enums';
import * as bcrypt from 'bcrypt';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTeacherDto) {
    const existingTeacher = await this.prisma.teacher.findUnique({
      where: {
        employeeId: dto.employeeId,
      },
    });

    if (existingTeacher) {
      throw new BadRequestException('Employee ID is already exists');
    }

    const temporaryPassword = 'Temp@123';

    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: dto.employeeId,
          password: hashedPassword,
          role: Role.TEACHER,
          mustChangePassword: true,
        },
      });

      const teacher = await tx.teacher.create({
        data: {
          employeeId: dto.employeeId,
          firstName: dto.firstName,
          lastName: dto.lastName,
          middleName: dto.middleName,
          extensionName: dto.extensionName,
          userId: user.id,
        },
      });

      return {
        message: 'Teacher created Successfully',
        username: user.username,
        temporaryPassword,
        teacher,
      };
    });
  }

  async findAll() {
    return this.prisma.teacher.findMany({
      where: {
        user: {
          isActive: true,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            isActive: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async update(id: number, dto: UpdateTeacherDto) {
    await this.findOne(id);

    return this.prisma.teacher.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: number) {
    const teacher = await this.findOne(id);

    await this.prisma.user.update({
      where: {
        id: teacher.userId,
      },
      data: {
        isActive: false,
      },
    });

    return { message: 'Teacher deactivated successfully' };
  }
}
