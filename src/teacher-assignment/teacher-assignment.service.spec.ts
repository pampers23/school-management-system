import { Test, TestingModule } from '@nestjs/testing';
import { TeacherAssignmentService } from './teacher-assignment.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('TeacherAssignmentService', () => {
  let service: TeacherAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherAssignmentService],
    }).compile();

    service = module.get<TeacherAssignmentService>(TeacherAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
