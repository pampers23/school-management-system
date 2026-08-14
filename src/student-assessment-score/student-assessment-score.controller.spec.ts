import { Test, TestingModule } from '@nestjs/testing';
import { StudentAssessmentScoreController } from './student-assessment-score.controller';
import { StudentAssessmentScoreService } from './student-assessment-score.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('StudentAssessmentScoreController', () => {
  let controller: StudentAssessmentScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentAssessmentScoreController],
      providers: [
        {
          provide: StudentAssessmentScoreService,
          useValue: {
            createAssessmentScore: jest.fn(),
            updateAssessmentScore: jest.fn(),
            deleteAssessmentScore: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StudentAssessmentScoreController>(
      StudentAssessmentScoreController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
