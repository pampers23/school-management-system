import { Test, TestingModule } from '@nestjs/testing';
import { StudentAssessmentScoreController } from './student-assessment-score.controller';

describe('StudentAssessmentScoreController', () => {
  let controller: StudentAssessmentScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentAssessmentScoreController],
    }).compile();

    controller = module.get<StudentAssessmentScoreController>(StudentAssessmentScoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
