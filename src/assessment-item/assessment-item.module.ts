import { Module } from '@nestjs/common';
import { AssessmentItemService } from './assessment-item.service';
import { AssessmentItemController } from './assessment-item.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AssessmentItemService],
  controllers: [AssessmentItemController],
})
export class AssessmentItemModule {}
