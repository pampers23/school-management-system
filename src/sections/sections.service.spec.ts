import { Test, TestingModule } from '@nestjs/testing';
import { SectionsService } from './sections.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('SectionsService', () => {
  let service: SectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectionsService,
        {
          provide: PrismaService,
          useValue: {
            curriculum: {
              findUnique: jest.fn(),
            },
            section: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            sectionSubject: {
              createMany: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SectionsService>(SectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
