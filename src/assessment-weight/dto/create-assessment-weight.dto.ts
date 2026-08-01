import { IsInt, IsNumber } from 'class-validator';

export class CreateAssessmentWeightDto {
  @IsInt()
  sectionSubjectId!: number;

  @IsInt()
  gradingPeriodId!: number;

  @IsNumber()
  writtenWorkWeight!: number;

  @IsNumber()
  performanceTaskWeight!: number;

  @IsNumber()
  quarterlyAssessmentWeight!: number;
}
