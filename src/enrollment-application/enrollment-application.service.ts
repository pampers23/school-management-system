import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, Role } from '../../generated/prisma/enums';
import { AssignReviewerDto } from './dto/assign-reviewer.dto';
import { CreateEnrollmentApplicationDto } from './dto/create-enrollment-application.dto';
import { ReviewEnrollmentApplicationDto } from './dto/review-enrollment-application.dto';

@Injectable()
export class EnrollmentApplicationService {
  constructor(private prisma: PrismaService) {}

  async assignReviewer(applicationId: number, dto: AssignReviewerDto) {
    const application = await this.prisma.enrollmentApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Enrollment application not found.');
    }

    if (application.status === ApplicationStatus.APPROVED) {
      throw new BadRequestException(
        'Cannot assign a reviewer to an already approved application.',
      );
    }

    if (application.status === ApplicationStatus.REJECTED) {
      throw new BadRequestException(
        'Cannot assign a reviewer to a reject application.',
      );
    }

    const reviewer = await this.prisma.user.findUnique({
      where: { id: dto.reviewerId },
    });

    if (!reviewer) {
      throw new NotFoundException('Reviewer not found.');
    }

    if (reviewer.role !== Role.TEACHER) {
      throw new BadRequestException(
        'Only teachers can be assigned to a application reviewers.',
      );
    }

    if (!reviewer.isActive) {
      throw new BadRequestException('The reviewer account is not active');
    }

    return this.prisma.enrollmentApplicationReview.upsert({
      where: {
        enrollmentApplicationId: applicationId,
      },
      update: {
        reviewId: dto.reviewerId,
        remarks: null,
        reviewedAt: null,
      },
      create: {
        enrollmentApplicationId: applicationId,
        reviewId: dto.reviewerId,
      },
      include: {
        enrollmentApplication: true,
        reviewer: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });
  }

  async approve(id: number) {
    const application = await this.prisma.enrollmentApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Enrollment application not found');
    }

    if (application.status === ApplicationStatus.APPROVED) {
      throw new BadRequestException(
        'Enrollment application is already approved.',
      );
    }

    if (application.status === ApplicationStatus.REJECTED) {
      throw new BadRequestException(
        'Rejected enrollment applications cannot be approved.',
      );
    }

    return this.prisma.enrollmentApplication.update({
      where: { id },
      data: {
        status: ApplicationStatus.APPROVED,
        approvedAt: new Date(),
        rejectedAt: null,
      },
    });
  }

  async findAll() {
    return this.prisma.enrollmentApplication.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async createApplication(dto: CreateEnrollmentApplicationDto) {
    const schoolYear = await this.prisma.schoolYear.findUnique({
      where: {
        id: dto.schoolYearId,
      },
    });

    if (!schoolYear) {
      throw new NotFoundException('School year not found.');
    }

    if (dto.isIP && !dto.ipCommunity) {
      throw new BadRequestException(
        'IP Community is required when the student is an IP',
      );
    }

    if (dto.is4Ps && !dto.householdId) {
      throw new BadRequestException(
        'Household ID is required when the student is a 4Ps beneficiary.',
      );
    }

    if (!dto.hasDisability) {
      // No disability records should be created later
    }

    return this.prisma.enrollmentApplication.create({
      data: {
        gradeLevel: dto.gradeLevel,
        hasLRN: dto.hasLRN,
        isReturning: dto.isReturning ?? false,

        schoolYearId: dto.schoolYearId,

        psaNumber: dto.psaNumber,
        lrn: dto.lrn,

        firstName: dto.firstName,
        middleName: dto.middleName,
        lastName: dto.lastName,
        extensionName: dto.extensionName,

        birthDate: new Date(dto.birthDate),
        gender: dto.gender,
        placeOfBirth: dto.placeOfBirth,

        isIP: dto.isIP ?? false,
        ipCommunity: dto.ipCommunity,

        is4Ps: dto.is4Ps ?? false,
        householdId: dto.householdId,

        hasDisability: dto.hasDisability ?? false,

        lastGradeCompleted: dto.lastGradeCompleted,
        lastSchoolYear: dto.lastSchoolYear,
        lastSchoolAttended: dto.lastSchoolAttended,
        lastSchoolId: dto.lastSchoolId,

        semester: dto.semester,
        track: dto.track,
        strand: dto.strand,

        status: ApplicationStatus.PENDING,
      },
      include: {
        schoolYear: true,
      },
    });
  }

  async findMyAssignedApplications(reviewId: number) {
    return this.prisma.enrollmentApplicationReview.findMany({
      where: {
        reviewId,
        enrollmentApplication: {
          status: ApplicationStatus.PENDING,
        },
      },
      include: {
        enrollmentApplication: {
          include: {
            schoolYear: true,
            addresses: true,
            parents: true,
            disabilities: true,
            learningModes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async reviewApplications(
    applicationId: number,
    reviewId: number,
    dto: ReviewEnrollmentApplicationDto,
  ) {
    const review = await this.prisma.enrollmentApplicationReview.findUnique({
      where: {
        enrollmentApplicationId: applicationId,
      },
      include: {
        enrollmentApplication: true,
      },
    });

    if (!review) {
      throw new NotFoundException(
        'This enrollment application has not been assgined to a reviewer.',
      );
    }

    if (review.reviewId !== reviewId) {
      throw new ForbiddenException(
        'You are not assigned to review this application',
      );
    }

    const application = review.enrollmentApplication;

    if (application.status === ApplicationStatus.APPROVED) {
      throw new BadRequestException(
        'This enrollment application has already been approved',
      );
    }

    if (application.status === ApplicationStatus.REJECTED) {
      throw new BadRequestException(
        'This enrollment application has already been rejected',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updateApplication = await tx.enrollmentApplication.update({
        where: {
          id: applicationId,
        },
        data: {
          status: dto.status,

          approvedAt:
            dto.status === ApplicationStatus.APPROVED ? new Date() : null,

          rejectedAt:
            dto.status === ApplicationStatus.REJECTED ? new Date() : null,
        },
      });

      const updateReview = await tx.enrollmentApplicationReview.update({
        where: {
          enrollmentApplicationId: applicationId,
        },
        data: {
          remarks: dto.remarks,
          reviewedAt: new Date(),
        },
      });

      return {
        message: `Enrollment application ${dto.status.toLowerCase()} successfully.`,
        application: updateApplication,
        review: updateReview,
      };
    });
  }
}
