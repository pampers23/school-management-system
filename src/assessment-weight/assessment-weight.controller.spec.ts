import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentWeightService } from './assessment-weight.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('AssessmentWeightService', () => {
  let service: AssessmentWeightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssessmentWeightService,
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
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AssessmentWeightService>(AssessmentWeightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
