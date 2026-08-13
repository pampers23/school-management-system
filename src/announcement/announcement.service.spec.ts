import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementService } from './announcement.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('AnnouncementService', () => {
  let service: AnnouncementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnnouncementService],
    }).compile();

    service = module.get<AnnouncementService>(AnnouncementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
