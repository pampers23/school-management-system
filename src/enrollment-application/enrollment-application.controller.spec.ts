import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentApplicationController } from './enrollment-application.controller';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('EnrollmentApplicationController', () => {
  let controller: EnrollmentApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentApplicationController],
    }).compile();

    controller = module.get<EnrollmentApplicationController>(
      EnrollmentApplicationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
