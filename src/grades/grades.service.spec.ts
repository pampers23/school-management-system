import { Test, TestingModule } from '@nestjs/testing';
import { GradesService } from './grades.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('GradesService', () => {
  let service: GradesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradesService,
        {
          provide: PrismaService,
          useValue: {
            assessmentItem: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
            studentAssessmentScore: {
              findUnique: jest.fn(),
            },
            assessmentWeight: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GradesService>(GradesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
