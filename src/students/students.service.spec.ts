import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('StudentsService', () => {
  let service: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: PrismaService,
          useValue: {
            enrollmentApplication: {
              findUnique: jest.fn(),
            },
            student: {
              findFirst: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
