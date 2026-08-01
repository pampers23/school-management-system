import { Module } from '@nestjs/common';
import { AssessmentWeightService } from './assessment-weight.service';
import { AssessmentWeightController } from './assessment-weight.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AssessmentWeightService],
  controllers: [AssessmentWeightController],
})
export class AssessmentWeightModule {}
