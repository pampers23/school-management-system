import { Module } from '@nestjs/common';
import { EnrollmentApplicationService } from './enrollment-application.service';
import { EnrollmentApplicationController } from './enrollment-application.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EnrollmentApplicationService],
  controllers: [EnrollmentApplicationController],
})
export class EnrollmentApplicationModule {}
