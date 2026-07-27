import { IsInt } from 'class-validator';

export class AssignReviewerDto {
  @IsInt()
  reviewerId!: number;
}
