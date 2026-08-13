import { Test, TestingModule } from '@nestjs/testing';
import { StudentAssessmentScoreService } from './student-assessment-score.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('StudentAssessmentScoreService', () => {
  let service: StudentAssessmentScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentAssessmentScoreService],
    }).compile();

    service = module.get<StudentAssessmentScoreService>(
      StudentAssessmentScoreService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
