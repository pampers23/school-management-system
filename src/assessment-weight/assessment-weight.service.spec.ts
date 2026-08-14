import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentWeightController } from './assessment-weight.controller';
import { AssessmentWeightService } from './assessment-weight.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('AssessmentWeightController', () => {
  let controller: AssessmentWeightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentWeightController],
      providers: [
        {
          provide: AssessmentWeightService,
          useValue: {
            createAssessmentWeight: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AssessmentWeightController>(
      AssessmentWeightController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
