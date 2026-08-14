import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentApplicationService } from './enrollment-application.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('EnrollmentApplicationService', () => {
  let service: EnrollmentApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentApplicationService,
        {
          provide: PrismaService,
          useValue: {
            enrollmentApplication: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            enrollmentApplicationReview: {
              upsert: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
            schoolYear: {
              findUnique: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EnrollmentApplicationService>(
      EnrollmentApplicationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
