import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentApplicationController } from './enrollment-application.controller';
import { EnrollmentApplicationService } from './enrollment-application.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('EnrollmentApplicationController', () => {
  let controller: EnrollmentApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentApplicationController],
      providers: [
        {
          provide: EnrollmentApplicationService,
          useValue: {
            assignReviewer: jest.fn(),
            approve: jest.fn(),
            findAll: jest.fn(),
            createApplication: jest.fn(),
            findMyAssignedApplications: jest.fn(),
            reviewApplications: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EnrollmentApplicationController>(
      EnrollmentApplicationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
