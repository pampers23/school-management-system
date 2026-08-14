import { Test, TestingModule } from '@nestjs/testing';
import { TeacherAssignmentController } from './teacher-assignment.controller';
import { TeacherAssignmentService } from './teacher-assignment.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('TeacherAssignmentController', () => {
  let controller: TeacherAssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherAssignmentController],
      providers: [
        {
          provide: TeacherAssignmentService,
          useValue: {
            assign: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TeacherAssignmentController>(
      TeacherAssignmentController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
