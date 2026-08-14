import { Test, TestingModule } from '@nestjs/testing';
import { StudentAssessmentScoreService } from './student-assessment-score.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('StudentAssessmentScoreService', () => {
  let service: StudentAssessmentScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentAssessmentScoreService,
        {
          provide: PrismaService,
          useValue: {
            teacher: {
              findUnique: jest.fn(),
            },
            assessmentItem: {
              findUnique: jest.fn(),
            },
            teacherAssignment: {
              findFirst: jest.fn(),
            },
            student: {
              findUnique: jest.fn(),
            },
            enrollment: {
              findFirst: jest.fn(),
            },
            studentAssessmentScore: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<StudentAssessmentScoreService>(
      StudentAssessmentScoreService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
