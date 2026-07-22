import { IsInt, IsString, IsEnum } from 'class-validator';
import { DayOfWeek } from '../../../generated/prisma/enums';

export class CreateScheduleDto {
  @IsInt()
  sectionId!: number;

  @IsInt()
  roomId!: number;

  @IsInt()
  sectionSubjectId!: number;

  @IsEnum(DayOfWeek)
  day!: DayOfWeek;

  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;
}
