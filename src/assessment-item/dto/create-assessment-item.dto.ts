import { IsEnum, IsInt, IsNumber, IsString, Min } from 'class-validator';
import { AssessmentType } from '../../../generated/prisma/enums';

export class CreateAssessmentItemDto {
  @IsString()
  name!: string;

  @IsEnum(AssessmentType)
  assessmentType!: AssessmentType;

  @IsNumber()
  @Min(1)
  highestPossibleScore!: number;

  @IsInt()
  sectionSubjectId!: number;

  @IsInt()
  gradingPeriodId!: number;
}
