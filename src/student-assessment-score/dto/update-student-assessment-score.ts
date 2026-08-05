import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class UpdateStudentAssessmentScore {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  score!: number;
}
