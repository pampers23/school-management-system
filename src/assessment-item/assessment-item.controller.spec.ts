import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentItemController } from './assessment-item.controller';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('AssessmentItemController', () => {
  let controller: AssessmentItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentItemController],
    }).compile();

    controller = module.get<AssessmentItemController>(AssessmentItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
