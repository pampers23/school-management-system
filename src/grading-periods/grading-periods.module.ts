import { Module } from '@nestjs/common';
import { GradingPeriodsService } from './grading-periods.service';
import { GradingPeriodsController } from './grading-periods.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GradingPeriodsService],
  controllers: [GradingPeriodsController],
})
export class GradingPeriodsModule {}
