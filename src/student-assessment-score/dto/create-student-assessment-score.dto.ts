import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateAssessmentScoreDto {
  @IsInt()
  assessmentItemId!: number;

  @IsInt()
  studentId!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  score!: number;
}
