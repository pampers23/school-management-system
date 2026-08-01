import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentWeightController } from './assessment-weight.controller';

describe('AssessmentWeightController', () => {
  let controller: AssessmentWeightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentWeightController],
    }).compile();

    controller = module.get<AssessmentWeightController>(AssessmentWeightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
