import { Test, TestingModule } from '@nestjs/testing';
import { TeacherAssignmentService } from './teacher-assignment.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('TeacherAssignmentService', () => {
  let service: TeacherAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherAssignmentService,
        {
          provide: PrismaService,
          useValue: {
            teacher: {
              findUnique: jest.fn(),
            },
            sectionSubject: {
              findUnique: jest.fn(),
            },
            schoolYear: {
              findUnique: jest.fn(),
            },
            teacherAssignment: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TeacherAssignmentService>(TeacherAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
