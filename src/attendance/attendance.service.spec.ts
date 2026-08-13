import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('AttendanceService', () => {
  let service: AttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceService],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
