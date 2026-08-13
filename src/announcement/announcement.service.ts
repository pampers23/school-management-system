import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnnouncementAudience, Role } from '../../generated/prisma/enums';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementService {
  constructor(private prisma: PrismaService) {}

  // create announcement
  async create(userId: number, role: Role, dto: CreateAnnouncementDto) {
    // 1. Validate section only for SECTION announcements
    if (dto.audience === AnnouncementAudience.SECTION) {
      if (!dto.sectionId) {
        throw new BadRequestException(
          'Section ID is required for a section announcement.',
        );
      }

      const section = await this.prisma.section.findUnique({
        where: {
          id: dto.sectionId,
        },
      });

      if (!section) {
        throw new NotFoundException('Section not found.');
      }

      // 2. If teacher, verify teacher assignment
      if (role === Role.TEACHER) {
        const teacher = await this.prisma.teacher.findUnique({
          where: {
            userId,
          },
        });

        if (!teacher) {
          throw new NotFoundException('Teacher profile not found.');
        }

        const assignment = await this.prisma.teacherAssignment.findFirst({
          where: {
            teacherId: teacher.id,
            sectionSubject: {
              sectionId: dto.sectionId,
            },
          },
        });

        if (!assignment) {
          throw new ForbiddenException('You are not assigned to this section.');
        }
      }
    }

    // 3. Teachers cannot create school-wide announcements
    if (role === Role.TEACHER && dto.audience === AnnouncementAudience.ALL) {
      throw new ForbiddenException(
        'Teachers cannot create school-wide announcements.',
      );
    }

    // 4. Create announcement
    return this.prisma.announcement.create({
      data: {
        title: dto.title,
        content: dto.content,
        audience: dto.audience,

        sectionId:
          dto.audience === AnnouncementAudience.SECTION ? dto.sectionId! : null,

        createdByUserId: userId,
        isPublished: dto.isPublished ?? true,
      },

      include: {
        section: true,

        createdByUser: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });
  }

  // find all
  async findAll() {
    return this.prisma.announcement.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        section: true,
        createdByUser: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });
  }

  //find one
  async findOne(id: number) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: {
        section: true,
        createdByUser: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found.');
    }

    return announcement;
  }

  // student announcements
  async findMyAnnouncements(userId: number) {
    // 1. find student
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found.');
    }

    //2. find student's current enrollment
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        status: 'ENROLLED',
        schoolYear: {
          isCurrent: true,
        },
      },
      select: {
        sectionId: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException(
        'Student is not currently enrolled in a section',
      );
    }

    //3. get school-wide + section announcements
    return this.prisma.announcement.findMany({
      where: {
        isPublished: true,
        OR: [
          {
            audience: AnnouncementAudience.ALL,
          },
          {
            audience: AnnouncementAudience.SECTION,
            sectionId: enrollment.sectionId,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        section: true,
        createdByUser: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });
  }

  // update
  async update(
    id: number,
    userId: number,
    role: Role,
    dto: UpdateAnnouncementDto,
  ) {
    const exisitingAnnouncement = await this.findOne(id);

    // 1. determine final values
    const audience = dto.audience ?? exisitingAnnouncement.audience;

    const sectionId = dto.sectionId ?? exisitingAnnouncement.sectionId;

    // 2. validate section announcement
    if (audience === AnnouncementAudience.SECTION) {
      if (!sectionId) {
        throw new BadRequestException(
          'Section ID is required for a section announcement.',
        );
      }

      const section = await this.prisma.section.findUnique({
        where: { id: sectionId },
      });

      if (!section) {
        throw new NotFoundException('Section not found.');
      }

      // teacher authorization
      if (role === Role.TEACHER) {
        const teacher = await this.prisma.teacher.findUnique({
          where: { userId },
        });

        if (!teacher) {
          throw new NotFoundException('Teacher profile not found.');
        }

        const assignment = await this.prisma.teacherAssignment.findFirst({
          where: {
            teacherId: teacher.id,
            sectionSubject: {
              sectionId,
            },
          },
        });

        if (!assignment) {
          throw new ForbiddenException('You are not assigned to this section.');
        }
      }
    }

    // 3. teachers cannot change at ALL
    if (role === Role.TEACHER && audience === AnnouncementAudience.ALL) {
      throw new ForbiddenException(
        'Teachers cannot create school-wide announcements',
      );
    }

    // 4. update
    return this.prisma.announcement.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
        audience,
        sectionId: audience === AnnouncementAudience.SECTION ? sectionId : null,
        isPublished: dto.isPublished,
      },
      include: {
        section: true,
        createdByUser: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });
  }

  // delete
  async delete(id: number) {
    await this.findOne(id);

    await this.prisma.announcement.delete({
      where: { id },
    });

    return { message: 'Announcement deleted sucessfully.' };
  }
}
