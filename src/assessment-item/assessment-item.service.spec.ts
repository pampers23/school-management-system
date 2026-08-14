import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentItemService } from './assessment-item.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('AssessmentItemService', () => {
  let service: AssessmentItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssessmentItemService,
        {
          provide: PrismaService,
          useValue: {
            sectionSubject: {
              findUnique: jest.fn(),
            },
            gradingPeriod: {
              findUnique: jest.fn(),
            },
            assessmentWeight: {
              findUnique: jest.fn(),
            },
            assessmentItem: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
            },
            teacher: {
              findUnique: jest.fn(),
            },
            teacherAssignment: {
              findFirst: jest.fn(),
            },
            studentAssessmentScore: {
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AssessmentItemService>(AssessmentItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
