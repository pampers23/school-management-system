import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentApplicationService } from './enrollment-application.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('EnrollmentApplicationService', () => {
  let service: EnrollmentApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentApplicationService],
    }).compile();

    service = module.get<EnrollmentApplicationService>(
      EnrollmentApplicationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
