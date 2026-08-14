import { Test, TestingModule } from '@nestjs/testing';
import { CurriculumService } from './curriculum.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('CurriculumService', () => {
  let service: CurriculumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurriculumService,
        {
          provide: PrismaService,
          useValue: {
            schoolYear: {
              findUnique: jest.fn(),
            },
            curriculum: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            subject: {
              findMany: jest.fn(),
            },
            curriculumSubject: {
              createMany: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CurriculumService>(CurriculumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
