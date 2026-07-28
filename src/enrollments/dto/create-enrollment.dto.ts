import { IsInt } from 'class-validator';

export class CreateEnrollmentDto {
  @IsInt()
  studentId!: number;

  @IsInt()
  schoolYearId!: number;

  @IsInt()
  sectionId!: number;
}
