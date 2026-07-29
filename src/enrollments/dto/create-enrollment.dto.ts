import { IsInt } from 'class-validator';

export class CreateEnrollmentDto {
  @IsInt()
  schoolYearId!: number;

  @IsInt()
  sectionId!: number;
}
