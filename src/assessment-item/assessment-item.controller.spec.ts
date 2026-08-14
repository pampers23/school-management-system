import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentItemController } from './assessment-item.controller';
import { AssessmentItemService } from './assessment-item.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('AssessmentItemController', () => {
  let controller: AssessmentItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentItemController],
      providers: [
        {
          provide: AssessmentItemService,
          useValue: {
            createAssessmentItem: jest.fn(),
            deleteAssessmentItem: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AssessmentItemController>(AssessmentItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
